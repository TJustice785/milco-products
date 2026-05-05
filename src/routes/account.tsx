import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, Package, CheckCircle2, Key } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/account")({
  component: Account,
  head: () => ({ meta: [{ title: "My account — MILCO" }] }),
});

interface Order { id: string; total: number; status: string; created_at: string; }
interface Notif { id: string; title: string; body: string | null; link: string | null; read: boolean; created_at: string; }

function Account() {
  const nav = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [savedCreds, setSavedCreds] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { nav({ to: "/auth" }); return; }
      setUser(data.session.user);
    });
    
    // Load saved credentials from localStorage
    const creds = JSON.parse(localStorage.getItem("milco_credentials") || "[]");
    setSavedCreds(creds);
  }, [nav]);

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as Order[]) ?? []));
    const loadNotif = async () => {
      const { data } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
      setNotifs((data as Notif[]) ?? []);
    };
    loadNotif();
    const ch = supabase.channel("notif-account")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, (payload) => {
        toast.info((payload.new as any).title);
        loadNotif();
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifs((n) => n.map((x) => x.id === id ? { ...x, read: true } : x));
  };

  if (!user) return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading…</div>;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <header className="mb-10">
        <h1 className="font-display text-4xl font-bold">My account</h1>
        <p className="mt-1 text-muted-foreground">Welcome back, {user.email}</p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-semibold">My orders</h2>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet. <Link to="/products" className="text-primary hover:underline">Start shopping</Link>.</p>
          ) : (
            <ul className="space-y-3">
              {orders.map((o) => (
                <li key={o.id} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
                  <div>
                    <p className="font-medium">Order #{o.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">M{Number(o.total).toFixed(2)}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-clay">
                      <CheckCircle2 className="h-3 w-3" /> {o.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-semibold">Notifications</h2>
          </div>
          {notifs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notifications yet.</p>
          ) : (
            <ul className="space-y-3">
              {notifs.map((n) => (
                <li key={n.id} className={`rounded-xl border p-3 text-sm transition ${n.read ? "border-border bg-background" : "border-accent/40 bg-accent/5"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{n.title}</p>
                      {n.body && <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>}
                      <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">{new Date(n.created_at).toLocaleString()}</p>
                    </div>
                    {!n.read && (
                      <Button size="sm" variant="ghost" onClick={() => markRead(n.id)} className="shrink-0">Mark read</Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-8">
        <Card className="overflow-hidden border-border bg-card shadow-[var(--shadow-soft)]">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" /> My Saved Credentials
            </CardTitle>
            <CardDescription>Your account details for next time.</CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            {savedCreds.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No credentials saved yet.</p>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {savedCreds.map((c, i) => (
                    <div key={i} className="rounded-lg border border-border bg-muted/20 p-3 text-xs">
                      <div className="mb-1 flex justify-between font-bold">
                        <span>{c.name}</span>
                        <span className="text-[10px] font-normal text-muted-foreground">{c.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span>{c.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pass:</span>
                        <span className="font-mono">{c.password}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    localStorage.removeItem("milco_credentials");
                    setSavedCreds([]);
                    toast.info("Saved credentials cleared");
                  }}
                >
                  Clear all saved credentials
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
