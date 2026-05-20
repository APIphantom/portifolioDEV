import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

const skills = [
  { name: "React", level: 90 },
  { name: "TypeScript", level: 82 },
  { name: "Tailwind CSS", level: 94 },
  { name: "Framer Motion", level: 86 },
  { name: "Next.js", level: 78 },
  { name: "Node.js", level: 72 },
  { name: "Figma", level: 80 },
  { name: "Git", level: 85 },
];

function Counter({ to }: { to: number }) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });
  const rounded = useTransform(spring, (v) => Math.round(v));
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => { if (inView) mv.set(to); }, [inView, to, mv]);
  useEffect(() => rounded.on("change", (v) => { if (ref.current) ref.current.textContent = `${v}%`; }), [rounded]);

  return <span ref={ref} className="text-primary font-black tabular-nums">0%</span>;
}

export function Skills() {
  return (
    <section id="skills" className="relative py-32 px-6 lg:px-10 border-y border-border bg-gradient-to-b from-background via-card/30 to-background">
      <div className="absolute inset-0 -z-10 scanlines opacity-30" />
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">// 02 — Stack</div>
            <h2 className="display text-5xl md:text-7xl">
              Equipamento <br /> de <span className="text-primary">trabalho.</span>
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Ferramentas escolhidas a dedo — não pelo hype, mas pelo que entrega resultado real em
            produtos modernos.
          </p>
        </div>

        {/* Terminal-style header */}
        <div className="mb-6 inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-card border border-border text-xs font-mono">
          <span className="flex gap-1.5">
            <span className="size-2 rounded-full bg-destructive/70" />
            <span className="size-2 rounded-full bg-primary/70" />
            <span className="size-2 rounded-full bg-primary" />
          </span>
          <span className="text-muted-foreground">~ stvx@portfolio — bash —</span>
          <span className="text-primary">stack --list</span>
          <span className="inline-block w-1.5 h-3 bg-primary animate-blink" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {skills.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.05 }}
              className="group p-6 rounded-2xl border border-border bg-card relative overflow-hidden hover:border-primary/60 hover:glow-neon transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-baseline justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground tabular-nums font-mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xl font-bold tracking-tight">{s.name}</span>
                </div>
                <Counter to={s.level} />
              </div>
              <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                  className="h-full bg-primary group-hover:shadow-[0_0_20px_rgba(var(--glow-color),0.7)] transition-shadow"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
