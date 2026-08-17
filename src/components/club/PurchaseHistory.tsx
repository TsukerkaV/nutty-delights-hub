import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { purchaseHistory, type HistoryChannel } from "@/data/loyalty";
import { findProduct } from "@/data/voice-catalog";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

type Filter = "all" | HistoryChannel;

export function PurchaseHistory() {
  const [filter, setFilter] = useState<Filter>("all");
  const { add } = useCart();

  const rows = purchaseHistory.filter((row) => filter === "all" || row.channel === filter);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {(
          [
            ["all", "Все покупки"],
            ["online", "Заказы на сайте"],
            ["store", "Покупки в магазинах"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={cn(
              "shrink-0 rounded-[10px] px-4 py-2 text-sm font-semibold",
              filter === id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {rows.map((order) => (
          <li key={order.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold">{order.title}</p>
                <p className="text-sm text-muted-foreground">
                  {order.subtitle} — {order.date}
                </p>
                <p className="mt-1 text-sm font-extrabold tabular-nums">{order.total.toFixed(2)} BYN</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  for (const line of order.items) {
                    const product = findProduct(line.productId);
                    if (product) {
                      add({
                        id: product.id,
                        name: product.name,
                        grams: line.grams,
                        pricePer100: product.pricePer100,
                        image: product.image,
                      });
                    }
                  }
                }}
                className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
              >
                <RefreshCw className="size-4" />
                Повторить заказ в корзину
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
