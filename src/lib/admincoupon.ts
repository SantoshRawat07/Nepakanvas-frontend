"use client";

import { useSyncExternalStore } from "react";
import { apiGet, apiDelete } from "./api";

export interface Coupon {
  _id: string;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  isActive: boolean;
  expiresAt?: string;
  minOrderAmount?: number;
  usageLimit?: number;
  usedCount: number;
  createdAt: string;
}

let coupons: Coupon[] = [];
let loaded = false, loading = false;
let error: string | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const EMPTY: Coupon[] = [];

async function fetchCoupons() {
  if (loading) return;
  loading = true; error = null; emit();
  try {
    coupons = await apiGet<Coupon[]>("/admin/coupons");
    loaded = true;
  } catch (e: any) {
    error = e.message ?? "Failed to load coupons";
  } finally {
    loading = false; emit();
  }
}

export function useCoupons() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); if (!loaded && !loading) fetchCoupons(); return () => listeners.delete(cb); },
    () => coupons, () => EMPTY
  );
}

export function useCouponsStatus() { return { loading, error }; }

async function postJson(path: string, body: any) {
  const { API_BASE } = await import("./api");
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST", credentials: "include",
    headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const parsed = await res.json().catch(() => null);
  if (!res.ok) throw new Error(parsed?.message ?? "Request failed");
  return parsed?.data;
}

async function putJson(path: string, body: any) {
  const { API_BASE } = await import("./api");
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT", credentials: "include",
    headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const parsed = await res.json().catch(() => null);
  if (!res.ok) throw new Error(parsed?.message ?? "Request failed");
  return parsed?.data;
}

async function patchNoBody(path: string) {
  const { API_BASE } = await import("./api");
  const res = await fetch(`${API_BASE}${path}`, { method: "PATCH", credentials: "include" });
  const parsed = await res.json().catch(() => null);
  if (!res.ok) throw new Error(parsed?.message ?? "Request failed");
}

export interface CouponInput {
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  expiresAt?: string;
  minOrderAmount?: number;
  usageLimit?: number;
}

export const couponActions = {
  refresh: fetchCoupons,
  create: async (input: CouponInput) => { await postJson("/admin/coupons", input); await fetchCoupons(); },
  update: async (id: string, input: Partial<CouponInput> & { isActive?: boolean }) => { await putJson(`/admin/coupons/${id}`, input); await fetchCoupons(); },
  toggle: async (id: string) => { await patchNoBody(`/admin/coupons/${id}/toggle`); await fetchCoupons(); },
  remove: async (id: string) => { await apiDelete(`/admin/coupons/${id}`); await fetchCoupons(); },
};