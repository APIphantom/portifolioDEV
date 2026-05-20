import { useEffect, useState, useCallback } from "react";

export type ProjectCategory = "web" | "ui" | "ecommerce" | "experiment" | "mobile";

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  gallery?: string[];
  tech: string[];
  category: ProjectCategory;
  github?: string;
  demo?: string;
  objective?: string;
  problem?: string;
  solution?: string;
  process?: string;
  result?: string;
};

const KEY = "stvx.projects.v2";

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
  },
  {
    id: "p2",
    slug: "grid-sound",
    title: "GRID/SOUND",
    description: "Player de música minimalista com visualização em grid e modo dark premium.",
    longDescription: "Reprodutor experimental com visualizador em tempo real usando Web Audio API.",
    image: "",
    tech: ["React", "TypeScript", "Web Audio API"],
    category: "experiment",
    github: "https://github.com",
    demo: "https://example.com",
    objective: "Reinventar o player de música como peça de design.",
    problem: "Players atuais priorizam função e abandonam estética.",
    solution: "Grid responsivo, tipografia gigante e visualizador de frequência.",
    process: "Estudo de marcas como Teenage Engineering, prototipagem em Figma, dev em TS.",
    result: "Projeto destacado em comunidades de design e dev no Brasil.",
  },
  {
    id: "p3",
    slug: "asphalt-os",
    title: "ASPHALT/OS",
    description: "Dashboard techwear para monitoramento de frota urbana em tempo real.",
    longDescription: "Sistema interno com mapas, gráficos e alertas em tempo real para gestão de frotas.",
    image: "",
    tech: ["Next.js", "Tailwind", "D3", "Supabase"],
    category: "web",
    github: "https://github.com",
    demo: "https://example.com",
    objective: "Unificar dados de frota em uma interface densa porém legível.",
    problem: "Operadores usavam 4 planilhas e 2 sistemas legados para uma única decisão.",
    solution: "Dashboard único com filtros rápidos, gráficos em D3 e tema techwear.",
    process: "Discovery com operadores, design system, MVP em 6 semanas.",
    result: "Tempo médio de resposta reduzido em 41%.",
  },
];

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(defaults);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setProjects(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(projects));
  }, [projects, loaded]);

  const addProject = useCallback((p: Omit<Project, "id" | "slug"> & { slug?: string }) => {
    const slug = p.slug || slugify(p.title) || crypto.randomUUID().slice(0, 8);
    setProjects((prev) => [{ ...p, id: crypto.randomUUID(), slug }, ...prev]);
  }, []);
  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);
  const removeProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { projects, addProject, updateProject, removeProject, loaded };
}

/** Read projects from localStorage (client-only). Useful in route components. */
export function readProjects(): Project[] {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaults;
}
