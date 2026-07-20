-- ============================================================================
-- Crée automatiquement une ligne "merchants" dès qu'un nouveau compte
-- d'authentification est créé, en lisant le nom de l'établissement transmis
-- lors de l'inscription (user_metadata.business_name).
-- ============================================================================

create function handle_new_merchant_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  business_name text;
  base_slug text;
begin
  business_name := coalesce(new.raw_user_meta_data ->> 'business_name', 'Mon établissement');

  base_slug := lower(regexp_replace(business_name, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  if base_slug = '' then
    base_slug := 'commerce';
  end if;

  insert into merchants (owner_id, name, slug)
  values (
    new.id,
    business_name,
    base_slug || '-' || substr(new.id::text, 1, 8)
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function handle_new_merchant_signup();
