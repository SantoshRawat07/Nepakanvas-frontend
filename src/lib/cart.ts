import { createPersistedStore, useStore } from "./store";

export interface CartItem {
  id: string;
  title: string;
  image: string;
  price: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
}

export const cartStore = createPersistedStore<CartState>("nk_cart_v1", { items: [] });

export const useCart = () => useStore(cartStore, (s) => s.items);
export const useCartCount = () => useStore(cartStore, (s) => s.items.reduce((n, i) => n + i.qty, 0));
export const useCartTotal = () =>
  useStore(cartStore, (s) => s.items.reduce((n, i) => n + priceToNumber(i.price) * i.qty, 0));

export function priceToNumber(p: string) {
  return parseInt(p.replace(/[^\d]/g, ""), 10) || 0;
}

export const cartActions = {
  add: (item: Omit<CartItem, "qty">) =>
    cartStore.set((s) => {
      const i = s.items.findIndex((x) => x.id === item.id);
      if (i >= 0) {
        const next = [...s.items];
        next[i] = { ...next[i], qty: next[i].qty + 1 };
        return { items: next };
      }
      return { items: [...s.items, { ...item, qty: 1 }] };
    }),
  remove: (id: string) => cartStore.set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  setQty: (id: string, qty: number) =>
    cartStore.set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
    })),
  clear: () => cartStore.set({ items: [] }),
};
