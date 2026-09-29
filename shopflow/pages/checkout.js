import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getCart, setQty, clearCart, rp } from "../lib/cart";
export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useState({});
  const [busy, setBusy] = useState(false);
  useEffect(() => setCart(getCart()), []);
  const items = Object.values(cart);
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.11);
  async function next() {
    setBusy(true);
    const r = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: items.map((i) => ({ productId: i._id, qty: i.qty })) }) });
    const d = await r.json();
    if (d.id) { clearCart(); router.push("/payment/" + d.id); } else setBusy(false);
  }
  return (
    <div className="wrap">
      <div className="bar"><Link href="/">‹ Back</Link><span>Checkout</span><span /></div>
      <div className="pad">
        {!items.length && <p>Your cart is empty.</p>}
        {items.map((i) => (
          <div className="row" key={i._id}>
            <div className="img">{i.image && <img src={i.image} alt={i.name} />}</div>
            <div className="grow"><b>{i.name}</b>
              <div className="qty"><button onClick={() => setCart({ ...setQty(i._id, i.qty - 1) })}>−</button>{i.qty}<button onClick={() => setCart({ ...setQty(i._id, i.qty + 1) })}>+</button></div></div>
            <b>{rp(i.price * i.qty)}</b>
          </div>
        ))}
        <div style={{ marginTop: 16 }}>
          <div className="sum"><span>Subtotal</span><span>{rp(subtotal)}</span></div>
          <div className="sum"><span>Tax (11%)</span><span>{rp(tax)}</span></div>
          <div className="sum total"><span>Total</span><span>{rp(subtotal + tax)}</span></div>
        </div>
        <button className="btn block" disabled={!items.length || busy} onClick={next}>Continue to Payment →</button>
      </div>
    </div>
  );
}
