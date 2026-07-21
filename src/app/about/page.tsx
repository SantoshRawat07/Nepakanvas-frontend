"use client";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Section, SectionHeader } from "@/components/ui-custom/Section";
import { Reveal } from "@/components/ui-custom/Reveal";
import { CTALink } from "@/components/ui-custom/CTAButton";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import { useTeamBackend, useTeamStatus } from "@/lib/teams";

const TIMELINE = [
  { year: "2021", title: "A studio is born", desc: "Founded in Kathmandu around a single love for portrait painting." },
  { year: "2022", title: "First 100 commissions", desc: "Word spread quickly. The mini canvas became our signature." },
  { year: "2023", title: "Live wedding painting", desc: "We started painting live at ceremonies across the valley." },
  { year: "2024", title: "Art classes", desc: "Opened our doors to children and adults learning the craft." },
  { year: "2026", title: "Nationwide", desc: "Shipping across Nepal — same care, every package." },
];

const VALUES = [
  { title: "Craft", desc: "Slow, careful, by hand. Always." },
  { title: "Honesty", desc: "Real paint on real canvas. No prints sold as originals." },
  { title: "Memory", desc: "We paint what people want to remember." },
];

export default function About() {
  const team = useTeamBackend();
  const { loading, error } = useTeamStatus();

  return (
    <SiteShell>
      <Section size="lg" tone="surface" className="pt-32 md:pt-44">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <Reveal className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-6">About the studio</p>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1] tracking-tight">Painted by hand.<br/>Made to remember.</h1>
          </Reveal>
          <Reveal className="md:col-span-5" delay={0.1}>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              NepaKanvas began as a single artist, a small table and one mini canvas. Five years on, we're a studio of painters obsessed with one thing — turning the people, places and moments you love into art you can hang.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section>
        <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-center">
          <Reveal>
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-secondary">
              <img src="/assets/family.webp" alt="Studio work" loading="lazy" className="h-full w-full object-cover"/>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Mission</p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">To make handmade art ordinary again.</h2>
            <p className="mt-6 text-muted-foreground font-light leading-relaxed">
              Phones gave us a thousand pictures and almost no objects. We make the objects. A small canvas of someone you love, on a shelf, lit warmly — that's the brief.
            </p>
            <p className="mt-10 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Vision</p>
            <h3 className="text-2xl md:text-3xl font-bold leading-tight">A painting in every Nepali home.</h3>
          </Reveal>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeader eyebrow="Timeline" title="The studio, year by year." />
        <div className="relative">
          <div className="absolute left-[7px] md:left-1/2 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-12 md:space-y-20">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year}>
                <div className={`relative grid md:grid-cols-2 gap-6 md:gap-16 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                  <div className={`md:text-right ${i % 2 ? "md:text-left" : ""}`}>
                    <p className="text-5xl md:text-6xl font-bold tracking-tight">{t.year}</p>
                  </div>
                  <div className="relative pl-8 md:pl-12">
                    <div className="absolute left-0 md:left-[-7px] top-2 h-3.5 w-3.5 rounded-full bg-foreground" />
                    <h3 className="text-xl md:text-2xl font-semibold">{t.title}</h3>
                    <p className="mt-3 text-muted-foreground font-light">{t.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

        <Section>
        <SectionHeader eyebrow="The team" title="Meet the artists." />

        {loading && team.length === 0 && (
          <p className="text-muted-foreground font-light">Loading the team…</p>
        )}
        {error && (
          <p className="text-muted-foreground font-light">Couldn't load the team right now.</p>
        )}
        {!loading && !error && team.length === 0 && (
          <p className="text-muted-foreground font-light">Team info coming soon.</p>
        )}

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {team.map((m) => (
            <motion.div key={m.id} variants={fadeUp} className="group">
              <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-secondary">
                <img
                  src={m.image}
                  alt={m.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-5">
                <p className="font-semibold text-lg">{m.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{m.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <Section tone="surface">
        <SectionHeader eyebrow="What we believe" title="Three values." />
        <div className="grid md:grid-cols-3 gap-6">
          {VALUES.map((v) => (
            <Reveal key={v.title}>
              <div className="rounded-3xl border border-border bg-background p-10 h-full">
                <p className="text-6xl font-bold tracking-tight">{v.title[0]}</p>
                <h3 className="mt-6 text-2xl font-semibold">{v.title}</h3>
                <p className="mt-3 text-muted-foreground font-light">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <Reveal>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <h2 className="text-4xl md:text-6xl font-bold leading-[1] max-w-2xl">Have a moment in mind? Let's paint it.</h2>
            <CTALink href="/contact" size="lg" withArrow className="bg-background text-foreground border-background hover:bg-transparent hover:text-background">Get in touch</CTALink>
          </div>
        </Reveal>
      </Section>
    </SiteShell>
  );
}
