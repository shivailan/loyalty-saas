-- ============================================================================
-- L'offre d'un commerçant (commande / fidélité / complet) suit ce qui est payé
-- et pilote l'accès à la liaison avec les commandes : elle ne doit pas être
-- modifiable depuis le navigateur. Seul le serveur (clé service_role) peut la
-- changer. À la création du compte, le déclencheur d'inscription la renseigne
-- (SECURITY DEFINER) : on ne la remet à zéro que pour les écritures directes.
-- ============================================================================

create or replace function protect_merchant_billing_columns()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') in ('anon', 'authenticated') then
    if tg_op = 'INSERT' then
      new.stripe_customer_id := null;
      new.stripe_subscription_id := null;
      new.subscription_status := 'none';
      new.subscription_plan := null;
      new.subscription_period_end := null;
      new.billing_exempt := false;
      new.is_suspended := false;
    elsif (
      new.stripe_customer_id,
      new.stripe_subscription_id,
      new.subscription_status,
      new.subscription_plan,
      new.subscription_period_end,
      new.billing_exempt,
      new.is_suspended,
      new.offer
    ) is distinct from (
      old.stripe_customer_id,
      old.stripe_subscription_id,
      old.subscription_status,
      old.subscription_plan,
      old.subscription_period_end,
      old.billing_exempt,
      old.is_suspended,
      old.offer
    ) then
      raise exception 'Ces informations ne sont pas modifiables.'
        using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;
