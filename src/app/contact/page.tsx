"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Check } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Section } from "@/components/ui-custom/Section";
import { Reveal } from "@/components/ui-custom/Reveal";
import { CTAButton } from "@/components/ui-custom/CTAButton";
import { useState } from "react";

const PIGMENT = "#000000";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .regex(/^98\d{8}$/, "Enter a 10-digit number starting with 98"),
  subject: z.string().trim().min(2, "Add a short subject"),
  message: z.string().trim().min(10, "Tell us a little more (min 10 characters)"),
});
type FormValues = z.infer<typeof schema>;

export default function Contact() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onBlur" });

  const onSubmit = async (_data: FormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    setSent(true);
    reset();
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <SiteShell>
      <Section tone="surface" className="pt-32 md:pt-44" size="sm">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-6">Get in touch</p>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1] tracking-tight max-w-3xl">
            Let's make something
            <br />
            <span className="relative inline-block">
              together.
              <svg
                viewBox="0 0 200 16"
                className="absolute left-0 -bottom-2 w-full h-3 pointer-events-none"
                preserveAspectRatio="none"
              >
                <path
                  d="M4 9 C 40 2, 90 13, 130 6 S 180 2, 196 8"
                  fill="none"
                  stroke={PIGMENT}
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
        </Reveal>
      </Section>

      <Section>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-5 space-y-10">
            <Reveal>
              <Info
                icon={<MapPin className="h-5 w-5" strokeWidth={1.5} />}
                label="Studio"
                value={"Kathmandu, Nepal\nMon–Sat · 10am–7pm"}
              />
            </Reveal>
            <Reveal delay={0.05}>
              <Info icon={<Phone className="h-5 w-5" strokeWidth={1.5} />} label="Phone & WhatsApp" value="+977 9867387833" />
            </Reveal>
            <Reveal delay={0.1}>
              <Info icon={<Mail className="h-5 w-5" strokeWidth={1.5} />} label="Email" value="hello@nepakanvas.com" />
            </Reveal>
            <Reveal delay={0.15}>
              <Info
                icon={<Clock className="h-5 w-5" strokeWidth={1.5} />}
                label="Working hours"
                value={"Mon–Fri · 10am–7pm\nSaturday · 11am–5pm"}
              />
            </Reveal>
            <Reveal delay={0.2}>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Follow</p>
                <div className="flex gap-2">
                  {[Instagram, Facebook].map((Icon, i) => (
                     <a
                      key={i}
                      href="#"
                      aria-label="social"
                      className="h-11 w-11 rounded-full border border-border flex items-center justify-center transition-colors"
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = PIGMENT)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-7">
            <div className="relative rounded-3xl bg-secondary overflow-hidden">
              {/* stitched canvas-edge accent, echoes the footer */}
              <div
                aria-hidden
                className="h-1 w-full opacity-70"
                style={{
                  backgroundImage: `repeating-linear-gradient(90deg, ${PIGMENT} 0 8px, transparent 8px 18px)`,
                }}
              />
              <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12 grid gap-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Name" required error={errors.name?.message}>
                    <input {...register("name")} required aria-required="true" className={inputCls} placeholder="Your name" />
                  </Field>
                  <Field label="Phone" required error={errors.phone?.message}>
                    <input
                      {...register("phone", {
                        onChange: (e) => {
                          e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
                        },
                      })}
                      required
                      aria-required="true"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      className={inputCls}
                      placeholder="9864934788"
                    />
                  </Field>
                </div>
                <Field label="Email" required error={errors.email?.message}>
                  <input {...register("email")} required aria-required="true" type="email" className={inputCls} placeholder="you@email.com" />
                </Field>
                <Field label="Subject" required error={errors.subject?.message}>
                  <input {...register("subject")} required aria-required="true" className={inputCls} placeholder="What is it about?" />
                </Field>
                <Field label="Message" required error={errors.message?.message}>
                  <textarea
                    rows={5}
                    {...register("message")}
                    required
                    aria-required="true"
                    className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-sm focus:outline-none transition-colors"
                    style={{ borderColor: undefined }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = PIGMENT)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                    placeholder="Tell us about your project…"
                  />
                </Field>
                <div className="flex items-center gap-4 flex-wrap">
                  <CTAButton
                    type="submit"
                    size="lg"
                    withArrow
                    disabled={isSubmitting}
                    style={{ backgroundColor: PIGMENT, borderColor: PIGMENT }}
                  >
                    {isSubmitting ? "Sending…" : "Send message"}
                  </CTAButton>
                  {sent && (
                    <p className="flex items-center gap-1.5 text-sm font-medium">
                      <Check className="h-4 w-4" style={{ color: PIGMENT }} />
                      Thanks — we'll be in touch soon.
                    </p>
                  )}
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section size="sm">
        <Reveal>
          <div className="rounded-3xl overflow-hidden border border-border h-[420px]">
            <iframe
              title="NepaKanvas studio map"
              src="https://www.google.com/maps?q=Kathmandu,Nepal&output=embed"
              className="w-full h-full grayscale"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </Section>
    </SiteShell>
  );
}

const inputCls =
  "w-full rounded-full border border-border bg-background px-5 py-3.5 text-sm focus:outline-none transition-colors";

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
        {required && <span style={{ color: "#ee0707" }}> *</span>}
      </span>
      <div className="mt-2">{children}</div>
      {error && <span className="mt-2 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-5">
      <div className="h-11 w-11 shrink-0 rounded-full bg-foreground text-background flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">{label}</p>
        <p className="text-lg font-semibold whitespace-pre-line leading-snug">{value}</p>
      </div>
    </div>
  );
}