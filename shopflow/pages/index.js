import { useEffect, useState } from "react";
import Link from "next/link";
import { addToCart, cartCount, rp } from "../lib/cart";
const cats = ["All", "Drinks", "Snacks", "Vehicle"];
export default function Home() {
  const [products, setProducts] = useState([]);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [count, setCount] = useState(0);
  useEffect(() => setCount(cartCount()), []);
  useEffect(() => { fetch("/api/products?category=" + cat).then((r) => r.json()).then(setProducts); }, [cat]);
  const list = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="wrap">
      <div className="bar"><span>ShopFlow</span><Link href="/checkout">🛒 {count}</Link></div>
      <div className="pad">
        <input className="search" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="tabs">{cats.map((c) => <button key={c} className={"tab" + (c === cat ? " on" : "")} onClick={() => setCat(c)}>{c}</button>)}</div>
        {list.map((p) => (
          <div className="row" key={p._id}>
            <div className="img">{p.image && <img src={p.image} alt={p.name} />}</div>
            <div className="grow"><b>{p.name}</b><div>{rp(p.price)}</div><div className="muted">{p.description}</div>
              <button className="btn small" onClick={() => setCount(addToCart(p))}>Add +</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
