import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Section } from "@/components/ui-custom/Section";
import { CTAButton } from "@/components/ui-custom/CTAButton";
import { authActions } from "@/lib/auth";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({ meta: [{ title: "Create account — NepaKanvas" }, { name: "robots", content: "noindex" }] }),
  component: SignupPage,
});

function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    const res = authActions.signup(form.name, form.email, form.password);
    if (!res.ok) return setError(res.error ?? "Signup failed");
    navigate({ to: "/" });
  };

  return (
    <SiteShell>
      <Section tone="surface" size="lg" className="pt-32">
        <div className="max-w-md mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-4">Join the studio</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">Create account.</h1>
          <p className="mt-3 text-muted-foreground font-light">Save your favourites and track custom orders.</p>

          <form onSubmit={submit} className="mt-8 space-y-4 rounded-3xl border border-border bg-background p-6">
            {error && <div className="rounded-xl bg-destructive/10 text-destructive text-sm px-4 py-3">{error}</div>}
            <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
            <CTAButton type="submit" size="lg" className="w-full">Create account</CTAButton>
            <p className="text-sm text-muted-foreground text-center">
              Already have one? <Link to="/auth/login" className="text-foreground underline underline-offset-4">Sign in</Link>
            </p>
          </form>
        </div>
      </Section>
    </SiteShell>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      <input
        type={type} required value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground"
      />
    </div>
  );
}
