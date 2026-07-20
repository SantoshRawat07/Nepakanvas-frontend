"use client";

import { useSyncExternalStore } from "react";
import { apiGet, apiPostForm, apiPutForm, apiDelete } from "./api";
import type { EditableArtwork } from "./content";

interface BackendProduct {
  _id: string;
  title: string;
  price: number;
  category: string;
  sizes?: string;
  description?: string;
  image: { url: string; public_id?: string };
}

function mapProduct(p: BackendProduct): EditableArtwork {
  return {
    id: p._id,
    title: p.title,
    image: p.image?.url ?? "",
    category: (p.category.charAt(0).toUpperCase() + p.category.slice(1)) as any,
    price: `Rs ${p.price}`,
    size: p.sizes ?? "",
    artist: "Studio NK",
    description: p.description ?? "",
    featured: true,
  };
}

let products: EditableArtwork[] = [];
let loaded = false;
let loading = false;
let error: string | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const EMPTY: EditableArtwork[] = [];

async function fetchProducts() {
  if (loading) return;
  loading = true;
  error = null;
  emit();
  try {
    const data = await apiGet<BackendProduct[]>("/products");
    products = data.map(mapProduct);
    loaded = true;
  } catch (e: any) {
    error = e.message ?? "Failed to load products";
  } finally {
    loading = false;
    emit();
  }
}

export function getProductsSnapshot(): EditableArtwork[] {
  if (!loaded && !loading) fetchProducts();
  return products;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!loaded && !loading) fetchProducts();
  return () => listeners.delete(cb);
}

export function useArtworksBackend() {
  return useSyncExternalStore(subscribe, () => products, () => EMPTY);
}

export function useProductsStatus() {
  return { loading, error };
}

export const productActions = {
  refresh: fetchProducts,

  async create(input: {
    title: string;
    price: number;
    category: string;
    size?: string;
    description?: string;
    photo: File;
  }) {
    const fd = new FormData();
    fd.append("title", input.title);
    fd.append("price", String(input.price));
    fd.append("category", input.category);
    if (input.size) fd.append("sizes", input.size);
    if (input.description) fd.append("description", input.description);
    fd.append("photo", input.photo);
    await apiPostForm("/admin/products", fd);
    await fetchProducts();
  },

  async update(id: string, input: {
    title?: string;
    price?: number;
    category?: string;
    size?: string;
    description?: string;
    photo?: File | null;
  }) {
    const fd = new FormData();
    if (input.title !== undefined) fd.append("title", input.title);
    if (input.price !== undefined) fd.append("price", String(input.price));
    if (input.category !== undefined) fd.append("category", input.category);
    if (input.size !== undefined) fd.append("sizes", input.size);
    if (input.description !== undefined) fd.append("description", input.description);
    if (input.photo) fd.append("photo", input.photo);
    await apiPutForm(`/admin/products/${id}`, fd);
    await fetchProducts();
  },

  async remove(id: string) {
    await apiDelete(`/admin/products/${id}`);
    await fetchProducts();
  },
};