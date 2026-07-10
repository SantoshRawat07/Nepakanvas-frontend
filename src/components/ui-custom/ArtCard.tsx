import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { cartActions } from "@/lib/cart";
import { OrderModal } from "./OrderModal";

interface ArtCardProps {
  id?: string;
  image: string;
  title: string;
  category: string;
  price?: string;
}

export function ArtCard({ id, image, title, category, price }: ArtCardProps) {
  const [orderOpen, setOrderOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const inner = (
    <div className="relative overflow-hidden rounded-2xl bg-secondary aspect-[4/5]">
      <motion.img
        src={image} alt={title} loading="lazy"
        variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <button
        type="button"
        aria-label="Add to wishlist"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        className="absolute top-4 right-4 h-9 w-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Heart className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </div>
  );

  return (
    <motion.article whileHover="hover" initial="rest" animate="rest" className="group relative">
      {id ? (
        <Link to="/artwork/$id" params={{ id }} className="block">{inner}</Link>
      ) : inner}

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{category}</p>
          <h3 className="mt-1.5 font-semibold text-base md:text-lg leading-snug">
            {id ? <Link to="/artwork/$id" params={{ id }} className="hover:underline underline-offset-4">{title}</Link> : title}
          </h3>
        </div>
        {price && <p className="text-sm font-semibold whitespace-nowrap">{price}</p>}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (!id) return;
            cartActions.add({ id, title, image, price: price ?? "Rs 0" });
            setAdded(true);
            setTimeout(() => setAdded(false), 1200);
          }}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-xs font-medium hover:border-foreground transition-colors"
        >
          <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.75} />
          {added ? "Added ✓" : "Add to cart"}
        </button>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); setOrderOpen(true); }}
          className="flex-1 inline-flex items-center justify-center rounded-full bg-foreground text-background px-4 py-2.5 text-xs font-medium hover:bg-[var(--hover)] transition-colors"
        >
          Order now
        </button>
      </div>

      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} artwork={id ? { id, title, price } : undefined} />
    </motion.article>
  );
}
