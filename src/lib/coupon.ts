"use client";

import { API_BASE } from "./api";

export interface AppliedCoupon {
  code: string;
  type: "percentage" | "flat";
  value: number;
  discountAmount: number;
  finalAmount: number;
}

interface BackendCouponResponse {
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  discountAmount: number;
  totalAmount: number;
}

export async function validateCoupon(code: string, amount: number): Promise<AppliedCoupon> {
  const res = await fetch(`${API_BASE}/checkout/coupon/validate`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, subtotal: amount }),
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(body?.message ?? "Invalid or expired coupon code");

  const data: BackendCouponResponse = body?.data ?? body;

  return {
    code: data.code,
    type: data.discountType,
    value: data.discountValue,
    discountAmount: data.discountAmount,
    finalAmount: data.totalAmount,
  };
}