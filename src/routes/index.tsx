import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Manifesto } from "@/components/Manifesto";
import { Projects } from "@/components/Projects";
import { Vision } from "@/components/Vision";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Link } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { useProjects } from "@/lib/projects-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "STVX // Front-End Developer Portfolio — Streetwear Code" },
      { name: "description", content: "Portfolio premium de Front-End Developer Jr. — React, TypeScript, Tailwind, Framer Motion. Identidade streetwear, performance e estética cinematográfica." },
      { property: "og:title", content: "STVX // Front-End Developer" },
      { property: "og:description", content: "Construindo experiências digitais com identidade, performance e estética moderna." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: "STVX",
        jobTitle: "Front-End Developer",
        url: "/",
        sameAs: ["https://github.com", "https://linkedin.com"],
      }),
    }],
  }),
  component: Index,
});

function Index() {
  const { projects } = useProjects();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Manifesto />
        <Projects projects={projects} />
        <Vision />
        <Contact />
      </main>
      <Footer />
      <Link
        to="/admin"
        data-cursor="hover"
        aria-label="Abrir CMS"
        className="fixed bottom-6 right-6 z-40 size-14 rounded-full bg-primary text-primary-foreground glow-neon flex items-center justify-center hover:scale-105 transition-transform"
      >
        <Settings className="size-6 animate-[spin_8s_linear_infinite]" />
      </Link>
    </div>
  );
}
