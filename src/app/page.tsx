"use client";

import { motion } from "framer-motion";
import { Brush, Sparkles, Truck, ShieldCheck, Users, Award, Star } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Section, SectionHeader } from "@/components/ui-custom/Section";
import { Reveal } from "@/components/ui-custom/Reveal";
import { ArtCard } from "@/components/ui-custom/ArtCard";
import { CTALink } from "@/components/ui-custom/CTAButton";
import { FloatingIcons } from "@/components/ui-custom/FloatingIcons";
import { fadeUp, stagger } from "@/lib/motion";
import { useArtworks, useHero} from "@/lib/content";
import { useTeamBackend, useTeamStatus } from "@/lib/teams";
import wallpainting from "@/assets/wallpainting.jpeg";
import portrait from "@/assets/portrait.webp";
import weeding from "@/assets/weeding.jpeg";
import pm from "@/assets/pm.webp"

export default function Home() {
  return (
    <SiteShell>
      <Hero />
      <Categories />
      <Featured />
      <WhyUs />
      <ServicesPreview />
      <TeamSection />
      <Testimonials />
      <CallToAction />
    </SiteShell>
  );
}
function Hero() {
  const hero = useHero();
  const lines = hero.title.split("\n");
  const lastIndex = lines.length - 1;

  return (
    <section className="relative min-h-[65dvh] lg:min-h-dvh flex items-center overflow-hidden bg-secondary pt-16 lg:pt-24 pb-0 lg:pb-6">
      <FloatingIcons />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_55%,rgba(0,0,0,0.06)_100%)]" />

      <div className="relative mx-auto max-w-7xl container-px w-full text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xs uppercase tracking-[0.4em] text-foreground/70 mb-3 lg:mb-8"
        >
          {hero.eyebrow}
        </motion.p>

        <h1 className="font-bold leading-[0.9] tracking-[-0.045em] text-6xl sm:text-8xl md:text-[10rem] lg:text-[12rem]">
          {lines.map((line, i) => {
            const isLast = i === lastIndex;
            if (!isLast) {
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="block"
                >
                  {line}
                </motion.span>
              );
            }

            const match = line.match(/^(.*\s)?(\S+)$/);
            const rest = match?.[1] ?? "";
            const lastWord = match?.[2] ?? line;

            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                {rest}
                <span className="relative inline-block">
                  {lastWord}
                  <HeadlineUnderline />
                </span>
              </motion.span>
            );
          })}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-10 lg:mt-10 max-w-xl mx-auto text-base md:text-lg text-foreground/70 font-light"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.8 }}
          className="mt-10 lg:mt-10 flex flex-wrap justify-center gap-3"
        >
          <CTALink href="/gallery" variant="primary" size="lg" withArrow className="hover:bg-primary">Explore Collection</CTALink>
          <CTALink href="/services" variant="outline" size="lg">Custom Order</CTALink>
        </motion.div>
      </div>
    </section>
  );
}
function HeadlineUnderline() {
  return (
    <motion.svg
      viewBox="0 0 340 40"
      preserveAspectRatio="none"
      className="absolute -left-[6%] -bottom-2 sm:-bottom-4 md:-bottom-7 lg:-bottom-10 w-[112%] h-3 sm:h-4 md:h-6 lg:h-9 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.3 }}
    >
      <motion.path
        d="M6 20 C 90 34, 250 34, 334 18"
        fill="none"
        stroke="#C2542F"
        strokeWidth="6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.5, duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      />
    </motion.svg>
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
          <CTALink href="/gallery" variant="ghost" withArrow>View all</CTALink>
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
  const artworks = useArtworks();
  const list = artworks.filter((a) => a.featured).slice(0, 6);
  return (
    <Section tone="surface">
      <SectionHeader
        eyebrow="Featured collection"
        title="Pieces from the studio."
        description="A small selection of recent commissions and originals — each one painted by hand on cotton canvas."
      />
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {list.map((a) => (
          <motion.div key={a.id} variants={fadeUp}>
            <ArtCard id={a.id} image={a.image} title={a.title} category={a.category} price={a.price} />
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
  { title: "Canvas Art", desc: "Mini and large format originals, ready to hang.", image: portrait.src },
  { title: "Wall Painting", desc: "Residential, commercial, hotels & restaurants.", image: wallpainting.src },
  { title: "Wedding Live Painting", desc: "Live ceremony, engagement, anniversary memories.", image: weeding.src },
  { title: "Custom Orders", desc: "Send a photo — we'll turn it into a painting.", image: pm.src },
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
                <CTALink href="/services" variant="ghost" className="mt-5 -ml-3" withArrow>Learn more</CTALink>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function TeamSection() {
  const team = useTeamBackend();
  const { loading, error } = useTeamStatus();

  if (!loading && !error && team.length === 0) return null;

  return (
    <Section>
      <SectionHeader eyebrow="Our team" title="The hands behind the work." />

      {loading && team.length === 0 && (
        <p className="text-muted-foreground font-light">Loading the team…</p>
      )}
      {error && (
        <p className="text-muted-foreground font-light">Couldn't load the team right now.</p>
      )}

      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {team.map((m) => (
          <motion.article key={m.id} variants={fadeUp} className="group">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-secondary">
              <img src={m.image} alt={m.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <h3 className="mt-4 text-xl font-bold">{m.name}</h3>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">{m.role}</p>
            <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed">{m.bio}</p>
          </motion.article>
        ))}
      </motion.div>
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
    <Section tone="surface">
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
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-background/50 mb-6">
            One canvas at a time
          </p>

          <h2 className="relative inline-block text-4xl md:text-7xl font-bold leading-[1] text-background">
            Ready to transform
            <br />
            your space?
            <BrushUnderline />
          </h2>

          <p className="mt-8 text-background/60 text-lg font-light max-w-xl mx-auto">
            From a single mini canvas to a full wall — let's make something you'll keep forever.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <CTALink
              href="/services"
              size="lg"
              withArrow
              className="bg-background text-foreground border-background hover:bg-transparent hover:text-background"
            >
              Order Your Artwork
            </CTALink>
            <CTALink
              href="/contact"
              size="lg"
              variant="ghost"
              className="border border-background/30 text-background hover:bg-background/10"
            >
              Talk to us
            </CTALink>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function BrushUnderline() {
  return (
    <motion.svg
      viewBox="0 0 320 24"
      className="absolute left-1/2 -bottom-3 md:-bottom-5 -translate-x-1/2 w-[85%] md:w-[70%] h-4 md:h-6 pointer-events-none"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M6 14 C 60 4, 120 20, 180 10 S 280 4, 314 12"
        fill="none"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
      />
    </motion.svg>
  );
}
