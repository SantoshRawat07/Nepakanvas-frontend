import { createPersistedStore, useStore } from "./store";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // frontend-only demo, do NOT do this in production
  role: "user" | "admin";
}

interface AuthState {
  users: User[];
  currentUserId: string | null;
}

const ADMIN_SEED: User = {
  id: "admin-1",
  name: "Studio Admin",
  email: "admin@nepakanvas.com",
  password: "admin123",
  role: "admin",
};

export const authStore = createPersistedStore<AuthState>("nk_auth_v1", {
  users: [ADMIN_SEED],
  currentUserId: null,
});

// ensure admin seed always present
if (typeof window !== "undefined") {
  const s = authStore.get();
  if (!s.users.some((u) => u.email === ADMIN_SEED.email)) {
    authStore.set({ ...s, users: [ADMIN_SEED, ...s.users] });
  }
}

export const useCurrentUser = () =>
  useStore(authStore, (s) => s.users.find((u) => u.id === s.currentUserId) ?? null);

export const authActions = {
  signup: (name: string, email: string, password: string): { ok: boolean; error?: string } => {
    const state = authStore.get();
    if (state.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "An account with that email already exists." };
    }
    const user: User = { id: crypto.randomUUID(), name, email, password, role: "user" };
    authStore.set({ users: [...state.users, user], currentUserId: user.id });
    return { ok: true };
  },
  login: (email: string, password: string): { ok: boolean; error?: string } => {
    const state = authStore.get();
    const user = state.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return { ok: false, error: "Invalid email or password." };
    authStore.set({ ...state, currentUserId: user.id });
    return { ok: true };
  },
  logout: () => authStore.set({ ...authStore.get(), currentUserId: null }),
};
