import { motion } from "framer-motion";
import { CircleDot } from "lucide-react";

type Feature = {
  title: string;
  subtitle: string;
};

type Props = {
  summary: string;
  features: Feature[];
};

export function OverviewSection({ summary, features }: Props) {
  return (
    <section className="px-6 lg:px-10 mt-2">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55 }}
        className="mx-auto max-w-7xl rounded-3xl border border-border/80 bg-gradient-to-b from-card/60 to-background/45 backdrop-blur-xl p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary">01</span>
          <div className="h-px flex-1 bg-border/80" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Overview</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <p className="lg:col-span-7 text-base md:text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
            {summary}
          </p>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border/70 bg-background/45 p-3 hover:border-primary/55 hover:shadow-[0_14px_38px_rgba(255,212,0,0.10)] transition-all"
              >
                <div className="flex items-center gap-2 text-primary mb-1">
                  <CircleDot className="size-3" />
                  <span className="text-xs uppercase tracking-[0.2em]">{item.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
