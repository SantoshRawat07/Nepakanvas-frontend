import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { Section, SectionHeader } from "@/components/ui-custom/Section";
import { Reveal } from "@/components/ui-custom/Reveal";
import { CTALink } from "@/components/ui-custom/CTAButton";
import { ASSETS } from "@/lib/assets";
import { Check } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — NepaKanvas" },
      { name: "description", content: "Canvas painting, wall painting, wedding live painting, custom orders and more." },
      { property: "og:title", content: "Services — NepaKanvas" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

const SERVICES = [
  {
    title: "Canvas Painting",
    image: ASSETS.portraitGirl,
    desc: "Mini and large originals, painted by hand on cotton canvas.",
    options: ["3″×3″ mini canvas", "6″×6″ medium", "Custom sizes on request"],
    price: "From Rs 600",
  },
  {
    title: "Wall Painting",
    image: ASSETS.fourFace,
    desc: "Murals and feature walls for homes and businesses.",
    options: ["Residential", "Commercial", "Hotels & Restaurants", "Schools & Offices"],
    price: "Quote on site",
  },
  {
    title: "Wedding Live Painting",
    image: ASSETS.artistHolding,
    desc: "We paint the ceremony as it happens — a keepsake unlike any photo.",
    options: ["Wedding ceremony", "Engagement", "Reception", "Anniversary"],
    price: "Packages from Rs 25,000",
  },
  {
    title: "Custom Orders",
    image: ASSETS.portraitBalen,
    desc: "Send any photo. We'll paint it. Single subject or group portraits.",
    options: ["Reference photo", "Choose size", "Approve preview", "Delivered to your door"],
    price: "From Rs 800",
  },
];

function Services() {
  return (
    <SiteShell>
      <Section tone="surface" className="pt-32 md:pt-44" size="sm">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-6">What we do</p>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1] tracking-tight max-w-4xl">Services for every wall, every memory.</h1>
        </Reveal>
      </Section>

      <Section>
        <div className="space-y-24 md:space-y-32">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title}>
              <article className={`grid md:grid-cols-12 gap-8 md:gap-16 items-center ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <div className="md:col-span-7">
                  <div className="aspect-[5/4] rounded-3xl overflow-hidden bg-secondary">
                    <img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover"/>
                  </div>
                </div>
                <div className="md:col-span-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">0{i + 1}</p>
                  <h2 className="text-3xl md:text-5xl font-bold leading-tight">{s.title}</h2>
                  <p className="mt-5 text-muted-foreground font-light text-lg leading-relaxed">{s.desc}</p>
                  <ul className="mt-8 space-y-3">
                    {s.options.map((o) => (
                      <li key={o} className="flex items-center gap-3 text-sm">
                        <Check className="h-4 w-4" strokeWidth={1.5}/>{o}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10 flex items-center gap-5">
                    <CTALink to="/contact" withArrow>Request a quote</CTALink>
                    <p className="text-sm font-semibold">{s.price}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeader eyebrow="Custom commission" title="Tell us about your idea." description="Share a reference image and a few details. We'll come back with a quote and timeline." align="center"/>
        <Reveal>
          <form className="max-w-2xl mx-auto grid gap-4">
            <Input label="Your name" placeholder="Full name" />
            <Input label="Email" type="email" placeholder="you@email.com"/>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Preferred size" placeholder="e.g. 6×6 inch"/>
              <Input label="Budget (NPR)" placeholder="e.g. 2000"/>
            </div>
            <Input label="Deadline" type="date"/>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Description</span>
              <textarea rows={5} placeholder="Tell us what you'd like painted…"
                className="mt-2 w-full rounded-2xl border border-border bg-background px-5 py-4 text-sm focus:outline-none focus:border-foreground transition-colors"/>
            </label>
            <CTALink to="/contact" size="lg" className="justify-self-start mt-2" withArrow>Submit request</CTALink>
          </form>
        </Reveal>
      </Section>
    </SiteShell>
  );
}

function Input({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <input {...rest}
        className="mt-2 w-full rounded-full border border-border bg-background px-5 py-3.5 text-sm focus:outline-none focus:border-foreground transition-colors"/>
    </label>
  );
}
