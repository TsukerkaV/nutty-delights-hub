import {
  bundleTotal,
  findProduct,
  formatByn,
  type VoiceBundle,
} from "@/data/voice-catalog";

type SommelierSheetProps = {
  bundle: VoiceBundle;
  onAddAll: () => void;
  onOtherVariant: () => void;
};

export function SommelierSheet({ bundle, onAddAll, onOtherVariant }: SommelierSheetProps) {
  const total = bundleTotal(bundle);
  const prompt = bundle.prompt.replace("{total}", formatByn(total));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <p className="mb-4 text-sm leading-relaxed text-foreground">{prompt}</p>
      <ul className="space-y-3">
        {bundle.items.map((line) => {
          const product = findProduct(line.productId);
          if (!product) {
            return null;
          }
          return (
            <li key={`${line.productId}-${line.grams}`} className="flex items-center gap-3">
              <img
                src={product.image}
                alt=""
                width={56}
                height={56}
                className="size-14 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{product.name}</p>
                <p className="text-xs text-muted-foreground">{line.grams}г</p>
              </div>
              <p className="text-sm font-bold">
                {formatByn((product.pricePer100 * line.grams) / 100)} BYN
              </p>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex flex-col gap-2 pt-6 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onAddAll}
          className="rounded-[10px] bg-primary py-4 text-base font-bold text-primary-foreground shadow-card transition-colors hover:bg-primary-dark"
        >
          Добавить весь сет в корзину
        </button>
        <button
          type="button"
          onClick={onOtherVariant}
          className="rounded-[10px] border border-border bg-secondary py-3 text-sm font-semibold transition-colors hover:bg-accent"
        >
          Сгенерировать другой вариант
        </button>
      </div>
    </div>
  );
}
