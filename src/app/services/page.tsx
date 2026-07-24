"use client";

import { useState, useRef, type FormEvent, type ComponentType } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Section, SectionHeader } from "@/components/ui-custom/Section";
import { Reveal } from "@/components/ui-custom/Reveal";
import { CTALink, CTAButton } from "@/components/ui-custom/CTAButton";
import {
  Check,
  ImagePlus,
  X,
  Palette,
  PaintRoller,
  Heart,
  Image as ImageIcon,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import portrait from "@/assets/portrait.webp";
import wallpainting from "@/assets/wallpaints.png";
import balen from "@/assets/balen.webp";
import wedding from "@/assets/weeding.jpeg";

/* ------------------------------------------------------------------ */
/* Service categories — shown as selectable chips inside the request form */
/* ------------------------------------------------------------------ */

type Category = {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  swatch: string; // bg color for the icon badge
};

const CATEGORIES: Category[] = [
  { key: "canvas", label: "Canvas Painting", icon: Palette, swatch: "bg-indigo-500" },
  { key: "wall", label: "Wall Painting", icon: PaintRoller, swatch: "bg-amber-500" },
  { key: "wedding", label: "Wedding Live Painting", icon: Heart, swatch: "bg-rose-500" },
  { key: "custom", label: "Custom Orders", icon: ImageIcon, swatch: "bg-sky-500" },
  { key: "classes", label: "Art Classes for Students", icon: GraduationCap, swatch: "bg-emerald-500" },
];

/* ------------------------------------------------------------------ */
/* Full service detail list — shown further down the page              */
/* ------------------------------------------------------------------ */

const SERVICES = [
  {
    title: "Canvas Painting",
    image: portrait.src,
    desc: "Mini and large originals, painted by hand on cotton canvas.",
    options: ["3″×3″ mini canvas", "6″×6″ medium", "Custom sizes on request"],
    price: "From Rs 600",
  },
  {
    title: "Wall Painting",
    image: wallpainting.src,
    desc: "Murals and feature walls for homes and businesses.",
    options: ["Residential", "Commercial", "Hotels & Restaurants", "Schools & Offices"],
    price: "Quote on site",
  },
  {
    title: "Wedding Live Painting",
    image: wedding.src,
    desc: "We paint the ceremony as it happens — a keepsake unlike any photo.",
    options: ["Wedding ceremony", "Engagement", "Reception", "Anniversary"],
    price: "Packages from Rs 25,000",
  },
  {
    title: "Custom Orders",
    image: balen.src,
    desc: "Send any photo. We'll paint it. Single subject or group portraits.",
    options: ["Reference photo", "Choose size", "Approve preview", "Delivered to your door"],
    price: "From Rs 800",
  },
  {
    title: "Art Classes for Students",
    image: null,
    icon: GraduationCap,
    desc: "Guided painting lessons for beginners and improvers, in small groups or one-on-one.",
    options: ["Beginner & intermediate levels", "Group or private sessions", "All materials included", "Certificate on completion"],
    price: "From Rs 1,500 / session",
  },
];

const MAX_FILES = 3; // matches backend storage.array('photos', 3)
const MAX_SIZE_MB = 8;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

type RefImage = {
  file: File;
  preview: string;
};

export default function Services() {
  const [category, setCategory] = useState<string>(CATEGORIES[0].key);

  const [refImages, setRefImages] = useState<RefImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [size, setSize] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [descriptions, setDescriptions] = useState("");

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    setError(null);

    const incoming = Array.from(fileList);
    const valid: File[] = [];

    for (const file of incoming) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Only JPEG or PNG images are allowed.");
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`Each image must be under ${MAX_SIZE_MB}MB.`);
        continue;
      }
      valid.push(file);
    }

    setRefImages((prev) => {
      const combined = [...prev, ...valid.map((file) => ({ file, preview: URL.createObjectURL(file) }))];
      if (combined.length > MAX_FILES) {
        setError(`You can upload up to ${MAX_FILES} images.`);
        return combined.slice(0, MAX_FILES);
      }
      return combined;
    });

    if (inputRef.current) inputRef.current.value = "";
  }

  function removeImage(index: number) {
    setRefImages((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].preview);
      next.splice(index, 1);
      return next;
    });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("FullName", fullName);
      formData.append("Email", email);
      formData.append("Category", category);
      formData.append("Size", size);
      formData.append("Budget", budget);
      formData.append("Deadline", deadline);
      formData.append("Descriptions", descriptions);
      refImages.forEach((img) => formData.append("photos", img.file));

      const res = await fetch(`${API_BASE}/user/orders`, {
        method: "POST",
        credentials: "include",
        body: formData, // do NOT set Content-Type manually — browser sets the multipart boundary
      });

      let body: any = null;
      try { body = await res.json(); } catch { /* no body */ }

      if (!res.ok) {
        throw new Error(body?.message ?? "Something went wrong submitting your request.");
      }

      setSuccess(true);
      setFullName(""); setEmail(""); setSize(""); setBudget(""); setDeadline(""); setDescriptions("");
      setCategory(CATEGORIES[0].key);
      refImages.forEach((img) => URL.revokeObjectURL(img.preview));
      setRefImages([]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteShell>
      {/* ---------------------------------------------------------------- */}
      {/* Hero: heading + premium-service teasers (left) / request form (right) */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="surface" className="pt-32 md:pt-44 pb-20 md:pb-28">
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-10 items-start">
          {/* Left column */}
          <div className="lg:col-span-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-medium tracking-wide">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
                Commission-Ready Art Studio
              </span>

              <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight max-w-xl">
                Transform Your Memories into Timeless Canvas Art.
              </h1>

              <p className="mt-6 max-w-md text-muted-foreground font-light text-lg">
                From a single canvas to a full mural, every piece is painted by hand
                and built around your story.
              </p>
            </Reveal>

            <Reveal>
              <p className="mt-12 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Our premium services
              </p>
              <div className="mt-5 grid grid-cols-2 gap-4 max-w-lg">
                <div className="rounded-2xl border border-border bg-background p-6">
                  <div className="h-11 w-11 rounded-xl bg-indigo-500 flex items-center justify-center">
                    <Palette className="h-5 w-5 text-white" strokeWidth={1.5} />
                  </div>
                  <p className="mt-5 font-semibold">Canvas Painting</p>
                  <p className="mt-1 text-sm text-muted-foreground">Hand-painted originals, any size</p>
                </div>
                <div className="rounded-2xl border border-border bg-background p-6">
                  <div className="h-11 w-11 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-white" strokeWidth={1.5} />
                  </div>
                  <p className="mt-5 font-semibold">Art Classes</p>
                  <p className="mt-1 text-sm text-muted-foreground">Guided lessons for students</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right column — floating request-a-commission card */}
          <div className="lg:col-span-6">
            <Reveal>
              <div className="rounded-3xl border border-border bg-background shadow-xl shadow-black/5 p-6 md:p-8">
                {/* window dots */}
                <div className="flex items-center gap-1.5 mb-6">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>

                {success ? (
                  <div className="py-10 text-center">
                    <p className="text-lg font-semibold">Request sent!</p>
                    <p className="mt-2 text-muted-foreground text-sm">We'll get back to you by email soon.</p>
                    <button type="button" onClick={() => setSuccess(false)} className="mt-6 text-sm underline underline-offset-4">
                      Submit another request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit} className="grid gap-4">
                    {error && <div className="rounded-xl bg-destructive/10 text-destructive text-sm px-4 py-3">{error}</div>}

                    {/* Service category */}
                    <div>
                      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Service category <span className="text-red-500">*</span>
                      </span>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        {CATEGORIES.map((c) => {
                          const Icon = c.icon;
                          const active = category === c.key;
                          return (
                            <button
                              key={c.key}
                              type="button"
                              onClick={() => setCategory(c.key)}
                              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                                active ? "border-foreground bg-secondary" : "border-border hover:border-foreground/50"
                              }`}
                            >
                              <span className={`h-8 w-8 shrink-0 rounded-full ${c.swatch} flex items-center justify-center`}>
                                <Icon className="h-4 w-4 text-white" strokeWidth={1.5} />
                              </span>
                              {c.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Your name" placeholder="Full name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                      <Input label="Email" type="email" placeholder="you@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Preferred size" placeholder="e.g. 6×6 inch" required value={size} onChange={(e) => setSize(e.target.value)} />
                      <Input label="Budget (NPR)" type="number" placeholder="e.g. 2000" required value={budget} onChange={(e) => setBudget(e.target.value)} />
                    </div>

                    {/* Reference images upload */}
                    <div className="block">
                      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Reference images</span>

                      <label
                        htmlFor="reference-images"
                        className="mt-2 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-background px-5 py-6 text-center text-sm cursor-pointer hover:border-foreground transition-colors"
                      >
                        <ImagePlus className="h-5 w-5" strokeWidth={1.5} />
                        <span className="text-muted-foreground text-xs">
                          Click to upload <span className="hidden sm:inline">JPEG or PNG (up to {MAX_FILES}, {MAX_SIZE_MB}MB each)</span>
                        </span>
                        <input
                          id="reference-images"
                          ref={inputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/jpg"
                          multiple
                          className="hidden"
                          onChange={(e) => handleFiles(e.target.files)}
                        />
                      </label>

                      {refImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
                          {refImages.map((img, idx) => (
                            <div key={img.preview} className="relative aspect-square rounded-xl overflow-hidden bg-secondary group">
                              <img src={img.preview} alt={`Reference ${idx + 1}`} className="h-full w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove image"
                              >
                                <X className="h-3 w-3" strokeWidth={2} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Input label="Deadline" type="date" required value={deadline} onChange={(e) => setDeadline(e.target.value)} />

                    <label className="block">
                      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Description</span>
                      <textarea
                        rows={4}
                        required
                        placeholder="Tell us what you'd like painted…"
                        value={descriptions}
                        onChange={(e) => setDescriptions(e.target.value)}
                        className="mt-2 w-full rounded-2xl border border-border bg-background px-5 py-4 text-sm focus:outline-none focus:border-foreground transition-colors"
                      />
                    </label>

                    <div className="mt-2 flex justify-end border-t border-border pt-5">
                      <CTAButton type="submit" size="lg" className="hover:bg-primary" disabled={submitting}>
                        {submitting ? "Submitting…" : "Request a quote"}
                      </CTAButton>
                    </div>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Detail: every service, in full                                    */}
      {/* ---------------------------------------------------------------- */}
      <Section>
        <SectionHeader
          eyebrow="In detail"
          title="Every service, up close."
          description="A closer look at what's included, sizing, and pricing for each service."
          align="center"
        />
        <div className="mt-16 space-y-24 md:space-y-32">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title}>
              <article className={`grid md:grid-cols-12 gap-8 md:gap-16 items-center ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <div className="md:col-span-7">
                  <div className="aspect-[5/4] rounded-3xl overflow-hidden bg-secondary">
                    {s.image ? (
                      <img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-emerald-500/10">
                        {s.icon ? <s.icon className="h-16 w-16 text-emerald-600" strokeWidth={1} /> : null}
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">0{i + 1}</p>
                  <h2 className="text-3xl md:text-5xl font-bold leading-tight">{s.title}</h2>
                  <p className="mt-5 text-muted-foreground font-light text-lg leading-relaxed">{s.desc}</p>
                  <ul className="mt-8 space-y-3">
                    {s.options.map((o) => (
                      <li key={o} className="flex items-center gap-3 text-sm">
                        <Check className="h-4 w-4" strokeWidth={1.5} />{o}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10 flex items-center gap-5">
                    <CTALink href="/contact" withArrow className="hover:bg-primary">Request a quote</CTALink>
                    <p className="text-sm font-semibold">{s.price}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
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