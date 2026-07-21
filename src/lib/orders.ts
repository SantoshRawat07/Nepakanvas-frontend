"use client";

import { useSyncExternalStore } from "react";
import { apiGet, apiDelete, apiDeleteJson} from "./api";
import type { CartItem } from "./cart";

export type PaymentStatus = "pending" | "confirmed" | "invalid" | "not-received";
export type DeliveryStatus = "pending" | "packed" | "delivered" | "ordercancelled";
export interface Order {
  id: string;
  createdAt: number;
  items?: CartItem[];
  amount: number;
  artworkId?: string;
  originalAmount?: number;
  couponCode?: string;
  title: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  paymentScreenshot?: string;
  paymentConfirmed?: boolean;
  invalidPayment?: boolean;
  paymentNotReceived?: boolean;
  deliveryStatus: DeliveryStatus;
  status: "new" | "in-progress" | "completed";
}

interface BackendCheckoutOrder {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
  items: { productId: string; title: string; price: number; qty: number }[];
  subtotal: number;
  couponCode?: string;
  discountAmount: number;
  totalAmount: number;
  paymentImage?: { public_id: string; url: string };
  status: "new" | "in-progress" | "completed";
  paymentConfirmed: boolean;
  invalidPayment: boolean;
  paymentNotReceived: boolean;
  deliveryStatus: DeliveryStatus;
  createdAt: string;
}

function mapOrder(o: BackendCheckoutOrder): Order {
  return {
    id: o._id,
    createdAt: new Date(o.createdAt).getTime(),
    items: o.items?.map((it) => ({ id: it.productId, title: it.title, price: `Rs ${it.price}`, image: "", qty: it.qty })) as any,
    amount: o.totalAmount,
    originalAmount: o.subtotal,
    couponCode: o.couponCode,
    title: o.items?.length === 1 ? o.items[0].title : `${o.items?.length ?? 0} item(s)`,
    name: o.fullName,
    phone: o.phone,
    email: o.email,
    address: o.address,
    notes: o.notes ?? "",
    paymentScreenshot: o.paymentImage?.url,
    paymentConfirmed: o.paymentConfirmed,
    invalidPayment: o.invalidPayment,
    paymentNotReceived: o.paymentNotReceived,
    deliveryStatus: o.deliveryStatus,
    status: o.status,
  };
}

let orders: Order[] = [];
let loaded = false, loading = false;
let error: string | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const EMPTY: Order[] = [];

async function fetchOrders() {
  if (loading) return;
  loading = true; error = null; emit();
  try {
    const data = await apiGet<BackendCheckoutOrder[]>("/admin/checkout-orders");
    orders = data.map(mapOrder).sort((a, b) => b.createdAt - a.createdAt);
    loaded = true;
  } catch (e: any) {
    error = e.message ?? "Failed to load orders";
  } finally {
    loading = false; emit();
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!loaded && !loading) fetchOrders();
  return () => listeners.delete(cb);
}

export function useOrders() {
  return useSyncExternalStore(subscribe, () => orders, () => EMPTY);
}

export function useOrdersStatus() {
  return { loading, error };
}

async function patchNoBody(path: string) {
  const { API_BASE } = await import("./api");
  const res = await fetch(`${API_BASE}${path}`, { method: "PATCH", credentials: "include" });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(body?.message ?? "Request failed");
}

async function patchJson(path: string, body: any) {
  const { API_BASE } = await import("./api");
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const parsed = await res.json().catch(() => null);
  if (!res.ok) throw new Error(parsed?.message ?? "Request failed");
}

export const orderActions = {
  refresh: fetchOrders,

  setStatus: async (id: string, status: Order["status"]) => {
    await patchJson(`/admin/checkout-orders/${id}/status`, { status });
    await fetchOrders();
  },
  removeMany: async (ids: string[]) => {
  if (ids.length === 0) return;
  await apiDeleteJson(`/admin/checkout-orders`, { ids });
  await fetchOrders();
},
removeAll: async () => {
  await apiDelete(`/admin/checkout-orders/all`);
  await fetchOrders();
},

  setPaymentStatus: async (id: string, paymentStatus: PaymentStatus) => {
    if (paymentStatus === "confirmed") await patchNoBody(`/admin/checkout-orders/${id}/confirm-payment`);
    else if (paymentStatus === "invalid") await patchNoBody(`/admin/checkout-orders/${id}/invalid-payment`);
    else if (paymentStatus === "not-received") await patchNoBody(`/admin/checkout-orders/${id}/payment-not-received`);
    // "pending" has no backend reset route yet — see note below
    await fetchOrders();
  },

  setDeliveryStatus: async (id: string, deliveryStatus: DeliveryStatus) => {
  await patchJson(`/admin/checkout-orders/${id}/delivery-status`, { deliveryStatus });
  await fetchOrders();
},
  remove: async (id: string) => {
    await apiDelete(`/admin/checkout-orders/${id}`);
    await fetchOrders();
  },
};
export function getPaymentStatus(o: Order): PaymentStatus {
  if (o.paymentConfirmed) return "confirmed";
  if (o.invalidPayment) return "invalid";
  if (o.paymentNotReceived) return "not-received";
  return "pending";
}