"use client";

import { Tag } from "lucide-react";
import { useActiveCoupons, useActiveCouponsStatus, type PublicCoupon } from "@/lib/pubcoupon";

function formatDiscount(c: PublicCoupon): string {
  return c.discountType === "percentage" ? `${c.discountValue}%` : `Rs ${c.discountValue.toLocaleString()}`;
}

function pickFeatured(coupons: PublicCoupon[]): PublicCoupon | null {
  if (coupons.length === 0) return null;
  return [...coupons].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];
}

export function CouponPromoBanner() {
  const coupons = useActiveCoupons();
  const { loading } = useActiveCouponsStatus();

  if (loading && coupons.length === 0) return null;

  const featured = pickFeatured(coupons);
  if (!featured) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 lg:mt-4 mb-0">
      <div className="rounded-full border border-black/10 bg-black px-5 py-3 flex items-center justify-center gap-2.5 shadow-sm">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
          <Tag className="h-3.5 w-3.5 text-white" strokeWidth={1.75} />
        </span>

        <p className="text-xs md:text-sm font-medium tracking-wide text-white text-center">
          Use a discount coupon code{" "}
          <span className="font-bold text-white underline decoration-white/50 underline-offset-2">
            "{featured.code}"
          </span>{" "}
          and get <span className="font-bold text-white">{formatDiscount(featured)} discount</span> on every order.
        </p>
      </div>
    </div>
  );
}