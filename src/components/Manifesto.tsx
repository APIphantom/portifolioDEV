import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const yFast = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section ref={ref} className="relative py-40 overflow-hidden">
      <motion.div style={{ y: yFast }} className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <span className="display text-[28vw] text-primary/5 leading-none whitespace-nowrap">CODE / CULTURE</span>
      </motion.div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-8">// Manifesto</div>
        <motion.h2 style={{ y }} className="display text-[clamp(3rem,14vw,16rem)] leading-[0.82]">
          Código
          <br />
          também é
          <br />
          <span className="text-primary text-glow">identidade.</span>
        </motion.h2>

        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl">
          <p className="text-muted-foreground">
            Cada linha é uma escolha. Cada componente, uma postura. Software não é neutro — ele
            carrega a voz de quem o constrói.
          </p>
          <p className="text-muted-foreground md:mt-12">
            Acredito em interfaces que respeitam o usuário, valorizam o detalhe e não têm medo de
            ter opinião visual.
          </p>
          <p className="text-muted-foreground md:mt-24">
            O resultado: produtos que parecem feitos por gente, para gente — e não por templates
            sem alma.
          </p>
        </div>
      </div>
    </section>
  );
}
