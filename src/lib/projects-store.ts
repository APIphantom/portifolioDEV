import { useEffect, useState, useCallback } from "react";

export type Project = {
  id: string;
  title: string;
  description: string;
  image: string; // data url or url
  tech: string[];
  github?: string;
  demo?: string;
};

const KEY = "stvx.projects.v1";

const defaults: Project[] = [
  {
    id: "p1",
    title: "NEON/COMMERCE",
    description: "Storefront experimental para uma marca de streetwear, com checkout fluido e microinterações cinematográficas.",
    image: "",
    tech: ["React", "Tailwind", "Framer Motion"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    id: "p2",
    title: "GRID/SOUND",
    description: "Player de música minimalista com visualização em grid e modo dark premium.",
    image: "",
    tech: ["React", "TypeScript", "Web Audio"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    id: "p3",
    title: "ASPHALT/OS",
    description: "Dashboard techwear para monitoramento de frota urbana em tempo real.",
    image: "",
    tech: ["Next.js", "Tailwind", "D3"],
    github: "https://github.com",
    demo: "https://example.com",
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

  const addProject = useCallback((p: Omit<Project, "id">) => {
    setProjects((prev) => [{ ...p, id: crypto.randomUUID() }, ...prev]);
  }, []);
  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);
  const removeProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { projects, addProject, updateProject, removeProject };
}
