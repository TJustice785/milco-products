import dishwashing1 from "@/assets/products/dishwashing-liquid-1.jpg";
import fabricSoftener from "@/assets/products/fabric-softener.jpg";
import cornMeal from "@/assets/products/corn-meal.jpg";
import meat from "@/assets/products/meat.jpg";
import watermelon from "@/assets/products/watermelon.jpg";
import dishwashing2 from "@/assets/products/dishwashing-liquid-2.jpg";
import bayLeaves from "@/assets/products/bay-leaves.jpeg";
import matlamaCream from "@/assets/products/matlama-petroleum-cream.jpeg";
import mokorotloHat from "@/assets/products/mokorotlo-hat.jpeg";
import seanamarena1 from "@/assets/products/seanamarena-blanket-1.jpeg";
import seanamarena2 from "@/assets/products/seanamarena-blanket-2.jpeg";
import wovenBasket from "@/assets/products/woven-grass-basket.jpeg";
import peanutButter from "@/assets/products/basotho-peanut-butter.jpeg";
import { type Product } from "@/components/ProductCard";

export const NEW_PRODUCTS: Product[] = [
  {
    id: "new-prod-14",
    name: "Fresh Watermelon",
    description: "Sweet, juicy local watermelon harvested from our farmers.",
    price: 65.00,
    stock: 30,
    image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800",
    is_new: true,
    maker: "Berea Farmers",
    category_id: "50d3874b-f540-4485-8c0b-eefd71d79bd6", // Food & Pantry
  },
  {
    id: "new-prod-12",
    name: "Woven Grass Basket",
    description: "Hand-woven basket by Basotho artisans, perfect for decor or practical use.",
    price: 180.00,
    stock: 15,
    image_url: wovenBasket,
    is_new: true,
    maker: "Thaba-Bosiu Crafts",
    category_id: "48dc1905-7940-476c-b4b1-0e99f63df41a", // Crafts & Home
  },
  {
    id: "new-prod-13",
    name: "Basotho Peanut Butter",
    description: "Creamy, all-natural peanut butter made in small batches by the NUL Innovation Hub.",
    price: 45.00,
    stock: 50,
    image_url: peanutButter,
    is_new: true,
    maker: "NUL Innovation Hub",
    category_id: "50d3874b-f540-4485-8c0b-eefd71d79bd6", // Food & Pantry
  },
  {
    id: "new-prod-8",
    name: "Matlama Petroleum Cream",
    description: "Authentic Matlama branded petroleum jelly for skin protection and nourishment.",
    price: 25.00,
    stock: 50,
    image_url: matlamaCream,
    is_new: true,
    maker: "MILCO",
    category_id: "732edd22-8a16-4a6a-af37-bb92a4b7495c", // Skincare
  },
  {
    id: "new-prod-9",
    name: "Mokorotlo Basotho Hat",
    description: "Traditional hand-woven Basotho hat, an iconic symbol of Lesotho's heritage.",
    price: 150.00,
    stock: 15,
    image_url: mokorotloHat,
    is_new: true,
    maker: "Basotho Artisans",
    category_id: "48dc1905-7940-476c-b4b1-0e99f63df41a", // Crafts & Home
  },
  {
    id: "new-prod-10",
    name: "Seanamarena Basotho Blanket",
    description: "The prestigious Seanamarena blanket, known for its quality and deep cultural significance.",
    price: 850.00,
    stock: 10,
    image_url: seanamarena1,
    is_new: true,
    maker: "Aranda",
    category_id: "48dc1905-7940-476c-b4b1-0e99f63df41a", // Crafts & Home
  },
  {
    id: "new-prod-11",
    name: "Seanamarena Basotho Blanket (Design 2)",
    description: "Exquisite Seanamarena blanket featuring a unique traditional pattern.",
    price: 850.00,
    stock: 5,
    image_url: seanamarena2,
    is_new: true,
    maker: "Aranda",
    category_id: "48dc1905-7940-476c-b4b1-0e99f63df41a", // Crafts & Home
  },
  {
    id: "new-prod-1",
    name: "Lemon Fresh Dishwashing Liquid",
    description: "Infused with lemon freshness and formulated to be gentle on skin. Get professional cleaning results without the harsh chemicals.",
    price: 35.99,
    stock: 100,
    image_url: dishwashing1,
    is_new: true,
    maker: "MILCO",
    category_id: "48dc1905-7940-476c-b4b1-0e99f63df41a", // Crafts & Home
  },
  {
    id: "new-prod-2",
    name: "Fabric Softener",
    description: "Ikutloe u natefetsoe ke monko o monate o tsoarellang nako e telele, le liaparo tse bonolo. (Enjoy a long-lasting pleasant scent and soft clothes).",
    price: 60.00,
    stock: 50,
    image_url: fabricSoftener,
    is_new: true,
    maker: "MILCO",
    category_id: "48dc1905-7940-476c-b4b1-0e99f63df41a", // Crafts & Home
  },
  {
    id: "new-prod-3",
    name: "POKOMA CORN MEAL",
    description: "Phoofo ea poone (corn meal) e thusa ka ts’ilo ea lijo e hantle. (Supports healthy digestion). 2kg pack.",
    price: 35.00,
    stock: 75,
    image_url: cornMeal,
    is_new: true,
    maker: "MILCO",
    category_id: "50d3874b-f540-4485-8c0b-eefd71d79bd6", // Food & Pantry
  },
  {
    id: "new-prod-4",
    name: "Only Goat Meat",
    description: "Nama ea poli ea fumaneha. Fresh local goat meat available per kg.",
    price: 145.00,
    stock: 20,
    image_url: meat,
    is_new: true,
    maker: "MILCO",
    category_id: "bbfbbffd-4816-43dc-9158-e76208dcce8e", // Agriculture
  },
  {
    id: "new-prod-5",
    name: "Only Sheep Meat",
    description: "Nama ea nku ea fumaneha. Fresh local sheep meat available per kg.",
    price: 145.00,
    stock: 100,
    image_url: meat,
    is_new: true,
    maker: "MILCO",
    category_id: "bbfbbffd-4816-43dc-9158-e76208dcce8e", // Agriculture
  },
  {
    id: "new-prod-6",
    name: "High-Foaming Dishwashing Liquid",
    description: "Spices with benefits. Bird’s Eye Chilli is not just about the burn. It is packed with Vitamin C to boost your immunity and capsaicin to fire up your metabolism.",
    price: 39.99,
    stock: 150,
    image_url: dishwashing2,
    is_new: true,
    maker: "MILCO",
    category_id: "50d3874b-f540-4485-8c0b-eefd71d79bd6", // Food & Pantry
  },
  {
    id: "new-prod-7",
    name: "Bay Leaves",
    description: "Power through grease with this high-foaming dishwashing liquid tough on stains, gentle on your hands. Enjoy a fresh lemon scent while its pH-balanced formula delivers maximum cleaning power.",
    price: 20.00,
    stock: 200,
    image_url: bayLeaves,
    is_new: true,
    maker: "MILCO",
    category_id: "48dc1905-7940-476c-b4b1-0e99f63df41a", // Crafts & Home
  },
];
