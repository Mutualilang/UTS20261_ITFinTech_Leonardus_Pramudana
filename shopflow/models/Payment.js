import mongoose from "mongoose";
const S = new mongoose.Schema({
  checkoutId: String, xenditInvoiceId: String, invoiceUrl: String, amount: Number,
  status: { type: String, default: "PENDING" }, // PENDING | PAID
  paidAt: Date,
}, { timestamps: true });
export default mongoose.models.Payment || mongoose.model("Payment", S);
