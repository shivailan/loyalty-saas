-- ============================================================================
-- Offre choisie à l'inscription : commande seule, fidélité seule, ou les deux.
-- Elle est transmise par le formulaire d'inscription (user_metadata.offer) et
-- recopiée ici à la création du compte. Valeur inconnue = fidélité.
-- ============================================================================

alter table merchants
  add column offer text not null default 'fidelite'
    check (offer in ('commande', 'fidelite', 'complet'));

create or replace function handle_new_merchant_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  business_name text;
  base_slug text;
  chosen_offer text;
begin
  business_name := coalesce(new.raw_user_meta_data ->> 'business_name', 'Mon établissement');

  chosen_offer := new.raw_user_meta_data ->> 'offer';
  if chosen_offer is null or chosen_offer not in ('commande', 'fidelite', 'complet') then
    chosen_offer := 'fidelite';
  end if;

  base_slug := lower(regexp_replace(business_name, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  if base_slug = '' then
    base_slug := 'commerce';
  end if;

  insert into merchants (owner_id, name, slug, offer)
  values (
    new.id,
    business_name,
    base_slug || '-' || substr(new.id::text, 1, 8),
    chosen_offer
  );

  return new;
end;
$$;
