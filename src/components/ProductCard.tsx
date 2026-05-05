import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cart } from "@/lib/cart";
import { toast } from "sonner";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  is_new: boolean;
  maker: string | null;
  category_id?: string | null;
}

export function ProductCard({ product }: { product: Product }) {
  const out = product.stock <= 0;
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-[var(--gradient-card)] shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
      <Link to="/products/$id" params={{ id: product.id }} className="relative block aspect-square overflow-hidden bg-muted">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : null}
        {product.is_new && (
          <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">New</Badge>
        )}
        {out && <Badge className="absolute right-3 top-3 bg-destructive">Out of stock</Badge>}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        {product.maker && <span className="text-xs uppercase tracking-wider text-muted-foreground">{product.maker}</span>}
        <Link to="/products/$id" params={{ id: product.id }} className="mt-1 font-display text-lg font-semibold leading-snug hover:text-primary">
          {product.name}
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-xl font-bold text-primary">M{product.price.toFixed(2)}</span>
          <Button
            size="sm"
            disabled={out}
            onClick={() => {
              cart.add({
                product_id: product.id,
                name: product.name,
                price: Number(product.price),
                image_url: product.image_url,
                stock: product.stock,
              });
              toast.success(`${product.name} added to cart`);
            }}
            className="bg-primary hover:bg-primary-glow"
          >
            <ShoppingCart className="mr-1 h-4 w-4" /> Add
          </Button>
        </div>
      </div>
    </article>
  );
}
