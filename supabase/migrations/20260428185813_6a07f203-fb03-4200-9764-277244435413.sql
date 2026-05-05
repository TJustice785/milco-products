
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'customer');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url TEXT,
  is_new BOOLEAN NOT NULL DEFAULT false,
  maker TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Profiles viewable by owner" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles updatable by owner" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Profiles insertable by owner" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Roles viewable by owner" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Categories public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Categories admin write" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Products public read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Products admin write" ON public.products FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Orders viewable by owner" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Orders insertable by owner" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Orders updatable by owner" ON public.orders FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Order items viewable by order owner" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);
CREATE POLICY "Order items insertable by order owner" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);

CREATE POLICY "Notifications viewable by owner" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Notifications updatable by owner" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Notifications insertable by owner" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Checkout RPC: validates stock, decrements stock, creates order + items, generates recommendations & notifications
CREATE OR REPLACE FUNCTION public.checkout_cart(_items jsonb, _shipping_address text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid uuid := auth.uid();
  _order_id uuid;
  _total numeric := 0;
  _item jsonb;
  _product RECORD;
  _qty int;
  _bought_categories uuid[];
  _rec RECORD;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF jsonb_array_length(_items) = 0 THEN RAISE EXCEPTION 'Cart is empty'; END IF;

  -- Validate stock & compute total
  FOR _item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    _qty := (_item->>'quantity')::int;
    SELECT * INTO _product FROM public.products WHERE id = (_item->>'product_id')::uuid FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Product not found'; END IF;
    IF _product.stock < _qty THEN RAISE EXCEPTION 'Insufficient stock for %', _product.name; END IF;
    _total := _total + (_product.price * _qty);
  END LOOP;

  -- Create order
  INSERT INTO public.orders(user_id, total, status, shipping_address)
  VALUES (_uid, _total, 'paid', _shipping_address)
  RETURNING id INTO _order_id;

  -- Create items, reduce stock, collect categories
  FOR _item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    _qty := (_item->>'quantity')::int;
    SELECT * INTO _product FROM public.products WHERE id = (_item->>'product_id')::uuid;
    INSERT INTO public.order_items(order_id, product_id, quantity, unit_price)
    VALUES (_order_id, _product.id, _qty, _product.price);
    UPDATE public.products SET stock = stock - _qty WHERE id = _product.id;
    IF _product.category_id IS NOT NULL THEN
      _bought_categories := array_append(_bought_categories, _product.category_id);
    END IF;
  END LOOP;

  -- Order confirmation notification
  INSERT INTO public.notifications(user_id, title, body, link)
  VALUES (_uid, 'Order confirmed 🎉', 'Thank you! Your order of M' || _total || ' has been received.', '/account');

  -- Recommendation notifications based on bought categories
  FOR _rec IN
    SELECT p.id, p.name FROM public.products p
    WHERE p.category_id = ANY(_bought_categories)
      AND p.id NOT IN (SELECT (i->>'product_id')::uuid FROM jsonb_array_elements(_items) i)
      AND p.stock > 0
    LIMIT 3
  LOOP
    INSERT INTO public.notifications(user_id, title, body, link)
    VALUES (_uid, 'You may also like: ' || _rec.name, 'Based on your recent purchase, we think you''ll love this.', '/products/' || _rec.id);
  END LOOP;

  RETURN _order_id;
END;
$$;

-- Seed categories
INSERT INTO public.categories(name, slug) VALUES
  ('Food & Pantry', 'food'),
  ('Skincare', 'skincare'),
  ('Crafts & Home', 'crafts'),
  ('Stationery', 'stationery'),
  ('Agriculture', 'agriculture');

-- Seed products
INSERT INTO public.products(name, description, price, stock, category_id, image_url, is_new, maker) VALUES
  ('Pure Mountain Honey', 'Raw, unfiltered honey harvested from the highlands of Lesotho.', 85.00, 30, (SELECT id FROM categories WHERE slug='food'), 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800', true, 'Maluti Honey Co-op'),
  ('Basotho Peanut Butter', 'Creamy, all-natural peanut butter made in small batches.', 45.00, 50, (SELECT id FROM categories WHERE slug='food'), 'https://images.unsplash.com/photo-1612207973171-2deeed1c2cea?w=800', true, 'NUL Innovation Hub'),
  ('Highland Muesli', 'Wholesome muesli with locally grown oats and dried fruit.', 60.00, 25, (SELECT id FROM categories WHERE slug='food'), 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=800', false, 'Maseru Mills'),
  ('Rosehip Glycerin Serum', 'Nourishing skincare with wild rosehip from Ts''ehlanyane.', 120.00, 20, (SELECT id FROM categories WHERE slug='skincare'), 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800', true, 'Rosehip Lesotho'),
  ('Aloe & Honey Soap', 'Handmade soap bar with local aloe and honey.', 35.00, 60, (SELECT id FROM categories WHERE slug='skincare'), 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800', false, 'Pure Basotho Bath'),
  ('Woven Grass Basket', 'Hand-woven basket by Basotho artisans.', 180.00, 15, (SELECT id FROM categories WHERE slug='crafts'), 'https://images.unsplash.com/photo-1516527594805-6e3b6203d233?w=800', false, 'Thaba-Bosiu Crafts'),
  ('Basotho Blanket Throw', 'Iconic patterned throw, woven with pride.', 650.00, 8, (SELECT id FROM categories WHERE slug='crafts'), 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800', true, 'Maseru Textiles'),
  ('Recycled Notebook A5', 'Eco-friendly notebook made from recycled paper.', 40.00, 100, (SELECT id FROM categories WHERE slug='stationery'), 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800', false, 'Green Pages LS'),
  ('Fresh Mountain Veggies', 'Seasonal vegetable box from local farmers.', 95.00, 18, (SELECT id FROM categories WHERE slug='agriculture'), 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800', true, 'Berea Farmers'),
  ('Wooden Cutting Board', 'Hand-finished cutting board from indigenous wood.', 220.00, 12, (SELECT id FROM categories WHERE slug='crafts'), 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?w=800', false, 'Mokhotlong Wood');
