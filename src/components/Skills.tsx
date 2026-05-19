import { motion } from "framer-motion";

const skills = [
  { name: "HTML5", level: 95 },
  { name: "CSS3", level: 92 },
  { name: "JavaScript", level: 88 },
  { name: "React", level: 90 },
  { name: "Tailwind CSS", level: 94 },
  { name: "TypeScript", level: 82 },
  { name: "Git", level: 85 },
  { name: "Figma", level: 80 },
];

export function Skills() {
  return (
    <section id="skills" className="relative py-32 px-6 lg:px-10 border-y border-border bg-gradient-to-b from-background via-card/30 to-background">
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

        <div className="grid md:grid-cols-2 gap-4">
          {skills.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.05 }}
              className="group p-6 rounded-2xl border border-border bg-card relative overflow-hidden hover:border-primary/60 transition-all"
            >
              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xl font-bold tracking-tight">{s.name}</span>
                </div>
                <span className="text-primary font-black tabular-nums">{s.level}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                  className="h-full bg-primary group-hover:shadow-[0_0_20px_rgba(255,212,0,0.6)] transition-shadow"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
