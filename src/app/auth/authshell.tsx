"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Canvas } from "@/app/auth/artstudio";
import { ArrowLeft } from "lucide-react";

type AuthShellProps = {
  mode: "login" | "signup";
  title: ReactNode;
  subtitle?: string;
  error?: string | null;
  children: ReactNode;
};

function ErrorToast({ message }: { message?: string | null }) {
  const [shown, setShown] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setShown(message);
    // let the DOM paint the hidden state first, then animate in
    const enter = requestAnimationFrame(() => setVisible(true));
    const exit = setTimeout(() => setVisible(false), 3200);
    const unmount = setTimeout(() => setShown(null), 3700);
    return () => {
      cancelAnimationFrame(enter);
      clearTimeout(exit);
      clearTimeout(unmount);
    };
  }, [message]);

  if (!shown) return null;

  return (
    <div
      className={`pointer-events-none absolute left-0 right-0 -top-1 z-20 flex justify-center transition-all duration-500 ease-out ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
      }`}
    >
      <div className="flex items-center gap-2.5 rounded-full border border-[#B5533C]/30 bg-white px-4 py-2 text-sm text-[#B5533C] shadow-[0_18px_35px_-18px_rgba(42,38,32,0.5)]">
        <span className="h-1.5 w-6 shrink-0 rounded-full bg-[#B5533C]" />
        {shown}
      </div>
    </div>
  );
}

export function AuthShell({ mode, title, subtitle, error, children }: AuthShellProps) {
  return (
    <div className="fixed inset-0 flex w-full overflow-hidden bg-black">
      {/* left: gallery wall */}
      <Canvas />

      {/* right: form column */}
      <div className="flex h-full w-full flex-col justify-center overflow-y-auto bg-[#F6F1E6] px-6 py-8 sm:px-10 sm:py-10 md:w-1/2 lg:w-[44%] lg:px-16">
        <div className="relative mx-auto w-full max-w-sm">
          <ErrorToast message={error} />

          {/* back-to-home brand header */}
          <h1 className="font-serif text-3xl leading-tight text-[#1B1F2A] sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-[#8A8577]">{subtitle}</p>
          )}

          <div className="mt-6">{children}</div>

          <p className="mt-6 text-center text-sm text-[#8A8577]">
            {mode === "login" ? (
              <>
                New to Nepa Kanvas?{" "}
                <Link href="/auth/signup" className="font-medium text-[#C9A24B] hover:underline">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/auth/login" className="font-medium text-[#C9A24B] hover:underline">
                  Log in
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}