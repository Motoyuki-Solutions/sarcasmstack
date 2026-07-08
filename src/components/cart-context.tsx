"use client";

/**
 * Cart state via React context + localStorage persistence.
 *
 * Keeps it simple per the brief: no user accounts, no order history. The cart
 * is a list of {productId, variantId, quantity} lines persisted to
 * localStorage so a refresh doesn't empty it. The provider hydrates from
 * localStorage on mount (client-only) to avoid SSR mismatch.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine } from "@/types";
import { getProduct, getProductVariant } from "@/data/catalog";

const STORAGE_KEY = "sarcasmstack:cart:v1";

interface CartContextValue {
  lines: CartLine[];
  /** True until the cart has hydrated from localStorage (avoids SSR mismatch). */
  hydrated: boolean;
  /** Total item count across all lines. */
  itemCount: number;
  add: (productId: string, variantId: string, qty?: number) => void;
  remove: (productId: string, variantId: string) => void;
  setQuantity: (productId: string, variantId: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function lineKey(productId: string, variantId: string) {
  return `${productId}::${variantId}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (client only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) setLines(parsed);
      }
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  // Persist on every change (after hydration).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage full / disabled — non-fatal
    }
  }, [lines, hydrated]);

  const add = useCallback((productId: string, variantId: string, qty = 1) => {
    setLines((prev) => {
      const idx = prev.findIndex(
        (l) => lineKey(l.productId, l.variantId) === lineKey(productId, variantId),
      );
      if (idx === -1) return [...prev, { productId, variantId, quantity: qty }];
      const next = [...prev];
      next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
      return next;
    });
  }, []);

  const remove = useCallback((productId: string, variantId: string) => {
    setLines((prev) =>
      prev.filter(
        (l) => lineKey(l.productId, l.variantId) !== lineKey(productId, variantId),
      ),
    );
  }, []);

  const setQuantity = useCallback(
    (productId: string, variantId: string, qty: number) => {
      setLines((prev) => {
        if (qty <= 0) {
          return prev.filter(
            (l) => lineKey(l.productId, l.variantId) !== lineKey(productId, variantId),
          );
        }
        return prev.map((l) =>
          lineKey(l.productId, l.variantId) === lineKey(productId, variantId)
            ? { ...l, quantity: qty }
            : l,
        );
      });
    },
    [],
  );

  const clear = useCallback(() => setLines([]), []);

  const itemCount = useMemo(
    () => lines.reduce((s, l) => s + l.quantity, 0),
    [lines],
  );

  const value = useMemo<CartContextValue>(
    () => ({ lines, hydrated, itemCount, add, remove, setQuantity, clear }),
    [lines, hydrated, itemCount, add, remove, setQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}

/**
 * Hydrate cart lines with product/variant data + line totals for display
 * and for building the Stripe checkout payload. Lines referencing products
 * that no longer exist are dropped.
 */
export function useDetailedCart() {
  const { lines, hydrated } = useCart();

  return useMemo(() => {
    const detailed = lines
      .map((l) => {
        const product = getProduct(l.productId);
        if (!product) return null;
        const variant = getProductVariant(product, l.variantId);
        if (!variant) return null;
        return {
          ...l,
          product,
          variant,
          lineTotalCents: variant.priceCents * l.quantity,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    const subtotalCents = detailed.reduce((s, d) => s + d.lineTotalCents, 0);
    return { lines: detailed, subtotalCents, hydrated };
  }, [lines, hydrated]);
}
