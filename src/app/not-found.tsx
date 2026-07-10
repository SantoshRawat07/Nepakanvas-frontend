import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Section } from "@/components/ui-custom/Section";

export default function NotFound() {
  return (
    <SiteShell>
      <Section size="lg" className="min-h-[80vh] flex flex-col justify-center text-center">
        <h1 className="text-7xl md:text-9xl font-bold tracking-tight">404</h1>
        <h2 className="mt-6 text-2xl md:text-4xl font-semibold">Page not found.</h2>
        <p className="mt-4 text-muted-foreground max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="mt-10 inline-flex items-center gap-2 justify-center hover:underline underline-offset-4">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Return to home
        </Link>
      </Section>
    </SiteShell>
  );
}
