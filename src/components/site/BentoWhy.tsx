import { useState } from "react";
import { ChevronDown, Gift, Leaf, Rocket, Store } from "lucide-react";
import { cn } from "@/lib/utils";

export function BentoWhy() {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-secondary/60 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">Почему Dubai?</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-primary p-7 text-primary-foreground md:col-span-2">
            <Rocket className="size-7" />
            <h3 className="mt-4 text-xl font-bold">Экспресс-доставка за 30–60 мин</h3>
            <p className="mt-2 max-w-md text-sm text-primary-foreground/85">
              Собираем заказ в ближайшем магазине «Dubai» рядом с вами.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-7 shadow-card">
            <Store className="size-7 text-primary" />
            <h3 className="mt-4 text-xl font-bold">Офлайн-сеть в 2 странах</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Минск и Ереван. 12 магазинов с возможностью самовывоза.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-7 shadow-card">
            <Leaf className="size-7 text-primary" />
            <h3 className="mt-4 text-xl font-bold">100% отборный урожай</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Прямые поставки. Контроль калибра и влажности каждого ореха.
            </p>
          </div>
          <div className="rounded-2xl bg-charcoal p-7 text-charcoal-foreground md:col-span-2">
            <Gift className="size-7 text-primary" />
            <h3 className="mt-4 text-xl font-bold">Подарочный сервис и B2B</h3>
            <p className="mt-2 max-w-md text-sm text-charcoal-foreground/70">
              Брендирование боксов, сборка наборов под ваш бюджет.
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-semibold"
          >
            Читать подробнее о магазине Dubai
            <ChevronDown
              className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")}
            />
          </button>
          {open && (
            <div className="animate-fade-in space-y-3 px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
              <p>
                Интернет-магазин «Dubai» — розничная сеть орехов и сухофруктов в Минске и Ереване.
                В каталоге более 200 позиций: орехи, сухофрукты, цукаты, семечки и семена,
                ореховые пасты, мёд и подарочные наборы. Мы работаем напрямую с фермерскими
                хозяйствами и контролируем калибр, влажность и сроки каждой партии.
              </p>
              <p>
                Оформить заказ можно на сайте, по телефону +375 (44) 714-04-04 или в любом из
                наших магазинов. Доступна экспресс-доставка курьером от 30 минут, самовывоз из
                ближайшей точки и отправка почтой по всей стране. Оплата — картой онлайн, ЕРИП,
                наличными при получении, для юрлиц — по безналичному расчёту с закрывающими
                документами.
              </p>
              <p>
                Для корпоративных клиентов доступно брендирование боксов от 10 штук, подписка на
                снабжение офиса и персональная сборка наборов под бюджет.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
