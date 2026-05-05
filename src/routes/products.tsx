import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type Product } from "@/components/ProductCard";
import { NEW_PRODUCTS } from "@/lib/new-products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/products")({
  component: Products,
  head: () => ({
    meta: [
      { title: "All Products — MILCO" },
      { name: "description", content: "Browse all authentic Made-in-Lesotho products: honey, peanut butter, skincare, crafts, stationery and more." },
    ],
  }),
});

interface Cat { id: string; name: string; slug: string; }

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    supabase.from("products").select("*").order("created_at", { ascending: false })
      .then(({ data }) => {
        const fetched = (data as Product[]) ?? [];
        // Filter out database products that are already in NEW_PRODUCTS (by name)
        // OR those that don't have a valid image URL
        const localNames = new Set(NEW_PRODUCTS.map(p => p.name));
        const namesToHide = new Set([...localNames, "Pure Mountain Honey"]);
        const filteredFetched = fetched.filter(p => 
          !namesToHide.has(p.name) && p.image_url && p.image_url.startsWith('http')
        );
        setProducts([...NEW_PRODUCTS, ...filteredFetched]);
      });
    supabase.from("categories").select("*").order("name")
      .then(({ data }) => setCats((data as Cat[]) ?? []));
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p: any) => {
      const matchCat = cat === "all" || p.category_id === cat;
      const matchQ = !q || p.name.toLowerCase().includes(q.toLowerCase()) || (p.description ?? "").toLowerCase().includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [products, cat, q]);

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold">All products</h1>
        <p className="mt-2 text-muted-foreground">Everything we stock is proudly Made in Lesotho.</p>
      </header>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant={cat === "all" ? "default" : "outline"} onClick={() => setCat("all")} className={cat === "all" ? "bg-primary" : ""}>All</Button>
          {cats.map((c) => (
            <Button key={c.id} size="sm" variant={cat === c.id ? "default" : "outline"} onClick={() => setCat(c.id)} className={cat === c.id ? "bg-primary" : ""}>{c.name}</Button>
          ))}
        </div>
        <Input placeholder="Search products..." value={q} onChange={(e) => setQ(e.target.value)} className="md:max-w-xs" />
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">No products match your search.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
