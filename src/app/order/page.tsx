"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCurrentUser } from "@/lib/auth";
import { SiteShell } from "@/components/layout/SiteShell";
import { Section } from "@/components/ui-custom/Section";
import { CTAButton } from "@/components/ui-custom/CTAButton";
import { useCart, useCartTotal, cartActions } from "@/lib/cart";
import { getArtworkById } from "@/lib/content";
import { orderActions } from "@/lib/orders";

export default function OrderPage() {
  return (
    <Suspense fallback={<OrderPageFallback />}>
      <OrderPageContent />
    </Suspense>
  );
}

function OrderPageFallback() {
  return (
    <SiteShell>
      <Section tone="surface" className="pt-28 md:pt-36" size="sm">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-4">Place order</p>
        <h1 className="text-5xl md:text-7xl font-bold leading-[1] tracking-tight">Complete your order</h1>
      </Section>
    </SiteShell>
  );
}

function OrderPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const checkout = params.get("checkout");
  const artworkId = params.get("artworkId");

  const cartItems = useCart();
  const cartTotal = useCartTotal();

  const [items, setItems] = useState(() => [] as any[]);
  const [amount, setAmount] = useState(0);
  const user = useCurrentUser();

  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", notes: "" });
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (checkout === "cart") {
      setItems(cartItems);
      setAmount(cartTotal);
    } else if (artworkId) {
      const a = getArtworkById(artworkId);
      if (a) {
        setItems([{ id: a.id, title: a.title, price: a.price, qty: 1, image: a.image }]);
        setAmount(parseInt(a.price.replace(/[^\d]/g, ""), 10) || 0);
      }
    }
    if (user) {
      setForm((f) => ({ ...f, name: user.name ?? f.name, email: user.email ?? f.email }));
    }
  }, [checkout, artworkId, cartItems, cartTotal, user]);

  const payText = `Pay Rs ${amount} to NepaKanvas — Account: 9864865976 (eSewa/Khalti)`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(payText)}`;

  const onFile = async (f?: File) => {
    if (!f) return;
    const data = await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = rej;
      r.readAsDataURL(f);
    });
    setScreenshot(data);
  };

  const submit = async (e?: any) => {
    e?.preventDefault();
    if (!user) return router.push('/auth/login');
    if (!form.name || !form.phone || !form.address) return alert("Please fill name, phone and address");
    setSubmitting(true);
    const order = orderActions.create({
      items,
      amount,
      artworkId: artworkId ?? undefined,
      title: items.length === 1 ? items[0].title : `${items.length} item(s)`,
      name: form.name,
      phone: form.phone,
      email: form.email,
      address: form.address,
      notes: form.notes,
      paymentScreenshot: screenshot ?? undefined,
    });

    if (checkout === "cart") cartActions.clear();

    router.push(`/admin?order=${order.id}`);
  };

  return (
    <SiteShell>
      <Section tone="surface" className="pt-28 md:pt-36" size="sm">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-4">Place order</p>
        <h1 className="text-5xl md:text-7xl font-bold leading-[1] tracking-tight">Complete your order</h1>
      </Section>

      <Section>
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-lg font-semibold">Order summary</h3>
            <div className="mt-4 space-y-3">
              {items.map((i: any) => (
                <div key={i.id} className="flex items-center gap-4">
                  <img src={i.image} className="h-20 w-20 object-cover rounded-md bg-secondary" />
                  <div>
                    <p className="font-semibold">{i.title}</p>
                    <p className="text-sm text-muted-foreground">{i.price} × {i.qty ?? 1}</p>
                  </div>
                </div>
              ))}
              <div className="h-px bg-border my-3" />
              <p className="font-bold">Total: Rs {amount.toLocaleString()}</p>
            </div>

            <h4 className="mt-8 text-lg font-semibold">Pay with</h4>
            <p className="text-sm text-muted-foreground">Scan the QR using your mobile payment app and pay Rs {amount}.</p>
            <div className="mt-4">
              <img src={qrSrc} alt="Payment QR" className="h-56 w-56" />
            </div>
          </div>

          <div>
            <form onSubmit={submit} className="space-y-4">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Full name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-full border border-border px-4 py-3" />

              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-full border border-border px-4 py-3" />

              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email (optional)</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-full border border-border px-4 py-3" />

              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Delivery address</label>
              <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-2xl border border-border px-4 py-3" />

              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full rounded-2xl border border-border px-4 py-3" />

              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Upload payment screenshot</label>
              <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />

              {screenshot && <img src={screenshot} alt="screenshot" className="mt-2 h-40 object-contain" />}

              <CTAButton type="submit" className="w-full mt-4 hover:bg-primary" disabled={submitting}>{submitting ? "Submitting…" : "Submit order"}</CTAButton>
            </form>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}