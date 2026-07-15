"use client";

import { useState } from "react";

const GALLERY_ITEMS = [
  { src: "/assets/studentarts.webp", title: "Portrait Study", medium: "Charcoal on paper" },
  { src: "/assets/studentarteye.webp", title: "Buddha", medium: "Acrylic on canvas" },
  { src: "/assets/studentartss.jpg", title: "Family Piece", medium: "Oil on canvas" },
  { src: "/assets/studentcanvas.webp", title: "Civic Portrait", medium: "Watercolour" },
  {src: "/assets/studentart.jpg", title: "Landscape Study", medium: "Acrylic on canvas" },
  {src: "/assets/studentcanvasart.webp", title: "Abstract Composition", medium: "Mixed media on paper" },
  {src: "/assets/stdcanvasart.webp", title: "Still Life", medium: "Oil on canvas" },
];

const RAIL_ITEMS = [...GALLERY_ITEMS, ...GALLERY_ITEMS];

export function StudentGalleryRail() {
  const [hovered, setHovered] = useState<number | null>(null);
  const track = [...RAIL_ITEMS, ...RAIL_ITEMS]; // 16 nodes total → -50% = exactly one loop

  return (
    <div className="group/rail relative overflow-hidden py-10 -mx-6 px-6">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-background to-transparent z-10" />

      {/* hanging rail wire */}
      <div className="absolute top-6 left-0 right-0 h-px bg-border" />

      <div className="flex gap-8 w-max animate-rail group-hover/rail:[animation-play-state:paused]">
        {track.map((item, i) => {
          const isHovered = hovered === i;
          const dim = hovered !== null && !isHovered;

          return (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`relative flex-shrink-0 w-52 md:w-64 transition-all duration-500 ease-out will-change-transform ${
                isHovered
                  ? "scale-110 -translate-y-3 z-20"
                  : dim
                  ? "scale-95 opacity-50 blur-[1px]"
                  : "scale-100"
              }`}
            >
              {/* hook + wire down to frame */}
              <div className="mx-auto w-px h-6 bg-muted-foreground/40" />
              <div
                className={`mx-auto w-1.5 h-1.5 rounded-full -mt-[1px] mb-1 transition-colors duration-300 ${
                  isHovered ? "bg-primary" : "bg-muted-foreground/40"
                }`}
              />

              {/* spotlight glow */}
              <div
                className={`pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-primary/20 blur-3xl transition-opacity duration-500 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* wood frame */}
              <div
                className={`relative rounded-sm border-[10px] border-[#3a2b1d] bg-[#3a2b1d] shadow-lg transition-shadow duration-500 ${
                  isHovered ? "shadow-2xl shadow-black/40" : ""
                }`}
              >
                <div className="bg-background p-2">
                  <div className="aspect-[4/5] overflow-hidden rounded-[2px] bg-secondary">
                    <img
                      src={item.src}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* museum label */}
              <div
                className={`mt-3 text-center transition-opacity duration-300 ${
                  isHovered ? "opacity-100" : "opacity-70"
                }`}
              >
                <p className="text-xs font-semibold tracking-wide">{item.title}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-0.5">
                  {item.medium}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes rail {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-rail {
          animation: rail 48s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-rail {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}