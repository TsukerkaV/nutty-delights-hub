import { peanutVariants } from "@/data/voice-catalog";

type DisambiguationSheetProps = {
  grams: number;
  onPick: (productId: string) => void;
};

export function DisambiguationSheet({ grams, onPick }: DisambiguationSheetProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
        {peanutVariants.map((product) => (
          <article
            key={product.id}
            className="w-[220px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-card shadow-card"
          >
            <div className="aspect-square overflow-hidden bg-secondary">
              <img
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
                className="size-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2 p-3">
              <h3 className="text-sm font-semibold leading-snug">{product.name}</h3>
              <p className="text-xs text-muted-foreground">{product.subtitle}</p>
              <p className="text-sm font-extrabold">{product.pricePer100.toFixed(2)} BYN / 100г</p>
              <button
                type="button"
                onClick={() => onPick(product.id)}
                className="mt-1 rounded-[10px] bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-dark"
              >
                Выбрать {grams}г
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
