"use client";

import { useMemo } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Section } from "@/components/ui-custom/Section";
import { useCurrentUser } from "@/lib/auth";
import { useOrders } from "@/lib/orders";
import { useCart } from "@/lib/cart";
import { useLikes } from "@/lib/likes";
import Link from "next/link";

export default function AccountPage() {
  const user = useCurrentUser();
  const orders = useOrders();
  const cart = useCart();
  const likes = useLikes();

  const myOrders = useMemo(() => {
    if (!user) return [];
    return orders.filter((o) => o.email && user.email && o.email.toLowerCase() === user.email.toLowerCase());
  }, [orders, user]);

  return (
    <SiteShell>
      <Section tone="surface" className="pt-28 md:pt-36" size="sm">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-4">Account</p>
        <h1 className="text-5xl md:text-7xl font-bold leading-[1] tracking-tight">Your dashboard</h1>
      </Section>

      <Section>
        {!user ? (
          <div className="py-20 text-center">
            <p className="text-lg">Please sign in to view your account.</p>
            <Link href="/auth/login" className="mt-4 inline-block underline">Sign in</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold">My orders</h2>
              {myOrders.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">No orders yet.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {myOrders.map((o) => (
                    <div key={o.id} className="rounded-2xl border border-border p-4">
                      <p className="font-semibold">{o.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</p>
                      <p className="mt-2 text-sm">Status: <span className="font-medium">{o.status}</span></p>
                      {o.paymentConfirmed && <p className="text-sm">Payment: confirmed</p>}
                      {o.delivered && <p className="text-sm">Delivered</p>}
                      <details className="mt-2">
                        <summary className="text-sm text-muted-foreground cursor-pointer">View details</summary>
                        <div className="mt-2 text-sm">
                          <p><strong>Address:</strong> {o.address}</p>
                          <p><strong>Phone:</strong> {o.phone}</p>
                          {o.items && (
                            <ul className="mt-2 space-y-1">
                              {o.items.map((it) => (
                                <li key={(it as any).id}>{(it as any).title} — {(it as any).price} × {(it as any).qty ?? 1}</li>
                              ))}
                            </ul>
                          )}
                          {o.paymentScreenshot && <img src={o.paymentScreenshot} className="mt-3 h-32 object-contain rounded-md border" />}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold">Cart</h2>
              {cart.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">Cart is empty.</p> : (
                <div className="mt-4 space-y-2">
                  {cart.map((c) => (
                    <div key={c.id} className="flex items-center gap-3">
                      <img src={c.image} className="h-14 w-14 object-cover rounded-md" />
                      <div>
                        <p className="text-sm font-medium">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{c.price} × {c.qty}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h2 className="mt-8 text-lg font-semibold">Liked items</h2>
              {likes.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">No liked items.</p> : (
                <div className="mt-4 space-y-2">
                  {likes.map((id) => (
                    <div key={id} className="flex items-center gap-3">
                      <Link href={`/artwork/${id}`} className="text-sm underline">View artwork</Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Section>
    </SiteShell>
  );
}
