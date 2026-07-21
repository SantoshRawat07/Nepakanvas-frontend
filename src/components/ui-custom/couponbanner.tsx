"use client";

import { Tag } from "lucide-react";

export function CouponPromoBanner({
  code = "SAVE10",
  percent = 10,
}: {
  code?: string;
  percent?: number;
}) {
  return (
    <div className="max-w-6xl mx-auto px-6 lg:mt-4 mb-0">
      <div className="rounded-full border border-black/10 bg-black px-5 py-3 flex items-center justify-center gap-2.5 shadow-sm">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
          <Tag className="h-3.5 w-3.5 text-white" strokeWidth={1.75} />
        </span>

        <p className="text-xs md:text-sm font-medium tracking-wide text-white text-center">
          Use a discount coupon code{" "}
          <span className="font-bold text-white underline decoration-white/50 underline-offset-2">
            "{code}"
          </span>{" "}
          and get <span className="font-bold text-white">{percent}% discount</span> on every order.
        </p>
      </div>
    </div>
  );
}