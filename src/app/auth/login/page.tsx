"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authActions } from "@/lib/auth";
import { AuthShell } from "@/app/auth/authshell";
import { FormField } from "@/app/auth/formfield";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await authActions.login(email, password);
    setLoading(false);
    if (!res.ok) return setError(res.error ?? "Login failed");
    router.push("/");
  };

  return (
    <AuthShell
      mode="login"
      title={
        <>
          Welcome <span className="text-[#C9A24B]">back!</span>
        </>
      }
      subtitle="Sign in to continue to your account."
    >
      <form
        onSubmit={submit}
        className="space-y-4 rounded-3xl border border-[#E4DCC8] bg-white p-6 shadow-[0_20px_45px_-25px_rgba(42,38,32,0.35)]"
      >
        {error && (
          <div className="rounded-xl bg-[#B5533C]/10 px-4 py-3 text-sm text-[#B5533C]">
            {error}
          </div>
        )}

        <FormField label="Email" type="email" value={email} onChange={setEmail} />
        <FormField label="Password" type="password" value={password} onChange={setPassword} />

        <div className="flex justify-end">
          <Link href="/auth/forgot-password" className="text-xs font-medium text-[#C9A24B] hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#1B1F2A] py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#C9A24B] hover:text-[#1B1F2A] disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Login"}
        </button>

        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-[#E4DCC8]" />
          <span className="text-xs text-[#8A8577]">or</span>
          <div className="h-px flex-1 bg-[#E4DCC8]" />
        </div>

        <button
          type="button"
          onClick={() => authActions.googleLogin()}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-[#E4DCC8] bg-white px-4 py-3 text-sm font-medium text-[#2A2620] transition-colors hover:bg-[#F6F1E6]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
        {/* <p className="border-t border-[#E4DCC8] pt-3 text-center font-mono text-[11px] text-[#8A8577]">
          Admin demo: <code>admin@nepakanvas.com</code> / <code>admin123</code>
        </p> */}
      </form>
    </AuthShell>
  );
}