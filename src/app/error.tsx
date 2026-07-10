"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Section } from "@/components/ui-custom/Section";
import { CTAButton } from "@/components/ui-custom/CTAButton";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <SiteShell>
      <Section size="lg" className="min-h-[80vh] flex flex-col justify-center text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">Something went wrong.</h1>
        <p className="mt-4 text-muted-foreground max-w-md mx-auto">
          An unexpected error occurred. We have been notified and are looking into it.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <CTAButton onClick={() => reset()} variant="outline">
            <RefreshCcw className="h-4 w-4 mr-2" strokeWidth={1.5} /> Try again
          </CTAButton>
          <Link href="/" className="inline-flex items-center gap-2 hover:underline underline-offset-4">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Return to home
          </Link>
        </div>
      </Section>
    </SiteShell>
  );
}
