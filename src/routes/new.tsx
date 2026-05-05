import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type Product } from "@/components/ProductCard";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/new")({
  component: NewArrivals,
  head: () => ({
    meta: [
      { title: "New Arrivals — MILCO" },
      { name: "description", content: "Discover MILCO's newest Made-in-Lesotho products and subscription bundles." },
    ],
  }),
});

function NewArrivals() {
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => {
    supabase.from("products").select("*").eq("is_new", true).order("created_at", { ascending: false })
      .then(({ data }) => setItems((data as Product[]) ?? []));
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-10 max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
          <Sparkles className="h-3.5 w-3.5" /> Just landed
        </span>
        <h1 className="mt-4 font-display text-4xl font-bold">New arrivals & subscriptions</h1>
        <p className="mt-3 text-muted-foreground">
          Fresh batches from our Basotho makers — and our new monthly Pantry, Skincare and Crafts subscription boxes.
        </p>
      </header>

      <h2 className="mb-4 font-display text-xl font-semibold">Subscription bundles</h2>
      <div className="mb-12 grid gap-5 md:grid-cols-3">
        {[
          { name: "Pantry Box", price: 280, body: "Honey, peanut butter, muesli & seasonal goodies. Delivered monthly." },
          { name: "Skincare Box", price: 320, body: "Curated rosehip, aloe & natural skincare from local makers." },
          { name: "Crafts Box", price: 450, body: "A surprise hand-made craft each month, supporting a different artisan." },
        ].map((b) => (
          <div key={b.name} className="rounded-2xl border border-border bg-[var(--gradient-card)] p-6 shadow-[var(--shadow-soft)]">
            <h3 className="font-display text-xl font-semibold">{b.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
            <p className="mt-4 font-display text-2xl font-bold text-primary">M{b.price}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
          </div>
        ))}
      </div>

      <h2 className="mb-4 font-display text-xl font-semibold">New products</h2>
      {items.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No new arrivals right now — check back soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
