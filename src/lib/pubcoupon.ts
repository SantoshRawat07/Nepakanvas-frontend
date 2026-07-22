"use client";

import { useSyncExternalStore } from "react";
import { API_BASE } from "./api";

export interface PublicCoupon {
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  createdAt: string;
}

let coupons: PublicCoupon[] = [];
let loaded = false, loading = false;
let error: string | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const EMPTY: PublicCoupon[] = [];

async function fetchActiveCoupons() {
  if (loading) return;
  loading = true; error = null; emit();
  try {
    const res = await fetch(`${API_BASE}/checkout/coupon/active`);
    const body = await res.json().catch(() => null);
    if (!res.ok) throw new Error(body?.message ?? "Failed to load coupons");
    coupons = body?.data ?? body;
    loaded = true;
  } catch (e: any) {
    error = e.message ?? "Failed to load coupons";
  } finally {
    loading = false; emit();
  }
}

export function useActiveCoupons() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); if (!loaded && !loading) fetchActiveCoupons(); return () => listeners.delete(cb); },
    () => coupons, () => EMPTY
  );
}

export function useActiveCouponsStatus() { return { loading, error }; }