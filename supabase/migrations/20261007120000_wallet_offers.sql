-- ============================================================================
-- Offres promotionnelles envoyées par les commerçants dans le Wallet de leurs
-- clients.
--
-- Règles garanties par la base (et non par la seule page) :
--   * 1 offre maximum par période de 24 h et par commerçant ;
--   * deux offres identiques d'affilée sont refusées (Wallet n'afficherait
--     aucune notification si le texte ne change pas) ;
--   * seules les cartes dont le client a accepté de recevoir des offres sont
--     marquées comme modifiées, donc seules elles recevront la notification.
-- ============================================================================

create table wallet_offers (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants (id) on delete cascade,
  message text not null check (char_length(message) between 3 and 100),
  recipients_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index wallet_offers_merchant_created_idx
  on wallet_offers (merchant_id, created_at desc);

-- Lecture réservée au commerçant propriétaire. Aucune règle d'écriture : on
-- ne peut créer une offre que par la fonction ci-dessous, qui applique les
-- limites.
alter table wallet_offers enable row level security;
revoke all on table wallet_offers from anon, authenticated;
grant select on table wallet_offers to authenticated;

create policy "wallet_offers_select_own" on wallet_offers
  for select using (is_merchant_owner(merchant_id));

create function send_wallet_offer(
  p_message text,
  p_cooldown_seconds integer default 86400
)
returns table (
  status text,
  offer_id uuid,
  seconds_remaining integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_merchant_id uuid;
  v_message text := btrim(p_message);
  v_last_message text;
  v_last_at timestamptz;
  v_offer_id uuid;
begin
  -- Le verrou empêche deux envois simultanés de contourner la limite.
  select id into v_merchant_id
  from merchants
  where owner_id = auth.uid()
  for update;

  if v_merchant_id is null then
    return query select 'not_found'::text, null::uuid, 0;
    return;
  end if;

  if char_length(v_message) < 3 or char_length(v_message) > 100 then
    return query select 'invalid'::text, null::uuid, 0;
    return;
  end if;

  select message, created_at into v_last_message, v_last_at
  from wallet_offers
  where merchant_id = v_merchant_id
  order by created_at desc
  limit 1;

  if v_last_at is not null
     and v_last_at > now() - make_interval(secs => p_cooldown_seconds) then
    return query select
      'too_soon'::text,
      null::uuid,
      ceil(extract(epoch from (v_last_at + make_interval(secs => p_cooldown_seconds) - now())))::integer;
    return;
  end if;

  if v_last_message is not null and lower(v_last_message) = lower(v_message) then
    return query select 'same_message'::text, null::uuid, 0;
    return;
  end if;

  insert into wallet_offers (merchant_id, message)
  values (v_merchant_id, v_message)
  returning id into v_offer_id;

  -- Marque les cartes concernées comme modifiées : Apple ne rafraîchira que
  -- celles-ci. Seuls les clients ayant accepté les offres sont inclus.
  update loyalty_cards lc
  set updated_at = now()
  from customers c, loyalty_programs lp
  where lc.customer_id = c.id
    and lc.loyalty_program_id = lp.id
    and lp.merchant_id = v_merchant_id
    and c.merchant_id = v_merchant_id
    and c.marketing_consent = true;

  return query select 'ok'::text, v_offer_id, 0;
end;
$$;

revoke all on function send_wallet_offer(text, integer) from public, anon;
grant execute on function send_wallet_offer(text, integer) to authenticated;
