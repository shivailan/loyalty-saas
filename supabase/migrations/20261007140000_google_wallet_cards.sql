-- ============================================================================
-- Cartes proposées à Google Wallet.
--
-- Contrairement à Apple, Google conserve la carte sur ses propres serveurs :
-- pour la mettre à jour (passages, offres), on appelle son API. Cette table
-- retient quelles cartes ont été proposées à un client Android, pour ne
-- mettre à jour que celles-là.
-- ============================================================================

create table google_wallet_cards (
  card_id uuid primary key references loyalty_cards (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- RLS activé sans aucune règle : seul le service_role (côté serveur de
-- l'application) peut lire ou écrire cette table.
alter table google_wallet_cards enable row level security;
revoke all on table google_wallet_cards from anon, authenticated;
