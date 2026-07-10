import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isFine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(isFine);
    if (!isFine) return;

    let rx = 0, ry = 0, dx = 0, dy = 0;
    const onMove = (e: MouseEvent) => {
      dx = e.clientX; dy = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${dx - 3}px, ${dy - 3}px, 0)`;
      const t = e.target as HTMLElement | null;
      // determine if pointer is over interactive elements (links/buttons/etc.)
      setHover(!!t?.closest("a, button, [role=button], input, textarea, select, label"));
      // keep native cursor visible when over header or footer
      const overUi = !!t?.closest("header, footer");
      document.body.style.cursor = overUi ? "" : "none";
    };
    const loop = () => {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    let raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove);
    // start hidden; will be toggled on first move if over header/footer
    document.body.style.cursor = "none";
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.body.style.cursor = "";
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-9 w-9 rounded-full border border-foreground/60 transition-[width,height,border-color,background-color] duration-200"
        style={{
          mixBlendMode: "difference",
          borderColor: hover ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
          background: hover ? "rgba(255,255,255,0.15)" : "transparent",
          transform: "translate3d(-100px,-100px,0)",
        }}
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-white"
        style={{ mixBlendMode: "difference", transform: "translate3d(-100px,-100px,0)" }}
      />
    </>
  );
}
