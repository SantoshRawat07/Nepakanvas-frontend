"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authActions } from "@/lib/auth";

export default function AuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // cookie is already set by backend at this point
    // just sync the store then redirect
    authActions.syncAfterGoogleLogin().then(({ ok }) => {
      router.replace(ok ? "/" : "/auth/login?error=google_failed");
    });
  }, [router]);

  return (
    <div className="min-h-dvh flex items-center justify-center">
      <p className="text-muted-foreground text-sm animate-pulse">
        Signing you in...
      </p>
    </div>
  );
}