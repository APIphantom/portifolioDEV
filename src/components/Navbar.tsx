import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#sobre", label: "Sobre" },
  { href: "#skills", label: "Skills" },
  { href: "#projetos", label: "Projetos" },
  { href: "#contato", label: "Contato" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "backdrop-blur-xl bg-background/60 border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2 group">
            <span className="inline-block w-2.5 h-2.5 bg-primary rounded-sm group-hover:rotate-45 transition-transform" />
            <span className="font-black tracking-[-0.05em] text-lg">STVX<span className="text-primary">/</span>DEV</span>
          </a>
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-4 py-2 text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {l.label}
                <span className="absolute left-4 right-4 -bottom-0.5 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
            ))}
          </nav>
          <a
            href="#contato"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest font-bold bg-primary text-primary-foreground rounded-full hover:glow-neon transition-shadow"
          >
            Let's Talk
          </a>
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 rounded-md border border-border"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setOpen(false)} />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-card border-l border-border p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <span className="font-black tracking-tight">STVX<span className="text-primary">/</span>DEV</span>
                <button onClick={() => setOpen(false)} className="p-2"><X className="size-5" /></button>
              </div>
              <nav className="flex flex-col gap-2">
                {links.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ x: 30, opacity: 1 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 * i }}
                    className="text-4xl font-black tracking-tighter py-3 border-b border-border hover:text-primary transition-colors"
                  >
                    {l.label.toUpperCase()}
                  </motion.a>
                ))}
              </nav>
              <a
                href="#contato"
                onClick={() => setOpen(false)}
                className="mt-auto inline-flex justify-center items-center px-6 py-4 bg-primary text-primary-foreground rounded-full font-bold uppercase tracking-widest text-sm"
              >
                Let's Talk
              </a>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
