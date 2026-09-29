import db from "../../lib/db";
import Product from "../../models/Product";
const seed = [
  ["Iced Latte", 28000, "Espresso, milk, ice", "Drinks", "/images/icedlatte.jpg"],
  ["Matcha Tea", 30000, "Creamy iced matcha", "Drinks", "/images/matcha.jpg"],
  ["Choco Cookies", 18000, "Box of 6", "Snacks", "/images/cookies.jpg"],
  ["Potato Chips", 15000, "Salted, 100g", "Snacks", "/images/chips.jpg"],
  ["T-90", 80856000000, "third-generation Russian main battle tank", "Vehicle", "/images/T-90M.jpg"],
  ["F-16", 1.076118000000, "American single-engine supersonic multirole fourth-generation fighter aircraft", "Vehicle", "/images/F-16.jpg"],
];
export default async function handler(req, res) {
  await db();
  if ((await Product.countDocuments()) === 0)
    await Product.insertMany(seed.map(([name, price, description, category, image]) => ({ name, price, description, category, image })));
  const { category } = req.query;
  const filter = category && category !== "All" ? { category } : {};
  res.json(await Product.find(filter).lean());
}
