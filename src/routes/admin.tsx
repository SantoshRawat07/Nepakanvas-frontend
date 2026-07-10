import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, Plus, LayoutDashboard, Palette, Users, Home as HomeIcon, ClipboardList } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Section } from "@/components/ui-custom/Section";
import { CTAButton } from "@/components/ui-custom/CTAButton";
import { useCurrentUser } from "@/lib/auth";
import {
  contentActions, useArtworks, useHero, useTeam,
  type EditableArtwork, type TeamMember,
} from "@/lib/content";
import { CATEGORIES } from "@/lib/artworks";
import { useOrders, orderActions, type Order } from "@/lib/orders";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — NepaKanvas" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Tab = "hero" | "artworks" | "team" | "orders";

function AdminPage() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("hero");

  useEffect(() => {
    if (user === null) return; // not yet hydrated / logged out — handled in render
  }, [user]);

  if (!user) {
    return (
      <SiteShell>
        <Section tone="surface" size="lg" className="pt-32">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-4xl font-bold">Admin area</h1>
            <p className="mt-3 text-muted-foreground">Please sign in with an admin account to continue.</p>
            <CTAButton onClick={() => navigate({ to: "/auth/login" })} className="mt-6">Sign in</CTAButton>
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
            <Link to="/" className="mt-6 inline-block underline underline-offset-4">Return home</Link>
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
          <button
            onClick={() => { if (confirm("Reset all content to defaults?")) contentActions.reset(); }}
            className="ml-auto text-xs text-muted-foreground hover:text-destructive"
          >
            Reset to defaults
          </button>
        </div>

        {tab === "hero" && <HeroEditor />}
        {tab === "artworks" && <ArtworksEditor />}
        {tab === "team" && <TeamEditor />}
        {tab === "orders" && <OrdersManager />}
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
        <CTAButton onClick={() => { contentActions.updateHero(form); setSaved(true); setTimeout(() => setSaved(false), 1500); }}>
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

  return (
    <div className="grid lg:grid-cols-[1fr_420px] gap-6">
      <div className="space-y-3">
        <button
          onClick={() => setEditing({ ...EMPTY_ART, id: crypto.randomUUID() })}
          className="inline-flex items-center gap-2 rounded-full border border-dashed border-border px-5 py-3 text-sm font-medium hover:border-foreground w-full justify-center"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} /> New artwork
        </button>
        {artworks.map((a) => (
          <div key={a.id} className="flex items-center gap-4 rounded-2xl border border-border p-3">
            <img src={a.image} alt="" className="h-14 w-14 object-cover rounded-xl bg-secondary" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.category} · {a.price} {a.featured ? "· ★ featured" : ""}</p>
            </div>
            <button onClick={() => setEditing(a)} className="h-9 w-9 rounded-full hover:bg-secondary inline-flex items-center justify-center" aria-label="Edit">
              <Pencil className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => { if (confirm(`Delete "${a.title}"?`)) contentActions.deleteArtwork(a.id); }}
              className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive inline-flex items-center justify-center" aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="rounded-3xl border border-border p-6 space-y-4 h-fit lg:sticky lg:top-28">
          <h3 className="font-bold text-lg">{artworks.some((a) => a.id === editing.id) ? "Edit artwork" : "New artwork"}</h3>
          {editing.image && <img src={editing.image} alt="" className="w-full aspect-[4/5] object-cover rounded-2xl bg-secondary" />}
          <Field label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
          <Field label="Image URL" value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} />
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
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
            Show on the home page
          </label>
          <div className="flex gap-3 pt-2">
            <CTAButton
              onClick={() => { if (!editing.title || !editing.image) return alert("Title and image are required"); contentActions.upsertArtwork(editing); setEditing(null); }}
            >Save</CTAButton>
            <button onClick={() => setEditing(null)} className="text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

const EMPTY_TEAM: TeamMember = { id: "", name: "", role: "", bio: "", image: "" };

function TeamEditor() {
  const team = useTeam();
  const [editing, setEditing] = useState<TeamMember | null>(null);

  return (
    <div className="grid lg:grid-cols-[1fr_420px] gap-6">
      <div className="space-y-3">
        <button onClick={() => setEditing({ ...EMPTY_TEAM, id: crypto.randomUUID() })}
          className="inline-flex items-center gap-2 rounded-full border border-dashed border-border px-5 py-3 text-sm font-medium hover:border-foreground w-full justify-center">
          <Plus className="h-4 w-4" strokeWidth={1.5} /> New team member
        </button>
        {team.map((m) => (
          <div key={m.id} className="flex items-center gap-4 rounded-2xl border border-border p-3">
            <img src={m.image} alt="" className="h-14 w-14 object-cover rounded-full bg-secondary" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{m.name}</p>
              <p className="text-xs text-muted-foreground truncate">{m.role}</p>
            </div>
            <button onClick={() => setEditing(m)} className="h-9 w-9 rounded-full hover:bg-secondary inline-flex items-center justify-center" aria-label="Edit">
              <Pencil className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button onClick={() => { if (confirm(`Remove ${m.name}?`)) contentActions.deleteTeam(m.id); }} className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive inline-flex items-center justify-center" aria-label="Delete">
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="rounded-3xl border border-border p-6 space-y-4 h-fit lg:sticky lg:top-28">
          <h3 className="font-bold text-lg">{team.some((m) => m.id === editing.id) ? "Edit member" : "New member"}</h3>
          {editing.image && <img src={editing.image} alt="" className="w-full aspect-square object-cover rounded-2xl bg-secondary" />}
          <Field label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
          <Field label="Role" value={editing.role} onChange={(v) => setEditing({ ...editing, role: v })} />
          <Field label="Image URL" value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} />
          <Field label="Bio" value={editing.bio} onChange={(v) => setEditing({ ...editing, bio: v })} textarea rows={3} />
          <div className="flex gap-3 pt-2">
            <CTAButton onClick={() => { if (!editing.name) return alert("Name is required"); contentActions.upsertTeam(editing); setEditing(null); }}>Save</CTAButton>
            <button onClick={() => setEditing(null)} className="text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersManager() {
  const orders = useOrders();
  const sorted = useMemo(() => [...orders].sort((a, b) => b.createdAt - a.createdAt), [orders]);

  if (sorted.length === 0) {
    return <div className="rounded-3xl border border-border p-10 text-center text-muted-foreground">No orders yet.</div>;
  }

  const STATUS: Order["status"][] = ["new", "in-progress", "completed"];

  return (
    <div className="space-y-3">
      {sorted.map((o) => (
        <div key={o.id} className="rounded-2xl border border-border p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-bold">{o.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{new Date(o.createdAt).toLocaleString()}</p>
              <p className="mt-3 text-sm"><span className="text-muted-foreground">From:</span> {o.name} — {o.phone} — {o.email}</p>
              <p className="text-sm"><span className="text-muted-foreground">Address:</span> {o.address}</p>
              {o.notes && <p className="text-sm mt-1"><span className="text-muted-foreground">Notes:</span> {o.notes}</p>}
            </div>
            <div className="flex flex-col items-end gap-2">
              <select value={o.status} onChange={(e) => orderActions.setStatus(o.id, e.target.value as Order["status"])}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:border-foreground">
                {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => { if (confirm("Delete this order?")) orderActions.remove(o.id); }} className="text-xs text-muted-foreground hover:text-destructive">Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
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
