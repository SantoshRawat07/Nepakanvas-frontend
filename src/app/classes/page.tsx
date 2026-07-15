"use client";

import { SiteShell } from "@/components/layout/SiteShell";
import { Section, SectionHeader } from "@/components/ui-custom/Section";
import { Reveal } from "@/components/ui-custom/Reveal";
import { CTALink } from "@/components/ui-custom/CTAButton";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import {StudentGalleryRail} from "@/components/ui-custom/Studentgallery";

const COURSES = [
  { level: "Kids", title: "Kids Art Adventure", age: "Ages 5–12", duration: "8 weeks", price: "Rs 6,000", instructor: "Mira T.", topics: ["Drawing basics", "Colour play", "Creative thinking"] },
  { level: "Beginner", title: "Foundations", age: "Teens & Adults", duration: "10 weeks", price: "Rs 9,500", instructor: "Sushant K.", topics: ["Drawing", "Sketching", "Painting", "Color theory"] },
  { level: "Intermediate", title: "Portrait & Watercolour", age: "Teens & Adults", duration: "12 weeks", price: "Rs 14,000", instructor: "Ayan R.", topics: ["Portrait", "Perspective", "Watercolour", "Acrylic"] },
  { level: "Advanced", title: "Professional Canvas", age: "Adults", duration: "16 weeks", price: "Rs 22,000", instructor: "Sushant K.", topics: ["Oil painting", "Realism", "Abstract", "Landscape"] },
];

const FAQ = [
  { q: "Do I need any experience?", a: "No — our Foundations and Kids tracks start from absolute zero." },
  { q: "Are materials included?", a: "Yes. Canvas, brushes, paints and reference photos are provided." },
  { q: "Online or in-studio?", a: "All classes are in-studio in Kathmandu. Online cohorts opening soon." },
  { q: "Do you give a certificate?", a: "Yes — all levels include a NepaKanvas certificate of completion." },
];


export default function Classes() {
  return (
    <SiteShell>
      <Section tone="surface" className="pt-32 md:pt-44" size="sm">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-6">Learn the craft</p>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1] tracking-tight max-w-4xl">Learn art from professional artists.</h1>
          <p className="mt-6 max-w-xl text-muted-foreground font-light text-lg">
            Small cohorts. Honest feedback. Real canvases at the end of every term.
          </p>
        </Reveal>
      </Section>

      <Section>
        <SectionHeader eyebrow="Tracks" title="Four levels, one studio." />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.05 }}
          className="grid sm:grid-cols-2 gap-6">
          {COURSES.map((c) => (
            <motion.article key={c.title} variants={fadeUp}
              className="rounded-3xl border border-border bg-background p-8 md:p-10 hover:shadow-soft transition-shadow">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{c.level}</p>
              <h3 className="mt-3 text-2xl md:text-3xl font-bold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.age} · {c.duration}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {c.topics.map((t) => (
                  <li key={t} className="px-3 py-1.5 rounded-full text-xs bg-secondary">{t}</li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-border flex items-end justify-between gap-4">
                <div>
                  <p className="text-2xl font-bold">{c.price}</p>
                  <p className="text-xs text-muted-foreground mt-1">Instructor: {c.instructor}</p>
                </div>
                <CTALink href="/contact" withArrow className="hover:bg-primary">Enroll</CTALink>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Section>

      <Section tone="surface">
  <SectionHeader eyebrow="Student work" title="From first stroke to finished piece." />
  <StudentGalleryRail/>
</Section>

      <Section>
        <SectionHeader eyebrow="Questions" title="Frequently asked." />
        <div className="max-w-3xl mx-auto divide-y divide-border border-y border-border">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="flex justify-between items-center cursor-pointer list-none">
                <span className="text-lg font-semibold">{f.q}</span>
                <span className="text-2xl font-light transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-muted-foreground font-light">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </SiteShell>
  );
}
