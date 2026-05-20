import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Github, ExternalLink, ImageIcon } from "lucide-react";
import { readProjects, type Project, CATEGORIES } from "@/lib/projects-store";

export const Route = createFileRoute("/projeto/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Case Study // STVX` },
      { name: "description", content: `Case study do projeto ${params.slug} — objetivo, problema, solução e resultado.` },
      { property: "og:title", content: `${params.slug} — Case Study` },
      { property: "og:type", content: "article" },
    ],
  }),
  component: ProjectPage,
});

function ProjectPage() {
  const { slug } = Route.useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const all = readProjects();
    setProject(all.find((p) => p.slug === slug) ?? null);
    setReady(true);
  }, [slug]);

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando…</div>;
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">// 404 / drop não encontrado</div>
        <h1 className="display text-6xl mb-6">Projeto inexistente.</h1>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs">
          <ArrowLeft className="size-4" /> Voltar
        </Link>
      </div>
    );
  }

  const cat = CATEGORIES.find((c) => c.value === project.category)?.label ?? project.category;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pb-32"
    >
      {/* Top bar */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors" data-cursor="hover">
            <ArrowLeft className="size-4" /> Voltar ao portfolio
          </Link>
          <div className="flex gap-2">
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" data-cursor="hover" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary">
                <Github className="size-3" /> Code
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer" data-cursor="hover" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] uppercase tracking-widest hover:glow-neon">
                <ExternalLink className="size-3" /> Demo
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Hero */}
      <header className="relative pt-20 pb-16 px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0 -z-10 grid-bg opacity-50" />
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-primary mb-6">
            <span className="px-2 py-1 border border-primary rounded-full">{cat}</span>
            <span className="text-muted-foreground">/{project.slug}</span>
          </div>
          <h1 className="display text-[clamp(3rem,10vw,9rem)] text-glow">{project.title}</h1>
          <p className="mt-8 max-w-3xl text-lg md:text-2xl text-muted-foreground">
            {project.longDescription || project.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-border text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Cover image */}
      <div className="px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="relative aspect-[16/8] rounded-3xl overflow-hidden border border-border bg-muted">
            {project.image ? (
              <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-graphite to-background">
                <span className="display text-[14rem] text-primary/10">{project.title.charAt(0)}</span>
                <ImageIcon className="absolute size-12 text-muted-foreground/30" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Case study sections */}
      <div className="mx-auto max-w-5xl px-6 lg:px-10 mt-24 space-y-20">
        {[
          { n: "01", k: "Objetivo", v: project.objective },
          { n: "02", k: "Problema", v: project.problem },
          { n: "03", k: "Solução", v: project.solution },
          { n: "04", k: "Processo", v: project.process },
          { n: "05", k: "Resultado", v: project.result },
        ]
          .filter((s) => s.v)
          .map((s) => (
            <motion.section
              key={s.k}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="grid md:grid-cols-12 gap-6"
            >
              <div className="md:col-span-3">
                <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-mono">// {s.n}</div>
                <h2 className="display text-3xl md:text-4xl mt-2">{s.k}</h2>
              </div>
              <p className="md:col-span-9 text-lg md:text-xl text-muted-foreground leading-relaxed">{s.v}</p>
            </motion.section>
          ))}
      </div>

      {/* CTA */}
      <div className="mx-auto max-w-5xl px-6 lg:px-10 mt-32">
        <div className="rounded-3xl border border-border bg-card p-10 md:p-16 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">// Next drop</div>
          <h3 className="display text-4xl md:text-6xl">Explore outros projetos.</h3>
          <Link to="/" hash="projetos" className="inline-flex mt-8 items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs hover:glow-neon" data-cursor="hover">
            <ArrowLeft className="size-4" /> Ver todos
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
