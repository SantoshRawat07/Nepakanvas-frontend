"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { Section } from "@/components/ui-custom/Section";
import { CTAButton } from "@/components/ui-custom/CTAButton";
import { authActions } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await authActions.login(email, password);
    if (!res.ok) return setError(res.error ?? "Login failed");
    router.push("/");
  };

  return (
    <SiteShell>
      <Section tone="surface" size="lg" className="pt-32">
        <div className="max-w-md mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-4">Welcome back</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">Sign in.</h1>
          <p className="mt-3 text-muted-foreground font-light">Access your orders, wishlist and profile.</p>

          <form onSubmit={submit} className="mt-8 space-y-4 rounded-3xl border border-border bg-background p-6">
            {error && (
              <div className="rounded-xl bg-destructive/10 text-destructive text-sm px-4 py-3">
                {error}
              </div>
            )}

            <Field label="Email" type="email" value={email} onChange={setEmail} />
            <Field label="Password" type="password" value={password} onChange={setPassword} />
            <CTAButton type="submit" size="lg" className="w-full hover:bg-primary">
              Sign in
            </CTAButton>

            {/* ✅ divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* ✅ Google login button */}
            <button
              type="button"
              onClick={() => authActions.googleLogin()}
              className="w-full flex items-center justify-center gap-3 rounded-full border border-border bg-background px-4 py-3 text-sm font-medium hover:bg-secondary transition-colors"
            >
              {/* Google SVG icon */}
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            <p className="text-sm text-muted-foreground text-center">
              New here?{" "}
              <Link href="/auth/signup" className="text-foreground underline underline-offset-4">
                Create an account
              </Link>
            </p>
            <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
              Admin demo: <code className="font-mono">admin@nepakanvas.com</code> /{" "}
              <code className="font-mono">admin123</code>
            </p>
          </form>
        </div>
      </Section>
    </SiteShell>
  );
}

function Field({
  label, value, onChange, type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
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