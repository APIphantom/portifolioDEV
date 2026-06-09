import { useEffect, useState, useCallback } from "react";

export type ProjectCategory = "web" | "ui" | "ecommerce" | "experiment" | "mobile";
export type ProjectStatus = "published" | "draft" | "archived";
export type ProjectVisibility = "public" | "private";

export type ContentBlock = {
  id: string;
  kind: "objective" | "problem" | "solution" | "process" | "result" | "custom";
  title: string;
  description: string;
  icon?: string;
};

export type Metric = {
  id: string;
  title: string;
  value: string;
  prefix?: string;
  suffix?: string;
  description?: string;
};

export type SEO = {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  twitterImage?: string;
  robotsIndex?: boolean;
  structuredData?: string;
};

export type Publication = {
  status: ProjectStatus;
  publishedAt?: string;
  scheduledFor?: string;
  visibility: ProjectVisibility;
  featured?: boolean;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  heroImage?: string;
  heroVideo?: string;
  gallery?: string[];
  desktopMockup?: string;
  tabletMockup?: string;
  mobileMockup?: string;
  previewGif?: string;
  tech: string[];
  category: ProjectCategory;
  github?: string;
  demo?: string;
  // Legacy single-field case study
  objective?: string;
  problem?: string;
  solution?: string;
  process?: string;
  result?: string;
  // New rich blocks
  contentBlocks?: ContentBlock[];
  metrics?: Metric[];
  seo?: SEO;
  publication?: Publication;
  client?: string;
  year?: string;
  duration?: string;
  role?: string;
  displayOrder?: number;
  updatedAt?: string;
};

const KEY = "stvx.projects.v3";
const MEDIA_KEY = "stvx.media.v1";
const TECH_KEY = "stvx.tech.v1";
const SETTINGS_KEY = "stvx.settings.v1";

export const CATEGORIES: { value: ProjectCategory; label: string }[] = [
  { value: "web", label: "Web App" },
  { value: "ui", label: "UI/Design" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "experiment", label: "Experimento" },
  { value: "mobile", label: "Mobile" },
];

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function uid() {
  return (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);
}

const defaults: Project[] = [
  {
    id: "p1",
    slug: "neon-commerce",
    title: "NEON/COMMERCE",
    description: "Storefront experimental para uma marca de streetwear com checkout fluido.",
    longDescription: "Plataforma de e-commerce construída do zero com foco em performance, identidade visual e microinterações cinematográficas no checkout.",
    image: "",
    tech: ["React", "Tailwind", "Framer Motion", "Stripe"],
    category: "ecommerce",
    github: "https://github.com",
    demo: "https://example.com",
    objective: "Criar uma experiência de compra que transmita o DNA de uma marca premium.",
    problem: "Storefronts genéricos diluem a identidade e reduzem percepção de valor.",
    solution: "Layout editorial, transições com Framer Motion e checkout em 2 steps.",
    process: "Wireframe em Figma, design tokens, build em React + Vite, testes com usuários reais.",
    result: "Conversão +38%, tempo médio na página +52%, share orgânico em alta.",
    publication: { status: "published", visibility: "public", featured: true },
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p2",
    slug: "grid-sound",
    title: "GRID/SOUND",
    description: "Player de música minimalista com visualização em grid e modo dark premium.",
    image: "",
    tech: ["React", "TypeScript", "Web Audio API"],
    category: "experiment",
    publication: { status: "published", visibility: "public" },
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p3",
    slug: "asphalt-os",
    title: "ASPHALT/OS",
    description: "Dashboard techwear para monitoramento de frota urbana em tempo real.",
    image: "",
    tech: ["Next.js", "Tailwind", "D3", "Supabase"],
    category: "web",
    publication: { status: "draft", visibility: "private" },
    updatedAt: new Date().toISOString(),
  },
];

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(defaults);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProjects(load<Project[]>(KEY, defaults));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(projects));
  }, [projects, loaded]);

  const addProject = useCallback((p: Omit<Project, "id" | "slug"> & { slug?: string }) => {
    const slug = p.slug || slugify(p.title) || uid().slice(0, 8);
    setProjects((prev) => [{ ...p, id: uid(), slug, updatedAt: new Date().toISOString() }, ...prev]);
  }, []);
  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p)));
  }, []);
  const removeProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);
  const duplicateProject = useCallback((id: string) => {
    setProjects((prev) => {
      const orig = prev.find((p) => p.id === id);
      if (!orig) return prev;
      return [{ ...orig, id: uid(), slug: `${orig.slug}-copy`, title: `${orig.title} (cópia)`, updatedAt: new Date().toISOString() }, ...prev];
    });
  }, []);

  return { projects, addProject, updateProject, removeProject, duplicateProject, loaded };
}

export function readProjects(): Project[] {
  return load<Project[]>(KEY, defaults);
}

/* ============ MEDIA LIBRARY ============ */
export type MediaItem = {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  folder?: string;
  createdAt: string;
};

export function useMedia() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setItems(load<MediaItem[]>(MEDIA_KEY, [])); setLoaded(true); }, []);
  useEffect(() => { if (loaded) localStorage.setItem(MEDIA_KEY, JSON.stringify(items)); }, [items, loaded]);

  const add = useCallback((m: Omit<MediaItem, "id" | "createdAt">) => {
    setItems((p) => [{ ...m, id: uid(), createdAt: new Date().toISOString() }, ...p]);
  }, []);
  const remove = useCallback((id: string) => setItems((p) => p.filter((m) => m.id !== id)), []);
  return { items, add, remove };
}

/* ============ TECHNOLOGIES ============ */
export type Technology = {
  id: string;
  name: string;
  category: string;
  url?: string;
  color?: string;
  icon?: string;
};

const techDefaults: Technology[] = [
  { id: "t1", name: "React", category: "Frontend", color: "#61DAFB" },
  { id: "t2", name: "TypeScript", category: "Language", color: "#3178C6" },
  { id: "t3", name: "Tailwind CSS", category: "Styling", color: "#06B6D4" },
  { id: "t4", name: "Framer Motion", category: "Animation", color: "#FF008C" },
  { id: "t5", name: "Next.js", category: "Framework", color: "#FFFFFF" },
  { id: "t6", name: "Supabase", category: "Backend", color: "#3ECF8E" },
];

export function useTechnologies() {
  const [items, setItems] = useState<Technology[]>(techDefaults);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setItems(load<Technology[]>(TECH_KEY, techDefaults)); setLoaded(true); }, []);
  useEffect(() => { if (loaded) localStorage.setItem(TECH_KEY, JSON.stringify(items)); }, [items, loaded]);

  const add = useCallback((t: Omit<Technology, "id">) => setItems((p) => [{ ...t, id: uid() }, ...p]), []);
  const update = useCallback((id: string, patch: Partial<Technology>) => setItems((p) => p.map((t) => t.id === id ? { ...t, ...patch } : t)), []);
  const remove = useCallback((id: string) => setItems((p) => p.filter((t) => t.id !== id)), []);
  return { items, add, update, remove };
}

/* ============ SETTINGS ============ */
export type Settings = {
  name: string;
  role: string;
  bio: string;
  email: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  githubToken?: string;
  githubUsername?: string;
  theme?: string;
};

const settingsDefaults: Settings = {
  name: "Adriano Oliveira",
  role: "Desenvolvedor Front-End Júnior",
  bio: "Front-End Júnior apaixonado por React, Next.js e TypeScript. Transformo ideias em interfaces modernas, responsivas e acessíveis.",
  email: "contato@adrianodev.com",
  location: "Brasil",
  github: "",
  linkedin: "",
  twitter: "",
  instagram: "",
  githubUsername: "",
  githubToken: "",
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(settingsDefaults);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setSettings(load<Settings>(SETTINGS_KEY, settingsDefaults)); setLoaded(true); }, []);
  useEffect(() => { if (loaded) localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }, [settings, loaded]);
  const update = useCallback((patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })), []);
  return { settings, update };
}
