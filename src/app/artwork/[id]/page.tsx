"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/auth";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, Brush } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Section } from "@/components/ui-custom/Section";
import { Reveal } from "@/components/ui-custom/Reveal";
import { ArtCard } from "@/components/ui-custom/ArtCard";
import { CTAButton } from "@/components/ui-custom/CTAButton";
import { useArtworks, getArtworkById } from "@/lib/content";
import { cartActions } from "@/lib/cart";

export default function ArtworkDetail() {
  const params = useParams();
  const id = params.id as string;
  const artworks = useArtworks();
  const artworkFromStore = artworks.find((a) => a.id === id);
  const artworkFromSeed = getArtworkById(id);
  const live = artworkFromStore ?? artworkFromSeed;
  const related = artworks.filter((a) => live && a.category === live.category && a.id !== live.id).slice(0, 3);
  const [orderOpen, setOrderOpen] = useState(false);
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const user = useCurrentUser();
  const isAdmin = user?.role === "admin";

  if (!live) {
    return (
      <SiteShell>
        <Section size="lg">
          <div className="text-center">
            <h1 className="text-5xl font-bold">Artwork not found.</h1>
            <p className="mt-4 text-muted-foreground">It may have been removed by the studio.</p>
            <Link href="/gallery" className="mt-6 inline-flex items-center gap-2 underline underline-offset-4">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Back to gallery
            </Link>
          </div>
        </Section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <Section tone="surface" className="pt-28 md:pt-36" size="sm">
        <Link href="/gallery" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Back to gallery
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="rounded-3xl overflow-hidden bg-background aspect-[4/5] border border-border">
              <img src={live.image} alt={live.title} className="h-full w-full object-cover" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{live.category}</p>
            <h1 className="mt-3 text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">{live.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">by {live.artist}</p>

            {live.size && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Size</span>
                <span className="text-sm font-medium">{live.size}</span>
              </div>
            )}

            <div className="mt-4">
              <span className="text-4xl font-bold">{live.price}</span>
            </div>

            <p className="mt-8 text-base text-muted-foreground leading-relaxed font-light">{live.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <CTAButton
                size="lg" variant="outline"
                disabled={isAdmin}
                onClick={() => {
                  if (isAdmin) return;
                  if (!user) return router.push('/auth/login');
                  cartActions.add({ id: live.id, title: live.title, image: live.image, price: live.price });
                  setAdded(true);
                  setTimeout(() => setAdded(false), 1500);
                }}
                className={isAdmin ? "opacity-40 cursor-not-allowed" : ""}
              >
                <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                {added ? "Added to cart ✓" : "Add to cart"}
              </CTAButton>
              <CTAButton
  size="lg"
  disabled={isAdmin}
  onClick={() => {
    if (isAdmin) return;
    if (!user) return router.push('/auth/login');
    router.push(`/order?artworkId=${live.id}`);
  }}
  withArrow
  className={`border border-primary bg-transparent text-primary 
    hover:bg-primary hover:text-primary-foreground 
    transition-all duration-300
    ${isAdmin ? "opacity-40 cursor-not-allowed" : ""}`}
>
  Order now
</CTAButton>
            </div>

            {isAdmin && (
              <p className="mt-3 text-xs text-muted-foreground">
                Ordering is disabled for admin accounts. Sign in your account to place an order.
              </p>
            )}

            <div className="mt-10 grid grid-cols-3 gap-4">
              <Perk icon={Brush} label="Handmade" />
              <Perk icon={Truck} label="Ships in 5–7d" />
              <Perk icon={ShieldCheck} label="Secure pay" />
            </div>
          </motion.div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section>
          <Reveal>
            <h2 className="text-2xl md:text-4xl font-bold mb-10">You might also love</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {related.map((a) => (
              <ArtCard key={a.id} id={a.id} image={a.image} title={a.title} category={a.category} price={a.price} />
            ))}
          </div>
        </Section>
      )}

      
    </SiteShell>
  );
}

function Perk({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="rounded-2xl border border-border p-4 text-center">
      <Icon className="h-5 w-5 mx-auto" strokeWidth={1.25} />
      <p className="mt-2 text-xs font-medium">{label}</p>
    </div>
  );
}