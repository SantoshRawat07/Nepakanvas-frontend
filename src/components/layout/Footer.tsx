import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { ASSETS } from "@/lib/assets";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl container-px py-20 md:py-28">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <img src={ASSETS.logo} alt="NepaKanvas" className="h-10 w-10 rounded-full object-cover bg-background" />
              <span className="font-bold text-lg">NepaKanvas</span>
            </div>
            <p className="mt-6 max-w-md text-background/60 font-light leading-relaxed">
              Where ideas become art. Handcrafted canvas paintings, portraits, wall art and live event painting — made with care in Nepal.
            </p>

            <form className="mt-8 flex max-w-md gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent border border-background/20 rounded-full px-5 py-3 text-sm placeholder:text-background/40 focus:outline-none focus:border-background/60 transition-colors"
              />
              <button className="rounded-full bg-background text-foreground px-6 py-3 text-sm font-medium hover:bg-background/90 transition-colors">
                Subscribe
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
            <h4 className="text-xs uppercase tracking-[0.25em] text-background/50 mb-5">Studio</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={1.5}/>Kathmandu, Nepal</li>
              <li className="flex items-center gap-3"><Phone className="h-4 w-4" strokeWidth={1.5}/>+977 98XXXXXXXX</li>
              <li className="flex items-center gap-3"><Mail className="h-4 w-4" strokeWidth={1.5}/>hello@nepakanvas.com</li>
            </ul>
            <div className="flex gap-2 mt-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" aria-label="social" className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-background/20 hover:bg-background hover:text-foreground transition-colors">
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-background/50">
          <p>© {new Date().getFullYear()} NepaKanvas. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div className="md:col-span-2">
      <h4 className="text-xs uppercase tracking-[0.25em] text-background/50 mb-5">{title}</h4>
      <ul className="space-y-3 text-sm">
        {items.map((i) => (
          <li key={i.label}>
            <Link to={i.to} className="text-background/70 hover:text-background transition-colors">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
