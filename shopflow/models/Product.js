import mongoose from "mongoose";
const S = new mongoose.Schema({ name: String, price: Number, description: String, category: String, image: String });
export default mongoose.models.Product || mongoose.model("Product", S);
