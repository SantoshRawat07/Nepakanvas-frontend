"use client";

import { Upload, Image as ImageIcon, X } from "lucide-react";

interface PaymentProofUploadProps {
  previewUrl: string | null;
  fileName?: string | null;
  onChange: (file?: File) => void;
  onClear: () => void;
  required?: boolean;
}

export function PaymentProofUpload({
  previewUrl,
  fileName,
  onChange,
  onClear,
  required = true,
}: PaymentProofUploadProps) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Payment proof screenshot {required && <span className="text-destructive">*</span>}
      </label>

      <label
        htmlFor="payment-screenshot"
        className="mt-2 flex items-center gap-3 rounded-2xl border border-dashed border-border px-4 py-3 cursor-pointer bg-secondary/30 hover:border-foreground hover:bg-secondary/50 transition-colors"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
          <Upload className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium truncate">
            {fileName ? fileName : "Choose file"}
          </span>
          <span className="block text-xs text-muted-foreground">
            {fileName ? "Tap to change" : "PNG or JPG — upload your payment screenshot"}
          </span>
        </span>
        {previewUrl && <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.75} />}
      </label>

      <input
        id="payment-screenshot"
        type="file"
        accept="image/*"
        required={required && !previewUrl}
        onChange={(e) => onChange(e.target.files?.[0])}
        className="sr-only"
      />

      {previewUrl ? (
        <div className="mt-3 relative inline-block">
          <img
            src={previewUrl}
            alt="Payment screenshot preview"
            className="h-40 object-contain rounded-xl border border-border"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-black text-white flex items-center justify-center shadow-sm hover:bg-neutral-800"
            aria-label="Remove screenshot"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
      ) : (
        <p className="mt-1.5 text-xs text-muted-foreground">Upload proof of payment to submit your order.</p>
      )}
    </div>
  );
}