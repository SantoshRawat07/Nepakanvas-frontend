import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ASSETS } from "@/lib/assets";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Our Arts" },
  { to: "/services", label: "Services" },
  { to: "/classes", label: "Art Classes" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-background/85 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl container-px h-16 md:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={ASSETS.logo} alt="NepaKanvas" className="h-9 w-9 rounded-full object-cover" />
            <span className="font-bold tracking-tight text-base md:text-lg">NepaKanvas</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-sm font-medium text-foreground/75 hover:text-foreground transition-colors"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button aria-label="Wishlist" className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary transition-colors">
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>
            <button aria-label="Cart" className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary transition-colors">
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>
            <button aria-label="Account" className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary transition-colors">
              <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>
            <button
              aria-label="Menu"
              onClick={() => setOpen(true)}
              className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-full hover:bg-secondary"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background"
          >
            <div className="container-px mx-auto max-w-7xl h-16 md:h-20 flex items-center justify-between">
              <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
                <img src={ASSETS.logo} alt="NepaKanvas" className="h-9 w-9 rounded-full object-cover" />
                <span className="font-bold tracking-tight">NepaKanvas</span>
              </Link>
              <button aria-label="Close" onClick={() => setOpen(false)} className="h-10 w-10 inline-flex items-center justify-center rounded-full hover:bg-secondary">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="container-px mx-auto max-w-7xl flex flex-col gap-2 mt-10">
              {NAV.map((n, i) => (
                <motion.div
                  key={n.to}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                >
                  <Link
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className="block py-4 text-4xl font-bold tracking-tight border-b border-border"
                  >
                    {n.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
