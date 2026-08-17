import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

export type CartLine = {
  id: string;
  productId: string;
  name: string;
  grams: number;
  pricePer100: number;
  lineTotal: number;
  image?: string;
};

type AddPayload = {
  id: string;
  name: string;
  grams: number;
  pricePer100: number;
  image?: string;
};

type CartContextValue = {
  items: CartLine[];
  total: number;
  add: (item: AddPayload) => void;
  updateGrams: (lineId: string, grams: number) => void;
  remove: (lineId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function lineTotal(pricePer100: number, grams: number) {
  return (pricePer100 * grams) / 100;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);

  const add = useCallback((item: AddPayload) => {
    setItems((prev) => {
      const existing = prev.find((line) => line.productId === item.id);
      if (existing) {
        const grams = existing.grams + item.grams;
        return prev.map((line) =>
          line.id === existing.id
            ? { ...line, grams, lineTotal: lineTotal(line.pricePer100, grams) }
            : line,
        );
      }
      return [
        ...prev,
        {
          id: `${item.id}-${Date.now()}`,
          productId: item.id,
          name: item.name,
          grams: item.grams,
          pricePer100: item.pricePer100,
          lineTotal: lineTotal(item.pricePer100, item.grams),
          ...(item.image ? { image: item.image } : {}),
        },
      ];
    });
    toast.success(`${item.name} (${item.grams}г) — в корзине`);
  }, []);

  const updateGrams = useCallback((lineId: string, grams: number) => {
    const next = Math.max(50, grams);
    setItems((prev) =>
      prev.map((line) =>
        line.id === lineId
          ? { ...line, grams: next, lineTotal: lineTotal(line.pricePer100, next) }
          : line,
      ),
    );
  }, []);

  const remove = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((line) => line.id !== lineId));
  }, []);

  const total = useMemo(() => items.reduce((sum, line) => sum + line.lineTotal, 0), [items]);

  const value = useMemo(
    () => ({ items, total, add, updateGrams, remove }),
    [items, total, add, updateGrams, remove],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
