import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const can = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!can) return;
    setEnabled(true);
    document.body.classList.add("has-custom-cursor");

    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${mx - 4}px, ${my - 4}px, 0)`;
      }
      const target = e.target as HTMLElement | null;
      const interactive = !!target?.closest('a, button, [data-cursor="hover"], input, textarea, select, label');
      setHover(interactive);
    };

    let raf = 0;
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[10000] size-2 rounded-full bg-primary mix-blend-difference"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ring}
        aria-hidden
        className={`pointer-events-none fixed top-0 left-0 z-[10000] size-9 rounded-full border border-primary transition-[width,height,border-color,opacity] duration-200 ${
          hover ? "scale-150 bg-primary/10" : ""
        }`}
        style={{ willChange: "transform" }}
      />
    </>
  );
}
