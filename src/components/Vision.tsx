import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Vision() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section id="visao" ref={ref} className="relative py-32 px-6 lg:px-10 overflow-hidden border-y border-border">
      <div className="absolute inset-0 -z-10 scanlines opacity-40" />
      <motion.div style={{ x }} className="text-xs uppercase tracking-[0.5em] text-primary mb-8">
        // 04 — Minha Visão / My Vision / 私のビジョン
      </motion.div>

      <div className="mx-auto max-w-6xl">
        <h2 className="display text-[clamp(2.5rem,9vw,8rem)]">
          Não crio
          <br />
          <span className="text-muted-foreground">interfaces</span>{" "}
          <span className="text-primary text-glow">genéricas.</span>
        </h2>
        <p className="mt-12 max-w-2xl text-lg md:text-2xl text-muted-foreground leading-relaxed">
          Construo experiências com{" "}
          <span className="text-foreground font-bold">identidade visual forte</span>, inspiradas em{" "}
          <span className="text-foreground">moda</span>,{" "}
          <span className="text-foreground">música</span> e{" "}
          <span className="text-foreground">cultura urbana</span>. Código é tecido. Pixel é tinta.
          Cada projeto é um drop.
        </p>

        <div className="mt-16 grid sm:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
          {[
            { k: "Design", v: "Editorial, bold, com hierarquia clara" },
            { k: "Motion", v: "Cinemático, com propósito, nunca decorativo" },
            { k: "Code", v: "Acessível, performático, escalável" },
          ].map((b) => (
            <div key={b.k} className="bg-card p-8">
              <div className="text-[10px] uppercase tracking-[0.3em] text-primary">// {b.k}</div>
              <p className="mt-3 text-sm text-muted-foreground">{b.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
