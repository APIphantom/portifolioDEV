import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Plus, Pencil, Trash2, UploadCloud } from "lucide-react";
import type { Project } from "@/lib/projects-store";

type Props = {
  projects: Project[];
  onAdd: (p: Omit<Project, "id">) => void;
  onUpdate: (id: string, patch: Partial<Project>) => void;
  onRemove: (id: string) => void;
};

const empty: Omit<Project, "id"> = {
  title: "",
  description: "",
  image: "",
  tech: [],
  github: "",
  demo: "",
};

export function AdminPanel({ projects, onAdd, onUpdate, onRemove }: Props) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(empty);
  const [techInput, setTechInput] = useState("");
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setForm(empty);
    setEditingId(null);
    setTechInput("");
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const tech = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = { ...form, tech: tech.length ? tech : form.tech };
    if (editingId) onUpdate(editingId, payload);
    else onAdd(payload);
    reset();
  };

  const startEdit = (p: Project) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      image: p.image,
      tech: p.tech,
      github: p.github ?? "",
      demo: p.demo ?? "",
    });
    setTechInput(p.tech.join(", "));
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        aria-label="Open admin"
        className="fixed bottom-6 right-6 z-40 size-14 rounded-full bg-primary text-primary-foreground shadow-[0_0_30px_rgba(255,212,0,0.4)] flex items-center justify-center"
      >
        <Settings className="size-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-border bg-card/95 backdrop-blur">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-primary">// Admin</div>
                  <div className="font-black text-2xl tracking-tight">Painel de Drops</div>
                </div>
                <button onClick={() => setOpen(false)} className="size-10 rounded-full border border-border flex items-center justify-center hover:border-primary">
                  <X className="size-4" />
                </button>
              </div>

              <div className="p-6 grid md:grid-cols-2 gap-8">
                {/* Form */}
                <form onSubmit={submit} className="space-y-4">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {editingId ? "Editando Drop" : "Novo Drop"}
                  </div>

                  {/* Image dropzone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDrag(false);
                      const f = e.dataTransfer.files?.[0];
                      if (f) handleFile(f);
                    }}
                    onClick={() => fileRef.current?.click()}
                    className={`relative aspect-video rounded-2xl border-2 border-dashed cursor-pointer transition-all overflow-hidden ${
                      drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    {form.image ? (
                      <img src={form.image} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <UploadCloud className="size-8" />
                        <div className="text-xs uppercase tracking-widest">Drag & drop ou clique</div>
                      </div>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    />
                  </div>

                  <Input label="Título" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
                  <TextArea label="Descrição" value={form.description} onChange={(v) => setForm({ ...form, description: v })} required />
                  <Input label="Tecnologias (separe por vírgula)" value={techInput} onChange={setTechInput} placeholder="React, Tailwind" />
                  <Input label="Link GitHub" value={form.github ?? ""} onChange={(v) => setForm({ ...form, github: v })} placeholder="https://github.com/..." />
                  <Input label="Link Demo" value={form.demo ?? ""} onChange={(v) => setForm({ ...form, demo: v })} placeholder="https://..." />

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs hover:glow-neon transition-shadow"
                    >
                      <Plus className="size-4" /> {editingId ? "Salvar" : "Adicionar"}
                    </button>
                    {editingId && (
                      <button type="button" onClick={reset} className="px-4 py-3 rounded-full border border-border text-xs uppercase tracking-widest">
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>

                {/* List */}
                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Drops ({projects.length})
                  </div>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                    {projects.map((p) => (
                      <div key={p.id} className="flex gap-3 p-3 rounded-xl border border-border hover:border-primary/40 transition-colors">
                        <div className="size-14 shrink-0 rounded-lg overflow-hidden bg-muted">
                          {p.image ? (
                            <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary/40 font-black">
                              {p.title.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold truncate">{p.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{p.tech.join(" · ")}</div>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => startEdit(p)} className="size-8 rounded-md border border-border hover:border-primary hover:text-primary flex items-center justify-center">
                            <Pencil className="size-3.5" />
                          </button>
                          <button onClick={() => onRemove(p.id)} className="size-8 rounded-md border border-border hover:border-destructive hover:text-destructive flex items-center justify-center">
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {projects.length === 0 && (
                      <div className="text-sm text-muted-foreground text-center py-10 border border-dashed border-border rounded-xl">
                        Sem drops. Adicione o primeiro.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Input({ label, value, onChange, required, placeholder }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-primary outline-none transition-colors"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        rows={3}
        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-primary outline-none transition-colors resize-none"
      />
    </div>
  );
}
