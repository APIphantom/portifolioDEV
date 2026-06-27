import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, Plus, Trash2, GripVertical, Save } from "lucide-react";
import { CATEGORIES, slugify, uid, type Project, type ContentBlock, type Metric, type ProjectCategory, type ProjectStatus, type ProjectVisibility } from "@/lib/projects-store";

type Props = {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: (data: Omit<Project, "id">) => void;
};

const TABS = [
  { id: "geral", label: "Geral" },
  { id: "conteudo", label: "Conteúdo" },
  { id: "stack", label: "Stack" },
  { id: "midia", label: "Mídia" },
  { id: "metricas", label: "Métricas" },
  { id: "seo", label: "SEO" },
  { id: "publicacao", label: "Publicação" },
] as const;
type TabId = typeof TABS[number]["id"];

const emptyProject: Omit<Project, "id"> = {
  slug: "",
  title: "",
  description: "",
  longDescription: "",
  image: "",
  tech: [],
  category: "web",
  github: "",
  demo: "",
  gallery: [],
  contentBlocks: [],
  metrics: [],
  seo: { robotsIndex: true },
  publication: { status: "draft", visibility: "public" },
  client: "",
  year: String(new Date().getFullYear()),
  duration: "",
  role: "",
};

export function ProjectEditor({ open, project, onClose, onSave }: Props) {
  const [tab, setTab] = useState<TabId>("geral");
  const [form, setForm] = useState<Omit<Project, "id">>(emptyProject);
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    if (open) {
      setTab("geral");
      if (project) {
        const { id: _id, ...rest } = project;
        setForm({ ...emptyProject, ...rest });
        setTechInput(project.tech.join(", "));
      } else {
        setForm(emptyProject);
        setTechInput("");
      }
    }
  }, [open, project]);

  const patch = (p: Partial<Omit<Project, "id">>) => setForm((f) => ({ ...f, ...p }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tech = techInput.split(",").map((t) => t.trim()).filter(Boolean);
    onSave({ ...form, tech: tech.length ? tech : form.tech, slug: form.slug || slugify(form.title) });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-stretch justify-end"
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={onClose} />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="relative w-full max-w-3xl h-full bg-card border-l border-border flex flex-col"
          >
            <header className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-primary">// {project ? "Editar" : "Novo"} drop</div>
                <div className="font-black text-xl tracking-tight">{form.title || "Sem título"}</div>
              </div>
              <button onClick={onClose} className="size-9 rounded-full border border-border flex items-center justify-center hover:border-primary">
                <X className="size-4" />
              </button>
            </header>

            <div className="flex items-center gap-0.5 px-3 py-2 border-b border-border overflow-x-auto">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`relative px-3 py-1.5 rounded-md text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${
                    tab === t.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.id === tab && (
                    <motion.div layoutId="tab-active" className="absolute inset-0 bg-primary/10 rounded-md" transition={{ type: "spring", damping: 24, stiffness: 320 }} />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {tab === "geral" && <GeralTab form={form} patch={patch} />}
                {tab === "conteudo" && <ConteudoTab form={form} patch={patch} />}
                {tab === "stack" && <StackTab techInput={techInput} setTechInput={setTechInput} />}
                {tab === "midia" && <MidiaTab form={form} patch={patch} />}
                {tab === "metricas" && <MetricasTab form={form} patch={patch} />}
                {tab === "seo" && <SeoTab form={form} patch={patch} />}
                {tab === "publicacao" && <PublicacaoTab form={form} patch={patch} />}
              </div>

              <footer className="flex items-center justify-between gap-2 px-6 py-4 border-t border-border bg-card/95 backdrop-blur">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {form.publication?.status === "published" ? "● Publicado" : form.publication?.status === "archived" ? "● Arquivado" : "● Rascunho"}
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={onClose} className="px-4 py-2 rounded-full border border-border text-xs uppercase tracking-widest hover:border-foreground">Cancelar</button>
                  <button type="submit" className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:glow-neon transition-shadow">
                    <Save className="size-3.5" /> Salvar
                  </button>
                </div>
              </footer>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- TABS ---------- */
type FormT = Omit<Project, "id">;
type PatchFn = (p: Partial<FormT>) => void;

function GeralTab({ form, patch }: { form: FormT; patch: PatchFn }) {
  return (
    <div className="space-y-4">
      <Row>
        <Field label="Título" value={form.title} onChange={(v) => patch({ title: v, slug: form.slug || slugify(v) })} required />
        <Field label="Slug" value={form.slug} onChange={(v) => patch({ slug: slugify(v) })} prefix="/projeto/" />
      </Row>
      <Row>
        <SelectField label="Categoria" value={form.category} onChange={(v) => patch({ category: v as ProjectCategory })} options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))} />
        <Field label="Cliente" value={form.client ?? ""} onChange={(v) => patch({ client: v })} />
      </Row>
      <Row>
        <Field label="Ano" value={form.year ?? ""} onChange={(v) => patch({ year: v })} />
        <Field label="Duração" value={form.duration ?? ""} onChange={(v) => patch({ duration: v })} placeholder="6 semanas" />
        <Field label="Papel" value={form.role ?? ""} onChange={(v) => patch({ role: v })} placeholder="Front-End Dev" />
      </Row>
      <TextArea label="Descrição curta" value={form.description} onChange={(v) => patch({ description: v })} required />
      <TextArea label="Descrição completa" value={form.longDescription ?? ""} onChange={(v) => patch({ longDescription: v })} rows={5} />
      <Row>
        <Field label="URL do projeto" value={form.demo ?? ""} onChange={(v) => patch({ demo: v })} placeholder="https://..." />
        <Field label="Repositório" value={form.github ?? ""} onChange={(v) => patch({ github: v })} placeholder="https://github.com/..." />
      </Row>
      <Row>
        <Field label="Ordem de exibição" value={String(form.displayOrder ?? "")} onChange={(v) => patch({ displayOrder: Number(v) || 0 })} type="number" />
        <label className="flex items-center gap-2 mt-6">
          <input type="checkbox" checked={form.publication?.featured ?? false} onChange={(e) => patch({ publication: { ...(form.publication ?? { status: "draft" as ProjectStatus, visibility: "public" as ProjectVisibility }), featured: e.target.checked } })} className="size-4 accent-primary" />
          <span className="text-sm">Projeto em destaque</span>
        </label>
      </Row>
    </div>
  );
}

function ConteudoTab({ form, patch }: { form: FormT; patch: PatchFn }) {
  const blocks = form.contentBlocks ?? [];
  const setBlocks = (b: ContentBlock[]) => patch({ contentBlocks: b });
  const addBlock = (kind: ContentBlock["kind"]) =>
    setBlocks([...blocks, { id: uid(), kind, title: defaultTitle(kind), description: "" }]);

  // Migrate legacy fields if present
  useEffect(() => {
    if (blocks.length === 0 && (form.objective || form.problem || form.solution || form.process || form.result)) {
      const migrated: ContentBlock[] = [];
      const push = (k: ContentBlock["kind"], v?: string) => v && migrated.push({ id: uid(), kind: k, title: defaultTitle(k), description: v });
      push("objective", form.objective); push("problem", form.problem); push("solution", form.solution); push("process", form.process); push("result", form.result);
      if (migrated.length) setBlocks(migrated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["objective", "problem", "solution", "process", "result", "custom"] as const).map((k) => (
          <button key={k} type="button" onClick={() => addBlock(k)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs hover:border-primary hover:text-primary transition-colors">
            <Plus className="size-3" /> {defaultTitle(k)}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {blocks.map((b, i) => (
          <div key={b.id} className="rounded-xl border border-border bg-background/40 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <GripVertical className="size-4 text-muted-foreground" />
              <input
                value={b.title}
                onChange={(e) => setBlocks(blocks.map((x) => x.id === b.id ? { ...x, title: e.target.value } : x))}
                className="flex-1 bg-transparent font-bold focus:outline-none"
              />
              <div className="flex gap-1">
                <button type="button" disabled={i === 0} onClick={() => { const c = [...blocks];[c[i - 1], c[i]] = [c[i], c[i - 1]]; setBlocks(c); }} className="size-7 rounded border border-border text-xs disabled:opacity-30">↑</button>
                <button type="button" disabled={i === blocks.length - 1} onClick={() => { const c = [...blocks];[c[i + 1], c[i]] = [c[i], c[i + 1]]; setBlocks(c); }} className="size-7 rounded border border-border text-xs disabled:opacity-30">↓</button>
                <button type="button" onClick={() => setBlocks(blocks.filter((x) => x.id !== b.id))} className="size-7 rounded border border-border hover:border-destructive hover:text-destructive flex items-center justify-center">
                  <Trash2 className="size-3" />
                </button>
              </div>
            </div>
            <textarea
              value={b.description}
              onChange={(e) => setBlocks(blocks.map((x) => x.id === b.id ? { ...x, description: e.target.value } : x))}
              rows={3}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none resize-none"
              placeholder="Descreva..."
            />
          </div>
        ))}
        {blocks.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-10 border border-dashed border-border rounded-xl">
            Adicione blocos de case study acima.
          </div>
        )}
      </div>
    </div>
  );
}

function defaultTitle(k: ContentBlock["kind"]) {
  return ({ objective: "Objetivo", problem: "Problema", solution: "Solução", process: "Processo", result: "Resultado", custom: "Bloco" } as const)[k];
}

function StackTab({ techInput, setTechInput }: { techInput: string; setTechInput: (v: string) => void }) {
  const tags = techInput.split(",").map((t) => t.trim()).filter(Boolean);
  return (
    <div className="space-y-4">
      <Field label="Tecnologias (separe por vírgula)" value={techInput} onChange={setTechInput} placeholder="React, TypeScript, Tailwind..." />
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs">{t}</span>
        ))}
      </div>
    </div>
  );
}

function MidiaTab({ form, patch }: { form: FormT; patch: PatchFn }) {
  return (
    <div className="space-y-4">
      <ImageDrop label="Cover / Capa" value={form.image} onChange={(v) => patch({ image: v })} />
      <Row>
        <ImageDrop label="Hero Image" value={form.heroImage ?? ""} onChange={(v) => patch({ heroImage: v })} />
        <Field label="Hero Video URL" value={form.heroVideo ?? ""} onChange={(v) => patch({ heroVideo: v })} placeholder="https://..." />
      </Row>
      <Row>
        <ImageDrop label="Desktop Mockup" value={form.desktopMockup ?? ""} onChange={(v) => patch({ desktopMockup: v })} />
        <ImageDrop label="Tablet Mockup" value={form.tabletMockup ?? ""} onChange={(v) => patch({ tabletMockup: v })} />
        <ImageDrop label="Mobile Mockup" value={form.mobileMockup ?? ""} onChange={(v) => patch({ mobileMockup: v })} />
      </Row>
      <GalleryEditor value={form.gallery ?? []} onChange={(g) => patch({ gallery: g })} />
    </div>
  );
}

function GalleryEditor({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((f) => {
      const r = new FileReader();
      r.onload = () => onChange([...value, r.result as string]);
      r.readAsDataURL(f);
    });
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground">Galeria</label>
        <button type="button" onClick={() => ref.current?.click()} className="text-xs text-primary hover:underline">+ Adicionar imagens</button>
        <input ref={ref} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && handleFiles(e.target.files)} />
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {value.map((src, i) => (
          <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
            <img src={src} className="w-full h-full object-cover" />
            <button type="button" onClick={() => onChange(value.filter((_, ii) => ii !== i))} className="absolute top-1 right-1 size-6 rounded-full bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 flex items-center justify-center hover:text-destructive">
              <X className="size-3" />
            </button>
          </div>
        ))}
        {value.length === 0 && <div className="col-span-full text-xs text-muted-foreground text-center py-6 border border-dashed border-border rounded-lg">Sem imagens na galeria</div>}
      </div>
    </div>
  );
}

function MetricasTab({ form, patch }: { form: FormT; patch: PatchFn }) {
  const metrics = form.metrics ?? [];
  const setMetrics = (m: Metric[]) => patch({ metrics: m });
  return (
    <div className="space-y-3">
      <button type="button" onClick={() => setMetrics([...metrics, { id: uid(), title: "", value: "" }])} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs hover:border-primary hover:text-primary">
        <Plus className="size-3" /> Adicionar métrica
      </button>
      {metrics.map((m) => (
        <div key={m.id} className="rounded-xl border border-border bg-background/40 p-4 space-y-2">
          <Row>
            <Field label="Título" value={m.title} onChange={(v) => setMetrics(metrics.map((x) => x.id === m.id ? { ...x, title: v } : x))} />
            <Field label="Valor" value={m.value} onChange={(v) => setMetrics(metrics.map((x) => x.id === m.id ? { ...x, value: v } : x))} />
          </Row>
          <Row>
            <Field label="Prefixo" value={m.prefix ?? ""} onChange={(v) => setMetrics(metrics.map((x) => x.id === m.id ? { ...x, prefix: v } : x))} />
            <Field label="Sufixo" value={m.suffix ?? ""} onChange={(v) => setMetrics(metrics.map((x) => x.id === m.id ? { ...x, suffix: v } : x))} />
          </Row>
          <TextArea label="Descrição" value={m.description ?? ""} onChange={(v) => setMetrics(metrics.map((x) => x.id === m.id ? { ...x, description: v } : x))} rows={2} />
          <button type="button" onClick={() => setMetrics(metrics.filter((x) => x.id !== m.id))} className="text-xs text-destructive hover:underline">Remover</button>
        </div>
      ))}
    </div>
  );
}

function SeoTab({ form, patch }: { form: FormT; patch: PatchFn }) {
  const seo = form.seo ?? {};
  const setSeo = (s: Partial<NonNullable<FormT["seo"]>>) => patch({ seo: { ...seo, ...s } });
  return (
    <div className="space-y-4">
      <Field label="Meta título" value={seo.metaTitle ?? ""} onChange={(v) => setSeo({ metaTitle: v })} />
      <TextArea label="Meta descrição" value={seo.metaDescription ?? ""} onChange={(v) => setSeo({ metaDescription: v })} />
      <Field label="Keywords" value={seo.keywords ?? ""} onChange={(v) => setSeo({ keywords: v })} placeholder="react, portfolio, streetwear" />
      <Field label="URL canônica" value={seo.canonicalUrl ?? ""} onChange={(v) => setSeo({ canonicalUrl: v })} />
      <Row>
        <ImageDrop label="Open Graph Image" value={seo.ogImage ?? ""} onChange={(v) => setSeo({ ogImage: v })} />
        <ImageDrop label="Twitter Image" value={seo.twitterImage ?? ""} onChange={(v) => setSeo({ twitterImage: v })} />
      </Row>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={seo.robotsIndex ?? true} onChange={(e) => setSeo({ robotsIndex: e.target.checked })} className="size-4 accent-primary" />
        <span className="text-sm">Permitir indexação (robots: index)</span>
      </label>
      <TextArea label="Structured Data (JSON-LD)" value={seo.structuredData ?? ""} onChange={(v) => setSeo({ structuredData: v })} rows={5} />
    </div>
  );
}

function PublicacaoTab({ form, patch }: { form: FormT; patch: PatchFn }) {
  const pub = form.publication ?? { status: "draft" as ProjectStatus, visibility: "public" as ProjectVisibility };
  const setPub = (p: Partial<NonNullable<FormT["publication"]>>) => patch({ publication: { ...pub, ...p } });
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Status</label>
        <div className="grid grid-cols-3 gap-2">
          {(["draft", "published", "archived"] as ProjectStatus[]).map((s) => (
            <button key={s} type="button" onClick={() => setPub({ status: s })} className={`px-3 py-2.5 rounded-lg border text-xs uppercase tracking-widest transition-all ${pub.status === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-foreground"}`}>
              {s === "draft" ? "Rascunho" : s === "published" ? "Publicado" : "Arquivado"}
            </button>
          ))}
        </div>
      </div>
      <Field label="Agendar publicação" type="datetime-local" value={pub.scheduledFor ?? ""} onChange={(v) => setPub({ scheduledFor: v })} />
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Visibilidade</label>
        <div className="grid grid-cols-2 gap-2">
          {(["public", "private"] as ProjectVisibility[]).map((v) => (
            <button key={v} type="button" onClick={() => setPub({ visibility: v })} className={`px-3 py-2.5 rounded-lg border text-xs uppercase tracking-widest transition-all ${pub.visibility === v ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-foreground"}`}>
              {v === "public" ? "Público" : "Privado"}
            </button>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={pub.featured ?? false} onChange={(e) => setPub({ featured: e.target.checked })} className="size-4 accent-primary" />
        <span className="text-sm">Destaque na home</span>
      </label>
    </div>
  );
}

/* ---------- BASE FIELDS ---------- */
function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 [&:has(>*:nth-child(2):last-child)]:lg:grid-cols-2">{children}</div>;
}

function Field({ label, value, onChange, required, placeholder, type = "text", prefix }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; type?: string; prefix?: string }) {
  return (
    <div className="min-w-0">
      <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">{label}</label>
      <div className="flex items-stretch rounded-lg border border-border bg-background overflow-hidden focus-within:border-primary transition-colors">
        {prefix && <span className="px-2.5 flex items-center text-xs text-muted-foreground bg-muted/40 border-r border-border">{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="flex-1 min-w-0 px-3 py-2.5 text-sm bg-transparent outline-none"
        />
      </div>
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3, required }: { label: string; value: string; onChange: (v: string) => void; rows?: number; required?: boolean }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        required={required}
        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-primary outline-none resize-none"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-primary outline-none">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ImageDrop({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const handleFile = (f: File) => {
    const r = new FileReader();
    r.onload = () => onChange(r.result as string);
    r.readAsDataURL(f);
  };
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">{label}</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
        onClick={() => ref.current?.click()}
        className={`relative aspect-video rounded-lg border-2 border-dashed cursor-pointer transition-all overflow-hidden ${drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
      >
        {value ? (
          <>
            <img src={value} className="absolute inset-0 w-full h-full object-cover" />
            <button type="button" onClick={(e) => { e.stopPropagation(); onChange(""); }} className="absolute top-2 right-2 size-7 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:text-destructive">
              <X className="size-3.5" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted-foreground">
            <UploadCloud className="size-6" />
            <span className="text-[10px] uppercase tracking-widest">Drop ou clique</span>
          </div>
        )}
        <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>
    </div>
  );
}
