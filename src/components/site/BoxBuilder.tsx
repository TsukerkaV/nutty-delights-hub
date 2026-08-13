import { useMemo, useState } from "react";
import { Check, Minus, Plus, ShoppingCart, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  boxCategories,
  fillingCategories,
  fillings,
  packagings,
  portions,
  type Filling,
} from "@/data/box-builder";

type Selection = { filling: Filling; portion: number };

const steps = ["Формат бокса", "Вкусы", "Фасовка и упаковка"];

export function BoxBuilder() {
  const [step, setStep] = useState(0);
  const [categoryId, setCategoryId] = useState(boxCategories[1]!.id);
  const [tab, setTab] = useState<(typeof fillingCategories)[number]>("Все");
  const [selected, setSelected] = useState<Selection[]>([]);
  const [packagingId, setPackagingId] = useState(packagings[0]!.id);
  const [note, setNote] = useState("");
  const [added, setAdded] = useState(false);

  const category = boxCategories.find((c) => c.id === categoryId)!;
  const packaging = packagings.find((p) => p.id === packagingId)!;
  const slotsLeft = category.slots - selected.length;

  const visible = useMemo(
    () => (tab === "Все" ? fillings : fillings.filter((f) => f.category === tab)),
    [tab],
  );

  const fillingsTotal = selected.reduce(
    (s, x) => s + (x.filling.pricePer100 * x.portion) / 100,
    0,
  );
  const total = category.basePrice + packaging.price + fillingsTotal;
  const totalWeight = selected.reduce((s, x) => s + x.portion, 0);

  const isSelected = (id: string) => selected.some((s) => s.filling.id === id);

  const toggle = (f: Filling) => {
    setSelected((prev) => {
      if (prev.some((s) => s.filling.id === f.id)) {
        return prev.filter((s) => s.filling.id !== f.id);
      }
      if (prev.length >= category.slots) return prev;
      return [...prev, { filling: f, portion: 100 }];
    });
  };

  const setPortion = (id: string, portion: number) =>
    setSelected((prev) =>
      prev.map((s) => (s.filling.id === id ? { ...s, portion } : s)),
    );

  const changeCategory = (id: string) => {
    const next = boxCategories.find((c) => c.id === id)!;
    setCategoryId(id);
    setSelected((prev) => prev.slice(0, next.slots));
  };

  const autoFill = () => {
    const pool = fillings.filter((f) => !isSelected(f.id));
    const need = category.slots - selected.length;
    setSelected((prev) => [
      ...prev,
      ...pool.slice(0, need).map((f) => ({ filling: f, portion: 100 })),
    ]);
  };

  const addToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground">
          <Sparkles className="size-3.5" />
          Конструктор боксов
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
          Соберите свой бокс за 3 шага
        </h1>
        <p className="mt-3 text-muted-foreground">
          Выберите формат, наполните его любимыми вкусами и подберите упаковку — цена
          пересчитывается мгновенно.
        </p>
      </div>

      {/* Stepper */}
      <ol className="mt-8 flex flex-wrap gap-2">
        {steps.map((s, i) => (
          <li key={s}>
            <button
              onClick={() => setStep(i)}
              className={cn(
                "flex items-center gap-2 rounded-[10px] border px-4 py-2.5 text-sm font-semibold transition-colors",
                i === step
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-[11px] font-bold",
                  i === step ? "bg-primary-foreground text-primary" : "bg-secondary",
                )}
              >
                {i + 1}
              </span>
              {s}
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {boxCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => changeCategory(c.id)}
                  className={cn(
                    "relative rounded-2xl border-2 bg-card p-5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-hover",
                    c.id === categoryId ? "border-primary" : "border-border",
                  )}
                >
                  {c.badge && (
                    <span className="absolute right-4 top-4 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-accent-foreground">
                      {c.badge}
                    </span>
                  )}
                  <h3 className="text-lg font-bold">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.subtitle}</p>
                  <p className="mt-4 text-sm font-extrabold">
                    от {c.basePrice.toFixed(2)} BYN
                  </p>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="no-scrollbar flex gap-2 overflow-x-auto">
                  {fillingCategories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setTab(c)}
                      className={cn(
                        "whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                        tab === c
                          ? "bg-charcoal text-charcoal-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <button
                  onClick={autoFill}
                  disabled={slotsLeft === 0}
                  className="flex items-center gap-2 rounded-[10px] border border-primary px-3.5 py-2 text-sm font-bold text-primary transition-colors hover:bg-accent disabled:opacity-40"
                >
                  <Sparkles className="size-4" />
                  Заполнить за меня
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
                {visible.map((f) => {
                  const active = isSelected(f.id);
                  const disabled = !active && slotsLeft === 0;
                  return (
                    <button
                      key={f.id}
                      onClick={() => toggle(f)}
                      disabled={disabled}
                      className={cn(
                        "group overflow-hidden rounded-2xl border-2 bg-card text-left shadow-card transition-all",
                        active ? "border-primary" : "border-border",
                        disabled ? "opacity-45" : "hover:-translate-y-1 hover:shadow-hover",
                      )}
                    >
                      <div className="relative aspect-square overflow-hidden bg-secondary">
                        <img
                          src={f.image}
                          alt={f.name}
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {active && (
                          <span className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground animate-scale-in">
                            <Check className="size-4" />
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug">
                          {f.name}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {f.pricePer100.toFixed(2)} BYN / 100г
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold">Фасовка каждого вкуса</h2>
                {selected.length === 0 ? (
                  <p className="mt-3 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                    Сначала выберите вкусы на шаге 2.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {selected.map((s) => (
                      <li
                        key={s.filling.id}
                        className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
                      >
                        <img
                          src={s.filling.image}
                          alt={s.filling.name}
                          loading="lazy"
                          className="size-14 rounded-[10px] object-cover"
                        />
                        <div className="min-w-40 flex-1">
                          <p className="text-sm font-semibold">{s.filling.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {((s.filling.pricePer100 * s.portion) / 100).toFixed(2)} BYN
                          </p>
                        </div>
                        <div className="flex gap-1 rounded-[10px] bg-secondary p-1">
                          {portions.map((p) => (
                            <button
                              key={p}
                              onClick={() => setPortion(s.filling.id, p)}
                              className={cn(
                                "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                                s.portion === p
                                  ? "bg-card text-primary-dark shadow-card"
                                  : "text-muted-foreground hover:text-foreground",
                              )}
                            >
                              {p}г
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => toggle(s.filling)}
                          aria-label={`Убрать ${s.filling.name}`}
                          className="rounded-[10px] p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h2 className="text-lg font-bold">Упаковка</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {packagings.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPackagingId(p.id)}
                      className={cn(
                        "rounded-2xl border-2 bg-card p-4 text-left shadow-card transition-all hover:-translate-y-0.5",
                        p.id === packagingId ? "border-primary" : "border-border",
                      )}
                    >
                      <p className="text-sm font-bold">{p.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
                      <p className="mt-3 text-sm font-extrabold">
                        {p.price === 0 ? "Бесплатно" : `+${p.price.toFixed(2)} BYN`}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="note" className="text-lg font-bold">
                  Открытка к боксу
                </label>
                <textarea
                  id="note"
                  value={note}
                  maxLength={140}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Например: С днём рождения! Пусть год будет вкусным."
                  className="mt-3 w-full rounded-2xl border border-border bg-card p-4 text-sm outline-none transition-colors focus:border-primary"
                />
                <p className="mt-1 text-xs text-muted-foreground">{note.length}/140</p>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">Ваш бокс</h2>
              <span className="text-xs font-semibold text-muted-foreground">
                {selected.length}/{category.slots} слотов
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${(selected.length / category.slots) * 100}%` }}
              />
            </div>

            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{category.title}</dt>
                <dd className="font-semibold">{category.basePrice.toFixed(2)} BYN</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Наполнение ({totalWeight}г)</dt>
                <dd className="font-semibold">{fillingsTotal.toFixed(2)} BYN</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{packaging.title}</dt>
                <dd className="font-semibold">
                  {packaging.price === 0 ? "0.00 BYN" : `${packaging.price.toFixed(2)} BYN`}
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
              <span className="text-sm font-semibold text-muted-foreground">Итого</span>
              <span className="text-2xl font-extrabold tracking-tight">
                {total.toFixed(2)} BYN
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                aria-label="Назад"
                className="rounded-[10px] border border-border px-3 py-3 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
              >
                <Minus className="size-4" />
              </button>
              {step < 2 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-dark"
                >
                  Далее
                  <Plus className="size-4" />
                </button>
              ) : (
                <button
                  onClick={addToCart}
                  disabled={selected.length === 0}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-[10px] py-3 text-sm font-bold text-primary-foreground transition-colors disabled:opacity-40",
                    added ? "bg-primary-dark" : "bg-primary hover:bg-primary-dark",
                  )}
                >
                  {added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
                  {added ? "Бокс в корзине" : "В корзину"}
                </button>
              )}
            </div>

            {slotsLeft > 0 && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Добавьте ещё {slotsLeft} {slotsLeft === 1 ? "вкус" : "вкуса"} для полного бокса
              </p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
