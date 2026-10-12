-- Deuxième couleur de la carte de fidélité : la couleur principale sert de
-- fond, la couleur secondaire aux textes et aux accents (barre de progression,
-- libellés). Par défaut un gris très foncé, lisible sur le jaune KeepMe.
alter table merchants
  add column secondary_color text not null default '#171717'
    check (secondary_color ~ '^#[0-9a-fA-F]{6}$');
