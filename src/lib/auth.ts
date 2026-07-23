"use client";

import { createPersistedStore, useStore } from "./store";

export interface User {
  id: string;
  userName: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;        // ✅ add this — Google users have a profile picture
  isGoogleUser?: boolean; // ✅ add this — useful to hide "change password" UI for Google users
}

interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export const authStore = createPersistedStore<AuthState>("nk_auth_v2", {
  user: null,
  status: "idle",
});

export const useCurrentUser = () => useStore(authStore, (s) => s.user);
export const useAuthStatus = () => useStore(authStore, (s) => s.status);

async function apiRequest(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
  });
  let body: any = null;
  try { body = await res.json(); } catch { /* no body */ }
  if (!res.ok) throw new Error(body?.message ?? "Request failed");
  return body?.data ?? body;
}

export const authActions = {
  checkAuth: async (): Promise<void> => {
    authStore.set({ ...authStore.get(), status: "loading" });
    try {
      const data = await apiRequest("/auth/me", { method: "GET" });
      authStore.set({ user: data.user, status: "authenticated" });
    } catch {
      authStore.set({ user: null, status: "unauthenticated" });
    }
  },

  signup: async (userName: string, email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ userName, email, password }),
      });
      await authActions.checkAuth();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  },

  login: async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      await authActions.checkAuth();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  },

  // ✅ new — redirects browser to backend Google OAuth flow
  googleLogin: (): void => {
    // full page redirect — not a fetch call, because Google OAuth
    // requires actual browser navigation, not an API request
    window.location.href = `${API_BASE}/auth/google`;
  },

syncAfterGoogleLogin: async (): Promise<{ ok: boolean; user?: User; error?: string }> => {
    try {
      await authActions.checkAuth();
      const { user, status } = authStore.get();
      if (status !== "authenticated" || !user) {
        return { ok: false, error: "Not authenticated" };
      }
      return { ok: true, user };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiRequest("/auth/logout", { method: "GET" });
    } finally {
      authStore.set({ user: null, status: "unauthenticated" });
    }
  },
};