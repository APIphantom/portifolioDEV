import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Github, ExternalLink, ImageIcon, ArrowUpRight } from "lucide-react";
import { CATEGORIES, type Project, type ProjectCategory } from "@/lib/projects-store";
import { TiltCard } from "./TiltCard";

type Filter = "all" | ProjectCategory;

export function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const filtered = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects]
  );

  return (
    <section id="projetos" className="relative py-32 px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">// 03 — Drops</div>
            <h2 className="display text-5xl md:text-7xl">
              Projetos <br />
              <span className="text-primary">selecionados.</span>
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Edições limitadas. Cada projeto é um experimento entre código, marca e cultura.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {[{ value: "all" as const, label: "Todos" }, ...CATEGORIES].map((c) => (
            <button
              key={c.value}
              onClick={() => setFilter(c.value as Filter)}
              data-cursor="hover"
              className={`text-[10px] uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${
                filter === c.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: (i % 3) * 0.1 }}
            >
              <TiltCard className="h-full">
                <article className="group relative h-full rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/60 hover:glow-neon transition-all">
                  <Link to="/projeto/$slug" params={{ slug: p.slug }} className="block" data-cursor="hover">
                    <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-graphite to-background">
                          <span className="display text-[8rem] text-primary/10">{p.title.charAt(0)}</span>
                          <ImageIcon className="absolute size-8 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
                          Drop {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground bg-background/60 backdrop-blur px-2 py-1 rounded-full border border-border">
                          {CATEGORIES.find((c) => c.value === p.category)?.label ?? p.category}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <ArrowUpRight className="size-5" />
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="font-black text-2xl tracking-tight leading-none mb-2">{p.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                      </div>
                    </div>
                  </Link>

                  <div className="p-5 flex flex-col gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tech.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full border border-border text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to="/projeto/$slug"
                        params={{ slug: p.slug }}
                        data-cursor="hover"
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full border border-border text-xs uppercase tracking-widest font-bold hover:border-primary hover:text-primary transition-colors"
                      >
                        Case Study <ArrowUpRight className="size-3.5" />
                      </Link>
                      {p.demo && (
                        <a
                          href={p.demo}
                          target="_blank"
                          rel="noreferrer"
                          data-cursor="hover"
                          aria-label={`Demo de ${p.title}`}
                          className="size-9 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:glow-neon transition-shadow"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      )}
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noreferrer"
                          data-cursor="hover"
                          aria-label={`GitHub de ${p.title}`}
                          className="size-9 inline-flex items-center justify-center rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
                        >
                          <Github className="size-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground">Nenhum drop nessa categoria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
