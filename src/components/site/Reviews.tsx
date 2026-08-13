import { useRef } from "react";
import { BadgeCheck, ChevronLeft, ChevronRight, Star } from "lucide-react";

const reviews = [
  {
    name: "Елена",
    date: "21.05.2026",
    shop: "Покупка в магазине на пр. Победителей",
    text: "Очень вкусные орешки и сухофрукты. Отправляла посылкой родным на юбилей — все в восторге, упаковано аккуратно.",
  },
  {
    name: "Алексей",
    date: "04.05.2026",
    shop: "Заказ на сайте",
    text: "Доверяю только этому магазину: знаю, что все продукты свежие и вкусные. Доставка приехала за 40 минут.",
  },
  {
    name: "Ольга",
    date: "26.04.2026",
    shop: "Покупка в ТРЦ Замок",
    text: "В Минске сложно было найти свежие сухофрукты, но тут есть абсолютно всё. Финики Меджул — лучшие.",
  },
  {
    name: "Мила",
    date: "21.04.2026",
    shop: "Заказ на сайте",
    text: "Так понравилось обслуживание, что решила покупать только тут. Собрала подарочный бокс коллеге — очень довольна.",
  },
  {
    name: "Кирилл",
    date: "12.04.2026",
    shop: "Покупка в магазине на Немиге",
    text: "Брал фисташки и кешью — лучший магазин в этой сфере. Обжарка идеальная, соли в меру.",
  },
];

export function Reviews() {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) =>
    ref.current?.scrollBy({ left: dir * 360, behavior: "smooth" });

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <h2 className="truncate text-2xl font-extrabold tracking-tight md:text-3xl">
            Отзывы о магазине
          </h2>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => scroll(-1)}
              aria-label="Назад"
              className="grid size-10 place-items-center rounded-[10px] border border-border transition-colors hover:bg-secondary"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Вперёд"
              className="grid size-10 place-items-center rounded-[10px] border border-border transition-colors hover:bg-secondary"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div
          ref={ref}
          className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 no-scrollbar"
        >
          {reviews.map((r) => (
            <article
              key={r.name}
              className="w-[320px] shrink-0 snap-start rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <div className="flex items-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-bold">{r.name}</span>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-primary-dark">
                <BadgeCheck className="size-3.5 shrink-0" />
                <span className="truncate">{r.shop}</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
