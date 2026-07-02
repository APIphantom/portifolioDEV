alter table if exists public.projects
  add column if not exists gallery_labels text[] default '{}';

update public.projects
set gallery_labels = coalesce(gallery_labels, '{}');
