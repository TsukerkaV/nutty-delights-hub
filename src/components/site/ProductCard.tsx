import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

export type Product = {
  id: string;
  name: string;
  image: string;
  cashback: number;
  pricePer100: number;
};

const weights = [100, 250, 500] as const;

export function ProductCard({ product }: { product: Product }) {
  const [weight, setWeight] = useState<number>(100);
  const [added, setAdded] = useState(false);

  const price = ((product.pricePer100 * weight) / 100).toFixed(2);

  const add = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-hover">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          width={800}
          height={800}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
          Кэшбэк {product.cashback}%
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-semibold leading-snug">
          {product.name}
        </h3>

        <div className="grid grid-cols-3 gap-1 rounded-[10px] bg-secondary p-1">
          {weights.map((w) => (
            <button
              key={w}
              onClick={() => setWeight(w)}
              className={cn(
                "rounded-md py-1.5 text-xs font-semibold transition-colors",
                weight === w
                  ? "bg-card text-primary-dark shadow-card"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {w}г
            </button>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="text-lg font-extrabold tracking-tight">{price} BYN</span>
          <button
            onClick={add}
            aria-label="В корзину"
            className={cn(
              "flex items-center gap-1.5 rounded-[10px] px-3.5 py-2.5 text-sm font-bold text-primary-foreground transition-all active:scale-95",
              added ? "bg-primary-dark" : "bg-primary hover:bg-primary-dark",
            )}
          >
            {added ? (
              <>
                <Check className="size-4 animate-scale-in" />
                Добавлено
              </>
            ) : (
              <ShoppingCart className="size-4" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
