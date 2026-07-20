"use client";

import { useSyncExternalStore } from "react";
import { apiGet, apiDelete, apiDeleteJson  } from "./api";

export interface CustomOrderPhoto {
  public_id: string;
  url: string;
}

export interface CustomOrder {
  _id: string;
  FullName: string;
  Email: string;
  Size: string;
  Budget: number;
  Deadline: string;
  Descriptions: string;
  photos: { photo: CustomOrderPhoto[] };
}

let customOrders: CustomOrder[] = [];
let loaded = false;
let loading = false;
let error: string | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const EMPTY: CustomOrder[] = [];

async function fetchCustomOrders() {
  if (loading) return;
  loading = true;
  error = null;
  emit();
  try {
    const data = await apiGet<any>("/admin/orders");
    customOrders = Array.isArray(data) ? data : (data?.orders ?? data?.data ?? []);
    loaded = true;
  } catch (e: any) {
    error = e.message ?? "Failed to load orders";
  } finally {
    loading = false;
    emit();
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!loaded && !loading) fetchCustomOrders();
  return () => listeners.delete(cb);
}

export function useCustomOrders() {
  return useSyncExternalStore(subscribe, () => customOrders, () => EMPTY);
}

export function useCustomOrdersStatus() {
  return { loading, error };
}

export const customOrderActions = {
  refresh: fetchCustomOrders,
async removeOne(id: string) {
    await apiDelete(`/admin/orders/${id}`);
    await fetchCustomOrders();
  },

  async removeMany(ids: string[]) {
    if (ids.length === 0) return;
    await apiDeleteJson(`/admin/orders`, { ids });
    await fetchCustomOrders();
  },

  async removeAll() {
    await apiDelete(`/admin/orders/all`);
    await fetchCustomOrders();
  },
};