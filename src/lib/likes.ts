import { createPersistedStore, useStore } from "./store";

interface LikesState {
  items: string[]; // artwork ids
}

export const likesStore = createPersistedStore<LikesState>("nk_likes_v1", { items: [] });
export const useLikes = () => useStore(likesStore, (s) => s.items);

export const likesActions = {
  toggle: (id: string) => likesStore.set((s) => ({ items: s.items.includes(id) ? s.items.filter((x) => x !== id) : [...s.items, id] })),
  clear: () => likesStore.set({ items: [] }),
};
