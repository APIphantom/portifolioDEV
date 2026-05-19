import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Manifesto } from "@/components/Manifesto";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { AdminPanel } from "@/components/AdminPanel";
import { useProjects } from "@/lib/projects-store";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { projects, addProject, updateProject, removeProject } = useProjects();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Manifesto />
        <Projects projects={projects} />
        <Contact />
      </main>
      <Footer />
      <AdminPanel
        projects={projects}
        onAdd={addProject}
        onUpdate={updateProject}
        onRemove={removeProject}
      />
    </div>
  );
}
