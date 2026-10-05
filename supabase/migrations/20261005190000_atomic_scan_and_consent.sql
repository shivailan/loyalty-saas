-- ============================================================================
-- 1. Consentement marketing des clients (RGPD) : case non cochée par défaut,
--    avec la date à laquelle le client a donné son accord.
-- ============================================================================

alter table customers
  add column marketing_consent boolean not null default false,
  add column marketing_consent_at timestamptz;

-- ============================================================================
-- 2. Scan / annulation / récompense : opérations atomiques.
--
-- Avant, l'application lisait le compteur, ajoutait 1 puis réécrivait la
-- valeur : deux scans simultanés pouvaient n'en compter qu'un. Ici la carte
-- est verrouillée (FOR UPDATE) le temps de l'opération, donc les appels sur
-- une même carte passent les uns après les autres.
--
-- Les fonctions sont SECURITY INVOKER : les règles RLS s'appliquent, un
-- commerçant ne peut agir que sur les cartes de son propre établissement.
-- Une carte d'un autre commerçant renvoie simplement "not_found".
-- ============================================================================

create function add_visit(
  p_card_id uuid,
  p_cooldown_seconds integer default 120
)
returns table (
  status text,
  previous_stamps integer,
  new_stamps integer,
  seconds_remaining integer
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_card loyalty_cards%rowtype;
  v_is_active boolean;
  v_last_visit timestamptz;
  v_remaining integer;
  v_new_stamps integer;
begin
  select * into v_card
  from loyalty_cards
  where id = p_card_id
  for update;

  if not found then
    return query select 'not_found'::text, 0, 0, 0;
    return;
  end if;

  select lp.is_active into v_is_active
  from loyalty_programs lp
  where lp.id = v_card.loyalty_program_id;

  if v_is_active is not true then
    return query select 'inactive'::text, v_card.current_stamps, v_card.current_stamps, 0;
    return;
  end if;

  -- Anti double scan : un même client ne peut pas être tamponné deux fois
  -- de suite en moins de p_cooldown_seconds secondes.
  select max(created_at) into v_last_visit
  from visits
  where card_id = p_card_id;

  if v_last_visit is not null
     and clock_timestamp() < v_last_visit + make_interval(secs => p_cooldown_seconds) then
    v_remaining := ceil(
      extract(epoch from (v_last_visit + make_interval(secs => p_cooldown_seconds) - clock_timestamp()))
    )::integer;
    return query select 'too_soon'::text, v_card.current_stamps, v_card.current_stamps, v_remaining;
    return;
  end if;

  insert into visits (card_id) values (p_card_id);

  update loyalty_cards
  set current_stamps = current_stamps + 1
  where id = p_card_id
  returning current_stamps into v_new_stamps;

  return query select 'ok'::text, v_new_stamps - 1, v_new_stamps, 0;
end;
$$;

-- Annule le dernier passage d'une carte (erreur de manipulation au comptoir).
-- Refusé si le passage est trop ancien ou si une récompense a été remise
-- depuis (le compteur a été remis à zéro, annuler n'aurait plus de sens).
create function undo_last_visit(
  p_card_id uuid,
  p_window_seconds integer default 600
)
returns table (
  status text,
  new_stamps integer
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_card loyalty_cards%rowtype;
  v_last_visit_id uuid;
  v_last_visit_at timestamptz;
  v_new_stamps integer;
begin
  select * into v_card
  from loyalty_cards
  where id = p_card_id
  for update;

  if not found then
    return query select 'not_found'::text, 0;
    return;
  end if;

  select id, created_at into v_last_visit_id, v_last_visit_at
  from visits
  where card_id = p_card_id
  order by created_at desc
  limit 1;

  if v_last_visit_id is null then
    return query select 'no_visit'::text, v_card.current_stamps;
    return;
  end if;

  if clock_timestamp() > v_last_visit_at + make_interval(secs => p_window_seconds) then
    return query select 'too_old'::text, v_card.current_stamps;
    return;
  end if;

  if exists (
    select 1
    from reward_redemptions
    where card_id = p_card_id
      and coalesce(redeemed_at, granted_at) >= v_last_visit_at
  ) then
    return query select 'reward_given'::text, v_card.current_stamps;
    return;
  end if;

  delete from visits where id = v_last_visit_id;

  update loyalty_cards
  set current_stamps = greatest(current_stamps - 1, 0)
  where id = p_card_id
  returning current_stamps into v_new_stamps;

  return query select 'ok'::text, v_new_stamps;
end;
$$;

-- Remet la récompense : enregistre l'historique et remet le compteur à zéro,
-- en une seule opération (un double clic ne peut plus créer deux récompenses).
create function redeem_reward(p_card_id uuid)
returns table (
  status text
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_card loyalty_cards%rowtype;
  v_visits_required integer;
begin
  select * into v_card
  from loyalty_cards
  where id = p_card_id
  for update;

  if not found then
    return query select 'not_found'::text;
    return;
  end if;

  select lp.visits_required into v_visits_required
  from loyalty_programs lp
  where lp.id = v_card.loyalty_program_id;

  if v_visits_required is null
     or v_visits_required <= 0
     or v_card.current_stamps < v_visits_required then
    return query select 'not_reached'::text;
    return;
  end if;

  insert into reward_redemptions (card_id, redeemed_at)
  values (p_card_id, now());

  update loyalty_cards
  set current_stamps = 0
  where id = p_card_id;

  return query select 'ok'::text;
end;
$$;

-- Seuls les utilisateurs connectés peuvent appeler ces fonctions.
revoke all on function add_visit(uuid, integer) from public, anon;
revoke all on function undo_last_visit(uuid, integer) from public, anon;
revoke all on function redeem_reward(uuid) from public, anon;

grant execute on function add_visit(uuid, integer) to authenticated;
grant execute on function undo_last_visit(uuid, integer) to authenticated;
grant execute on function redeem_reward(uuid) to authenticated;
