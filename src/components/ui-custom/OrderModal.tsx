import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { orderActions } from "@/lib/orders";
import { CTAButton } from "./CTAButton";

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  artwork?: { id: string; title: string; price?: string };
}

export function OrderModal({ open, onClose, artwork }: OrderModalProps) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", notes: "" });
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) {
      setDone(false);
      setForm({ name: "", phone: "", email: "", address: "", notes: "" });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    orderActions.create({
      artworkId: artwork?.id,
      title: artwork?.title ?? "Custom order",
      ...form,
    });
    setDone(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-foreground/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full md:max-w-lg bg-background rounded-t-3xl md:rounded-3xl border border-border shadow-elevated overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Order</p>
                <h3 className="mt-1 font-bold text-lg">{artwork?.title ?? "Custom artwork"}</h3>
              </div>
              <button onClick={onClose} aria-label="Close" className="h-10 w-10 rounded-full hover:bg-secondary flex items-center justify-center">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {done ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto text-foreground" strokeWidth={1.25} />
                <h4 className="mt-4 text-2xl font-bold">Order received.</h4>
                <p className="mt-2 text-sm text-muted-foreground">We'll reach out on your phone within 24 hours to confirm details.</p>
                <CTAButton onClick={onClose} className="mt-6">Close</CTAButton>
              </div>
            ) : (
              <form onSubmit={submit} className="p-6 space-y-4">
                <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
                  <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                </div>
                <Field label="Delivery address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required />
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Notes</label>
                  <textarea
                    value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                    placeholder="Reference photo link, size, message…"
                  />
                </div>
                {artwork?.price && (
                  <div className="flex items-center justify-between text-sm rounded-2xl bg-secondary px-4 py-3">
                    <span className="text-muted-foreground">Estimated price</span>
                    <span className="font-semibold">{artwork.price}</span>
                  </div>
                )}
                <CTAButton type="submit" size="lg" className="w-full">Place order</CTAButton>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      <input
        type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground"
      />
    </div>
  );
}
