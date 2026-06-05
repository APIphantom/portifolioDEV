import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { UploadCloud, Search, Trash2, Copy, X } from "lucide-react";
import { useMedia } from "@/lib/projects-store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/midias")({
  component: MidiasPage,
});

function MidiasPage() {
  const { items, add, remove } = useMedia();
  const [q, setQ] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((f) => {
      const r = new FileReader();
      r.onload = () => add({ name: f.name, url: r.result as string, type: f.type, size: f.size });
      r.readAsDataURL(f);
    });
  };

  const filtered = items.filter((m) => m.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">// Mídias</div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Biblioteca de mídias</h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} arquivos · armazenamento local</p>
        </div>
        <button onClick={() => ref.current?.click()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:glow-neon transition-shadow">
          <UploadCloud className="size-4" /> Upload
        </button>
        <input ref={ref} type="file" multiple accept="image/*,video/*" hidden onChange={(e) => e.target.files && handleFiles(e.target.files)} />
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar mídia..." className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-card/40 border border-border text-sm focus:border-primary outline-none" />
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
      >
        {filtered.map((m) => (
          <div key={m.id} className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-card/30">
            {m.type.startsWith("image") ? (
              <img src={m.url} className="w-full h-full object-cover" onClick={() => setPreview(m.url)} />
            ) : (
              <video src={m.url} className="w-full h-full object-cover" muted />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
              <div className="text-[10px] font-bold truncate">{m.name}</div>
              <div className="text-[9px] text-muted-foreground">{(m.size / 1024).toFixed(1)} KB</div>
              <div className="flex gap-1 mt-1">
                <button onClick={() => { navigator.clipboard.writeText(m.url); toast.success("URL copiada"); }} className="size-6 rounded bg-background/80 flex items-center justify-center hover:text-primary"><Copy className="size-3" /></button>
                <button onClick={() => remove(m.id)} className="size-6 rounded bg-background/80 flex items-center justify-center hover:text-destructive"><Trash2 className="size-3" /></button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 border border-dashed border-border rounded-2xl text-sm text-muted-foreground">
            Arraste arquivos aqui ou clique em Upload.
          </div>
        )}
      </div>

      {preview && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-background/90 backdrop-blur-xl" onClick={() => setPreview(null)}>
          <img src={preview} className="max-w-full max-h-full rounded-xl border border-border" />
          <button className="absolute top-4 right-4 size-10 rounded-full border border-border flex items-center justify-center"><X /></button>
        </div>
      )}
    </div>
  );
}
