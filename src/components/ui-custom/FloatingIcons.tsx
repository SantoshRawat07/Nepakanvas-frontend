import { motion } from "framer-motion";
import { Brush, Palette, Frame, PenTool, Sparkles, Paintbrush, Feather, Star } from "lucide-react";

const ICONS = [
  { Icon: Brush, x: "8%", y: "18%", size: 42, dur: 9 },
  { Icon: Palette, x: "82%", y: "14%", size: 52, dur: 11 },
  { Icon: Frame, x: "14%", y: "72%", size: 44, dur: 10 },
  { Icon: PenTool, x: "76%", y: "68%", size: 40, dur: 12 },
  { Icon: Sparkles, x: "48%", y: "10%", size: 30, dur: 8 },
  { Icon: Paintbrush, x: "90%", y: "44%", size: 38, dur: 13 },
  { Icon: Feather, x: "4%", y: "48%", size: 36, dur: 10 },
  { Icon: Star, x: "58%", y: "82%", size: 26, dur: 9 },
];

export function FloatingIcons() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {ICONS.map(({ Icon, x, y, size, dur }, i) => (
        <motion.div
          key={i}
          className="absolute text-foreground/10"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
          animate={{
            opacity: [0, 1, 1, 1],
            y: [0, -14, 0, 14, 0],
            x: [0, 8, 0, -8, 0],
            rotate: [-6, 6, -6],
          }}
          transition={{
            opacity: { duration: 1.2, delay: i * 0.08 },
            y: { duration: dur, repeat: Infinity, ease: "easeInOut" },
            x: { duration: dur * 1.2, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: dur * 1.4, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Icon size={size} strokeWidth={1.25} />
        </motion.div>
      ))}
    </div>
  );
}
