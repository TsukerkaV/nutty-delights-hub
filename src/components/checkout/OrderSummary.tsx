import { Minus, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { loyaltyWallet } from "@/data/loyalty";
import { useCart } from "@/lib/cart";
import { formatMoney, loyaltyDiscount, payable, type Fulfillment } from "@/lib/checkout";
import { useCheckoutUi } from "@/components/checkout/CheckoutShell";
import { cn } from "@/lib/utils";

type OrderSummaryProps = {
  redeem: boolean;
  onRedeem: (v: boolean) => void;
  fulfillment: Fulfillment;
};

export function OrderSummary({ redeem, onRedeem, fulfillment }: OrderSummaryProps) {
  const { items, total, updateGrams, remove } = useCart();
  const { city } = useCheckoutUi();
  const discount = loyaltyDiscount(redeem);
  const due = payable(total, redeem, fulfillment);
  const goodsPlusDelivery = payable(total, false, fulfillment);

  return (
    <aside className="rounded-2xl border border-border bg-card p-5 shadow-card lg:sticky lg:top-6">
      <h2 className="text-lg font-extrabold">Ваш заказ</h2>
      <ul className="mt-4 space-y-3">
        {items.map((line) => (
          <li key={line.id} className="flex gap-3">
            {line.image ? (
              <img src={line.image} alt="" className="size-14 rounded-[10px] object-cover" />
            ) : (
              <div className="size-14 rounded-[10px] bg-secondary" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{line.name}</p>
              <p className="text-xs text-muted-foreground">{line.grams}г</p>
              <p className="text-sm font-bold">{formatMoney(line.lineTotal, city)}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Меньше"
                onClick={() => {
                  if (line.grams <= 50) {
                    remove(line.id);
                    return;
                  }
                  updateGrams(line.id, line.grams - 50);
                }}
                className="grid size-8 place-items-center rounded-md border border-border"
              >
                <Minus className="size-3.5" />
              </button>
              <button
                type="button"
                aria-label="Больше"
                onClick={() => updateGrams(line.id, line.grams + 50)}
                className="grid size-8 place-items-center rounded-md border border-border"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between gap-3 rounded-[10px] bg-secondary p-3">
        <div>
          <p className="text-sm font-semibold">У вас {loyaltyWallet.bonuses} бонусов</p>
          <p className="text-xs text-muted-foreground">Списать {loyaltyWallet.bonusByn.toFixed(2)} BYN</p>
        </div>
        <Switch checked={redeem} onCheckedChange={onRedeem} />
      </div>

      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Товары</dt>
          <dd className="font-semibold">{formatMoney(total, city)}</dd>
        </div>
        {redeem && (
          <div className="flex justify-between text-primary">
            <dt>Скидка лояльности</dt>
            <dd className="font-semibold">−{formatMoney(discount, city)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Доставка</dt>
          <dd className="font-semibold">
            {formatMoney(payable(total, false, fulfillment) - total, city)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-border pt-3 text-base">
          <dt className="font-bold">К оплате</dt>
          <dd className="font-extrabold">
            {redeem && (
              <span className="mr-2 text-sm font-medium text-muted-foreground line-through">
                {formatMoney(goodsPlusDelivery, city)}
              </span>
            )}
            <span className={cn(redeem && "text-primary")}>{formatMoney(due, city)}</span>
          </dd>
        </div>
      </dl>
    </aside>
  );
}
