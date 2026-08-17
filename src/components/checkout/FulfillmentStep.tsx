import { Bike, MapPin, Package } from "lucide-react";
import { osmEmbed, storesForCity, type Store } from "@/data/stores";
import { courierEta, type Fulfillment } from "@/lib/checkout";
import { useCheckoutUi } from "@/components/checkout/CheckoutShell";
import { cn } from "@/lib/utils";

type FulfillmentStepProps = {
  method: Fulfillment;
  onMethod: (m: Fulfillment) => void;
  address: string;
  onAddress: (v: string) => void;
  store: Store | null;
  onStore: (s: Store) => void;
  postService: string;
  onPostService: (v: string) => void;
};

export function FulfillmentStep({
  method,
  onMethod,
  address,
  onAddress,
  store,
  onStore,
  postService,
  onPostService,
}: FulfillmentStepProps) {
  const { city } = useCheckoutUi();
  const cityStores = storesForCity(city);
  const postOptions = city === "minsk" ? ["Европочта", "Белпочта"] : ["Haypost"];

  const cards: { id: Fulfillment; title: string; hint: string; icon: typeof Bike }[] = [
    { id: "express", title: "Экспресс-доставка", hint: "30–60 мин", icon: Bike },
    { id: "pickup", title: "Самовывоз", hint: "Бесплатно", icon: MapPin },
    { id: "post", title: "Почта / ПВЗ", hint: "Другие города", icon: Package },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          const active = method === card.id;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onMethod(card.id)}
              className={cn(
                "rounded-2xl border p-4 text-left transition-colors",
                active ? "border-primary bg-primary/10" : "border-border hover:bg-secondary",
              )}
            >
              <Icon className={cn("size-5", active ? "text-primary" : "text-muted-foreground")} />
              <p className="mt-2 text-sm font-bold">{card.title}</p>
              <p className="text-xs text-muted-foreground">{card.hint}</p>
            </button>
          );
        })}
      </div>

      {method === "express" && (
        <div className="space-y-2">
          <label className="text-sm font-semibold">Адрес доставки</label>
          <input
            value={address}
            onChange={(e) => onAddress(e.target.value)}
            placeholder="Улица, дом, квартира"
            className="w-full rounded-[10px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          {address.trim().length > 4 && (
            <p className="text-sm text-primary">
              Соберём в магазине на пр. Победителей. Курьер будет у вас примерно в {courierEta()}.
            </p>
          )}
        </div>
      )}

      {method === "pickup" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ul className="space-y-2">
            {cityStores.map((s) => {
              const active = store?.id === s.id;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => onStore(s)}
                    className={cn(
                      "w-full rounded-[10px] border p-3 text-left",
                      active ? "border-primary bg-primary/10" : "border-border",
                    )}
                  >
                    <p className="text-sm font-bold">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.address}</p>
                    {active && (
                      <p className="mt-1 text-xs font-semibold text-primary">
                        Заказ будет готов через 15 минут
                      </p>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          {store && (
            <iframe
              title={store.name}
              src={osmEmbed(store)}
              className="h-56 w-full rounded-2xl border border-border"
            />
          )}
        </div>
      )}

      {method === "post" && (
        <div className="flex flex-wrap gap-2">
          {postOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onPostService(opt)}
              className={cn(
                "rounded-[10px] border px-4 py-2 text-sm font-semibold",
                postService === opt ? "border-primary bg-primary/10" : "border-border",
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
