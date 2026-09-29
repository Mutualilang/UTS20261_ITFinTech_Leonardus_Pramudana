import db from "../../../lib/db";
import Checkout from "../../../models/Checkout";
import Payment from "../../../models/Payment";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (req.headers["x-callback-token"] !== process.env.XENDIT_CALLBACK_TOKEN) return res.status(401).json({ error: "Invalid token" });
  await db();
  const { id, status } = req.body;
  if (status === "PAID" || status === "SETTLED") {
    const p = await Payment.findOneAndUpdate({ xenditInvoiceId: id }, { status: "PAID", paidAt: new Date() }, { new: true });
    if (p) await Checkout.findByIdAndUpdate(p.checkoutId, { status: "LUNAS" });
  }
  res.status(200).json({ ok: true });
}
