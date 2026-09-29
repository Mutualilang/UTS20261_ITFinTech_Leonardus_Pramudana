import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { rp } from "../../lib/cart";
export default function Payment() {
  const { id } = useRouter().query;
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => {
    if (!id) return;
    let t;
    const load = async () => {
      const d = await fetch("/api/checkout/" + id).then((r) => r.json());
      setData(d);
      if (d.checkout?.status !== "LUNAS") t = setTimeout(load, 3000); // poll until webhook marks LUNAS
    };
    load();
    return () => clearTimeout(t);
  }, [id]);
  async function pay() {
    setBusy(true); setErr("");
    const r = await fetch("/api/payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ checkoutId: id }) });
    const d = await r.json();
    if (d.invoiceUrl) window.location.href = d.invoiceUrl; else { setErr(d.error || "Failed"); setBusy(false); }
  }
  const c = data?.checkout;
  return (
    <div className="wrap">
      <div className="bar"><Link href="/checkout">‹ Back</Link><span>Secure Checkout</span><span /></div>
      <div className="pad">
        {!c ? <p>Loading…</p> : <>
          <h3>Order Summary</h3>
          {c.items.map((i, k) => <div className="sum" key={k}><span>{i.name} × {i.qty}</span><span>{rp(i.price * i.qty)}</span></div>)}
          <div className="sum"><span>Subtotal</span><span>{rp(c.subtotal)}</span></div>
          <div className="sum"><span>Tax</span><span>{rp(c.tax)}</span></div>
          <div className="sum total"><span>Total</span><span>{rp(c.total)}</span></div>
          <p>Status: <span className={"badge" + (c.status === "LUNAS" ? " ok" : "")}>{c.status === "LUNAS" ? "LUNAS ✓" : "MENUNGGU PEMBAYARAN"}</span></p>
          {c.status !== "LUNAS" && <button className="btn block" disabled={busy} onClick={pay}>Confirm & Pay</button>}
          {c.status === "LUNAS" && <Link href="/"><button className="btn block">Back to shop</button></Link>}
          {err && <p style={{ color: "#b00020" }}>{err}</p>}
          <p className="muted">Payment method is chosen on Xendit's secure page.</p>
        </>}
      </div>
    </div>
  );
}
