import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Phone, MapPin, Mail, Mountain } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--gradient-hero)] text-primary-foreground">
              <Mountain className="h-5 w-5" />
            </span>
            MILCO
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Made In Lesotho Cooperative. Proudly retailing only the finest Basotho-made products.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/products" className="hover:text-primary">All products</Link></li>
            <li><Link to="/new" className="hover:text-primary">New arrivals</Link></li>
            <li><Link to="/stakeholders" className="hover:text-primary">Stakeholders</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> Sefika Complex, Maseru, Lesotho</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +266 5892 1648</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@milco.co.ls</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Follow</h4>
          <div className="mt-4 flex gap-3">
            <a href="https://facebook.com" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-background text-muted-foreground transition hover:bg-primary hover:text-primary-foreground">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full bg-background text-muted-foreground transition hover:bg-primary hover:text-primary-foreground">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="grid h-10 w-10 place-items-center rounded-full bg-background text-muted-foreground transition hover:bg-primary hover:text-primary-foreground">
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} MILCO — Made In Lesotho Cooperative. Founded by the NUL Innovation Hub.
        </div>
      </div>
    </footer>
  );
}
