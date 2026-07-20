-- ============================================================================
-- Bucket public pour les logos des commerçants (personnalisation de la carte).
-- Chemin attendu : {merchant_id}/logo.{ext}
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'logos',
  'logos',
  true,
  2097152, -- 2 Mo
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
on conflict (id) do nothing;

-- Lecture publique : les logos doivent être visibles sur les pages clients
-- (inscription, carte), qui ne sont pas authentifiées.
create policy "logos_public_read" on storage.objects
  for select using (bucket_id = 'logos');

-- Écriture réservée au propriétaire du commerçant correspondant au dossier.
create policy "logos_owner_insert" on storage.objects
  for insert with check (
    bucket_id = 'logos'
    and is_merchant_owner(((storage.foldername(name))[1])::uuid)
  );

create policy "logos_owner_update" on storage.objects
  for update using (
    bucket_id = 'logos'
    and is_merchant_owner(((storage.foldername(name))[1])::uuid)
  );

create policy "logos_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'logos'
    and is_merchant_owner(((storage.foldername(name))[1])::uuid)
  );
