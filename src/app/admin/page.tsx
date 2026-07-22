"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { Section } from "@/components/ui-custom/Section";
import { useTeamBackend, useTeamStatus, teamActions } from "@/lib/teams";
import { CTAButton } from "@/components/ui-custom/CTAButton";
import { useCurrentUser } from "@/lib/auth";
import { useCoupons, useCouponsStatus, couponActions, type Coupon, type CouponInput } from "@/lib/admincoupon";
import { Tag, ToggleLeft, ToggleRight } from "lucide-react"; // add to your existing lucide-react import line
import {
  contentActions, useArtworks, useHero, useTeam,
  type EditableArtwork, type TeamMember,
} from "@/lib/content";
import { productActions } from "@/lib/products";
import { CATEGORIES } from "@/lib/artworks";
import { cn } from "@/lib/utils";

import { useCustomOrders, useCustomOrdersStatus, customOrderActions } from "@/lib/customorder";
import { Pencil, Trash2, Plus, LayoutDashboard, Palette, Users, Home as HomeIcon, ClipboardList, ListOrdered, X, Download, Maximize2 } from "lucide-react";
import { useOrders, useOrdersStatus, orderActions, getPaymentStatus, type Order, type PaymentStatus, type DeliveryStatus } from "@/lib/orders";
type Tab = "hero" | "artworks" | "team" | "orders" | "customOrders" | "coupons";
function toDownloadUrl(url: string): string {
  if (!url) return url;
  return url.includes("/upload/")
    ? url.replace("/upload/", "/upload/fl_attachment/")
    : url;
}
const DELIVERY: DeliveryStatus[] = ["pending", "packed", "delivered", "ordercancelled"];
async function downloadImage(url: string, filename: string) {
  try {
    const res = await fetch(toDownloadUrl(url));
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("Download failed:", err);
    // fallback: open in new tab if fetch/blob fails (e.g. CORS)
    window.open(url, "_blank");
  }
}
export default function AdminPage() {
  const user = useCurrentUser();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("hero");

  if (!user) {
    return (
      <SiteShell>
        <Section tone="surface" size="lg" className="pt-32">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-4xl font-bold">Admin area</h1>
            <p className="mt-3 text-muted-foreground">Please sign in with an admin account to continue.</p>
            <CTAButton onClick={() => router.push("/auth/login")} className="mt-6">Sign in</CTAButton>
          </div>
        </Section>
      </SiteShell>
    );
  }

  if (user.role !== "admin") {
    return (
      <SiteShell>
        <Section tone="surface" size="lg" className="pt-32">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-4xl font-bold">Access denied</h1>
            <p className="mt-3 text-muted-foreground">This area is reserved for the studio admin.</p>
            <Link href="/" className="mt-6 inline-block underline underline-offset-4">Return home</Link>
          </div>
        </Section>
      </SiteShell>
    );
  }

  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: "hero", label: "Home hero", icon: HomeIcon },
    { id: "artworks", label: "Artworks", icon: Palette },
    { id: "team", label: "Team", icon: Users },
    { id: "orders", label: "Orders", icon: ClipboardList },
    { id: "customOrders", label: "Custom Orders", icon: ListOrdered },
    { id: "coupons", label: "Coupons", icon: Tag}
  ];
  return (
    <SiteShell>
      <Section tone="surface" className="pt-28 md:pt-36" size="sm">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-6 w-6" strokeWidth={1.5} />
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Studio admin</p>
        </div>
        <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight">Manage the site.</h1>
        <p className="mt-3 text-muted-foreground max-w-xl">Edit the home hero, add or update artworks, manage the team and review incoming orders.</p>
      </Section>

      <Section size="sm">
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all",
                tab === t.id ? "bg-foreground text-background border-foreground" : "bg-background border-border hover:border-foreground"
              )}>
              <t.icon className="h-4 w-4" strokeWidth={1.5} /> {t.label}
            </button>
          ))}
        </div>

        {tab === "hero" && <HeroEditor />}
        {tab === "artworks" && <ArtworksEditor />}
        {tab === "team" && <TeamEditor />}
        {tab === "orders" && <OrdersManager />}
        {tab === "customOrders" && <CustomOrdersManager />}
        {tab === "coupons" && <CouponsManager />}
      </Section>
    </SiteShell>
  );
}

function HeroEditor() {
  const hero = useHero();
  const [form, setForm] = useState(hero);
  useEffect(() => setForm(hero), [hero]);
  const [saved, setSaved] = useState(false);

  return (
    <div className="max-w-2xl rounded-3xl border border-border p-6 space-y-4">
      <Field label="Eyebrow" value={form.eyebrow} onChange={(v) => setForm({ ...form, eyebrow: v })} />
      <Field label="Title (use new lines for line breaks)" value={form.title} onChange={(v) => setForm({ ...form, title: v })} textarea rows={3} />
      <Field label="Subtitle" value={form.subtitle} onChange={(v) => setForm({ ...form, subtitle: v })} textarea rows={3} />
      <div className="flex gap-3">
        <CTAButton
          className="hover:bg-black hover:text-white" onClick={() => { contentActions.updateHero(form); setSaved(true); setTimeout(() => setSaved(false), 1500); }}>
          {saved ? "Saved ✓" : "Save changes"}
        </CTAButton>
        <button onClick={() => setForm(hero)} className="text-sm text-muted-foreground hover:text-foreground">Discard</button>
      </div>
    </div>
  );
}

const EMPTY_ART: EditableArtwork = {
  id: "", title: "", image: "", category: "Canvas", price: "Rs 0", size: '3"×3"',
  artist: "Studio NK", description: "", featured: true,
};

function ArtworksEditor() {
  const artworks = useArtworks();
  const [editing, setEditing] = useState<EditableArtwork | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isNew = editing ? !artworks.some((a) => a.id === editing.id) : false;

  return (
    <div className="grid lg:grid-cols-[1fr_420px] gap-6">
      <div className="space-y-3">
        <button
          onClick={() => { setEditing({ ...EMPTY_ART, id: crypto.randomUUID() }); setPhotoFile(null); }}
          className="inline-flex items-center gap-2 rounded-full border border-dashed border-border px-5 py-3 text-sm font-medium hover:border-foreground w-full justify-center"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} /> New artwork
        </button>
        {artworks.map((a) => (
          <div key={a.id} className="flex items-center gap-4 rounded-2xl border border-border p-3">
            <img src={a.image} alt="" className="h-14 w-14 object-cover rounded-xl bg-secondary" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.category} · {a.price}</p>
            </div>
            <button
              onClick={() => { setEditing(a); setPhotoFile(null); }}
              className="h-9 w-9 rounded-full hover:bg-secondary inline-flex items-center justify-center"
              aria-label="Edit"
            >
              <Pencil className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              disabled={deletingId === a.id}
              onClick={async () => {
                if (!confirm(`Delete "${a.title}"?`)) return;
                setDeletingId(a.id);
                try {
                  await productActions.remove(a.id);
                  if (editing?.id === a.id) setEditing(null);
                } catch (err: any) {
                  alert(err.message ?? "Failed to delete product");
                } finally {
                  setDeletingId(null);
                }
              }}
              className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive inline-flex items-center justify-center disabled:opacity-40"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="rounded-3xl border border-border p-6 space-y-4 h-fit lg:sticky lg:top-28">
          <h3 className="font-bold text-lg">{isNew ? "New artwork" : "Edit artwork"}</h3>

          {photoFile ? (
            <img src={URL.createObjectURL(photoFile)} alt="" className="w-full aspect-[4/5] object-cover rounded-2xl bg-secondary" />
          ) : editing.image ? (
            <img src={editing.image} alt="" className="w-full aspect-[4/5] object-cover rounded-2xl bg-secondary" />
          ) : null}

          <Field label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />

          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Photo {!isNew && "(leave empty to keep current)"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              className="mt-2 w-full text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Category</label>
              <select
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value as EditableArtwork["category"] })}
                className="mt-2 w-full rounded-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground"
              >
                {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Field label="Price" value={editing.price} onChange={(v) => setEditing({ ...editing, price: v })} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Size" value={editing.size} onChange={(v) => setEditing({ ...editing, size: v })} />
            <Field label="Artist" value={editing.artist} onChange={(v) => setEditing({ ...editing, artist: v })} />
          </div>

          <Field label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} textarea rows={4} />

          <div className="flex gap-3 pt-2">
            <CTAButton
              className="hover:bg-black hover:text-white"
              disabled={saving}
              onClick={async () => {
                if (!editing.title) return alert("Title is required");
                if (isNew && !photoFile) return alert("A photo is required for new artwork");
                const price = parseInt(editing.price.replace(/[^\d]/g, ""), 10) || 0;
                setSaving(true);
                try {
                  if (isNew) {
                    await productActions.create({
                      title: editing.title,
                      price,
                      category: editing.category.toLowerCase(),
                      size: editing.size,
                      description: editing.description,
                      photo: photoFile!,
                    });
                  } else {
                    await productActions.update(editing.id, {
                      title: editing.title,
                      price,
                      category: editing.category.toLowerCase(),
                      size: editing.size,
                      description: editing.description,
                      photo: photoFile,
                    });
                  }
                  setEditing(null);
                  setPhotoFile(null);
                } catch (err: any) {
                  alert(err.message ?? "Failed to save product");
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? "Saving…" : "Save"}
            </CTAButton>
            <button onClick={() => { setEditing(null); setPhotoFile(null); }} className="text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

const EMPTY_TEAM: TeamMember = { id: "", name: "", role: "", bio: "", image: "" };

function TeamEditor() {
  const team = useTeamBackend();
  const { loading, error } = useTeamStatus();
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isNew = editing ? !team.some((m) => m.id === editing.id) : false;

  return (
    <div className="grid lg:grid-cols-[1fr_420px] gap-6">
      <div className="space-y-3">
        <button
          onClick={() => { setEditing({ ...EMPTY_TEAM, id: crypto.randomUUID() }); setPhotoFile(null); }}
          className="inline-flex items-center gap-2 rounded-full border border-dashed border-border px-5 py-3 text-sm font-medium hover:border-foreground w-full justify-center"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} /> New team member
        </button>

        {loading && team.length === 0 && (
          <p className="text-sm text-muted-foreground">Loading team…</p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {team.map((m) => (
          <div key={m.id} className="flex items-center gap-4 rounded-2xl border border-border p-3">
            <img src={m.image} alt="" className="h-14 w-14 object-cover rounded-full bg-secondary" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{m.name}</p>
              <p className="text-xs text-muted-foreground truncate">{m.role}</p>
            </div>
            <button
              onClick={() => { setEditing(m); setPhotoFile(null); }}
              className="h-9 w-9 rounded-full hover:bg-secondary inline-flex items-center justify-center"
              aria-label="Edit"
            >
              <Pencil className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              disabled={deletingId === m.id}
              onClick={async () => {
                if (!confirm(`Remove ${m.name}?`)) return;
                setDeletingId(m.id);
                try {
                  await teamActions.remove(m.id);
                  if (editing?.id === m.id) setEditing(null);
                } catch (err: any) {
                  alert(err.message ?? "Failed to remove team member");
                } finally {
                  setDeletingId(null);
                }
              }}
              className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive inline-flex items-center justify-center disabled:opacity-40"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="rounded-3xl border border-border p-6 space-y-4 h-fit lg:sticky lg:top-28">
          <h3 className="font-bold text-lg">{isNew ? "New member" : "Edit member"}</h3>

          {photoFile ? (
            <img src={URL.createObjectURL(photoFile)} alt="" className="w-full aspect-square object-cover rounded-2xl bg-secondary" />
          ) : editing.image ? (
            <img src={editing.image} alt="" className="w-full aspect-square object-cover rounded-2xl bg-secondary" />
          ) : null}

          <Field label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
          <Field label="Role" value={editing.role} onChange={(v) => setEditing({ ...editing, role: v })} />

          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Profile photo {!isNew && "(leave empty to keep current)"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              className="mt-2 w-full text-sm"
            />
          </div>

          <Field label="Bio" value={editing.bio} onChange={(v) => setEditing({ ...editing, bio: v })} textarea rows={3} />

          <div className="flex gap-3 pt-2">
            <CTAButton
              className="hover:bg-black hover:text-white"
              disabled={saving}
              onClick={async () => {
                if (!editing.name) return alert("Name is required");
                if (!editing.role) return alert("Title is required");
                if (!editing.bio) return alert("Description is required");
                if (isNew && !photoFile) return alert("A profile photo is required for new members");

                setSaving(true);
                try {
                  if (isNew) {
                    await teamActions.create({
                      name: editing.name,
                      title: editing.role,
                      description: editing.bio,
                      profileImage: photoFile!,
                    });
                  } else {
                    await teamActions.update(editing.id, {
                      name: editing.name,
                      title: editing.role,
                      description: editing.bio,
                      profileImage: photoFile,
                    });
                  }
                  setEditing(null);
                  setPhotoFile(null);
                } catch (err: any) {
                  alert(err.message ?? "Failed to save team member");
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? "Saving…" : "Save"}
            </CTAButton>
            <button onClick={() => { setEditing(null); setPhotoFile(null); }} className="text-sm text-muted-foreground hover:text-foreground">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersManager() {
  const orders = useOrders();
  const { loading, error } = useOrdersStatus();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const STATUS: Order["status"][] = ["new", "in-progress", "completed"];
  const PAYMENT: PaymentStatus[] = ["pending", "confirmed", "invalid", "not-received"];
  const DELIVERY: DeliveryStatus[] = ["pending", "packed", "delivered", "ordercancelled"];
  const [lightbox, setLightbox] = useState<{ url: string; name: string } | null>(null);

  const filtered = orders.filter((o) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return o.name?.toLowerCase().includes(s) || o.email?.toLowerCase().includes(s) || o.phone?.toLowerCase().includes(s);
  });

  const allFilteredSelected = filtered.length > 0 && filtered.every((o) => selected.has(o.id));

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAllFiltered = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) filtered.forEach((o) => next.delete(o.id));
      else filtered.forEach((o) => next.add(o.id));
      return next;
    });
  };

  const act = async (fn: () => Promise<void>, id: string) => {
    setBusyId(id);
    try { await fn(); } catch (e: any) { alert(e.message ?? "Action failed"); }
    finally { setBusyId(null); }
  };

  const deleteSingle = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    await act(() => orderActions.remove(id), id);
    setSelected((prev) => { const next = new Set(prev); next.delete(id); return next; });
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} selected order(s)? This can't be undone.`)) return;
    setBulkBusy(true);
    try {
      await orderActions.removeMany(Array.from(selected));
      setSelected(new Set());
    } catch (e: any) {
      alert(e.message ?? "Failed to delete selected orders");
    } finally {
      setBulkBusy(false);
    }
  };

  const deleteAll = async () => {
    if (!confirm(`Delete ALL ${orders.length} orders? This can't be undone.`)) return;
    setBulkBusy(true);
    try {
      await orderActions.removeAll();
      setSelected(new Set());
    } catch (e: any) {
      alert(e.message ?? "Failed to delete all orders");
    } finally {
      setBulkBusy(false);
    }
  };

  if (loading && orders.length === 0) {
    return <div className="rounded-3xl border border-border p-10 text-center text-muted-foreground">Loading orders…</div>;
  }
  if (error) {
    return <div className="rounded-3xl border border-border p-10 text-center text-destructive">{error}</div>;
  }
  if (orders.length === 0) {
    return <div className="rounded-3xl border border-border p-10 text-center text-muted-foreground">No orders yet.</div>;
  }
const EMPTY_COUPON: CouponInput = {
  code: "",
  discountType: "percentage",
  discountValue: 10,
  expiresAt: "",
  minOrderAmount: 0,
  usageLimit: undefined,
};

function CouponsManager() {
  const coupons = useCoupons();
  const { loading, error } = useCouponsStatus();
  const [editing, setEditing] = useState<{ id: string | null; form: CouponInput } | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const startNew = () => setEditing({ id: null, form: { ...EMPTY_COUPON } });

  const startEdit = (c: Coupon) =>
    setEditing({
      id: c._id,
      form: {
        code: c.code,
        discountType: c.discountType,
        discountValue: c.discountValue,
        expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : "",
        minOrderAmount: c.minOrderAmount ?? 0,
        usageLimit: c.usageLimit,
      },
    });

  const save = async () => {
    if (!editing) return;
    const { form, id } = editing;
    if (!form.code.trim()) return alert("Coupon code is required");
    if (!form.discountValue || form.discountValue <= 0) return alert("Discount value must be greater than 0");

    setSaving(true);
    try {
      const payload = {
        ...form,
        code: form.code.trim().toUpperCase(),
        expiresAt: form.expiresAt || undefined,
        usageLimit: form.usageLimit || undefined,
      };
      if (id) await couponActions.update(id, payload);
      else await couponActions.create(payload);
      setEditing(null);
    } catch (e: any) {
      alert(e.message ?? "Failed to save coupon");
    } finally {
      setSaving(false);
    }
  };

  const act = async (fn: () => Promise<void>, id: string) => {
    setBusyId(id);
    try { await fn(); } catch (e: any) { alert(e.message ?? "Action failed"); }
    finally { setBusyId(null); }
  };

  if (loading && coupons.length === 0) {
    return <div className="rounded-3xl border border-border p-10 text-center text-muted-foreground">Loading coupons…</div>;
  }
  if (error) {
    return <div className="rounded-3xl border border-border p-10 text-center text-destructive">{error}</div>;
  }

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-6">
      <div className="space-y-3">
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-full border border-dashed border-border px-5 py-3 text-sm font-medium hover:border-foreground w-full justify-center"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} /> New coupon
        </button>

        {coupons.length === 0 ? (
          <div className="rounded-3xl border border-border p-10 text-center text-muted-foreground">No coupons yet.</div>
        ) : (
          coupons.map((c) => {
            const expired = !!c.expiresAt && new Date(c.expiresAt).getTime() < Date.now();
            const limitReached = c.usageLimit !== undefined && c.usedCount >= c.usageLimit;
            return (
              <div key={c._id} className="rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">{c.code}</p>
                    <p className="text-sm text-muted-foreground">
                      {c.discountType === "percentage" ? `${c.discountValue}% off` : `Rs ${c.discountValue} off`}
                      {c.minOrderAmount ? ` · min Rs ${c.minOrderAmount}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Used {c.usedCount}{c.usageLimit !== undefined ? ` / ${c.usageLimit}` : " (unlimited)"}
                      {c.expiresAt ? ` · expires ${new Date(c.expiresAt).toLocaleDateString()}` : ""}
                    </p>
                    <div className="mt-2 flex gap-1.5 flex-wrap">
                      {!c.isActive && <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">Disabled</span>}
                      {expired && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Expired</span>}
                      {limitReached && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Limit reached</span>}
                      {c.isActive && !expired && !limitReached && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 items-end shrink-0">
                    <button onClick={() => startEdit(c)} className="text-xs underline underline-offset-4 text-muted-foreground hover:text-foreground">
                      Edit
                    </button>
                    <button
                      disabled={busyId === c._id}
                      onClick={() => act(() => couponActions.toggle(c._id), c._id)}
                      className="text-xs underline underline-offset-4 text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                      {c.isActive ? "Disable" : "Enable"}
                    </button>
                    <button
                      disabled={busyId === c._id}
                      onClick={() => { if (confirm(`Delete coupon ${c.code}?`)) act(() => couponActions.remove(c._id), c._id); }}
                      className="text-xs text-destructive underline underline-offset-4 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {editing && (
        <div className="rounded-3xl border border-border p-6 space-y-4 h-fit lg:sticky lg:top-28">
          <h3 className="font-bold text-lg">{editing.id ? "Edit coupon" : "New coupon"}</h3>

          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Code</label>
            <input
              value={editing.form.code}
              onChange={(e) => setEditing({ ...editing, form: { ...editing.form, code: e.target.value.toUpperCase() } })}
              className="mt-2 w-full rounded-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Type</label>
              <select
                value={editing.form.discountType}
                onChange={(e) => setEditing({ ...editing, form: { ...editing.form, discountType: e.target.value as "percentage" | "flat" } })}
                className="mt-2 w-full rounded-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground"
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat amount</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Value {editing.form.discountType === "percentage" ? "(%)" : "(Rs)"}
              </label>
              <input
                type="number"
                value={editing.form.discountValue}
                onChange={(e) => setEditing({ ...editing, form: { ...editing.form, discountValue: Number(e.target.value) } })}
                className="mt-2 w-full rounded-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Minimum order amount (Rs)</label>
            <input
              type="number"
              value={editing.form.minOrderAmount ?? 0}
              onChange={(e) => setEditing({ ...editing, form: { ...editing.form, minOrderAmount: Number(e.target.value) } })}
              className="mt-2 w-full rounded-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Usage limit (leave empty = unlimited)</label>
            <input
              type="number"
              value={editing.form.usageLimit ?? ""}
              onChange={(e) => setEditing({ ...editing, form: { ...editing.form, usageLimit: e.target.value ? Number(e.target.value) : undefined } })}
              className="mt-2 w-full rounded-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground"
              placeholder="e.g. 50"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Expiry date (leave empty = never)</label>
            <input
              type="date"
              value={editing.form.expiresAt ?? ""}
              onChange={(e) => setEditing({ ...editing, form: { ...editing.form, expiresAt: e.target.value } })}
              className="mt-2 w-full rounded-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <CTAButton className="hover:bg-black hover:text-white" disabled={saving} onClick={save}>
              {saving ? "Saving…" : "Save"}
            </CTAButton>
            <button onClick={() => setEditing(null)} className="text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or phone…"
          className="flex-1 min-w-[200px] rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:border-foreground"
        />
        {selected.size > 0 && (
          <button
            disabled={bulkBusy}
            onClick={deleteSelected}
            className="text-sm bg-destructive text-white px-4 py-2 rounded-full disabled:opacity-50"
          >
            Delete selected ({selected.size})
          </button>
        )}
        <button
          disabled={bulkBusy}
          onClick={deleteAll}
          className="text-sm border border-destructive text-destructive px-4 py-2 rounded-full hover:bg-destructive/10 disabled:opacity-50"
        >
          Delete all
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-border p-10 text-center text-muted-foreground">No orders match your search.</div>
      ) : (
        <div className="rounded-3xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-left">
                <th className="p-4 w-10">
                  <input type="checkbox" checked={allFilteredSelected} onChange={toggleAllFiltered} />
                </th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Order</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Payment proof</th>
                <th className="p-4 font-semibold">Order status</th>
                <th className="p-4 font-semibold">Payment status</th>
                <th className="p-4 font-semibold">Delivery status</th>
                <th className="p-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <React.Fragment key={o.id}>
                  <tr className="border-b border-border last:border-0 align-top">
                    <td className="p-4">
                      <input type="checkbox" checked={selected.has(o.id)} onChange={() => toggleOne(o.id)} />
                    </td>
                    <td className="p-4">
                      <p className="font-semibold">{o.name}</p>
                      <p className="text-xs text-muted-foreground">{o.phone}</p>
                      <p className="text-xs text-muted-foreground">{o.email}</p>
                    </td>
                    <td className="p-4">
                      <button onClick={() => setExpandedId(expandedId === o.id ? null : o.id)} className="text-left hover:underline underline-offset-4">
                        {o.title}
                      </button>
                      <p className="text-xs text-muted-foreground mt-0.5">{new Date(o.createdAt).toLocaleDateString()}</p>
                      {o.couponCode && <p className="text-xs text-muted-foreground">Coupon: {o.couponCode}</p>}
                    </td>
                    <td className="p-4 whitespace-nowrap font-medium">Rs {o.amount?.toLocaleString()}</td>
                    <td className="p-4">
                      {o.paymentScreenshot ? (
                        <button onClick={() => setLightbox({ url: o.paymentScreenshot!, name: `${o.name}-payment` })}>
                          <img
                            src={o.paymentScreenshot}
                            alt="proof"
                            className="h-14 w-14 object-cover rounded-lg border border-border hover:opacity-80 transition-opacity cursor-zoom-in"
                          />
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <select
                        disabled={busyId === o.id}
                        value={o.status}
                        onChange={(e) => act(() => orderActions.setStatus(o.id, e.target.value as Order["status"]), o.id)}
                        className="rounded-full border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:border-foreground disabled:opacity-50"
                      >
                        {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="p-4">
                      <select
                        disabled={busyId === o.id}
                        value={getPaymentStatus(o)}
                        onChange={(e) => act(() => orderActions.setPaymentStatus(o.id, e.target.value as PaymentStatus), o.id)}
                        className="rounded-full border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:border-foreground disabled:opacity-50"
                      >
                        {PAYMENT.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </td>
                    <td className="p-4">
                      <select
                        disabled={busyId === o.id}
                        value={o.deliveryStatus}
                        onChange={(e) => act(() => orderActions.setDeliveryStatus(o.id, e.target.value as DeliveryStatus), o.id)}
                        className="rounded-full border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:border-foreground disabled:opacity-50"
                      >
                        {DELIVERY.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </td>
                    <td className="p-4">
                      <button
                        disabled={busyId === o.id}
                        onClick={() => deleteSingle(o.id)}
                        className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive inline-flex items-center justify-center disabled:opacity-40"
                        aria-label="Delete order"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </td>
                  </tr>
                  {expandedId === o.id && (
                    <tr className="border-b border-border bg-secondary/20">
                      <td colSpan={9} className="p-4">
                        {o.address && <p className="text-sm"><span className="text-muted-foreground">Address:</span> {o.address}</p>}
                        {o.notes && <p className="text-sm mt-1"><span className="text-muted-foreground">Notes:</span> {o.notes}</p>}
                        {o.couponCode && (
                          <p className="text-sm mt-1"><span className="text-muted-foreground">Subtotal:</span> Rs {o.originalAmount?.toLocaleString()}</p>
                        )}
                        {o.items && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">Items</p>
                            <ul className="mt-1 space-y-1">
                              {o.items.map((it) => (
                                <li key={(it as any).id} className="text-sm">{(it as any).title} — {(it as any).price} × {(it as any).qty ?? 1}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {o.paymentScreenshot && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">Payment proof</p>
                            <button onClick={() => setLightbox({ url: o.paymentScreenshot!, name: `${o.name}-payment` })} className="mt-1">
                              <img
                                src={o.paymentScreenshot}
                                alt="proof"
                                className="h-32 object-contain rounded-md border border-border hover:opacity-80 transition-opacity cursor-zoom-in"
                              />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
       {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.url} alt="" className="max-w-full max-h-[85vh] rounded-xl object-contain" />
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-black" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
function CustomOrdersManager() {
  const orders = useCustomOrders();
  const { loading, error } = useCustomOrdersStatus();
  const [lightbox, setLightbox] = useState<{ url: string; name: string } | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const filtered = orders.filter((o) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return o.FullName?.toLowerCase().includes(s) || o.Email?.toLowerCase().includes(s);
  });

  const allFilteredSelected = filtered.length > 0 && filtered.every((o) => selected.has(o._id));

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAllFiltered = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filtered.forEach((o) => next.delete(o._id));
      } else {
        filtered.forEach((o) => next.add(o._id));
      }
      return next;
    });
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} selected order(s)? This can't be undone.`)) return;
    setBusy(true);
    try {
      await customOrderActions.removeMany(Array.from(selected));
      setSelected(new Set());
    } catch (err: any) {
      alert(err.message ?? "Failed to delete selected orders");
    } finally {
      setBusy(false);
    }
  };

  const deleteAll = async () => {
    if (!confirm(`Delete ALL ${orders.length} custom orders? This can't be undone.`)) return;
    setBusy(true);
    try {
      await customOrderActions.removeAll();
      setSelected(new Set());
    } catch (err: any) {
      alert(err.message ?? "Failed to delete all orders");
    } finally {
      setBusy(false);
    }
  };

  const deleteSingle = async (id: string, name: string) => {
    if (!confirm(`Delete order from "${name}"?`)) return;
    setBusy(true);
    try {
      await customOrderActions.removeOne(id);
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err: any) {
      alert(err.message ?? "Failed to delete order");
    } finally {
      setBusy(false);
    }
  };

  if (loading && orders.length === 0) {
    return <div className="rounded-3xl border border-border p-10 text-center text-muted-foreground">Loading orders…</div>;
  }

  if (error) {
    return <div className="rounded-3xl border border-border p-10 text-center text-destructive">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="rounded-3xl border border-border p-10 text-center text-muted-foreground">No custom orders yet.</div>;
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="flex-1 min-w-[200px] rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:border-foreground"
        />
        {selected.size > 0 && (
          <button
            disabled={busy}
            onClick={deleteSelected}
            className="text-sm bg-destructive text-white px-4 py-2 rounded-full disabled:opacity-50"
          >
            Delete selected ({selected.size})
          </button>
        )}
        <button
          disabled={busy}
          onClick={deleteAll}
          className="text-sm border border-destructive text-destructive px-4 py-2 rounded-full hover:bg-destructive/10 disabled:opacity-50"
        >
          Delete all
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-border p-10 text-center text-muted-foreground">No orders match your search.</div>
      ) : (
        <div className="rounded-3xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-left">
                <th className="p-4 w-10">
                  <input type="checkbox" checked={allFilteredSelected} onChange={toggleAllFiltered} />
                </th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Size</th>
                <th className="p-4 font-semibold">Budget</th>
                <th className="p-4 font-semibold">Deadline</th>
                <th className="p-4 font-semibold">Description</th>
                <th className="p-4 font-semibold">Reference photos</th>
                <th className="p-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o._id} className="border-b border-border last:border-0 align-top">
                  <td className="p-4">
                    <input type="checkbox" checked={selected.has(o._id)} onChange={() => toggleOne(o._id)} />
                  </td>
                  <td className="p-4">
                    <p className="font-semibold">{o.FullName}</p>
                    <p className="text-xs text-muted-foreground">{o.Email}</p>
                  </td>
                  <td className="p-4 whitespace-nowrap">{o.Size}</td>
                  <td className="p-4 whitespace-nowrap font-medium">Rs {o.Budget?.toLocaleString()}</td>
                  <td className="p-4 whitespace-nowrap">{new Date(o.Deadline).toLocaleDateString()}</td>
                  <td className="p-4 max-w-xs">
                    <p className="text-muted-foreground">{o.Descriptions}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 flex-wrap">
                      {o.photos?.photo?.map((p, i) => (
                        <div key={p.public_id} className="relative group h-14 w-14 rounded-lg border border-border overflow-hidden">
                          <button
                            onClick={() => setLightbox({ url: p.url, name: `${o.FullName}-photo-${i + 1}` })}
                            className="h-full w-full block"
                          >
                            <img src={p.url} alt="" className="h-full w-full object-cover" />
                            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                              <Maximize2 className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.75} />
                            </span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadImage(p.url, `${o.FullName}-photo-${i + 1}.jpg`);
                            }}
                            className="absolute bottom-0.5 right-0.5 h-5 w-5 rounded-full bg-white/90 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Download photo"
                          >
                            <Download className="h-3 w-3 text-black" strokeWidth={2} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      disabled={busy}
                      onClick={() => deleteSingle(o._id, o.FullName)}
                      className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive inline-flex items-center justify-center disabled:opacity-40"
                      aria-label="Delete order"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.url} alt="" className="max-w-full max-h-[85vh] rounded-xl object-contain" />
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={() => downloadImage(lightbox.url, `${lightbox.name}.jpg`)}
                className="h-10 w-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
                aria-label="Download image"
              >
                <Download className="h-4 w-4 text-black" strokeWidth={1.75} />
              </button>
              <button
                onClick={() => setLightbox(null)}
                className="h-10 w-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-black" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, value, onChange, type = "text", textarea, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean; rows?: number }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      {textarea ? (
        <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full rounded-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground" />
      )}
    </div>
  );
}
const EMPTY_COUPON: CouponInput = {
  code: "",
  discountType: "percentage",
  discountValue: 10,
  expiresAt: "",
  minOrderAmount: 0,
  usageLimit: undefined,
};

function CouponsManager() {
  const coupons = useCoupons();
  const { loading, error } = useCouponsStatus();
  const [editing, setEditing] = useState<{ id: string | null; form: CouponInput } | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const startNew = () => setEditing({ id: null, form: { ...EMPTY_COUPON } });

  const startEdit = (c: Coupon) =>
    setEditing({
      id: c._id,
      form: {
        code: c.code,
        discountType: c.discountType,
        discountValue: c.discountValue,
        expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : "",
        minOrderAmount: c.minOrderAmount ?? 0,
        usageLimit: c.usageLimit,
      },
    });

  const save = async () => {
    if (!editing) return;
    const { form, id } = editing;
    if (!form.code.trim()) return alert("Coupon code is required");
    if (!form.discountValue || form.discountValue <= 0) return alert("Discount value must be greater than 0");

    setSaving(true);
    try {
      const payload = {
        ...form,
        code: form.code.trim().toUpperCase(),
        expiresAt: form.expiresAt || undefined,
        usageLimit: form.usageLimit || undefined,
      };
      if (id) await couponActions.update(id, payload);
      else await couponActions.create(payload);
      setEditing(null);
    } catch (e: any) {
      alert(e.message ?? "Failed to save coupon");
    } finally {
      setSaving(false);
    }
  };

  const act = async (fn: () => Promise<void>, id: string) => {
    setBusyId(id);
    try { await fn(); } catch (e: any) { alert(e.message ?? "Action failed"); }
    finally { setBusyId(null); }
  };

  if (loading && coupons.length === 0) {
    return <div className="rounded-3xl border border-border p-10 text-center text-muted-foreground">Loading coupons…</div>;
  }
  if (error) {
    return <div className="rounded-3xl border border-border p-10 text-center text-destructive">{error}</div>;
  }

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-6">
      <div>
        <button
          onClick={startNew}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-dashed border-border px-5 py-3 text-sm font-medium hover:border-foreground w-full justify-center"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} /> New coupon
        </button>

        {coupons.length === 0 ? (
          <div className="rounded-3xl border border-border p-10 text-center text-muted-foreground">No coupons yet.</div>
        ) : (
          <div className="rounded-3xl border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-left">
                  <th className="p-4 font-semibold">Code</th>
                  <th className="p-4 font-semibold">Discount</th>
                  <th className="p-4 font-semibold">Usage</th>
                  <th className="p-4 font-semibold">Expires</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => {
                  const expired = !!c.expiresAt && new Date(c.expiresAt).getTime() < Date.now();
                  const limitReached = c.usageLimit !== undefined && c.usedCount >= c.usageLimit;
                  return (
                    <tr key={c._id} className="border-b border-border last:border-0">
                      <td className="p-4 font-bold">{c.code}</td>
                      <td className="p-4 whitespace-nowrap">
                        {c.discountType === "percentage" ? `${c.discountValue}% off` : `Rs ${c.discountValue} off`}
                        {c.minOrderAmount ? (
                          <span className="block text-xs text-muted-foreground">min Rs {c.minOrderAmount}</span>
                        ) : null}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {c.usedCount}{c.usageLimit !== undefined ? ` / ${c.usageLimit}` : " / ∞"}
                      </td>
                      <td className="p-4 whitespace-nowrap text-muted-foreground">
                        {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "Never"}
                      </td>
                      <td className="p-4">
                        {!c.isActive ? (
                          <span className="text-xs bg-secondary px-2 py-1 rounded-full">Disabled</span>
                        ) : expired ? (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Expired</span>
                        ) : limitReached ? (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Limit reached</span>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => startEdit(c)}
                            className="h-8 w-8 rounded-full hover:bg-secondary inline-flex items-center justify-center"
                            aria-label="Edit"
                          >
                            <Pencil className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                          <button
                            disabled={busyId === c._id}
                            onClick={() => act(() => couponActions.toggle(c._id), c._id)}
                            className="h-8 w-8 rounded-full hover:bg-secondary inline-flex items-center justify-center disabled:opacity-40"
                            aria-label={c.isActive ? "Disable" : "Enable"}
                            title={c.isActive ? "Disable" : "Enable"}
                          >
                            {c.isActive ? <ToggleRight className="h-4 w-4" strokeWidth={1.5} /> : <ToggleLeft className="h-4 w-4" strokeWidth={1.5} />}
                          </button>
                          <button
                            disabled={busyId === c._id}
                            onClick={() => { if (confirm(`Delete coupon ${c.code}?`)) act(() => couponActions.remove(c._id), c._id); }}
                            className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive inline-flex items-center justify-center disabled:opacity-40"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div className="rounded-3xl border border-border p-6 space-y-4 h-fit lg:sticky lg:top-28">
          <h3 className="font-bold text-lg">{editing.id ? "Edit coupon" : "New coupon"}</h3>

          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Code</label>
            <input
              value={editing.form.code}
              onChange={(e) => setEditing({ ...editing, form: { ...editing.form, code: e.target.value.toUpperCase() } })}
              className="mt-2 w-full rounded-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Type</label>
              <select
                value={editing.form.discountType}
                onChange={(e) => setEditing({ ...editing, form: { ...editing.form, discountType: e.target.value as "percentage" | "flat" } })}
                className="mt-2 w-full rounded-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground"
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat amount</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Value {editing.form.discountType === "percentage" ? "(%)" : "(Rs)"}
              </label>
              <input
                type="number"
                value={editing.form.discountValue}
                onChange={(e) => setEditing({ ...editing, form: { ...editing.form, discountValue: Number(e.target.value) } })}
                className="mt-2 w-full rounded-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Minimum order amount (Rs)</label>
            <input
              type="number"
              value={editing.form.minOrderAmount ?? 0}
              onChange={(e) => setEditing({ ...editing, form: { ...editing.form, minOrderAmount: Number(e.target.value) } })}
              className="mt-2 w-full rounded-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Usage limit (leave empty = unlimited)</label>
            <input
              type="number"
              value={editing.form.usageLimit ?? ""}
              onChange={(e) => setEditing({ ...editing, form: { ...editing.form, usageLimit: e.target.value ? Number(e.target.value) : undefined } })}
              className="mt-2 w-full rounded-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground"
              placeholder="e.g. 50"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Expiry date (leave empty = never)</label>
            <input
              type="date"
              value={editing.form.expiresAt ?? ""}
              onChange={(e) => setEditing({ ...editing, form: { ...editing.form, expiresAt: e.target.value } })}
              className="mt-2 w-full rounded-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <CTAButton className="hover:bg-black hover:text-white" disabled={saving} onClick={save}>
              {saving ? "Saving…" : "Save"}
            </CTAButton>
            <button onClick={() => setEditing(null)} className="text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}