import db from "../../../lib/db";
import Checkout from "../../../models/Checkout";
import Payment from "../../../models/Payment";
export default async function handler(req, res) {
  await db();
  const checkout = await Checkout.findById(req.query.id).lean();
  if (!checkout) return res.status(404).json({ error: "Not found" });
  const payment = await Payment.findOne({ checkoutId: req.query.id }).sort({ createdAt: -1 }).lean();
  res.json({ checkout, payment });
}
