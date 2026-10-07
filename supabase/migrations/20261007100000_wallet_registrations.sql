-- ============================================================================
-- Mises à jour automatiques des cartes Apple Wallet.
--
-- 1. loyalty_cards.updated_at : Apple demande « quelles cartes ont changé
--    depuis telle date ? ». Un déclencheur met la date à jour à chaque
--    modification (passage, annulation, récompense).
-- 2. wallet_registrations : quel iPhone possède quelle carte, et le jeton
--    nécessaire pour le prévenir qu'elle a changé. Quand un client supprime
--    sa carte de Wallet, Apple nous le signale et la ligne est supprimée.
-- ============================================================================

alter table loyalty_cards
  add column updated_at timestamptz not null default now();

create function set_loyalty_card_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger loyalty_cards_set_updated_at
  before update on loyalty_cards
  for each row
  execute function set_loyalty_card_updated_at();

create table wallet_registrations (
  device_library_identifier text not null,
  pass_type_identifier text not null,
  card_id uuid not null references loyalty_cards (id) on delete cascade,
  push_token text not null,
  created_at timestamptz not null default now(),
  primary key (device_library_identifier, pass_type_identifier, card_id)
);

create index wallet_registrations_card_id_idx on wallet_registrations (card_id);

-- RLS activé sans aucune règle : seul le service_role (côté serveur de
-- l'application) peut lire ou écrire cette table.
alter table wallet_registrations enable row level security;
revoke all on table wallet_registrations from anon, authenticated;
