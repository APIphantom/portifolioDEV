## Objetivo

Tirar o portfólio do `localStorage` e colocar tudo no **seu Supabase** (`dsmufcyqtdnhusosvsfs`), para que projetos, storyline, mídias, tecnologias, configurações e leads de contato sejam persistentes, multi-dispositivo e prontos para produção.

---

## O que existe hoje (tudo em localStorage)

| Dado | Arquivo atual | Uso |
|---|---|---|
| Projetos (case studies) | `stvx.projects.v3` em `projects-store.ts` | Cards do site + página `/projeto/$slug` + admin |
| Storyline (timeline) | `stvx.storyline.v1` | Seção Storyline + admin |
| Mídias (uploads) | `stvx.media.v1` | Galeria do admin |
| Tecnologias | `stvx.tech.v1` | Seção Skills + admin |
| Configurações do site | `stvx.settings.v1` | Hero/About/Contact/Footer |
| Leads do formulário de contato | `stvx.contact.leads.v1` | (hoje só fica no navegador) |

Tudo isso vai para o Supabase **mantendo o admin já existente** — só troco a camada de dados.

---

## Arquitetura proposta

```text
Browser (público)            Browser (admin /admin)
        │                              │
        │ leitura pública               │ leitura + escrita
        ▼                              ▼
  serverFn públicas             serverFn protegidas
  (supabaseAdmin com            (requireSupabaseAuth +
   projeção segura)              checagem de role admin)
        │                              │
        └──────────► Supabase ◄────────┘
                 (Postgres + Storage)
```

- **Leitura pública** (home, /projeto/$slug, sitemap) → `createServerFn` com `supabaseAdmin` e SELECT enxuto. Sem expor `anon` em policies.
- **Escrita / admin** → `createServerFn` com `requireSupabaseAuth` + checagem `has_role(uid, 'admin')`.
- **Upload de mídia** → Supabase Storage bucket `media` (público). Upload feito pelo admin autenticado; URL pública salva em `public.media`.

---

## Schema (SQL que vou rodar como migração)

```text
public.site_settings   (singleton: id=1, name, role, bio, email, github, ...)
public.technologies    (id, name, category, color, icon, url, sort_order)
public.storyline_items (id, year, title, subtitle, description, icon, badge, order, active)
public.media           (id, name, url, type, size, folder, created_at)
public.projects        (id, slug unique, title, description, long_description,
                        image, hero_image, hero_video, gallery jsonb,
                        desktop_mockup, tablet_mockup, mobile_mockup, preview_gif,
                        tech text[], category, github, demo,
                        objective, problem, solution, process, result,
                        content_blocks jsonb, metrics jsonb, seo jsonb,
                        publication jsonb, client, year, duration, role,
                        display_order, created_at, updated_at)
public.contact_leads   (id, name, email, message, created_at, ip, user_agent)
```

Storage bucket: `media` (público para leitura, upload só autenticado-admin).

RLS em todas as tabelas, sem grants para `anon`. Toda leitura pública passa por serverFn com `supabaseAdmin` projetando apenas colunas seguras.

---

## Fases

1. **Migração SQL** — criar tabelas, RLS, GRANTS, bucket de Storage. Seed inicial com os defaults atuais (projetos, storyline, tecnologias, settings) para o site não ficar vazio.
2. **Camada de dados (serverFns)** — substituir hooks `useProjects` / `useStoryline` / `useMedia` / `useTechnologies` / `useSettings` por TanStack Query + serverFns. Manter a mesma assinatura pública pra não quebrar componentes.
3. **Contato** — `sendContactMessage` passa a inserir em `public.contact_leads` via serverFn pública (com validação Zod e rate-limit básico por IP).
4. **Upload de mídia** — admin/midias passa a fazer upload real para Supabase Storage e salvar em `public.media`.
5. **SEO/SSR** — `projeto.$slug.tsx` e `sitemap.xml` consomem serverFn pública para ter conteúdo real no SSR/preview.

---

## O que você precisa fazer manualmente (uma vez só)

Já fizemos a parte de auth. Falta só **garantir que a secret `MY_SUPABASE_SERVICE_ROLE_KEY` está configurada** (a serverFn admin depende dela) e **rodar a migração SQL** que vou gerar — eu te entrego o SQL pronto pra colar no SQL Editor do Supabase, porque o projeto está no SEU Supabase e o Lovable não tem acesso de schema lá.

---

## Confirma?

- [ ] Pode prosseguir com **todas as 5 fases** de uma vez?
- [ ] Ou prefere ir por partes (ex.: primeiro só Projetos + Storyline)?
- [ ] Os defaults atuais (NEON/COMMERCE, GRID/SOUND, ASPHALT/OS, timeline 2019→2026) devem entrar como seed, ou começamos com banco vazio?
