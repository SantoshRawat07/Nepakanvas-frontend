"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, User, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartCount } from "@/lib/cart";
import { authActions, useCurrentUser } from "@/lib/auth";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Our Arts" },
  { href: "/services", label: "Services" },
  { href: "/classes", label: "Art Classes" },
  { href: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const count = useCartCount();
  const user = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();

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
          scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border" : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl container-px h-16 md:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/nepakanvaslogo.jpg" alt="NepaKanvas" className="h-9 w-9 rounded-full object-cover" />
            <span className="font-bold tracking-tight text-base md:text-lg">NepaKanvas</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href))
                    ? "text-foreground"
                    : "text-foreground/75 hover:text-foreground"
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link href="/cart" aria-label="Cart" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary transition-colors">
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            <div className="relative hidden md:block">
              <button
                aria-label="Account"
                onClick={() => setUserMenu((v) => !v)}
                className="inline-flex h-10 items-center gap-2 rounded-full px-3 hover:bg-secondary transition-colors"
              >
                <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
                {user && <span className="text-sm font-medium max-w-[80px] truncate">{user.userName.split(" ")[0]}</span>}
              </button>
              <AnimatePresence>
                {userMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-background shadow-elevated p-2"
                    onMouseLeave={() => setUserMenu(false)}
                  >
                    {user ? (
                      <>
                        <div className="px-3 py-2">
                          <p className="text-sm font-semibold truncate">{user.userName}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <div className="h-px bg-border my-1" />
                        {user.role === "admin" && (
                          <Link href="/admin" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary text-sm">
                            <LayoutDashboard className="h-4 w-4" strokeWidth={1.5} /> Admin dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => { authActions.logout(); setUserMenu(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary text-sm text-left"
                        >
                          <LogOut className="h-4 w-4" strokeWidth={1.5} /> Sign out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/auth/login" onClick={() => setUserMenu(false)} className="block px-3 py-2 rounded-xl hover:bg-secondary text-sm">Sign in</Link>
                        <Link href="/auth/signup" onClick={() => setUserMenu(false)} className="block px-3 py-2 rounded-xl hover:bg-secondary text-sm">Create account</Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              aria-label="Menu" onClick={() => setOpen(true)}
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background"
          >
            <div className="container-px mx-auto max-w-7xl h-16 md:h-20 flex items-center justify-between">
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
                <img src="/nepakanvaslogo.jpg" alt="NepaKanvas" className="h-9 w-9 rounded-full object-cover" />
                <span className="font-bold tracking-tight">NepaKanvas</span>
              </Link>
              <button aria-label="Close" onClick={() => setOpen(false)} className="h-10 w-10 inline-flex items-center justify-center rounded-full hover:bg-secondary">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="container-px mx-auto max-w-7xl flex flex-col gap-2 mt-10">
              {NAV.map((n, i) => (
                <motion.div key={n.href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i, duration: 0.4 }}>
                  <Link href={n.href} onClick={() => setOpen(false)} className="block py-4 text-4xl font-bold tracking-tight border-b border-border">
                    {n.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-6 flex flex-col gap-2">
                <Link href="/cart" onClick={() => setOpen(false)} className="py-3 text-lg font-medium">Cart ({count})</Link>
                {user ? (
                  <>
                    {user.role === "admin" && <Link href="/admin" onClick={() => setOpen(false)} className="py-3 text-lg font-medium">Admin</Link>}
                    <button onClick={() => { authActions.logout(); setOpen(false); }} className="py-3 text-lg font-medium text-left">Sign out</button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setOpen(false)} className="py-3 text-lg font-medium">Sign in</Link>
                    <Link href="/auth/signup" onClick={() => setOpen(false)} className="py-3 text-lg font-medium">Create account</Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
