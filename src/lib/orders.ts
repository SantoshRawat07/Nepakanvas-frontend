import { createPersistedStore, useStore } from "./store";

export interface Order {
  id: string;
  createdAt: number;
  artworkId?: string;
  title: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  status: "new" | "in-progress" | "completed";
}

interface OrdersState {
  orders: Order[];
}

export const ordersStore = createPersistedStore<OrdersState>("nk_orders_v1", { orders: [] });
export const useOrders = () => useStore(ordersStore, (s) => s.orders);

export const orderActions = {
  create: (o: Omit<Order, "id" | "createdAt" | "status">) => {
    const order: Order = { ...o, id: crypto.randomUUID(), createdAt: Date.now(), status: "new" };
    ordersStore.set((s) => ({ orders: [order, ...s.orders] }));
    return order;
  },
  setStatus: (id: string, status: Order["status"]) =>
    ordersStore.set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),
  remove: (id: string) => ordersStore.set((s) => ({ orders: s.orders.filter((o) => o.id !== id) })),
};
