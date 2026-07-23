"use client";

export function FormField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8577]">
        {label}
      </label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-[#E4DCC8] bg-[#FFFDF9] px-4 py-3 text-sm text-[#2A2620] outline-none transition-colors focus:border-[#C9A24B]"
      />
    </div>
  );
}