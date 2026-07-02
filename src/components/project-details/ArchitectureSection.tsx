import { motion } from "framer-motion";
import { ArrowDown, Database, HardDrive, Monitor, Server, Wallet } from "lucide-react";
import type { DetailItem } from "./types";

type Props = {
  description: string;
  technologies: string[];
};

const flow = [
  { label: "Cliente", icon: Monitor },
  { label: "Frontend", icon: Monitor },
  { label: "API", icon: Server },
  { label: "Banco", icon: Database },
  { label: "Storage", icon: HardDrive },
  { label: "Pagamento", icon: Wallet },
];

export function ArchitectureSection({ description, technologies }: Props) {
  return (
    <section id="architecture" className="px-6 lg:px-10 mt-10 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-7xl rounded-3xl border border-border/80 bg-gradient-to-b from-card/60 to-background/45 backdrop-blur-xl p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary">05</span>
          <div className="h-px flex-1 bg-border/80" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Arquitetura</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 rounded-2xl border border-border/70 bg-background/45 p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {flow.map((item, i) => (
                <div key={item.label} className="relative rounded-xl border border-border/70 bg-background/55 p-3">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <item.icon className="size-4" />
                    <span className="text-xs uppercase tracking-[0.2em]">{item.label}</span>
                  </div>
                  {i < flow.length - 1 && (
                    <ArrowDown className="absolute -bottom-3 left-1/2 -translate-x-1/2 size-3 text-primary/70 md:hidden" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{description}</p>
            <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
              <div className="text-[10px] uppercase tracking-[0.25em] text-primary mb-3">Tecnologias</div>
              <ul className="space-y-2">
                {technologies.map((item) => (
                  <li key={item} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 hover:border-primary/45 transition-colors">
                    <span className="text-sm">{item}</span>
                    <span className="text-xs text-muted-foreground">Stack</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
