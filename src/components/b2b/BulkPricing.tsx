import { Slider } from "@/components/ui/slider";
import {
  discountTiers,
  quantityMax,
  quantityMin,
  quoteBoxes,
} from "@/data/b2b-pricing";
import { cn } from "@/lib/utils";

type BulkPricingProps = {
  qty: number;
  onQty: (qty: number) => void;
};

export function BulkPricing({ qty, onQty }: BulkPricingProps) {
  const quote = quoteBoxes(qty);

  return (
    <section id="pricing" className="bg-secondary/60 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Тираж</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
          Интерактивный калькулятор
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">Скидка растёт вместе с объёмом заказа.</p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Количество наборов</p>
              <p className="text-3xl font-extrabold tabular-nums">{qty} шт</p>
            </div>
            {quote.tier.discount > 0 && (
              <span className="rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
                {quote.tier.label}
                {quote.tier.perk ? ` · ${quote.tier.perk}` : ""}
              </span>
            )}
          </div>

          <Slider
            min={quantityMin}
            max={quantityMax}
            step={1}
            value={[qty]}
            onValueChange={(v) => onQty(v[0] ?? quantityMin)}
          />

          <div className="mt-4 grid grid-cols-4 gap-1">
            {discountTiers.map((tier) => {
              const active = qty >= tier.min;
              return (
                <div key={tier.min} className="text-center">
                  <div
                    className={cn(
                      "h-2 rounded-full",
                      active ? "bg-primary" : "bg-primary/20",
                    )}
                  />
                  <p className="mt-2 text-[11px] font-semibold text-muted-foreground">
                    {tier.min}–{tier.max}
                  </p>
                  <p className="text-[11px] font-bold text-foreground">{tier.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid gap-3 rounded-[10px] bg-secondary p-5 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Итоговая сумма</p>
              <p className="text-2xl font-extrabold tabular-nums">{quote.total.toFixed(2)} BYN</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ваша экономия</p>
              <p className="text-2xl font-extrabold tabular-nums text-primary">
                {quote.savings.toFixed(2)} BYN
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
