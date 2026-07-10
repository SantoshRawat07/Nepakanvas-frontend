"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { Section } from "@/components/ui-custom/Section";
import { CTAButton } from "@/components/ui-custom/CTAButton";
import { authActions } from "@/lib/auth";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const res = authActions.signup(name, email, password);
    if (!res.ok) return setError(res.error ?? "Signup failed");
    router.push("/");
  };

  return (
    <SiteShell>
      <Section tone="surface" size="lg" className="pt-32">
        <div className="max-w-md mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-4">New account</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">Join the studio.</h1>
          <p className="mt-3 text-muted-foreground font-light">Create an account to save your favorite works and track orders.</p>

          <form onSubmit={submit} className="mt-8 space-y-4 rounded-3xl border border-border bg-background p-6">
            {error && <div className="rounded-xl bg-destructive/10 text-destructive text-sm px-4 py-3">{error}</div>}
            <Field label="Full name" value={name} onChange={setName} />
            <Field label="Email" type="email" value={email} onChange={setEmail} />
            <Field label="Password" type="password" value={password} onChange={setPassword} />
            <CTAButton type="submit" size="lg" className="w-full hover:bg-primary">Create account</CTAButton>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account? <Link href="/auth/login" className="text-foreground underline underline-offset-4">Sign in</Link>
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
