import db from "../../../lib/db";
import Product from "../../../models/Product";
import Checkout from "../../../models/Checkout";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  await db();
  const { items = [] } = req.body;
  const products = await Product.find({ _id: { $in: items.map((i) => i.productId) } }).lean();
  const lines = items.map((i) => {
    const p = products.find((x) => String(x._id) === i.productId);
    return p && i.qty > 0 ? { productId: i.productId, name: p.name, price: p.price, qty: i.qty } : null;
  }).filter(Boolean);
  if (!lines.length) return res.status(400).json({ error: "Cart is empty" });
  const subtotal = lines.reduce((a, l) => a + l.price * l.qty, 0);
  const tax = Math.round(subtotal * 0.11);
  const c = await Checkout.create({ items: lines, subtotal, tax, total: subtotal + tax });
  res.json({ id: c._id });
}
