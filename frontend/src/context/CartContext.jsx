import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// the cart lives in the browser until checkout; the server re-checks prices and stock when the order is placed
const CART_KEY = "shoenation.cart";
export const MAX_PER_ITEM = 20; // same limit the backend enforces per order line

const CartContext = createContext(null);

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // storage blocked: the cart still works for this visit
    }
  }, [items]);

  const limit = (item) => Math.min(item.maxStock, MAX_PER_ITEM);

  // item: { variantId, productId, name, brand, imageUrl, price, size, color, maxStock }
  const addItem = useCallback((item, quantity) => {
    setItems((current) => {
      const existing = current.find((i) => i.variantId === item.variantId);
      if (!existing) return [...current, { ...item, quantity: Math.min(quantity, limit(item)) }];
      return current.map((i) =>
        i.variantId === item.variantId ? { ...i, ...item, quantity: Math.min(i.quantity + quantity, limit(item)) } : i,
      );
    });
  }, []);

  const setQuantity = useCallback((variantId, quantity) => {
    setItems((current) =>
      current.map((i) => (i.variantId === variantId ? { ...i, quantity: Math.max(1, Math.min(quantity, limit(i))) } : i)),
    );
  }, []);

  const removeItem = useCallback((variantId) => {
    setItems((current) => current.filter((i) => i.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  // after checkout says "not enough stock": shrink each line to what's left, drop sold-out ones
  const applyStock = useCallback((shortages) => {
    const available = new Map(shortages.map((s) => [s.variant_id, s.available]));
    setItems((current) =>
      current
        .filter((i) => available.get(i.variantId) !== 0)
        .map((i) =>
          available.has(i.variantId)
            ? { ...i, maxStock: available.get(i.variantId), quantity: Math.min(i.quantity, available.get(i.variantId)) }
            : i,
        ),
    );
  }, []);

  const value = useMemo(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
    return { items, count, subtotal, addItem, setQuantity, removeItem, clear, applyStock };
  }, [items, addItem, setQuantity, removeItem, clear, applyStock]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
