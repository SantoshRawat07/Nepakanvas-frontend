import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  variants?: Variants;
  delay?: number;
  className?: string;
  amount?: number;
  once?: boolean;
}

export function Reveal({
  children,
  variants = fadeUp,
  delay = 0,
  className,
  amount = 0.2,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
