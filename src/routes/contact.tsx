import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Section } from "@/components/ui-custom/Section";
import { Reveal } from "@/components/ui-custom/Reveal";
import { CTAButton } from "@/components/ui-custom/CTAButton";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — NepaKanvas" },
      { name: "description", content: "Visit the NepaKanvas studio in Kathmandu, or get in touch by phone, email, or WhatsApp." },
      { property: "og:title", content: "Contact — NepaKanvas" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone"),
  subject: z.string().min(2, "Add a short subject"),
  message: z.string().min(10, "Tell us a little more"),
});
type FormValues = z.infer<typeof schema>;

function Contact() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

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
          <h1 className="text-5xl md:text-7xl font-bold leading-[1] tracking-tight max-w-3xl">Let's make something together.</h1>
        </Reveal>
      </Section>

      <Section>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-5 space-y-10">
            <Reveal>
              <Info icon={<MapPin className="h-5 w-5" strokeWidth={1.5}/>} label="Studio" value={"Kathmandu, Nepal\nMon–Sat · 10am–7pm"} />
            </Reveal>
            <Reveal delay={0.05}>
              <Info icon={<Phone className="h-5 w-5" strokeWidth={1.5}/>} label="Phone & WhatsApp" value="+977 98XX XXX XXX"/>
            </Reveal>
            <Reveal delay={0.1}>
              <Info icon={<Mail className="h-5 w-5" strokeWidth={1.5}/>} label="Email" value="hello@nepakanvas.com"/>
            </Reveal>
            <Reveal delay={0.15}>
              <Info icon={<Clock className="h-5 w-5" strokeWidth={1.5}/>} label="Working hours" value={"Mon–Fri · 10am–7pm\nSaturday · 11am–5pm"}/>
            </Reveal>
            <Reveal delay={0.2}>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Follow</p>
                <div className="flex gap-2">
                  {[Instagram, Facebook].map((Icon, i) => (
                    <a key={i} href="#" aria-label="social" className="h-11 w-11 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
                      <Icon className="h-4 w-4" strokeWidth={1.5}/>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-7">
            <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl bg-secondary p-8 md:p-12 grid gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Name" error={errors.name?.message}>
                  <input {...register("name")} className={inputCls} placeholder="Your name"/>
                </Field>
                <Field label="Phone" error={errors.phone?.message}>
                  <input {...register("phone")} className={inputCls} placeholder="+977…"/>
                </Field>
              </div>
              <Field label="Email" error={errors.email?.message}>
                <input {...register("email")} className={inputCls} placeholder="you@email.com"/>
              </Field>
              <Field label="Subject" error={errors.subject?.message}>
                <input {...register("subject")} className={inputCls} placeholder="What is it about?"/>
              </Field>
              <Field label="Message" error={errors.message?.message}>
                <textarea rows={5} {...register("message")}
                  className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-sm focus:outline-none focus:border-foreground transition-colors"
                  placeholder="Tell us about your project…"/>
              </Field>
              <div className="flex items-center gap-4">
                <CTAButton type="submit" size="lg" withArrow disabled={isSubmitting}>
                  {isSubmitting ? "Sending…" : "Send message"}
                </CTAButton>
                {sent && <p className="text-sm font-medium">Thanks — we'll be in touch soon.</p>}
              </div>
            </form>
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

const inputCls = "w-full rounded-full border border-border bg-background px-5 py-3.5 text-sm focus:outline-none focus:border-foreground transition-colors";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
      {error && <span className="mt-2 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-5">
      <div className="h-11 w-11 shrink-0 rounded-full bg-foreground text-background flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">{label}</p>
        <p className="text-lg font-semibold whitespace-pre-line leading-snug">{value}</p>
      </div>
    </div>
  );
}
