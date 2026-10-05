-- ============================================================================
-- Limitation du nombre de tentatives sur les pages publiques (inscription
-- client, récupération de carte) pour bloquer le spam et l'envoi massif
-- d'emails.
--
-- Chaque tentative est enregistrée sous une "clé" (ex. "join:ip:<empreinte>").
-- Les clés sont des empreintes non réversibles calculées par l'application :
-- aucune adresse IP ni email n'est stocké en clair. Les lignes de plus de
-- 24 heures sont supprimées automatiquement.
-- ============================================================================

create table rate_limit_hits (
  id bigint generated always as identity primary key,
  key text not null,
  created_at timestamptz not null default now()
);

create index rate_limit_hits_key_created_at_idx on rate_limit_hits (key, created_at);
create index rate_limit_hits_created_at_idx on rate_limit_hits (created_at);

-- RLS activé sans aucune règle : seul le service_role (côté serveur de
-- l'application) peut lire ou écrire cette table.
alter table rate_limit_hits enable row level security;
revoke all on table rate_limit_hits from anon, authenticated;

-- Renvoie true et enregistre la tentative si la limite n'est pas atteinte,
-- false sinon. Le verrou garantit que deux requêtes simultanées sur la même
-- clé ne peuvent pas dépasser la limite.
create function check_rate_limit(
  p_key text,
  p_max integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_count integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_key, 0));

  delete from rate_limit_hits
  where created_at < now() - interval '1 day';

  select count(*) into v_count
  from rate_limit_hits
  where key = p_key
    and created_at > now() - make_interval(secs => p_window_seconds);

  if v_count >= p_max then
    return false;
  end if;

  insert into rate_limit_hits (key) values (p_key);
  return true;
end;
$$;

revoke all on function check_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function check_rate_limit(text, integer, integer) to service_role;
