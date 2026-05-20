import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(80, "Nome muito longo"),
  email: z.string().trim().email("Email inválido").max(120),
  message: z.string().trim().min(10, "Mensagem muito curta").max(1500, "Mensagem muito longa"),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export function Contact() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [values, setValues] = useState({ name: "", email: "", message: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof Errors;
        if (k && !errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      toast.error("Verifique os campos do formulário");
      return;
    }
    setLoading(true);
    // EmailJS integration placeholder — substitua SERVICE/TEMPLATE/PUBLIC_KEY quando tiver
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    toast.success("Mensagem enviada — em breve respondo ✦");
    setValues({ name: "", email: "", message: "" });
  };

  return (
    <section id="contato" className="relative py-32 px-6 lg:px-10 border-t border-border">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">// 05 — Contato</div>
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
                data-cursor="hover"
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
          onSubmit={onSubmit}
          noValidate
          className="lg:col-span-7 p-8 rounded-3xl border border-border bg-card/60 backdrop-blur-xl space-y-5"
        >
          <Field
            id="name"
            label="Nome"
            type="text"
            value={values.name}
            onChange={(v) => setValues({ ...values, name: v })}
            error={errors.name}
          />
          <Field
            id="email"
            label="Email"
            type="email"
            value={values.email}
            onChange={(v) => setValues({ ...values, email: v })}
            error={errors.email}
          />
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Mensagem</label>
            <textarea
              rows={4}
              value={values.message}
              onChange={(e) => setValues({ ...values, message: e.target.value })}
              placeholder="conta o projeto..."
              data-cursor="hover"
              className="w-full bg-transparent border-0 border-b border-border focus:border-primary outline-none py-3 text-lg resize-none transition-colors"
            />
            {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            data-cursor="hover"
            className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs hover:glow-neon transition-shadow disabled:opacity-60"
          >
            {loading ? <><Loader2 className="size-4 animate-spin" /> Enviando…</> : <>Enviar <Send className="size-4" /></>}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

function Field({
  id, label, type, value, onChange, error,
}: {
  id: string; label: string; type: string; value: string; onChange: (v: string) => void; error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label.toLowerCase()}
        data-cursor="hover"
        className="w-full bg-transparent border-0 border-b border-border focus:border-primary outline-none py-3 text-lg transition-colors"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
