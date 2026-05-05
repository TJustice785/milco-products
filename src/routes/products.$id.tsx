import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { NEW_PRODUCTS } from "@/lib/new-products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard, type Product } from "@/components/ProductCard";
import { cart } from "@/lib/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$id")({
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [p, setP] = useState<(Product & { category_id: string | null }) | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const local = NEW_PRODUCTS.find(p => p.id === id);
    if (local) {
      setP({ ...local, category_id: null });
      return;
    }
    supabase.from("products").select("*").eq("id", id).maybeSingle()
      .then(({ data }) => setP(data as any));
  }, [id]);

  useEffect(() => {
    if (!p?.category_id) return;
    supabase.from("products").select("*").eq("category_id", p.category_id).neq("id", p.id).limit(4)
      .then(({ data }) => {
        const fetched = (data as Product[]) ?? [];
        const localRelated = NEW_PRODUCTS.filter(lp => lp.category_id === p.category_id && lp.id !== p.id);
        setRelated([...localRelated, ...fetched].slice(0, 4));
      });
  }, [p]);

  if (!p) return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading…</div>;

  const out = p.stock <= 0;

  return (
    <div className="container mx-auto px-4 py-10">
      <button onClick={() => navigate({ to: "/products" })} className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to products
      </button>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-muted shadow-[var(--shadow-elegant)]">
          {p.image_url && <img src={p.image_url} alt={p.name} className="aspect-square w-full object-cover" />}
        </div>
        <div>
          {p.is_new && <Badge className="bg-accent text-accent-foreground">New arrival</Badge>}
          {p.maker && <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">By {p.maker}</p>}
          <h1 className="mt-2 font-display text-4xl font-bold">{p.name}</h1>
          <p className="mt-4 text-3xl font-bold text-primary">M{Number(p.price).toFixed(2)}</p>
          <p className="mt-6 text-muted-foreground">{p.description}</p>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1">
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" onClick={() => setQty(Math.max(1, qty - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" onClick={() => setQty(Math.min(p.stock, qty + 1))}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              size="lg"
              disabled={out}
              onClick={() => {
                cart.add({ product_id: p.id, name: p.name, price: Number(p.price), image_url: p.image_url, stock: p.stock }, qty);
                toast.success(`Added ${qty} × ${p.name} to cart`);
              }}
              className="bg-primary hover:bg-primary-glow"
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> {out ? "Out of stock" : "Add to cart"}
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">{p.stock} in stock</p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl font-bold">You may also like</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {related.map((r) => <ProductCard key={r.id} product={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
