import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BaseProps {
  variant?: "primary" | "outline" | "ghost";
  size?: "default" | "lg";
  children: ReactNode;
  className?: string;
  withArrow?: boolean;
}

const styles = (variant: BaseProps["variant"] = "primary", size: BaseProps["size"] = "default") =>
  cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 group/btn",
    size === "lg" ? "px-7 py-4 text-sm" : "px-6 py-3 text-sm",
    variant === "primary" &&
      "bg-foreground text-background hover:bg-background hover:text-foreground border border-foreground",
    variant === "outline" &&
      "bg-transparent text-foreground border border-foreground hover:bg-foreground hover:text-background",
    variant === "ghost" &&
      "bg-transparent text-foreground hover:bg-secondary border border-transparent"
  );

export function CTALink({
  to,
  variant,
  size,
  className,
  children,
  withArrow,
  ...rest
}: BaseProps & { to: string } & Omit<ComponentProps<typeof Link>, "to" | "children" | "className">) {
  return (
    <Link to={to} className={cn(styles(variant, size), className)} {...(rest as any)}>
      {children}
      {withArrow && <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" strokeWidth={1.5} />}
    </Link>
  );
}

export function CTAButton({
  variant,
  size,
  className,
  children,
  withArrow,
  ...rest
}: BaseProps & ComponentProps<"button">) {
  return (
    <button className={cn(styles(variant, size), className)} {...rest}>
      {children}
      {withArrow && <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" strokeWidth={1.5} />}
    </button>
  );
}
