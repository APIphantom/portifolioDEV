import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useMemo } from "react";

type SkillLevel = "Em estudo" | "Confortável" | "Sólido";

interface Skill {
  name: string;
  level: number;
  label: SkillLevel;
}

interface SkillCategory {
  id: string;
  title: string;
  caption: string;
  skills: Skill[];
}

const categories: SkillCategory[] = [
  {
    id: "frontend",
    title: "Front-End",
    caption: "Stack principal do meu dia a dia",
    skills: [
      { name: "React", level: 85, label: "Sólido" },
      { name: "JavaScript", level: 88, label: "Sólido" },
      { name: "TypeScript", level: 75, label: "Confortável" },
      { name: "Next.js", level: 70, label: "Confortável" },
      { name: "Tailwind CSS", level: 90, label: "Sólido" },
      { name: "HTML5 & CSS3", level: 92, label: "Sólido" },
    ],
  },
  {
    id: "tools",
    title: "Ferramentas",
    caption: "Fluxo de trabalho e versionamento",
    skills: [
      { name: "Git", level: 82, label: "Sólido" },
      { name: "GitHub", level: 85, label: "Sólido" },
      { name: "Figma", level: 75, label: "Confortável" },
      { name: "Vite", level: 80, label: "Sólido" },
      { name: "Vercel", level: 78, label: "Confortável" },
      { name: "REST APIs", level: 78, label: "Confortável" },
    ],
  },
  {
    id: "learning",
    title: "Em Evolução",
    caption: "Tecnologias que estudo agora",
    skills: [
      { name: "Node.js", level: 55, label: "Em estudo" },
      { name: "Supabase", level: 50, label: "Em estudo" },
      { name: "PostgreSQL", level: 45, label: "Em estudo" },
      { name: "FastAPI", level: 35, label: "Em estudo" },
      { name: "Docker", level: 30, label: "Em estudo" },
      { name: "CI/CD", level: 35, label: "Em estudo" },
    ],
  },
];

function Counter({ to }: { to: number }) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });
  const rounded = useTransform(spring, (v) => Math.round(v));
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => { if (inView) mv.set(to); }, [inView, to, mv]);
  useEffect(
    () => rounded.on("change", (v) => { if (ref.current) ref.current.textContent = `${v}%`; }),
    [rounded],
  );

  return <span ref={ref} className="text-primary font-black tabular-nums" aria-label={`Nível: ${to}%`}>0%</span>;
}

export function Skills() {
  const allSkills = useMemo(() => categories.flatMap((c) => c.skills), []);

  return (
    <section
      id="skills"
      className="relative py-32 px-6 lg:px-10 border-y border-border bg-gradient-to-b from-background via-card/30 to-background"
      aria-labelledby="skills-title"
    >
      <div className="absolute inset-0 -z-10 scanlines opacity-30" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">// 02 — Stack</div>
            <h2 id="skills-title" className="display text-5xl md:text-7xl">
              Meu <span className="text-primary">arsenal</span>
              <br />
              técnico.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Ferramentas que uso no dia a dia, organizadas por categoria.
            Os percentuais refletem minha autoavaliação — sempre aprendendo mais.
          </p>
        </div>

        <div className="mb-6 inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-card border border-border text-xs font-mono">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2 rounded-full bg-destructive/70" />
            <span className="size-2 rounded-full bg-primary/70" />
            <span className="size-2 rounded-full bg-primary" />
          </span>
          <span className="text-muted-foreground">~ adriano@portfolio — bash —</span>
          <span className="text-primary">stack --list</span>
          <span className="inline-block w-1.5 h-3 bg-primary animate-blink" aria-hidden="true" />
        </div>

        <div className="space-y-12">
          {categories.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-baseline justify-between mb-5 flex-wrap gap-2">
                <h3 className="text-2xl md:text-3xl font-black tracking-tight">
                  {cat.title}
                  <span className="text-primary">.</span>
                </h3>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {cat.caption}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {cat.skills.map((s, i) => {
                  const globalIdx = allSkills.findIndex((x) => x.name === s.name);
                  return (
                    <motion.div
                      key={s.name}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ delay: i * 0.05 }}
                      className="group p-6 rounded-2xl border border-border bg-card relative overflow-hidden hover:border-primary/60 hover:glow-neon transition-all"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                      <div className="relative flex items-baseline justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground tabular-nums font-mono">
                            {String(globalIdx + 1).padStart(2, "0")}
                          </span>
                          <span className="text-xl font-bold tracking-tight">{s.name}</span>
                        </div>
                        <Counter to={s.level} />
                      </div>
                      <div className="relative flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          {s.label}
                        </span>
                      </div>
                      <div
                        className="relative h-1.5 bg-muted rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuenow={s.level}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${s.name} — ${s.level}%`}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                          className="h-full bg-primary group-hover:shadow-[0_0_20px_rgba(var(--glow-color),0.7)] transition-shadow"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
