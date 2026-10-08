-- ============================================================================
-- Abonnement des commerçants (Stripe).
--
-- Le commerçant s'abonne depuis l'application ; Stripe prévient le serveur
-- (webhook) qui met à jour ces colonnes. L'accès au tableau de bord dépend de
-- subscription_status (ou de billing_exempt pour les comptes offerts).
-- ============================================================================

alter table merchants
  add column stripe_customer_id text unique,
  add column stripe_subscription_id text,
  add column subscription_status text not null default 'none',
  add column subscription_plan text,
  add column subscription_period_end timestamptz,
  add column billing_exempt boolean not null default false;

-- Les commerçants déjà inscrits avant la mise en place du paiement (compte de
-- test) gardent leur accès : ils sont marqués « offerts ».
update merchants set billing_exempt = true;

-- ----------------------------------------------------------------------------
-- Un commerçant peut modifier sa propre ligne (nom, logo, couleurs…) : sans
-- protection, il pourrait aussi se déclarer abonné, se faire offrir l'accès
-- ou lever sa propre suspension. Ces colonnes ne sont modifiables que par le
-- serveur (clé service_role) ou en SQL direct.
-- ----------------------------------------------------------------------------
create function protect_merchant_billing_columns()
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
      new.is_suspended
    ) is distinct from (
      old.stripe_customer_id,
      old.stripe_subscription_id,
      old.subscription_status,
      old.subscription_plan,
      old.subscription_period_end,
      old.billing_exempt,
      old.is_suspended
    ) then
      raise exception 'Ces informations ne sont pas modifiables.'
        using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

create trigger merchants_protect_billing
  before insert or update on merchants
  for each row
  execute function protect_merchant_billing_columns();
