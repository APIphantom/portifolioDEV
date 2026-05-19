import { motion } from "framer-motion";
import { ArrowDown, Download, Mail } from "lucide-react";

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden flex items-center pt-24 pb-16">
      {/* Backdrop */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,212,0,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(255,255,255,0.04)_95%),linear-gradient(90deg,transparent_95%,rgba(255,255,255,0.04)_95%)] bg-[size:64px_64px]" />
        <motion.div
          aria-hidden
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -right-40 top-1/3 w-[700px] h-[700px] rounded-full border border-primary/20"
        >
          <div className="absolute inset-10 rounded-full border border-primary/10" />
          <div className="absolute inset-24 rounded-full border border-primary/5" />
        </motion.div>
        <div className="absolute -left-32 bottom-10 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl w-full px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-end">
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Available for hire — 2026
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="display text-[clamp(3.5rem,12vw,11rem)] leading-[0.82]"
          >
            STREET
            <br />
            <span className="text-primary text-glow">CODE</span>
            <span className="inline-block align-top text-primary text-glow">.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground"
          >
            <span className="text-foreground font-medium">Front-End Developer.</span> Construindo
            experiências digitais com identidade, performance e estética moderna — onde streetwear
            encontra interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <a
              href="#projetos"
              className="group inline-flex items-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-full font-bold uppercase tracking-widest text-xs hover:glow-neon transition-all"
            >
              Ver Projetos
              <ArrowDown className="size-4 group-hover:translate-y-0.5 transition-transform" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-4 border border-border rounded-full font-bold uppercase tracking-widest text-xs hover:border-primary hover:text-primary transition-colors"
            >
              <Download className="size-4" /> Download CV
            </a>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full font-bold uppercase tracking-widest text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="size-4" /> Contato
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="lg:col-span-4 space-y-4 text-xs uppercase tracking-widest"
        >
          <div className="border-l-2 border-primary pl-4">
            <div className="text-muted-foreground">Drop 01 / V.2026</div>
            <div className="text-foreground font-bold mt-1">Portfolio — Edição Limitada</div>
          </div>
          <div className="grid grid-cols-2 gap-px bg-border rounded-lg overflow-hidden">
            {[
              { k: "+3", v: "Anos" },
              { k: "20+", v: "Projetos" },
              { k: "12", v: "Stacks" },
              { k: "∞", v: "Café" },
            ].map((s) => (
              <div key={s.v} className="bg-card p-4">
                <div className="text-3xl font-black text-primary">{s.k}</div>
                <div className="text-[10px] text-muted-foreground mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="absolute bottom-0 left-0 right-0 border-y border-border bg-background/40 backdrop-blur-sm overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-3">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["REACT", "TAILWIND", "TYPESCRIPT", "FRAMER MOTION", "NEXT.JS", "FIGMA", "GIT", "NODE"].map(
              (t, i) => (
                <span key={`${k}-${i}`} className="mx-8 text-sm font-black tracking-widest text-muted-foreground">
                  {t} <span className="text-primary">★</span>
                </span>
              )
            )
          )}
        </div>
      </div>
    </section>
  );
}
