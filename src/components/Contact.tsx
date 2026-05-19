import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, Send } from "lucide-react";
import { useState } from "react";

export function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contato" className="relative py-32 px-6 lg:px-10 border-t border-border">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">// 04 — Contato</div>
          <h2 className="display text-5xl md:text-7xl">
            Vamos<br />construir<br /><span className="text-primary">algo.</span>
          </h2>
          <p className="mt-6 text-muted-foreground max-w-md">
            Disponível para projetos freelance, posições full-time e colaborações que envolvam
            código com identidade.
          </p>
          <div className="mt-10 space-y-3">
            {[
              { Icon: Github, label: "github.com/stvx", href: "https://github.com" },
              { Icon: Linkedin, label: "linkedin.com/in/stvx", href: "https://linkedin.com" },
              { Icon: Instagram, label: "@stvx.dev", href: "https://instagram.com" },
            ].map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-full border border-border group-hover:border-primary group-hover:glow-neon transition-all">
                  <Icon className="size-4" />
                </span>
                {label}
              </a>
            ))}
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            setTimeout(() => setSent(false), 3000);
          }}
          className="lg:col-span-7 p-8 rounded-3xl border border-border bg-card space-y-5"
        >
          {[
            { id: "name", label: "Nome", type: "text" },
            { id: "email", label: "Email", type: "email" },
          ].map((f) => (
            <div key={f.id}>
              <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                {f.label}
              </label>
              <input
                required
                type={f.type}
                className="w-full bg-transparent border-0 border-b border-border focus:border-primary outline-none py-3 text-lg transition-colors"
                placeholder={f.label.toLowerCase()}
              />
            </div>
          ))}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
              Mensagem
            </label>
            <textarea
              required
              rows={4}
              className="w-full bg-transparent border-0 border-b border-border focus:border-primary outline-none py-3 text-lg resize-none transition-colors"
              placeholder="conta o projeto..."
            />
          </div>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs hover:glow-neon transition-shadow"
          >
            {sent ? "Mensagem enviada ✓" : (<>Enviar <Send className="size-4" /></>)}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
