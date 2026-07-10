import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp, MessageCircle } from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CustomCursor } from "@/components/ui-custom/CustomCursor";

export function SiteShell({ children }: { children: ReactNode }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fn = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <CustomCursor />
      <motion.div style={{ scaleX }} className="fixed top-0 inset-x-0 h-[2px] bg-foreground z-[70] origin-left" />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />

      <a
        href="https://wa.me/9779800000000"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-foreground text-background flex items-center justify-center shadow-elevated hover:bg-[var(--hover)] transition-colors"
      >
        <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
      </a>
      {show && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-6 right-20 z-40 h-12 w-12 rounded-full bg-background text-foreground border border-border flex items-center justify-center shadow-soft hover:bg-secondary transition-colors animate-fade-in"
        >
          <ArrowUp className="h-5 w-5" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}
