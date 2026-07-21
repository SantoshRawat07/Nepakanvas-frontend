"use client";

import { useState } from "react";
import Image from "next/image";
import { CreditCard, X, Maximize2 } from "lucide-react";
import qrCodeImage from "@/assets/Qrcode.png"; 

interface QRPaymentCardProps {
  instructions?: string | null;
  amount: number;
}

export function QRPaymentCard({ instructions, amount }: QRPaymentCardProps) {
  const [lightbox, setLightbox] = useState(false);

  return (
    <div className="rounded-3xl border border-border p-6">
      <h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2">
        <CreditCard className="h-4 w-4" strokeWidth={1.75} /> Pay with
      </h4>
      <p className="mt-2 text-sm text-muted-foreground">
        Scan the QR using your mobile payment app and pay{" "}
        <span className="font-semibold text-foreground">Rs {amount.toLocaleString()}</span>.
      </p>

      <div className="mt-5 inline-block">
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="group relative block rounded-2xl border border-border bg-white p-4 shadow-sm hover:border-foreground transition-colors"
          aria-label="Enlarge QR code"
        >
          <Image src={qrCodeImage} alt="Payment QR" width={176} height={176} className="h-44 w-44 object-contain" />
          <span className="absolute inset-4 flex items-center justify-center rounded-lg bg-black/0 group-hover:bg-black/40 transition-colors">
            <Maximize2 className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.75} />
          </span>
        </button>
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="mt-3 text-xs font-medium rounded-full border border-border  lg:ml-4 px-10 py-1.5 hover:border-foreground"
        >
          Tap to enlarge
        </button>
      </div>

      {instructions && <p className="mt-3 text-xs text-muted-foreground">{instructions}</p>}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
          onClick={() => setLightbox(false)}
        >
          <div className="relative max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="rounded-2xl bg-white p-6">
              <Image src={qrCodeImage} alt="Payment QR" className="w-full h-auto object-contain" />
            </div>
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-black" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}