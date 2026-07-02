import { motion, useReducedMotion } from "framer-motion";
import type { DetailItem } from "./types";

type Props = {
  timeline: DetailItem[];
  cards: Array<DetailItem & { section: string }>;
};

export function DevelopmentSection({ timeline, cards }: Props) {
  const reducedMotion = useReducedMotion();
  const visibleTimeline = timeline.slice(0, 5);
  const timelineProgress = visibleTimeline.length
    ? Math.min(100, Math.max(20, Math.round((visibleTimeline.length / 5) * 100)))
    : 20;

  return (
    <section id="development" className="px-6 lg:px-10 mt-12 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="relative overflow-hidden mx-auto max-w-7xl rounded-3xl border border-primary/20 bg-gradient-to-b from-[#101005]/85 via-[#0a0a07]/88 to-[#060605]/96 backdrop-blur-xl p-6 md:p-8"
      >
        <div className="pointer-events-none absolute -top-40 right-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-44 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:repeating-linear-gradient(to_bottom,rgba(255,212,0,0.12)_0px,rgba(255,212,0,0.12)_1px,transparent_1px,transparent_16px)]" />

        <div className="hidden xl:flex absolute left-4 top-20 bottom-6 w-9 flex-col items-center">
          <span className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground">Scroll</span>
          <div className="mt-2 h-full w-px bg-border/80 relative overflow-hidden">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${timelineProgress}%` }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: reducedMotion ? 0.01 : 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 top-0 w-full bg-primary"
            />
          </div>
          <span className="mt-2 text-[9px] uppercase tracking-[0.24em] text-primary">{timelineProgress}%</span>
        </div>

        <div className="relative flex flex-wrap items-center gap-3 mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary">07</span>
          <div className="h-px flex-1 bg-gradient-to-r from-primary/45 to-transparent" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Desenvolvimento</span>
          <p className="w-full text-xs text-foreground/65 mt-1 md:mt-0 md:w-auto md:ml-2">
            Execucao por etapas, desafios tecnicos e decisoes de arquitetura.
          </p>
        </div>

        <div className="relative mb-8 rounded-2xl border border-primary/25 bg-gradient-to-b from-primary/[0.08] to-background/55 p-4 md:p-5">
          <div className="md:hidden space-y-3">
            {visibleTimeline.map((step, i) => (
              <motion.div
                key={`mobile-${step.id}`}
                initial={{ opacity: 0, x: -14, filter: "blur(2px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: reducedMotion ? 0.01 : 0.4, delay: i * 0.06 }}
                className="relative pl-6 pr-3 py-3 rounded-xl border border-primary/35 bg-background/70"
              >
                <span className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/70 via-primary/40 to-transparent" />
                <span className="absolute left-[5px] top-4 size-2 rounded-full bg-primary shadow-[0_0_0_4px_rgba(255,212,0,0.13)]" />
                <div className="text-[10px] uppercase tracking-[0.25em] text-primary mb-1">Etapa {String(i + 1).padStart(2, "0")}</div>
                <div className="text-sm font-semibold mb-1.5">{step.title}</div>
                <p className="text-xs text-foreground/70 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <div className="hidden md:block absolute left-8 right-8 top-[53%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="min-w-[820px] md:min-w-0 grid grid-cols-5 gap-3 md:gap-4">
            {visibleTimeline.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 18, filter: "blur(3px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: reducedMotion ? 0.01 : 0.45, delay: i * 0.08 }}
                className="relative min-w-0 rounded-xl border border-primary/45 bg-background/65 p-3.5 md:p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-primary">Etapa {String(i + 1).padStart(2, "0")}</div>
                  <span className="text-[10px] text-primary/70">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="text-sm font-semibold mb-2 line-clamp-2">{step.title}</div>
                <p className="text-xs text-foreground/70 leading-relaxed line-clamp-3">{step.description}</p>
                <span className="hidden md:block absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_0_4px_rgba(255,212,0,0.13)]" />
                {i < visibleTimeline.length - 1 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 h-px w-4 bg-primary/55" />
                )}
              </motion.div>
            ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {cards.map((card, i) => (
            <motion.article
              key={card.id}
              initial={{ opacity: 0, y: 16, filter: "blur(3px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: reducedMotion ? 0.01 : 0.42, delay: i * 0.05 }}
              className="group relative min-w-0 overflow-hidden rounded-2xl border border-primary/35 bg-gradient-to-b from-primary/[0.08] via-[#0b0b08]/90 to-[#070706]/95 p-4 md:p-5 hover:-translate-y-0.5 hover:scale-[1.01] hover:border-primary/70 hover:shadow-[0_20px_55px_rgba(255,212,0,0.16)] transition-all"
              data-cursor="details"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              <div className="pointer-events-none absolute inset-0 opacity-[0.09] [background-image:linear-gradient(to_bottom,transparent_0%,rgba(255,212,0,0.11)_40%,transparent_100%)]" />

              <div className="relative flex items-center justify-between mb-3 gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/35 bg-primary/[0.1] text-[10px] uppercase tracking-[0.22em] text-primary">
                  <span className="size-1.5 rounded-full bg-primary" /> {card.section}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary/75">{String(i + 1).padStart(2, "0")}</span>
              </div>

              <h3 className="text-base md:text-lg font-bold mb-2">{card.title}</h3>
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line break-words">
                {card.description}
              </p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
