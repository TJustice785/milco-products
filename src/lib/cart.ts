// Simple localStorage-backed cart with pub/sub
export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
  stock: number;
}

const KEY = "milco_cart_v1";
type Listener = (items: CartItem[]) => void;
const listeners = new Set<Listener>();

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l(items));
}

export const cart = {
  get: read,
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  add(item: Omit<CartItem, "quantity">, qty = 1) {
    const items = read();
    const existing = items.find((i) => i.product_id === item.product_id);
    if (existing) {
      existing.quantity = Math.min(existing.stock, existing.quantity + qty);
    } else {
      items.push({ ...item, quantity: Math.min(item.stock, qty) });
    }
    write(items);
  },
  setQuantity(product_id: string, qty: number) {
    const items = read();
    const it = items.find((i) => i.product_id === product_id);
    if (!it) return;
    it.quantity = Math.max(1, Math.min(it.stock, qty));
    write(items);
  },
  remove(product_id: string) {
    write(read().filter((i) => i.product_id !== product_id));
  },
  clear() {
    write([]);
  },
  count() {
    return read().reduce((s, i) => s + i.quantity, 0);
  },
  total() {
    return read().reduce((s, i) => s + i.quantity * i.price, 0);
  },
};
