import { useSyncExternalStore } from "react";

export interface Store<T> {
  get: () => T;
  set: (updater: T | ((prev: T) => T)) => void;
  subscribe: (fn: () => void) => () => void;
  getServer: () => T;
}

export function createPersistedStore<T>(key: string, initial: T): Store<T> {
  const listeners = new Set<() => void>();
  const read = (): T => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return initial;
      const parsed = JSON.parse(raw);
      // shallow merge object seeds to allow new default fields
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed) && initial && typeof initial === "object" && !Array.isArray(initial)) {
        return { ...(initial as any), ...parsed };
      }
      return parsed as T;
    } catch {
      return initial;
    }
  };
  let state: T = read();
  return {
    get: () => state,
    getServer: () => initial,
    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    set: (updater) => {
      const next = typeof updater === "function" ? (updater as (p: T) => T)(state) : updater;
      state = next;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {}
      }
      listeners.forEach((l) => l());
    },
  };
}

export function useStore<T, U>(store: Store<T>, selector: (s: T) => U): U {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.get()),
    () => selector(store.getServer())
  );
}
