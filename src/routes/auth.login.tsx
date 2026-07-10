import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Section } from "@/components/ui-custom/Section";
import { CTAButton } from "@/components/ui-custom/CTAButton";
import { authActions } from "@/lib/auth";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Sign in — NepaKanvas" }, { name: "robots", content: "noindex" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const res = authActions.login(email, password);
    if (!res.ok) return setError(res.error ?? "Login failed");
    navigate({ to: "/" });
  };

  return (
    <SiteShell>
      <Section tone="surface" size="lg" className="pt-32">
        <div className="max-w-md mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-4">Welcome back</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">Sign in.</h1>
          <p className="mt-3 text-muted-foreground font-light">Access your orders, wishlist and profile.</p>

          <form onSubmit={submit} className="mt-8 space-y-4 rounded-3xl border border-border bg-background p-6">
            {error && <div className="rounded-xl bg-destructive/10 text-destructive text-sm px-4 py-3">{error}</div>}
            <Field label="Email" type="email" value={email} onChange={setEmail} />
            <Field label="Password" type="password" value={password} onChange={setPassword} />
            <CTAButton type="submit" size="lg" className="w-full">Sign in</CTAButton>
            <p className="text-sm text-muted-foreground text-center">
              New here? <Link to="/auth/signup" className="text-foreground underline underline-offset-4">Create an account</Link>
            </p>
            <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
              Admin demo: <code className="font-mono">admin@nepakanvas.com</code> / <code className="font-mono">admin123</code>
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
