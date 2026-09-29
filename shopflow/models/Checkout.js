import mongoose from "mongoose";
const S = new mongoose.Schema({
  items: [{ productId: String, name: String, price: Number, qty: Number }],
  subtotal: Number, tax: Number, total: Number,
  status: { type: String, default: "PENDING" }, // PENDING | LUNAS
}, { timestamps: true });
export default mongoose.models.Checkout || mongoose.model("Checkout", S);
