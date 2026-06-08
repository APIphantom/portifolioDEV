import { useCallback, useEffect, useState } from "react";
import {
  Sparkles,
  GraduationCap,
  Rocket,
  Atom,
  FileCode2,
  Triangle,
  Layers,
  Target,
  Code2,
  Cpu,
  Globe,
  Trophy,
  Zap,
  Star,
  type LucideIcon,
} from "lucide-react";

export interface StorylineItem {
  id: string;
  year: string;
  title: string;
  subtitle?: string;
  description: string;
  icon: string;
  badge?: string;
  order: number;
  active: boolean;
}

export const STORYLINE_ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  graduation: GraduationCap,
  rocket: Rocket,
  atom: Atom,
  filecode: FileCode2,
  triangle: Triangle,
  layers: Layers,
  target: Target,
  code: Code2,
  cpu: Cpu,
  globe: Globe,
  trophy: Trophy,
  zap: Zap,
  star: Star,
};

export const STORYLINE_ICON_KEYS = Object.keys(STORYLINE_ICONS);

const KEY = "stvx.storyline.v1";

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

const DEFAULTS: StorylineItem[] = [
  { id: "s1", year: "2019", title: "Início", subtitle: "Primeira linha de código", description: "Curiosidade virou obsessão. HTML e CSS abriram a porta de um universo novo.", icon: "sparkles", badge: "Origin", order: 1, active: true },
  { id: "s2", year: "2020", title: "Faculdade", subtitle: "Fundamentos sólidos", description: "Análise e Desenvolvimento de Sistemas. Lógica, algoritmos e a base que sustenta tudo.", icon: "graduation", badge: "Education", order: 2, active: true },
  { id: "s3", year: "2021", title: "Primeiros Projetos", subtitle: "Mãos no código", description: "Landing pages, sites institucionais e o primeiro contato com clientes reais.", icon: "rocket", badge: "Build", order: 3, active: true },
  { id: "s4", year: "2022", title: "React", subtitle: "Componentização", description: "Pensar em componentes mudou minha forma de construir interfaces para sempre.", icon: "atom", badge: "Frontend", order: 4, active: true },
  { id: "s5", year: "2023", title: "TypeScript", subtitle: "Código robusto", description: "Tipagem forte, refactors seguros e produtividade em escala.", icon: "filecode", badge: "DX", order: 5, active: true },
  { id: "s6", year: "2024", title: "Next.js", subtitle: "Full-stack mindset", description: "SSR, edge functions e performance como prioridade desde o primeiro commit.", icon: "triangle", badge: "Framework", order: 6, active: true },
  { id: "s7", year: "2025", title: "Portfólio Atual", subtitle: "Identidade própria", description: "STVX/DEV — código com estética, performance e voz autoral.", icon: "layers", badge: "Now", order: 7, active: true },
  { id: "s8", year: "2026+", title: "Próximo Nível", subtitle: "Sem teto", description: "WebGL, IA aplicada ao front-end e produtos com identidade cinematográfica.", icon: "target", badge: "Next", order: 8, active: true },
];

function load(): StorylineItem[] {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as StorylineItem[];
  } catch {}
  return DEFAULTS;
}

export function useStoryline() {
  const [items, setItems] = useState<StorylineItem[]>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(load());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, loaded]);

  const add = useCallback((patch: Partial<StorylineItem>) => {
    setItems((prev) => {
      const nextOrder = prev.length ? Math.max(...prev.map((i) => i.order)) + 1 : 1;
      const item: StorylineItem = {
        id: uid(),
        year: patch.year ?? new Date().getFullYear().toString(),
        title: patch.title ?? "Novo marco",
        subtitle: patch.subtitle ?? "",
        description: patch.description ?? "",
        icon: patch.icon ?? "sparkles",
        badge: patch.badge ?? "",
        order: patch.order ?? nextOrder,
        active: patch.active ?? true,
      };
      return [...prev, item];
    });
  }, []);

  const update = useCallback((id: string, patch: Partial<StorylineItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const move = useCallback((id: string, direction: -1 | 1) => {
    setItems((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((i) => i.id === id);
      const targetIdx = idx + direction;
      if (idx < 0 || targetIdx < 0 || targetIdx >= sorted.length) return prev;
      const a = sorted[idx];
      const b = sorted[targetIdx];
      return prev.map((i) => {
        if (i.id === a.id) return { ...i, order: b.order };
        if (i.id === b.id) return { ...i, order: a.order };
        return i;
      });
    });
  }, []);

  const reset = useCallback(() => setItems(DEFAULTS), []);

  return { items, loaded, add, update, remove, move, reset };
}

export function readStoryline(): StorylineItem[] {
  return load();
}
