"use client";

import { useSyncExternalStore } from "react";
import { apiGet, apiPutForm } from "./api";

export interface PaymentSettings {
  qrCode: { url: string; public_id?: string };
  instructions: string;
}

let settings: PaymentSettings | null = null;
let loaded = false;
let loading = false;
let error: string | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

async function fetchSettings() {
  if (loading) return;
  loading = true;
  error = null;
  emit();
  try {
    settings = await apiGet<PaymentSettings | null>("/payment-settings");
    loaded = true;
  } catch (e: any) {
    error = e.message ?? "Failed to load payment settings";
  } finally {
    loading = false;
    emit();
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!loaded && !loading) fetchSettings();
  return () => listeners.delete(cb);
}

export function usePaymentSettings() {
  return useSyncExternalStore(subscribe, () => settings, () => null);
}

export function usePaymentSettingsStatus() {
  return { loading, error };
}

export const paymentSettingsActions = {
  refresh: fetchSettings,

  async save(input: { qrCode?: File; instructions?: string }) {
    const fd = new FormData();
    if (input.qrCode) fd.append("qrCode", input.qrCode);
    if (input.instructions !== undefined) fd.append("instructions", input.instructions);
    await apiPutForm("/admin/payment-settings", fd); // stays admin-gated — writes still need auth
    await fetchSettings();
  },
};