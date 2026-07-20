-- ============================================================================
-- Préférences d'envoi d'email par commerçant : activées par défaut,
-- désactivables individuellement depuis le dashboard.
-- ============================================================================

alter table merchants
  add column send_welcome_email boolean not null default true,
  add column send_reward_email boolean not null default true;
