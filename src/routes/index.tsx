import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Brush, Sparkles, Truck, ShieldCheck, Users, Award, Star } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Section, SectionHeader } from "@/components/ui-custom/Section";
import { Reveal } from "@/components/ui-custom/Reveal";
import { ArtCard } from "@/components/ui-custom/ArtCard";
import { CTALink } from "@/components/ui-custom/CTAButton";
import { ASSETS } from "@/lib/assets";
import { ARTWORKS } from "@/lib/artworks";
import { fadeUp, stagger } from "@/lib/motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NepaKanvas — Where Ideas Become Art" },
      { name: "description", content: "Premium handmade canvas paintings, portraits, wall art and live wedding painting — crafted in Nepal." },
      { property: "og:title", content: "NepaKanvas — Where Ideas Become Art" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteShell>
      <Hero />
      <Categories />
      <Featured />
      <WhyUs />
      <ServicesPreview />
      <Testimonials />
      <CallToAction />
    </SiteShell>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <section ref={ref} className="relative min-h-dvh flex items-end overflow-hidden bg-secondary pt-24 pb-16 md:pb-24">
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img src={ASSETS.artistHolding} alt="" className="h-full w-full object-cover opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/60" />
      </motion.div>

      <div className="relative mx-auto max-w-7xl container-px w-full">
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xs uppercase tracking-[0.4em] text-foreground/70 mb-6"
        >
          Handcrafted in Nepal — Est. 2021
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-bold leading-[0.95] tracking-[-0.04em] max-w-5xl"
        >
          Every Wall<br />Deserves Art.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.8 }}
          className="mt-8 max-w-xl text-base md:text-lg text-foreground/70 font-light"
        >
          A studio dedicated to turning your favourite moments and ideas into timeless canvas, portrait and wall art — painted by hand.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.8 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <CTALink to="/gallery" variant="primary" size="lg" withArrow>Explore Collection</CTALink>
          <CTALink to="/services" variant="outline" size="lg">Custom Order</CTALink>
        </motion.div>
      </div>
    </section>
  );
}

const CATS = [
  { name: "Canvas Painting", count: "48 works" },
  { name: "Wall Art", count: "32 works" },
  { name: "Portraits", count: "120 works" },
  { name: "Nature", count: "26 works" },
  { name: "Modern", count: "18 works" },
  { name: "Abstract", count: "21 works" },
];

function Categories() {
  return (
    <Section tone="default" size="sm">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Browse by category</p>
            <h2 className="text-2xl md:text-4xl font-bold">A studio, organised.</h2>
          </div>
          <CTALink to="/gallery" variant="ghost" withArrow>View all</CTALink>
        </div>
      </Reveal>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {CATS.map((c) => (
          <motion.button key={c.name} variants={fadeUp}
            className="text-left rounded-2xl border border-border bg-background p-5 hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300 group">
            <p className="font-semibold text-sm md:text-base">{c.name}</p>
            <p className="mt-1 text-xs text-muted-foreground group-hover:text-background/60">{c.count}</p>
          </motion.button>
        ))}
      </motion.div>
    </Section>
  );
}

function Featured() {
  return (
    <Section tone="surface">
      <SectionHeader
        eyebrow="Featured collection"
        title="Pieces from the studio."
        description="A small selection of recent commissions and originals — each one painted by hand on cotton canvas."
      />
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {ARTWORKS.slice(0, 6).map((a) => (
          <motion.div key={a.id} variants={fadeUp}>
            <ArtCard image={a.image} title={a.title} category={a.category} price={a.price} />
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

const WHY = [
  { icon: Brush, title: "Handmade", desc: "Every stroke is painted by hand — no prints, no shortcuts." },
  { icon: Sparkles, title: "Premium Materials", desc: "Cotton canvas, archival acrylics, hardwood easels." },
  { icon: Users, title: "Custom Orders", desc: "Send any photo or idea and we'll craft it for you." },
  { icon: Truck, title: "Nationwide Delivery", desc: "Carefully packed, shipped across Nepal." },
  { icon: ShieldCheck, title: "Secure Payments", desc: "eSewa, Khalti, bank transfer — all supported." },
  { icon: Award, title: "Professional Artists", desc: "A small team with years of portrait experience." },
];

function WhyUs() {
  return (
    <Section>
      <SectionHeader eyebrow="Why NepaKanvas" title="Built around the craft." />
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {WHY.map((w) => (
          <motion.div key={w.title} variants={fadeUp}
            className="rounded-3xl border border-border bg-background p-8 hover:shadow-soft transition-shadow duration-500">
            <w.icon className="h-7 w-7" strokeWidth={1.25} />
            <h3 className="mt-6 text-xl font-semibold">{w.title}</h3>
            <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed">{w.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

const SERVICES = [
  { title: "Canvas Art", desc: "Mini and large format originals, ready to hang.", image: ASSETS.portraitGirl },
  { title: "Wall Painting", desc: "Residential, commercial, hotels & restaurants.", image: ASSETS.fourFace },
  { title: "Wedding Live Painting", desc: "Live ceremony, engagement, anniversary memories.", image: ASSETS.artistHolding },
  { title: "Custom Orders", desc: "Send a photo — we'll turn it into a painting.", image: ASSETS.portraitBalen },
];

function ServicesPreview() {
  return (
    <Section tone="surface">
      <SectionHeader eyebrow="What we do" title="Services, with care." description="Originals, commissions, live event painting and classes — all under one studio." />
      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        {SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.05}>
            <article className="group relative rounded-3xl overflow-hidden bg-background border border-border">
              <div className="aspect-[16/10] overflow-hidden bg-secondary">
                <img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-7 md:p-8">
                <h3 className="text-2xl font-bold">{s.title}</h3>
                <p className="mt-3 text-muted-foreground font-light">{s.desc}</p>
                <CTALink to="/services" variant="ghost" className="mt-5 -ml-3" withArrow>Learn more</CTALink>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

const REVIEWS = [
  { name: "Anjali Shrestha", role: "Kathmandu", text: "The portrait of my grandmother brought my whole family to tears. Beautiful, beautiful work.", rating: 5 },
  { name: "Rohan Maharjan", role: "Lalitpur", text: "Booked live painting for our wedding — guests couldn't stop watching. A keepsake forever.", rating: 5 },
  { name: "Priya Gurung", role: "Pokhara", text: "Tiny canvas, huge personality. The packaging alone felt premium. Already ordered three more.", rating: 5 },
];

function Testimonials() {
  return (
    <Section>
      <SectionHeader eyebrow="Words from clients" title="Loved across Nepal." />
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
        className="grid md:grid-cols-3 gap-6">
        {REVIEWS.map((r) => (
          <motion.figure key={r.name} variants={fadeUp}
            className="rounded-3xl border border-border bg-background p-8 flex flex-col">
            <div className="flex gap-0.5">
              {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-foreground" strokeWidth={0} />)}
            </div>
            <blockquote className="mt-5 text-lg leading-relaxed font-light">"{r.text}"</blockquote>
            <figcaption className="mt-6 pt-6 border-t border-border">
              <p className="font-semibold text-sm">{r.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{r.role}</p>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </Section>
  );
}

function CallToAction() {
  return (
    <Section tone="dark" size="lg">
      <Reveal>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-7xl font-bold leading-[1]">Ready to transform your space?</h2>
          <p className="mt-6 text-background/60 text-lg font-light max-w-xl mx-auto">
            From a single mini canvas to a full wall — let's make something you'll keep forever.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <CTALink to="/services" size="lg" withArrow className="bg-background text-foreground border-background hover:bg-transparent hover:text-background">Order Your Artwork</CTALink>
            <CTALink to="/contact" size="lg" variant="ghost" className="text-background hover:bg-background/10">Talk to us</CTALink>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
