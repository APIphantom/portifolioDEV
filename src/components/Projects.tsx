import { motion } from "framer-motion";
import { Github, ExternalLink, ImageIcon } from "lucide-react";
import type { Project } from "@/lib/projects-store";

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projetos" className="relative py-32 px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 1, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: (i % 3) * 0.1 }}
              className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/60 transition-all"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-graphite to-background">
                    <span className="display text-[8rem] text-primary/10">
                      {p.title.charAt(0)}
                    </span>
                    <ImageIcon className="absolute size-8 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-primary font-bold">
                  Drop {String(i + 1).padStart(2, "0")}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-black text-2xl tracking-tight leading-none mb-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                </div>
              </div>

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
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full border border-border text-xs uppercase tracking-widest font-bold hover:border-primary hover:text-primary transition-colors"
                    >
                      <Github className="size-3.5" /> Code
                    </a>
                  )}
                  {p.demo && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-widest font-bold hover:glow-neon transition-shadow"
                    >
                      <ExternalLink className="size-3.5" /> Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground">Nenhum drop ainda. Adicione um pelo painel admin.</p>
          </div>
        )}
      </div>
    </section>
  );
}
