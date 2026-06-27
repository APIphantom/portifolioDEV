alter table public.site_settings
add column if not exists cv_url text;

update public.site_settings
set cv_url = coalesce(cv_url, '/cv-adriano-oliveira.pdf')
where id = 1;
