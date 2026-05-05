import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShoppingCart, Bell, User, Menu, X, Mountain } from "lucide-react";
import { cart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SiteHeader() {
  const [count, setCount] = useState(0);
  const [unread, setUnread] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCount(cart.count());
    const unsub = cart.subscribe((items) => setCount(items.reduce((s, i) => s + i.quantity, 0)));
    return () => { unsub; };
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return setUnread(0);
    const load = async () => {
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false);
      setUnread(count ?? 0);
    };
    load();
    const channel = supabase
      .channel("notif-header")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/new", label: "New Arrivals" },
    { to: "/stakeholders", label: "Stakeholders" },
    { to: "/contact", label: "Contact" },
  ] as const;

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-soft)]">
            <Mountain className="h-5 w-5" />
          </span>
          MILCO
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Link to="/account" className="relative hidden sm:inline-flex">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full bg-accent px-1.5 text-[10px] text-accent-foreground">
                    {unread}
                  </Badge>
                )}
              </Button>
            </Link>
          ) : null}
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
                  {count}
                </Badge>
              )}
            </Button>
          </Link>
          {user ? (
            <Button variant="ghost" onClick={signOut} className="hidden sm:inline-flex">Sign out</Button>
          ) : (
            <Link to="/auth" className="hidden sm:inline-flex">
              <Button variant="default" className="bg-primary hover:bg-primary-glow">
                <User className="mr-1 h-4 w-4" /> Sign in
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container mx-auto flex flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-muted">
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/account" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-muted">My account</Link>
                <button onClick={signOut} className="rounded-md px-3 py-2 text-left text-sm hover:bg-muted">Sign out</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-muted">Sign in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
