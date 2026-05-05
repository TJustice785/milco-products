import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Truck, Users, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type Product } from "@/components/ProductCard";
import { NEW_PRODUCTS } from "@/lib/new-products";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero-products.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "MILCO — Authentic Made-in-Lesotho Products" },
      { name: "description", content: "Shop honey, peanut butter, skincare, crafts and more — all proudly made in Lesotho. Supporting Basotho artisans and farmers." },
    ],
  }),
});

function Index() {
  const [featured, setFeatured] = useState<Product[]>([]);
  useEffect(() => {
    supabase.from("products").select("*").limit(15).order("created_at", { ascending: false })
      .then(({ data }) => {
        const fetched = (data as Product[]) ?? [];
        // Filter out database products that are already in NEW_PRODUCTS (by name)
        // OR those that don't have a valid image URL
        const localNames = new Set(NEW_PRODUCTS.map(p => p.name));
        const namesToHide = new Set([...localNames, "Pure Mountain Honey"]);
        const filteredFetched = fetched.filter(p => 
          !namesToHide.has(p.name) && p.image_url && p.image_url.startsWith('http')
        );
        setFeatured([...NEW_PRODUCTS.slice(0, 6), ...filteredFetched]);
      });
  }, []);

  return (
    <div>
      {/* Promo Banner — links to /new */}
      <Link to="/new" className="block bg-[var(--gradient-banner)] text-clay-foreground transition hover:brightness-110">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-3 px-4 py-3 text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          <span>Fresh from the highlands — discover our newest Made-in-Lesotho arrivals & subscription bundles.</span>
          <span className="inline-flex items-center gap-1 underline-offset-4 hover:underline">
            Shop New <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto grid gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
              <Heart className="h-3.5 w-3.5 text-clay" /> 100% Made in Lesotho
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] text-foreground md:text-6xl">
              The taste, craft & soul of <span className="text-primary">Lesotho</span> — delivered.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              MILCO is a cooperative supermarket founded by the NUL Innovation Hub. We bring you the very best of Basotho honey, food, skincare, fashion and crafts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products">
                <Button size="lg" className="bg-primary hover:bg-primary-glow shadow-[var(--shadow-elegant)]">
                  Shop products <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/stakeholders">
                <Button size="lg" variant="outline">Our stakeholders</Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-[var(--gradient-hero)] opacity-20 blur-3xl" />
            <img src={hero} alt="A flat-lay of authentic Lesotho-made products including honey, peanut butter, skincare and woven baskets" width={1600} height={900} className="relative rounded-3xl shadow-[var(--shadow-elegant)]" />
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="container mx-auto grid gap-6 px-4 py-12 md:grid-cols-3">
        {[
          { icon: Heart, title: "100% Local", body: "Every product is sourced from Basotho farmers, makers and artisans." },
          { icon: Users, title: "Cooperative model", body: "Profits support the local entrepreneurs behind every item." },
          { icon: Truck, title: "Delivered nationwide", body: "Order online and we'll bring it to your doorstep across Lesotho." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </section>

      {/* Featured products */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold">Featured products</h2>
            <p className="mt-1 text-muted-foreground">Hand-picked favourites from our cooperative.</p>
          </div>
          <Link to="/products" className="hidden text-sm font-medium text-primary hover:underline md:inline">View all →</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
