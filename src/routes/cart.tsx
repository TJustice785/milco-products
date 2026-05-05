import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cart, type CartItem } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Your Cart — MILCO" }] }),
});

function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    setItems(cart.get());
    const unsub = cart.subscribe(setItems);
    return () => { unsub; };
  }, []);

  const total = items.reduce((s, i) => s + i.quantity * i.price, 0);

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center px-4 py-24 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary text-primary">
          <ShoppingBag className="h-9 w-9" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Discover authentic Basotho products to fill it up.</p>
        <Link to="/products" className="mt-6">
          <Button className="bg-primary hover:bg-primary-glow">Shop products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 font-display text-4xl font-bold">Your cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it.product_id} className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                {it.image_url && <img src={it.image_url} alt={it.name} className="h-full w-full object-cover" />}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold">{it.name}</h3>
                  <button onClick={() => cart.remove(it.product_id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">M{it.price.toFixed(2)} each</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => cart.setQuantity(it.product_id, it.quantity - 1)}>
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-8 text-center text-sm font-semibold">{it.quantity}</span>
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => cart.setQuantity(it.product_id, it.quantity + 1)} disabled={it.quantity >= it.stock}>
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <span className="font-display text-lg font-bold text-primary">M{(it.price * it.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-[var(--gradient-card)] p-6 shadow-[var(--shadow-elegant)]">
          <h2 className="font-display text-xl font-semibold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>M{total.toFixed(2)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>Calculated at checkout</dd></div>
          </dl>
          <div className="my-4 h-px bg-border" />
          <div className="flex items-baseline justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-display text-2xl font-bold text-primary">M{total.toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="mt-6 block">
            <Button className="w-full bg-primary hover:bg-primary-glow">Proceed to checkout</Button>
          </Link>
        </aside>
      </div>
    </div>
  );
}
