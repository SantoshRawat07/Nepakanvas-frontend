import { createPersistedStore, useStore } from "./store";
import type { CartItem } from "./cart";

export interface Order {
  id: string;
  createdAt: number;
  items?: CartItem[];
  amount: number;
  artworkId?: string;
  title: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  paymentScreenshot?: string; // data URL
  paymentConfirmed?: boolean;
  delivered?: boolean;
  status: "new" | "in-progress" | "completed";
}

interface OrdersState {
  orders: Order[];
}

export const ordersStore = createPersistedStore<OrdersState>("nk_orders_v1", { orders: [] });
export const useOrders = () => useStore(ordersStore, (s) => s.orders);

export const orderActions = {
  create: (o: Omit<Order, "id" | "createdAt" | "status" | "paymentConfirmed" | "delivered">) => {
    const order: Order = { ...o, id: crypto.randomUUID(), createdAt: Date.now(), status: "new", paymentConfirmed: false, delivered: false };
    ordersStore.set((s) => ({ orders: [order, ...s.orders] }));
    return order;
  },
  setStatus: (id: string, status: Order["status"]) =>
    ordersStore.set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),
  confirmPayment: (id: string) =>
    ordersStore.set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, paymentConfirmed: true } : o)) })),
  markDelivered: (id: string) =>
    ordersStore.set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, delivered: true, status: "completed" } : o)) })),
  remove: (id: string) => ordersStore.set((s) => ({ orders: s.orders.filter((o) => o.id !== id) })),
};
