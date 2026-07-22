"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCurrentUser } from "@/lib/auth";
import { SiteShell } from "@/components/layout/SiteShell";
import { Section } from "@/components/ui-custom/Section";
import { CTAButton } from "@/components/ui-custom/CTAButton";
import { useCart, useCartTotal, cartActions } from "@/lib/cart";
import { getArtworkById, useArtworks } from "@/lib/content";
import { orderActions } from "@/lib/orders";
import { validateCoupon, type AppliedCoupon } from "@/lib/coupon";
import { usePaymentSettings } from "@/lib/paymentsetting";
import { Check, Tag, CreditCard, ArrowRight } from "lucide-react";
import { apiPostForm } from "@/lib/api";
import { CouponPromoBanner } from "@/components/ui-custom/couponbanner";
import { QRPaymentCard } from "@/components/ui-custom/Qrcode";
import { PaymentProofUpload } from "@/components/ui-custom/paymentproof";

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

type Step = "details" | "payment";

function isValidNepaliMobile(phone: string): boolean {
  return /^98\d{8}$/.test(phone);
}

function OrderPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const checkout = params.get("checkout");
  const artworkId = params.get("artworkId");

  const cartItems = useCart();
  const cartTotal = useCartTotal();
  const artworks = useArtworks();

  const [items, setItems] = useState(() => [] as any[]);
  const [amount, setAmount] = useState(0);
  const user = useCurrentUser();
  const isAdmin = user?.role === "admin";

  const [step, setStep] = useState<Step>("details");

  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", notes: "" });
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);

  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);


  const paymentSettings = usePaymentSettings();

  const finalAmount = coupon ? coupon.finalAmount : amount;

  const phoneError =
    form.phone.length > 0 && !isValidNepaliMobile(form.phone)
      ? form.phone.length < 10
        ? null
        : "Invalid phone number — must be 10 digits starting with 98"
      : null;

    useEffect(() => {
    if (checkout === "cart") {
      setItems(cartItems);
      setAmount(cartTotal);
    } else if (artworkId) {
      const a = artworks.find((x) => x.id === artworkId) ?? getArtworkById(artworkId);
      if (a) {
        setItems([{ id: a.id, title: a.title, price: a.price, qty: 1, image: a.image }]);
        setAmount(parseInt(a.price.replace(/[^\d]/g, ""), 10) || 0);
      }
    }
    if (user) {
      setForm((f) => ({ ...f, name: user.userName ?? f.name, email: user.email ?? f.email }));
    }
  }, [checkout, artworkId, cartItems, cartTotal, user, artworks]);

  useEffect(() => {
    setCoupon(null);
    setCouponError(null);
  }, [amount]);

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setApplyingCoupon(true);
    setCouponError(null);
    try {
      const result = await validateCoupon(couponInput.trim(), amount);
      setCoupon(result);
    } catch (err: any) {
      setCoupon(null);
      setCouponError(err.message ?? "Invalid or expired coupon code");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponInput("");
    setCouponError(null);
  };

  const onPhoneChange = (raw: string) => {
    const digitsOnly = raw.replace(/\D/g, "").slice(0, 10);
    setForm({ ...form, phone: digitsOnly });
  };

  const goToPayment = () => {
    if (!form.name.trim()) return alert("Please enter your full name");
    if (form.phone.length !== 10) return alert("Phone number must be exactly 10 digits");
    if (!isValidNepaliMobile(form.phone)) return alert("Invalid phone number — must start with 98");
    setStep("payment");
  };

  const onFile = async (f?: File) => {
    if (!f) return;
    setScreenshotFile(f);
    const data = await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = rej;
      r.readAsDataURL(f);
    });
    setScreenshot(data);
  };
  const [submitting, setSubmitting] = useState(false);
  const submit = async (e?: any) => {
    e?.preventDefault();
    if (isAdmin) return;
    if (!user) return router.push('/auth/login');
    if (!form.name.trim()) return alert("Please enter your full name");
    if (form.phone.length !== 10 || !isValidNepaliMobile(form.phone)) {
      return alert("Please enter a valid 10-digit phone number starting with 98");
    }
    if (!form.address.trim()) return alert("Delivery address is required");
    if (!screenshotFile) return alert("Please upload your payment screenshot");
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("fullName", form.name);
      fd.append("phone", form.phone);
      fd.append("email", form.email);
      fd.append("address", form.address);
      fd.append("notes", form.notes);
      fd.append(
        "items",
        JSON.stringify(
          items.map((i: any) => ({
            productId: i.id,
            title: i.title,
            price: parseInt(String(i.price).replace(/[^\d]/g, ""), 10) || 0,
            qty: i.qty ?? 1,
          }))
        )
      );
      if (coupon?.code) fd.append("couponCode", coupon.code);
      fd.append("paymentImage", screenshotFile);

      await apiPostForm("/checkout/order", fd);

      if (checkout === "cart") cartActions.clear();

      router.push(`/order?confirmed=1`);
    } catch (err: any) {
      alert(err.message ?? "Failed to submit order");
    } finally {
      setSubmitting(false);
    }
  };
  if (isAdmin) {
    return (
      <SiteShell>
        <Section tone="surface" size="lg" className="pt-32">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-4xl font-bold">Not available for admin accounts</h1>
            <p className="mt-3 text-muted-foreground">
              Admin accounts can't place orders. Sign in as a customer to order, or head to the dashboard to manage the studio.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link href="/" className="underline underline-offset-4">Return home</Link>
              <Link href="/admin" className="underline underline-offset-4">Go to admin dashboard</Link>
            </div>
          </div>
        </Section>
      </SiteShell>
    );
  }

  const confirmed = params.get("confirmed");
  if (confirmed) {
    return (
      <SiteShell>
        <Section tone="surface" size="lg" className="pt-32">
          <div className="max-w-md mx-auto text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <Check className="h-8 w-8 text-emerald-600" strokeWidth={2} />
            </div>
            <h1 className="mt-6 text-4xl font-bold">Order placed</h1>
            <p className="mt-3 text-muted-foreground">
              Thanks — we've received your order and payment screenshot. We'll confirm it shortly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link href="/">
                <CTAButton className="hover:bg-primary">Return home</CTAButton>
              </Link>
              <Link href="/gallery" className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 self-center">
                Continue browsing
              </Link>
            </div>
          </div>
        </Section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <Section tone="surface" className="pt-28 md:pt-36" size="sm">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-4">Place order</p>
        <h1 className="text-5xl md:text-7xl font-bold leading-[1] tracking-tight">Complete your order</h1>
      </Section>
      <CouponPromoBanner />
      <Section>
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* LEFT: order summary */}
          <div className="space-y-8 lg:-mt-10">
            <div className="rounded-3xl border border-border p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">Order summary</h3>
              <div className="mt-2 space-y-4">
                {items.map((i: any) => (
                  <div key={i.id} className="flex items-center gap-4">
                    <img src={i.image} className="h-16 w-16 object-cover rounded-xl bg-secondary" />
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{i.title}</p>
                      <p className="text-sm text-muted-foreground">{i.price} × {i.qty ?? 1}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-border my-5" />

              <div className="space-y-1.5">
                {coupon && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="line-through">Rs {amount.toLocaleString()}</span>
                  </div>
                )}
                {coupon && (
                  <div className="flex items-center justify-between text-sm text-emerald-600 font-medium">
                    <span>Coupon "{coupon.code}"</span>
                    <span>−Rs {coupon.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1.5">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">Rs {finalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border p-6">
              <h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2">
                <CreditCard className="h-4 w-4" strokeWidth={1.75} /> Pay with
              </h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Scan the QR using your mobile payment app and pay <span className="font-semibold text-foreground">Rs {finalAmount.toLocaleString()}</span>.
              </p>
              <QRPaymentCard instructions={paymentSettings?.instructions} amount={finalAmount} />
            </div>
          </div>

          {/* RIGHT: two-step form */}
          <div>
            <div className="flex items-center gap-3 mb-8 lg:-mt-10">
              <StepPill num={1} label="Your details" active={step === "details"} done={step === "payment"} />
              <div className="flex-1 h-px bg-border" />
              <StepPill num={2} label="Payment" active={step === "payment"} done={false} />
            </div>

            {step === "details" && (
              <div className="rounded-3xl border border-border p-6 space-y-5">
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Full name <span className="text-destructive">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-2 w-full rounded-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Phone <span className="text-destructive">*</span>
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => onPhoneChange(e.target.value)}
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="98XXXXXXXX"
                    className={`mt-2 w-full rounded-full border px-4 py-3 text-sm focus:outline-none ${phoneError ? "border-destructive focus:border-destructive" : "border-border focus:border-foreground"
                      }`}
                  />
                  {phoneError && <p className="mt-1.5 text-sm text-destructive">{phoneError}</p>}
                </div>

                <div className="rounded-2xl bg-secondary/50 p-4">
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" strokeWidth={1.75} /> Coupon code
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter code"
                      disabled={!!coupon}
                      className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:border-foreground disabled:opacity-60"
                    />
                    {coupon ? (
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium hover:border-destructive hover:text-destructive"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={applyCoupon}
                        disabled={applyingCoupon || !couponInput.trim()}
                        className="rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium disabled:opacity-40"
                      >
                        {applyingCoupon ? "Checking…" : "Apply"}
                      </button>
                    )}
                  </div>
                  {couponError && <p className="mt-2 text-sm text-destructive">{couponError}</p>}
                  {coupon && (
                    <p className="mt-2 text-sm text-emerald-600">
                      Applied — Rs {coupon.discountAmount.toLocaleString()} off.
                    </p>
                  )}
                </div>

                <div className="pt-1 space-y-3">
                  <CTAButton type="button" onClick={goToPayment} className="w-full hover:bg-primary flex items-center justify-center gap-2">
                    Continue to payment <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                  </CTAButton>
                  {!coupon && (
                    <button
                      type="button"
                      onClick={goToPayment}
                      className="w-full text-center text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                    >
                      Skip — I don't have a code
                    </button>
                  )}
                </div>
              </div>
            )}

            {step === "payment" && (
              <form onSubmit={submit} className="rounded-3xl border border-border p-6 space-y-5">
                <div className="rounded-2xl bg-secondary/50 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ordering as</p>
                    <p className="font-semibold mt-0.5">{form.name}</p>
                    <p className="text-sm text-muted-foreground">{form.phone}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("details")}
                    className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                  >
                    Edit
                  </button>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email (optional)</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-2 w-full rounded-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Delivery address <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    rows={3}
                    required
                    className="mt-2 w-full rounded-2xl border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={2}
                    className="mt-2 w-full rounded-2xl border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                  />
                </div>

                <PaymentProofUpload
                  previewUrl={screenshot}
                  fileName={screenshotFile?.name}
                  onChange={(f) => onFile(f)}
                  onClear={() => { setScreenshot(null); setScreenshotFile(null); }}
                />

                <CTAButton type="submit" className="w-full hover:bg-primary" disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit order"}
                </CTAButton>
              </form>
            )}
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}

function StepPill({ num, label, active, done }: { num: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold border shrink-0 ${active
            ? "bg-foreground text-background border-foreground"
            : done
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-background text-muted-foreground border-border"
          }`}
      >
        {done ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : num}
      </div>
      <span className={`text-sm font-medium whitespace-nowrap ${active ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
    </div>
  );
}