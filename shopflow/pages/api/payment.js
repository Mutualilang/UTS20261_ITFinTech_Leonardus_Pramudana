import db from "../../lib/db";
import Checkout from "../../models/Checkout";
import Payment from "../../models/Payment";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  await db();
  const checkout = await Checkout.findById(req.body.checkoutId);
  if (!checkout) return res.status(404).json({ error: "Checkout not found" });
  if (checkout.status === "LUNAS") return res.status(400).json({ error: "Already paid" });
  const existing = await Payment.findOne({ checkoutId: String(checkout._id), status: "PENDING" });
  if (existing) return res.json({ invoiceUrl: existing.invoiceUrl });
  const r = await fetch("https://api.xendit.co/v2/invoices", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(process.env.XENDIT_SECRET_KEY + ":").toString("base64"),
    },
    body: JSON.stringify({
      external_id: `order-${checkout._id}-${Date.now()}`,
      amount: checkout.total,
      currency: "IDR",
      description: `Order ${checkout._id}`,
      success_redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/${checkout._id}`,
    }),
  });
  const inv = await r.json();
  if (!r.ok) return res.status(500).json({ error: inv.message || "Xendit error" });
  await Payment.create({ checkoutId: String(checkout._id), xenditInvoiceId: inv.id, invoiceUrl: inv.invoice_url, amount: checkout.total });
  res.json({ invoiceUrl: inv.invoice_url });
}
