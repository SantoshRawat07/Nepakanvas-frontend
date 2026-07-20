"use client";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

async function parseBody(res: Response) {
  let body: any = null;
  try { body = await res.json(); } catch { /* no body */ }
  return body;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    credentials: "include", // sends the auth cookie, same as lib/auth.ts
  });
  const body = await parseBody(res);
  if (!res.ok) throw new Error(body?.message ?? `GET ${path} failed`);
  return body?.data ?? body;
}

export async function apiPostForm<T>(path: string, formData: FormData): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    credentials: "include",
    body: formData, // don't set Content-Type — browser adds the multipart boundary
  });
  const body = await parseBody(res);
  if (!res.ok) throw new Error(body?.message ?? `POST ${path} failed`);
  return body?.data ?? body;
}