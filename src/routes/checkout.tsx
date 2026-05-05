import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CreditCard, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cart, type CartItem } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
  head: () => ({ meta: [{ title: "Checkout — MILCO" }] }),
});

function Checkout() {
  const nav = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => { setItems(cart.get()); }, []);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
  }, []);

  const total = items.reduce((s, i) => s + i.quantity * i.price, 0);

  const placeOrder = async () => {
    if (!user) {
      toast.error("Please sign in to checkout");
      nav({ to: "/auth", search: { redirect: "/checkout" } as any });
      return;
    }
    if (!address.trim()) return toast.error("Please enter a shipping address");
    setLoading(true);
    const payload = items.map((i) => ({ product_id: i.product_id, quantity: i.quantity }));
    const { data, error } = await supabase.rpc("checkout_cart", {
      _items: payload as any,
      _shipping_address: address,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    cart.clear();
    toast.success("Payment successful! Order confirmed.");
    nav({ to: "/account" });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 font-display text-4xl font-bold">Checkout</h1>
      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-lg font-semibold">Shipping address</h2>
            <div className="mt-4">
              <Label htmlFor="addr">Delivery address</Label>
              <Textarea id="addr" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, town, district, Lesotho" />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <CreditCard className="h-5 w-5 text-primary" /> Payment
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">Demo simulated payment — no real card will be charged.</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="card">Card number</Label>
                <Input id="card" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" />
              </div>
              <div>
                <Label htmlFor="name">Name on card</Label>
                <Input id="name" placeholder="Your name" defaultValue={user?.email?.split("@")[0] ?? ""} />
              </div>
              <div>
                <Label htmlFor="exp">Expiry</Label>
                <Input id="exp" placeholder="MM/YY" defaultValue="12/28" />
              </div>
              <div>
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" defaultValue="123" />
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-[var(--gradient-card)] p-6 shadow-[var(--shadow-elegant)]">
          <h2 className="font-display text-xl font-semibold">Summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((i) => (
              <li key={i.product_id} className="flex justify-between gap-2">
                <span className="text-muted-foreground">{i.name} × {i.quantity}</span>
                <span>M{(i.price * i.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="my-4 h-px bg-border" />
          <div className="flex items-baseline justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-display text-2xl font-bold text-primary">M{total.toFixed(2)}</span>
          </div>
          <Button onClick={placeOrder} disabled={loading} className="mt-6 w-full bg-primary hover:bg-primary-glow">
            <Lock className="mr-2 h-4 w-4" /> {loading ? "Processing…" : `Pay M${total.toFixed(2)}`}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Stock will be reduced upon successful payment.</p>
        </aside>
      </div>
    </div>
  );
}
