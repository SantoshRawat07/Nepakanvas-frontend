import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Section } from "@/components/ui-custom/Section";
import { CTAButton, CTALink } from "@/components/ui-custom/CTAButton";
import { useCart, useCartTotal, cartActions, priceToNumber } from "@/lib/cart";
import { OrderModal } from "@/components/ui-custom/OrderModal";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — NepaKanvas" }, { name: "robots", content: "noindex" }] }),
  component: CartPage,
});

function CartPage() {
  const items = useCart();
  const total = useCartTotal();
  const [checkout, setCheckout] = useState(false);

  return (
    <SiteShell>
      <Section tone="surface" className="pt-28 md:pt-36" size="sm">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-4">Your cart</p>
        <h1 className="text-5xl md:text-7xl font-bold leading-[1] tracking-tight">The room, waiting.</h1>
      </Section>

      <Section size="sm">
        {items.length === 0 ? (
          <div className="py-16 text-center rounded-3xl border border-border bg-secondary/40">
            <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground" strokeWidth={1.25} />
            <p className="mt-4 text-2xl font-semibold">Your cart is empty.</p>
            <p className="mt-2 text-muted-foreground">Add a painting from the gallery to get started.</p>
            <CTALink to="/gallery" className="mt-6" withArrow>Browse gallery</CTALink>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-10">
            <div className="space-y-4">
              {items.map((i) => (
                <div key={i.id} className="flex gap-4 rounded-2xl border border-border p-4">
                  <Link to="/artwork/$id" params={{ id: i.id }} className="shrink-0">
                    <img src={i.image} alt={i.title} className="h-24 w-24 md:h-28 md:w-28 object-cover rounded-xl bg-secondary" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to="/artwork/$id" params={{ id: i.id }} className="font-semibold hover:underline underline-offset-4 truncate block">{i.title}</Link>
                    <p className="text-sm font-semibold mt-1">{i.price}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button onClick={() => cartActions.setQty(i.id, i.qty - 1)} className="h-8 w-8 flex items-center justify-center hover:bg-secondary rounded-l-full" aria-label="Decrease">
                          <Minus className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{i.qty}</span>
                        <button onClick={() => cartActions.setQty(i.id, i.qty + 1)} className="h-8 w-8 flex items-center justify-center hover:bg-secondary rounded-r-full" aria-label="Increase">
                          <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                      </div>
                      <button onClick={() => cartActions.remove(i.id)} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold">Rs {(priceToNumber(i.price) * i.qty).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              <button onClick={() => cartActions.clear()} className="text-xs text-muted-foreground hover:text-foreground">Clear cart</button>
            </div>

            <aside className="rounded-3xl border border-border bg-secondary/40 p-6 h-fit lg:sticky lg:top-28">
              <h2 className="text-lg font-bold">Order summary</h2>
              <div className="mt-6 space-y-3 text-sm">
                <Row label="Subtotal" value={`Rs ${total.toLocaleString()}`} />
                <Row label="Shipping" value="Calculated at checkout" />
                <div className="h-px bg-border my-3" />
                <Row label="Total" value={`Rs ${total.toLocaleString()}`} bold />
              </div>
              <CTAButton size="lg" className="w-full mt-6" onClick={() => setCheckout(true)} withArrow>Checkout</CTAButton>
              <p className="mt-3 text-xs text-muted-foreground text-center">Frontend demo — no payment is captured.</p>
            </aside>
          </div>
        )}
      </Section>

      <OrderModal
        open={checkout}
        onClose={() => { setCheckout(false); if (items.length === 0) return; cartActions.clear(); }}
        artwork={items.length ? { id: "cart", title: `${items.length} item(s)`, price: `Rs ${total.toLocaleString()}` } : undefined}
      />
    </SiteShell>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "font-bold text-base" : "font-medium"}>{value}</span>
    </div>
  );
}
