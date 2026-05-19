import { motion } from "framer-motion";
import { Code2, Palette, Smartphone, Zap } from "lucide-react";

const cards = [
  { icon: Code2, title: "Clean Code", text: "HTML, CSS, JavaScript e React com arquitetura escalável." },
  { icon: Palette, title: "UI Design", text: "Interface refinada com olhar editorial e atenção ao detalhe." },
  { icon: Smartphone, title: "Responsivo", text: "Experiências fluidas em qualquer dispositivo." },
  { icon: Zap, title: "Performance", text: "Loading rápido, animações suaves, zero gordura." },
];

export function About() {
  return (
    <section id="sobre" className="relative py-32 px-6 lg:px-10">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 1, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-6">// 01 — Sobre</div>
            <h2 className="display text-5xl md:text-7xl">
              Designer de
              <br />
              interfaces.
              <br />
              <span className="text-primary">Builder</span> de
              <br />
              experiências.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 1 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-10 relative w-56 h-56 rounded-2xl overflow-hidden border border-border"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="display text-[10rem] text-primary/40 leading-none">S</span>
            </div>
            <div className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest">
              <div className="text-muted-foreground">Avatar</div>
              <div className="text-foreground font-bold">STVX // 26</div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <motion.p
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl text-muted-foreground leading-relaxed"
          >
            Sou um desenvolvedor front-end júnior obcecado por interfaces que parecem
            <span className="text-foreground"> roupa boa</span>: têm caimento, identidade e
            atitude. Trabalho na fronteira entre código, design e cultura urbana.
          </motion.p>

          <div className="grid sm:grid-cols-2 gap-4">
            {cards.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 1, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors relative overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/0 group-hover:bg-primary/10 blur-2xl transition-all" />
                <c.icon className="size-6 text-primary mb-4" />
                <div className="font-bold text-lg">{c.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{c.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
