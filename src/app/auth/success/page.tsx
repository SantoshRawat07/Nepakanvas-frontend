"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authActions, type User } from "@/lib/auth";

export default function AuthSuccessPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"loading" | "success">("loading");

  useEffect(() => {
     router.prefetch("/");
    authActions.syncAfterGoogleLogin().then((res) => {
      if (!res.ok || !res.user) {
        router.replace("/auth/login?error=google_failed");
        return;
      }
      router.replace("/");

      const timer = setTimeout(() => router.replace("/"), 300);
      return () => clearTimeout(timer);
    });
  }, [router]);

  const initials =
    user?.userName
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "";

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          {/* pulsing ring while loading */}
          <div
            className={`absolute inset-0 rounded-full bg-primary/10 ${
              status === "loading" ? "animate-ping" : ""
            }`}
          />

          {/* avatar / fallback */}
          <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-border bg-muted shadow-sm">
            {user?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.userName ?? "Profile"}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : status === "loading" ? (
              <div className="h-full w-full animate-pulse bg-muted" />
            ) : (
              <span className="text-lg font-semibold text-muted-foreground">
                {initials}
              </span>
            )}
          </div>

          {/* success checkmark badge */}
          {status === "success" && (
            <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {status === "loading"
              ? "Signing you in"
              : `Welcome${user?.userName ? `, ${user.userName.split(" ")[0]}` : ""}!`}
          </p>
          <p className="text-xs text-muted-foreground">
            {status === "loading"
              ? "Hang tight, this'll only take a moment…"
              : "Redirecting you now…"}
          </p>
        </div>
      </div>
    </div>
  );
}