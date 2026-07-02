-- Media model hardening for project assets and robust uploads.
-- Safe additive migration: keeps legacy columns and adds new typed metadata columns.

alter table if exists public.media
  add column if not exists project_id uuid references public.projects(id) on delete cascade,
  add column if not exists media_type text,
  add column if not exists category text,
  add column if not exists mime_type text,
  add column if not exists file_size bigint,
  add column if not exists width integer,
  add column if not exists height integer,
  add column if not exists duration numeric,
  add column if not exists alt text,
  add column if not exists caption text,
  add column if not exists sort_order integer default 0,
  add column if not exists updated_at timestamptz default now();

update public.media
set
  mime_type = coalesce(mime_type, type),
  file_size = coalesce(file_size, size),
  media_type = coalesce(
    media_type,
    case
      when coalesce(type, '') = 'image/gif' then 'gif'
      when coalesce(type, '') like 'video/%' then 'video'
      else 'image'
    end
  ),
  category = coalesce(nullif(category, ''), nullif(folder, ''), 'misc'),
  updated_at = coalesce(updated_at, now());

alter table if exists public.media
  add constraint media_media_type_check
  check (media_type in ('image', 'video', 'gif'));

alter table if exists public.media
  add constraint media_category_check
  check (category in (
    'thumbnail',
    'banner',
    'gallery',
    'cover',
    'demo',
    'mobile',
    'desktop',
    'logo',
    'before_after',
    'hero_video',
    'tablet',
    'misc',
    'document'
  ));

create index if not exists idx_media_project_id on public.media(project_id);
create index if not exists idx_media_category on public.media(category);
create index if not exists idx_media_created_at on public.media(created_at desc);

-- RLS policies may differ by environment. Keep this as a guideline and adapt to your policy model.
-- Example read policy for public assets:
-- create policy "Public can read media" on storage.objects
-- for select to public
-- using (bucket_id = 'media');
