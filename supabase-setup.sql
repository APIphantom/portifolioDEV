-- =====================================================================
-- ADRIANO PORTFOLIO — Supabase setup
-- Rode TUDO isso de uma vez no SQL Editor do seu Supabase.
-- (Projeto: dsmufcyqtdnhusosvsfs)
-- =====================================================================

-- ---------- ROLES (user_roles + has_role) ----------
do $$ begin
  create type public.app_role as enum ('admin', 'user');
exception when duplicate_object then null; end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
alter table public.user_roles enable row level security;
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

drop policy if exists "roles self read" on public.user_roles;
create policy "roles self read" on public.user_roles for select to authenticated
  using (user_id = auth.uid());

-- ---------- SITE SETTINGS (singleton) ----------
create table if not exists public.site_settings (
  id int primary key default 1,
  name text not null default '',
  role text not null default '',
  bio text not null default '',
  email text not null default '',
  location text not null default '',
  github text not null default '',
  linkedin text not null default '',
  twitter text not null default '',
  instagram text not null default '',
  github_token text,
  github_username text,
  theme text,
  updated_at timestamptz not null default now(),
  constraint singleton check (id = 1)
);
alter table public.site_settings enable row level security;
grant select, insert, update on public.site_settings to authenticated;
grant all on public.site_settings to service_role;

insert into public.site_settings (id, name, role, bio, email, location)
values (1, 'Adriano Oliveira', 'Desenvolvedor Front-End Júnior',
        'Front-End Júnior apaixonado por React, Next.js e TypeScript. Transformo ideias em interfaces modernas, responsivas e acessíveis.',
        'contato@adrianodev.com', 'Brasil')
on conflict (id) do nothing;

-- ---------- TECHNOLOGIES ----------
create table if not exists public.technologies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default '',
  color text,
  icon text,
  url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.technologies enable row level security;
grant select on public.technologies to anon, authenticated;
grant all on public.technologies to service_role;

insert into public.technologies (name, category, color) values
  ('React','Frontend','#61DAFB'),
  ('TypeScript','Language','#3178C6'),
  ('Tailwind CSS','Styling','#06B6D4'),
  ('Framer Motion','Animation','#FF008C'),
  ('Next.js','Framework','#FFFFFF'),
  ('Supabase','Backend','#3ECF8E')
on conflict do nothing;

-- ---------- STORYLINE ----------
create table if not exists public.storyline_items (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  title text not null,
  subtitle text default '',
  description text not null default '',
  icon text not null default 'sparkles',
  badge text default '',
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.storyline_items enable row level security;
grant select on public.storyline_items to anon, authenticated;
grant all on public.storyline_items to service_role;

insert into public.storyline_items (year, title, subtitle, description, icon, badge, sort_order) values
  ('2019','Início','Primeira linha de código','Curiosidade virou obsessão. HTML e CSS abriram a porta de um universo novo.','sparkles','Origin',1),
  ('2020','Faculdade','Fundamentos sólidos','Análise e Desenvolvimento de Sistemas. Lógica, algoritmos e a base que sustenta tudo.','graduation','Education',2),
  ('2021','Primeiros Projetos','Mãos no código','Landing pages, sites institucionais e o primeiro contato com clientes reais.','rocket','Build',3),
  ('2022','React','Componentização','Pensar em componentes mudou minha forma de construir interfaces para sempre.','atom','Frontend',4),
  ('2023','TypeScript','Código robusto','Tipagem forte, refactors seguros e produtividade em escala.','filecode','DX',5),
  ('2024','Next.js','Full-stack mindset','SSR, edge functions e performance como prioridade desde o primeiro commit.','triangle','Framework',6),
  ('2025','Portfólio Atual','Identidade própria','STVX/DEV — código com estética, performance e voz autoral.','layers','Now',7),
  ('2026+','Próximo Nível','Sem teto','WebGL, IA aplicada ao front-end e produtos com identidade cinematográfica.','target','Next',8)
on conflict do nothing;

-- ---------- MEDIA ----------
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  storage_path text,
  type text not null default '',
  size bigint not null default 0,
  folder text default '',
  created_at timestamptz not null default now()
);
alter table public.media enable row level security;
grant select on public.media to anon, authenticated;
grant all on public.media to service_role;

-- ---------- PROJECTS ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null default '',
  long_description text,
  image text default '',
  hero_image text,
  hero_video text,
  gallery jsonb default '[]'::jsonb,
  desktop_mockup text,
  tablet_mockup text,
  mobile_mockup text,
  preview_gif text,
  tech text[] not null default '{}',
  category text not null default 'web',
  github text,
  demo text,
  objective text,
  problem text,
  solution text,
  process text,
  result text,
  content_blocks jsonb default '[]'::jsonb,
  metrics jsonb default '[]'::jsonb,
  seo jsonb,
  publication jsonb default '{"status":"draft","visibility":"private"}'::jsonb,
  client text,
  year text,
  duration text,
  role text,
  display_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;
grant select on public.projects to anon, authenticated;
grant all on public.projects to service_role;

insert into public.projects (slug, title, description, long_description, tech, category, github, demo, objective, problem, solution, process, result, publication)
values
  ('neon-commerce','NEON/COMMERCE','Storefront experimental para uma marca de streetwear com checkout fluido.',
   'Plataforma de e-commerce construída do zero com foco em performance, identidade visual e microinterações cinematográficas no checkout.',
   '{"React","Tailwind","Framer Motion","Stripe"}','ecommerce','https://github.com','https://example.com',
   'Criar uma experiência de compra que transmita o DNA de uma marca premium.',
   'Storefronts genéricos diluem a identidade e reduzem percepção de valor.',
   'Layout editorial, transições com Framer Motion e checkout em 2 steps.',
   'Wireframe em Figma, design tokens, build em React + Vite, testes com usuários reais.',
   'Conversão +38%, tempo médio na página +52%, share orgânico em alta.',
   '{"status":"published","visibility":"public","featured":true}'::jsonb),
  ('grid-sound','GRID/SOUND','Player de música minimalista com visualização em grid e modo dark premium.',
   null,'{"React","TypeScript","Web Audio API"}','experiment',null,null,null,null,null,null,null,
   '{"status":"published","visibility":"public"}'::jsonb),
  ('asphalt-os','ASPHALT/OS','Dashboard techwear para monitoramento de frota urbana em tempo real.',
   null,'{"Next.js","Tailwind","D3","Supabase"}','web',null,null,null,null,null,null,null,
   '{"status":"draft","visibility":"private"}'::jsonb)
on conflict (slug) do nothing;

-- ---------- CONTACT LEADS ----------
create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);
alter table public.contact_leads enable row level security;
grant insert on public.contact_leads to anon, authenticated;
grant select, delete on public.contact_leads to authenticated;
grant all on public.contact_leads to service_role;

drop policy if exists "leads admin read" on public.contact_leads;
create policy "leads admin read" on public.contact_leads for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- ---------- STORAGE BUCKET ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Leitura pública do bucket; uploads via service_role (server) bypassam RLS.
drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects for select to anon, authenticated
  using (bucket_id = 'media');

-- =====================================================================
-- DEPOIS DE RODAR:
-- 1) Authentication → Users → "Add user" → crie sua conta admin
-- 2) Pegue o UID e rode:
--    insert into public.user_roles (user_id, role) values ('SEU-UID-AQUI', 'admin');
-- 3) Authentication → Providers → desative "Enable Sign Ups" para evitar cadastros públicos
-- =====================================================================
