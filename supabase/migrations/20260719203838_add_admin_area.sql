-- ============================================================================
-- Espace administrateur : table séparée des commerçants (un admin n'est pas
-- forcément un commerçant), + capacité de suspendre un commerçant.
-- ============================================================================

create table admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table admin_users enable row level security;

-- Un utilisateur ne peut vérifier que son propre statut admin.
create policy "admin_users_select_self" on admin_users
  for select using (user_id = auth.uid());

alter table merchants
  add column is_suspended boolean not null default false;

-- Le premier administrateur : vous.
insert into admin_users (user_id)
select id from auth.users where email = 'shiva77127@gmail.com'
on conflict do nothing;
