-- Date du premier téléchargement de l'affiche QR par le commerçant : sert à
-- cocher automatiquement l'étape correspondante du guide de démarrage.
alter table merchants add column poster_downloaded_at timestamptz;
