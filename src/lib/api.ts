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
    credentials: "include",
  });
  const body = await parseBody(res);
  if (!res.ok) throw new Error(body?.message ?? `GET ${path} failed`);
  return body?.data ?? body;
}

export async function apiPostForm<T>(path: string, formData: FormData): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const body = await parseBody(res);
  if (!res.ok) throw new Error(body?.message ?? `POST ${path} failed`);
  return body?.data ?? body;
}

export async function apiPutForm<T>(path: string, formData: FormData): Promise<T> {
   console.log("PUT request to:", `${API_BASE}${path}`);
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });
  const body = await parseBody(res);
  if (!res.ok) throw new Error(body?.message ?? `PUT ${path} failed`);
  return body?.data ?? body;
}

export async function apiDelete<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    credentials: "include",
  });
  const body = await parseBody(res);
  if (!res.ok) throw new Error(body?.message ?? `DELETE ${path} failed`);
  return body?.data ?? body;
}
export async function apiDeleteJson<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const parsed = await parseBody(res);
  if (!res.ok) throw new Error(parsed?.message ?? `DELETE ${path} failed`);
  return parsed?.data ?? parsed;
}