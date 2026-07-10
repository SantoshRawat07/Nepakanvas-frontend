import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

function Footer() {
  return (
    <footer className="relative bg-white text-foreground">
      {/* stitched canvas-edge divider instead of a flat border */}
      <div
        aria-hidden
        className="h-px w-full opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, currentColor 0 6px, transparent 6px 14px)",
          color: "#C2542F",
        }}
      />

      <div className="mx-auto max-w-7xl container-px py-20 md:py-28">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <img
                src="/nepakanvaslogo.jpg"
                alt="NepaKanvas"
                className="h-10 w-10 rounded-full object-cover border border-foreground/10"
              />
              <span className="font-bold text-lg">NepaKanvas</span>
            </div>
            <p className="mt-6 max-w-md text-foreground/60 font-light leading-relaxed">
              Where ideas become art. Handcrafted canvas paintings, portraits, wall art and live
              event painting — made with care in Nepal.
            </p>

            <form className="mt-8 flex max-w-md gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent border border-foreground/15 rounded-full px-5 py-3 text-sm placeholder:text-foreground/40 focus:outline-none focus:border-foreground/40 transition-colors"
              />
              <button
                className="group rounded-full px-6 py-3 text-sm font-medium text-white transition-colors flex items-center gap-1.5"
                style={{ backgroundColor: "#000000" }}
              >
                Subscribe
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>
          </div>

          <FooterCol
            title="Explore"
            items={[
              { label: "Home", to: "/" },
              { label: "Our Arts", to: "/gallery" },
              { label: "Services", to: "/services" },
              { label: "Art Classes", to: "/classes" },
              { label: "About", to: "/about" },
            ]}
          />
          <FooterCol
            title="Support"
            items={[
              { label: "Contact", to: "/contact" },
              { label: "Custom Orders", to: "/services" },
              { label: "Shipping", to: "/contact" },
              { label: "FAQ", to: "/contact" },
            ]}
          />

          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.25em] text-foreground/40 mb-5">Studio</h4>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={1.5} />
                Kathmandu, Nepal
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4" strokeWidth={1.5} />
                +977 9864865976
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4" strokeWidth={1.5} />
                hello@nepakanvas.com
              </li>
            </ul>
            <div className="flex gap-2 mt-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                 <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-foreground/15 hover:text-black transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1000")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-foreground/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-foreground/45">
          <p>© {new Date().getFullYear()} NepaKanvas. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div className="md:col-span-2">
      <h4 className="text-xs uppercase tracking-[0.25em] text-foreground/40 mb-5">{title}</h4>
      <ul className="space-y-3 text-sm">
        {items.map((i) => (
          <li key={i.label}>
            <Link href={i.to} className="text-foreground/70 hover:text-foreground transition-colors">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { Footer };