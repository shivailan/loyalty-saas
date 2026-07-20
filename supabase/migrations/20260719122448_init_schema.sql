-- ============================================================================
-- Schéma initial : commerçants, programmes de fidélité, clients, cartes,
-- passages et récompenses. Chaque commerçant est un "tenant" isolé par RLS.
-- ============================================================================

-- 1. Merchants (un commerçant = un tenant)
create table merchants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  logo_url text,
  primary_color text not null default '#000000',
  created_at timestamptz not null default now()
);

create index merchants_owner_id_idx on merchants (owner_id);

-- 2. Loyalty programs (règles de fidélité d'un commerçant)
create table loyalty_programs (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants (id) on delete cascade,
  name text not null,
  visits_required integer not null check (visits_required > 0),
  reward_description text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index loyalty_programs_merchant_id_idx on loyalty_programs (merchant_id);

-- 3. Customers (clients inscrits chez un commerçant)
create table customers (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  created_at timestamptz not null default now(),
  unique (merchant_id, email)
);

create index customers_merchant_id_idx on customers (merchant_id);

-- 4. Loyalty cards (la carte d'un client pour un programme donné)
create table loyalty_cards (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers (id) on delete cascade,
  loyalty_program_id uuid not null references loyalty_programs (id) on delete cascade,
  current_stamps integer not null default 0 check (current_stamps >= 0),
  created_at timestamptz not null default now(),
  unique (customer_id, loyalty_program_id)
);

create index loyalty_cards_customer_id_idx on loyalty_cards (customer_id);
create index loyalty_cards_program_id_idx on loyalty_cards (loyalty_program_id);

-- 5. Visits (historique des passages : une ligne = un tampon)
create table visits (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references loyalty_cards (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index visits_card_id_idx on visits (card_id);

-- 6. Reward redemptions (historique des récompenses accordées/utilisées)
create table reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references loyalty_cards (id) on delete cascade,
  granted_at timestamptz not null default now(),
  redeemed_at timestamptz
);

create index reward_redemptions_card_id_idx on reward_redemptions (card_id);

-- ============================================================================
-- Row Level Security : isolation stricte entre commerçants (multi-tenant)
-- ============================================================================

alter table merchants enable row level security;
alter table loyalty_programs enable row level security;
alter table customers enable row level security;
alter table loyalty_cards enable row level security;
alter table visits enable row level security;
alter table reward_redemptions enable row level security;

-- Fonction utilitaire : l'utilisateur connecté est-il propriétaire de ce commerçant ?
create function is_merchant_owner(target_merchant_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from merchants
    where id = target_merchant_id
      and owner_id = auth.uid()
  );
$$;

-- Fonction utilitaire : l'utilisateur connecté est-il propriétaire de cette carte
-- (via la chaîne carte -> programme -> commerçant) ?
create function is_card_owner(target_card_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from loyalty_cards lc
    join loyalty_programs lp on lp.id = lc.loyalty_program_id
    where lc.id = target_card_id
      and is_merchant_owner(lp.merchant_id)
  );
$$;

-- merchants : un commerçant ne voit/modifie que sa propre ligne
create policy "merchants_select_own" on merchants
  for select using (owner_id = auth.uid());

create policy "merchants_insert_own" on merchants
  for insert with check (owner_id = auth.uid());

create policy "merchants_update_own" on merchants
  for update using (owner_id = auth.uid());

create policy "merchants_delete_own" on merchants
  for delete using (owner_id = auth.uid());

-- loyalty_programs : scoping par commerçant propriétaire
create policy "loyalty_programs_all_own" on loyalty_programs
  for all
  using (is_merchant_owner(merchant_id))
  with check (is_merchant_owner(merchant_id));

-- customers : scoping par commerçant propriétaire
create policy "customers_all_own" on customers
  for all
  using (is_merchant_owner(merchant_id))
  with check (is_merchant_owner(merchant_id));

-- loyalty_cards : scoping via le programme -> commerçant propriétaire
create policy "loyalty_cards_all_own" on loyalty_cards
  for all
  using (
    exists (
      select 1 from loyalty_programs lp
      where lp.id = loyalty_program_id
        and is_merchant_owner(lp.merchant_id)
    )
  )
  with check (
    exists (
      select 1 from loyalty_programs lp
      where lp.id = loyalty_program_id
        and is_merchant_owner(lp.merchant_id)
    )
  );

-- visits : scoping via la carte -> programme -> commerçant propriétaire
create policy "visits_all_own" on visits
  for all
  using (is_card_owner(card_id))
  with check (is_card_owner(card_id));

-- reward_redemptions : scoping via la carte -> programme -> commerçant propriétaire
create policy "reward_redemptions_all_own" on reward_redemptions
  for all
  using (is_card_owner(card_id))
  with check (is_card_owner(card_id));
