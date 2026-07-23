"use client";
import  Link  from "next/link";
import Image from "next/image";

type Piece = {
  src: string;
  alt: string;
  leftPct: number; // 0–100, position along the rope
  hang: number; // px of string below the rope
  tilt: number; // resting tilt in degrees
  size: number; // px, square-ish frame width
};

const DEFAULT_PIECES: Piece[] = [
  { src: "https://i.pinimg.com/control1/1200x/d7/eb/6e/d7eb6e7aba9056c05bdac2afad75799b.jpg", alt: "Custom canvas print, portrait", leftPct: 9, hang: 58, tilt: -4, size: 128 },
  { src: "https://picsum.photos/seed/nepakanvas-b/320/380", alt: "Custom canvas print, family photo", leftPct: 28, hang: 96, tilt: 3, size: 140 },
  { src: "https://picsum.photos/seed/nepakanvas-c/320/380", alt: "Custom canvas print, landscape", leftPct: 50, hang: 72, tilt: -2, size: 150 },
  { src: "https://picsum.photos/seed/nepakanvas-d/320/380", alt: "Custom canvas print, pet portrait", leftPct: 72, hang: 100, tilt: 4, size: 138 },
  { src: "https://picsum.photos/seed/nepakanvas-e/320/380", alt: "Custom canvas print, abstract", leftPct: 91, hang: 62, tilt: -3, size: 126 },
];

export function Canvas({ pieces = DEFAULT_PIECES }: { pieces?: Piece[] }) {
  return (
    <div className="relative hidden md:flex md:w-1/2 lg:w-[56%] h-screen flex-col justify-between overflow-hidden px-10 py-2 bg-black text-[#F6F1E6]">
      {/* wall */}
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#181B24_0%,#20222E_55%,#181B24_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_20%_10%,rgba(201,162,75,0.14),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_85%_75%,rgba(181,83,60,0.10),transparent_60%)]" />
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]" aria-hidden="true">
        <pattern id="wall-weave" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 14 L14 0" stroke="#F6F1E6" strokeWidth="1" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#wall-weave)" />
      </svg>
<Link
  href="/"
  className="group relative z-10 flex w-fit items-center gap-3"
  aria-label="Back to home"
>
      {/* brand mark */}
      <div className="relative z-10 flex items-center gap-3">
        <Image
          src="/nepakanvaslogo.jpg"
          alt="NepaKanvas Logo"
          width={36}
          height={36}
          className="h-9 w-9 rounded-full object-cover border-2 border-[#C9A24B] shadow-lg"
          priority
        />
        <span className="font-serif text-lg tracking-wide">NepaKanvas</span>
      </div>
</Link>
      {/* rope + hanging canvases */}
      <div className="relative z-10 flex-1">
        {/* the rope, sagging slightly */}
        <svg
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          className="absolute left-0 top-[16%] h-[26px] w-full"
        >
          <path d="M0 4 Q50 17 100 4" fill="none" stroke="#C9A24B" strokeWidth="0.6" strokeOpacity="0.75" />
          <path d="M0 4 Q50 17 100 4" fill="none" stroke="#8A6A2F" strokeWidth="1.4" strokeOpacity="0.25" />
        </svg>

        {pieces.map((p, i) => (
          <div
            key={i}
            className="hanger absolute top-[16%]"
            style={{
              left: `${p.leftPct}%`,
              transform: "translateX(-50%)",
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${4.5 + (i % 3) * 0.7}s`,
              ["--rest-tilt" as string]: `${p.tilt}deg`,
            }}
          >
            {/* string */}
            <div
              className="mx-auto w-px bg-[#C9A24B]/50"
              style={{ height: `${p.hang}px` }}
            />
            {/* clothespin */}
            <svg width="16" height="20" viewBox="0 0 16 20" className="mx-auto -mt-[1px]">
              <rect x="3" y="0" width="10" height="16" rx="2.5" fill="#B98B4E" />
              <rect x="3" y="7" width="10" height="2" fill="#8A6A2F" />
              <circle cx="8" cy="8" r="1.6" fill="#5C4526" />
            </svg>
            {/* framed canvas */}
            <div
              className="canvas-frame -mt-1 rounded-sm bg-[#FFFDF9] p-1.5 shadow-[0_18px_35px_-15px_rgba(0,0,0,0.65)]"
              style={{ width: `${p.size}px` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.alt}
                width={p.size}
                height={p.size * 1.15}
                className="block h-auto w-full rounded-[1px] object-cover"
                style={{ aspectRatio: "1 / 1.15" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* copy */}
      <div className="relative z-10 max-w-sm pb-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#C9A24B]">Order Premimum canvas in Nepal</p>
        <p className="lg:mt-4 font-serif text-2xl leading-snug text-[#F6F1E6]">
          Order &amp; customize your own canvas, at affordable prices, made in Nepal.
        </p>
      </div>

      <style jsx>{`
        @keyframes sway {
          0%   { transform: translateX(-50%) rotate(calc(var(--rest-tilt) - 2.5deg)); }
          50%  { transform: translateX(-50%) rotate(calc(var(--rest-tilt) + 2.5deg)); }
          100% { transform: translateX(-50%) rotate(calc(var(--rest-tilt) - 2.5deg)); }
        }
        .hanger {
          transform-origin: top center;
          animation-name: sway;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        .canvas-frame {
          transition: transform 0.25s ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .hanger {
            animation: none !important;
            transform: translateX(-50%) rotate(var(--rest-tilt)) !important;
          }
        }
      `}</style>
    </div>
  );
}