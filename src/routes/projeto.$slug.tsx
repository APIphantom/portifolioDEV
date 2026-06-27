import { useRef, useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Github,
  ExternalLink,
  ImageIcon,
  Play,
  CircleDot,
  Clock,
  Briefcase,
  Tag,
  User,
  Calendar,
  Smartphone,
  Tablet,
  Monitor,
  Target,
} from "lucide-react";
import { type Project, CATEGORIES } from "@/lib/projects-store";
import { getProjectBySlug } from "@/lib/portfolio.functions";

export const Route = createFileRoute("/projeto/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Case Study // STVX` },
      {
        name: "description",
        content: `Case study do projeto ${params.slug} — objetivo, problema, solução, processo e resultado.`,
      },
      { property: "og:title", content: `${params.slug} — Case Study` },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/projeto/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/projeto/${params.slug}` }],
  }),
  component: ProjectPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center text-destructive p-6 text-center">
      {error.message}
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Projeto não encontrado.
    </div>
  ),
});

/* ---------- helpers ---------- */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function SectionLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary">// {n}</span>
      <div className="h-px flex-1 bg-border" />
      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
        {title}
      </span>
    </div>
  );
}

function Counter({
  to,
  suffix = "",
  prefix = "",
}: {
  to: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <span ref={ref}>
      {prefix}
      {val}
      {suffix}
    </span>
  );
}

/* ---------- defaults derived from project ---------- */

function getMeta(project: Project) {
  const cat = CATEGORIES.find((c) => c.value === project.category)?.label ?? project.category;
  return {
    status:
      project.publication?.status === "published"
        ? "Publicado"
        : project.publication?.status === "archived"
          ? "Arquivado"
          : "Rascunho",
    duration: project.duration || "-",
    role: project.role || "-",
    type: cat,
    client: project.client || "-",
    year: project.year || "-",
  };
}

/* ---------- page ---------- */

function ProjectPage() {
  const { slug } = Route.useParams();
  const fetchProject = useServerFn(getProjectBySlug);
  const { data, isPending } = useQuery({
    queryKey: ["project", slug],
    queryFn: () => fetchProject({ data: { slug } }),
    staleTime: 60_000,
  });
  const project = data as Project | null | undefined;

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Carregando…
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
          // 404 / drop não encontrado
        </div>
        <h1 className="display text-6xl mb-6">Projeto inexistente.</h1>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="size-4" /> Voltar
        </Link>
      </div>
    );
  }

  const meta = getMeta(project);
  const cat = CATEGORIES.find((c) => c.value === project.category)?.label ?? project.category;

  const overview = [
    { Icon: Tag, label: "Status", value: meta.status },
    { Icon: Clock, label: "Duração", value: meta.duration },
    { Icon: Briefcase, label: "Papel", value: meta.role },
    { Icon: Target, label: "Tipo", value: meta.type },
    { Icon: User, label: "Cliente", value: meta.client },
    { Icon: Calendar, label: "Ano", value: meta.year },
  ];

  const gallery = (project.gallery && project.gallery.length ? project.gallery : []).slice(0, 4);
  const galleryLabels = ["Homepage", "Best Sellers", "Product Page", "Checkout"];

  const breakdown = [
    { n: "01", k: "Objetivo", v: project.objective },
    { n: "02", k: "Problema", v: project.problem },
    { n: "03", k: "Solução", v: project.solution },
    { n: "04", k: "Processo", v: project.process },
    { n: "05", k: "Resultado", v: project.result },
  ].filter((s) => s.v);

  const stackGroups =
    project.tech.length > 0 ? [{ title: "Tecnologias", items: project.tech }] : [];

  const results = (project.metrics ?? [])
    .map((m) => {
      const parsed = Number(String(m.value ?? "").replace(/[^0-9.-]/g, ""));
      return {
        label: m.title,
        raw: m.value,
        value: Number.isFinite(parsed) ? parsed : null,
        prefix: m.prefix ?? "",
        suffix: m.suffix ?? "",
        description: m.description ?? "",
      };
    })
    .filter((m) => m.label);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pb-32 overflow-x-hidden"
    >
      {/* Top bar */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            data-cursor="hover"
          >
            <ArrowLeft className="size-4" /> Voltar ao portfolio
          </Link>
          <div className="size-9 rounded-full border border-primary flex items-center justify-center text-primary font-black">
            N
          </div>
          <div className="flex gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary transition-colors"
              >
                <Github className="size-3" /> Code
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] uppercase tracking-widest hover:glow-neon transition-all"
              >
                <ExternalLink className="size-3" /> Demo
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ===== HERO ===== */}
      <header className="relative pt-16 pb-20 px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0 -z-10 grid-bg opacity-50" />
        <div className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5 xl:pr-6">
            <motion.div
              {...fadeUp}
              className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] mb-6"
            >
              <span className="px-3 py-1 border border-primary text-primary rounded-full bg-primary/5">
                {cat}
              </span>
              <span className="text-muted-foreground">/{project.slug}</span>
            </motion.div>
            <motion.h1
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.05 }}
              className="display max-w-[7ch] text-[clamp(2.8rem,6.6vw,5.8rem)] text-glow leading-[0.9]"
            >
              {project.title.split("/").map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && <span className="text-primary">/</span>}
                  <br />
                </span>
              ))}
            </motion.h1>
            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              {project.longDescription || project.description}
            </motion.p>
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.15 }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-start-7 lg:col-span-6 relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-graphite to-background glow-neon">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="display text-[14rem] text-primary/10">
                    {project.title.charAt(0)}
                  </span>
                  <ImageIcon className="absolute size-12 text-muted-foreground/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>
            {/* Floating card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 hidden md:block rounded-xl border border-border bg-card/90 backdrop-blur p-4 w-44"
            >
              <div className="text-[9px] uppercase tracking-widest text-primary mb-1">
                // status
              </div>
              <div className="text-sm font-bold">Live · v1.0</div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 hidden md:block rounded-xl border border-primary/40 bg-primary/10 backdrop-blur p-4"
            >
              <div className="text-[9px] uppercase tracking-widest text-primary mb-1">// score</div>
              <div className="text-2xl display text-primary">95</div>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* ===== OVERVIEW BAR ===== */}
      <section className="px-6 lg:px-10">
        <motion.div
          {...fadeUp}
          className="mx-auto max-w-7xl rounded-2xl border border-border bg-card/50 backdrop-blur p-6 md:p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {overview.map(({ Icon, label, value }) => (
            <div key={label} className="group">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                <Icon className="size-3.5 text-primary group-hover:scale-110 transition-transform" />
                {label}
              </div>
              <div className="text-sm md:text-base font-bold">{value}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ===== VIDEO + GALLERY ===== */}
      <section className="px-6 lg:px-10 mt-20">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-6">
          {/* Video */}
          <motion.div {...fadeUp} className="lg:col-span-7">
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-border bg-card group">
              <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-background/80 to-transparent z-10 flex items-center px-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  // project walkthrough
                </span>
              </div>
              {project.image ? (
                <img
                  src={project.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-graphite to-background" />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  className="size-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center glow-neon hover:scale-110 transition-transform"
                  data-cursor="hover"
                  aria-label="Play"
                >
                  <Play className="size-8 fill-current ml-1" />
                </button>
              </div>
              <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-background/80 to-transparent z-10 flex items-center justify-between px-4 text-[10px] font-mono text-muted-foreground">
                <span>00:00 / 01:12</span>
                <span>HD · 1080p</span>
              </div>
            </div>
          </motion.div>

          {/* Gallery */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {galleryLabels.map((label, i) => (
              <motion.div
                key={label}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.05 * i }}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-card hover:border-primary transition-all"
                data-cursor="hover"
              >
                <div className="absolute top-2 left-2 z-10 text-[9px] uppercase tracking-widest px-2 py-1 rounded-full bg-background/80 border border-border">
                  {label}
                </div>
                {gallery[i] ? (
                  <img
                    src={gallery[i]}
                    alt={label}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : project.image ? (
                  <img
                    src={project.image}
                    alt={label}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-graphite to-background">
                    <ImageIcon className="size-8 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute inset-0 ring-0 group-hover:ring-2 ring-primary/40 transition-all rounded-2xl" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CASE STUDY BREAKDOWN ===== */}
      {breakdown.length > 0 && (
        <section className="px-6 lg:px-10 mt-24">
          <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {breakdown.map((s, i) => (
              <motion.div
                key={s.k}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.05 * i }}
                className="relative"
              >
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary mb-3">
                  // {s.n}
                </div>
                <h3 className="display text-2xl md:text-3xl mb-3">{s.k}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.v}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ===== STACK ===== */}
      <section className="px-6 lg:px-10 mt-24">
        <motion.div
          {...fadeUp}
          className="mx-auto max-w-7xl rounded-2xl border border-border bg-card/40 p-6 md:p-8"
        >
          <SectionLabel n="STACK" title="Tecnológica" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stackGroups.map(({ title, items }) => (
              <div key={title} className="rounded-xl border border-border bg-background/60 p-5">
                <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-4">
                  {title}
                </div>
                <ul className="space-y-2">
                  {items.map((it) => (
                    <li key={it} className="flex items-center gap-2 text-sm">
                      <CircleDot className="size-3 text-primary" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {stackGroups.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-8 border border-dashed border-border rounded-xl">
              Nenhuma tecnologia cadastrada para este projeto.
            </div>
          )}
        </motion.div>
      </section>

      {/* ===== RESULTS ===== */}
      {results.length > 0 && (
        <section className="px-6 lg:px-10 mt-8">
          <motion.div
            {...fadeUp}
            className="mx-auto max-w-7xl rounded-2xl border border-border bg-card/40 p-6 md:p-8"
          >
            <SectionLabel n="RESULTS" title="Resultados" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {results.map((r, i) => (
                <motion.div
                  key={r.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * i }}
                  className="rounded-xl border border-border bg-background/60 p-6 text-center hover:border-primary hover:glow-neon transition-all group"
                >
                  <div className="display text-4xl md:text-5xl text-primary">
                    {r.value !== null ? (
                      <Counter to={r.value} prefix={r.prefix} suffix={r.suffix} />
                    ) : (
                      `${r.prefix}${r.raw}${r.suffix}`
                    )}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">
                    {r.label}
                  </div>
                  {r.description && (
                    <div className="text-xs text-muted-foreground mt-2">{r.description}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* ===== RESPONSIVE EXPERIENCE ===== */}
      <section className="px-6 lg:px-10 mt-8">
        <motion.div
          {...fadeUp}
          className="mx-auto max-w-7xl rounded-2xl border border-border bg-card/40 p-6 md:p-8"
        >
          <SectionLabel n="RESPONSIVE" title="Experience" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {[
              { Icon: Monitor, label: "Desktop", ratio: "aspect-[16/10]" },
              { Icon: Tablet, label: "Tablet", ratio: "aspect-[3/4]" },
              { Icon: Smartphone, label: "Mobile", ratio: "aspect-[9/16] max-w-[180px] mx-auto" },
            ].map((d, i) => (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
              >
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3 justify-center">
                  <d.Icon className="size-3.5 text-primary" /> {d.label}
                </div>
                <div
                  className={`relative ${d.ratio} rounded-2xl overflow-hidden border border-border bg-card hover:border-primary transition-colors`}
                >
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={d.label}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-graphite to-background">
                      <ImageIcon className="size-8 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="px-6 lg:px-10 mt-12">
        <motion.div
          {...fadeUp}
          className="mx-auto max-w-7xl relative overflow-hidden rounded-3xl border border-border bg-card p-10 md:p-16"
        >
          <div className="absolute -right-10 -bottom-20 display text-[20rem] text-primary/5 select-none pointer-events-none leading-none">
            {project.title.charAt(0)}
          </div>
          <div className="relative grid md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-4">
                // next project
              </div>
              <h3 className="display text-4xl md:text-6xl">Gostou deste projeto?</h3>
              <p className="text-muted-foreground mt-4 max-w-md">
                Veja outros cases ou entre em contato.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                to="/"
                hash="projetos"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs hover:glow-neon transition-all"
                data-cursor="hover"
              >
                Ver outros projetos <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/"
                hash="contato"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-primary hover:text-primary font-bold uppercase tracking-widest text-xs transition-all"
                data-cursor="hover"
              >
                Entrar em contato <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
