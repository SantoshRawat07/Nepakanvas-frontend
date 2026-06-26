import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "default" | "surface" | "dark";
  size?: "default" | "lg" | "sm";
}

export function Section({ children, className, id, tone = "default", size = "default" }: SectionProps) {
  const toneClass =
    tone === "surface" ? "bg-secondary" : tone === "dark" ? "bg-foreground text-background" : "bg-background";
  const sizeClass = size === "lg" ? "py-28 md:py-40" : size === "sm" ? "py-12 md:py-16" : "py-20 md:py-28";
  return (
    <section id={id} className={cn(toneClass, sizeClass, className)}>
      <div className={cn("mx-auto max-w-7xl container-px")}>{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl mb-12 md:mb-16", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">{eyebrow}</p>
      )}
      <h2 className="text-3xl md:text-5xl font-bold leading-[1.05]">{title}</h2>
      {description && (
        <p className="mt-5 text-base md:text-lg text-muted-foreground font-light leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
