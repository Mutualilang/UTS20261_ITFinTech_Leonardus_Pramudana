const K = "cart";
export const rp = (n) => "Rp" + Number(n).toLocaleString("id-ID");
export const getCart = () => { try { return JSON.parse(localStorage.getItem(K)) || {}; } catch { return {}; } };
const save = (c) => localStorage.setItem(K, JSON.stringify(c));
export const cartCount = () => Object.values(getCart()).reduce((a, i) => a + i.qty, 0);
export const addToCart = (p) => { const c = getCart(); c[p._id] = { ...p, qty: (c[p._id]?.qty || 0) + 1 }; save(c); return cartCount(); };
export const setQty = (id, q) => { const c = getCart(); if (q <= 0) delete c[id]; else c[id].qty = q; save(c); return c; };
export const clearCart = () => localStorage.removeItem(K);
