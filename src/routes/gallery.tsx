import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Section } from "@/components/ui-custom/Section";
import { Reveal } from "@/components/ui-custom/Reveal";
import { ArtCard } from "@/components/ui-custom/ArtCard";
import { CATEGORIES } from "@/lib/artworks";
import { useArtworks } from "@/lib/content";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Our Arts — NepaKanvas Gallery" },
      { name: "description", content: "Browse the NepaKanvas gallery: canvas, portraits, landscapes, abstract and wall paintings." },
      { property: "og:title", content: "Our Arts — NepaKanvas Gallery" },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

function Gallery() {
  const artworks = useArtworks();
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"newest" | "low" | "high">("newest");

  const filtered = useMemo(() => {
    let list = artworks.filter((a) => (cat === "All" ? true : a.category === cat));
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(s) || a.category.toLowerCase().includes(s));
    }
    if (sort === "low") list = [...list].sort((a, b) => num(a.price) - num(b.price));
    if (sort === "high") list = [...list].sort((a, b) => num(b.price) - num(a.price));
    return list;
  }, [cat, q, sort, artworks]);


  return (
    <SiteShell>
      <Section tone="surface" className="pt-32 md:pt-44" size="sm">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-6">The gallery</p>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1] tracking-tight max-w-3xl">A room of paintings.</h1>
          <p className="mt-6 max-w-xl text-muted-foreground font-light text-lg">
            Browse originals and recent commissions. Filter by what you love.
          </p>
        </Reveal>
      </Section>

      <Section size="sm" tone="default">
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5}/>
              <input
                value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Search portraits, themes…"
                className="w-full rounded-full border border-border bg-background pl-12 pr-5 py-3.5 text-sm focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value as any)}
              className="rounded-full border border-border bg-background px-5 py-3.5 text-sm focus:outline-none focus:border-foreground">
              <option value="newest">Newest</option>
              <option value="low">Price — Low to High</option>
              <option value="high">Price — High to Low</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-300",
                  cat === c ? "bg-foreground text-background border-foreground" : "bg-background border-border hover:border-foreground"
                )}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-2xl font-semibold">Nothing matches yet.</p>
            <p className="mt-2 text-muted-foreground">Try a different category or search term.</p>
          </div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {filtered.map((a) => (
              <motion.div key={a.id} variants={fadeUp}>
                <ArtCard id={a.id} image={a.image} title={a.title} category={a.category} price={a.price} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </Section>
    </SiteShell>
  );
}

function num(p: string) {
  return parseInt(p.replace(/[^\d]/g, ""), 10) || 0;
}
