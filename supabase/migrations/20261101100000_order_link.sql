-- ============================================================================
-- Liaison avec une application de commande (Qtime) : chaque commande retirée
-- ajoute automatiquement un passage sur la carte de fidélité du client.
--
-- 1. Le commerçant génère une clé de liaison dans son tableau de bord et la
--    colle dans Qtime. Seule l'empreinte (SHA-256) est conservée ici : la clé
--    en clair n'est affichée qu'une fois.
-- 2. external_order_visits garantit qu'une même commande n'ajoute jamais deux
--    passages, même si Qtime renvoie l'appel.
-- ============================================================================

alter table merchants
  add column integration_key_hash text unique,
  add column integration_key_hint text,
  add column integration_key_created_at timestamptz;

create table external_order_visits (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants (id) on delete cascade,
  source text not null,
  external_order_id text not null,
  card_id uuid references loyalty_cards (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (merchant_id, source, external_order_id)
);

-- Aucune politique : seul le serveur (clé service_role) lit et écrit ici.
alter table external_order_visits enable row level security;
