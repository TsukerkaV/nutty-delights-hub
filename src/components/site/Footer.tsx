import { useState } from "react";
import { ChevronDown, Clock, Mail, Phone } from "lucide-react";
import logo from "@/assets/dubai-logo.png.asset.json";
import { cn } from "@/lib/utils";

const columns = [
  {
    title: "Каталог",
    links: ["Орехи", "Сухофрукты", "Цукаты", "Семечки и семена", "Подарочные боксы", "Подписка"],
  },
  {
    title: "Покупателям",
    links: ["Доставка и оплата", "Самовывоз", "Возврат", "Программа лояльности", "Отзывы"],
  },
  {
    title: "B2B",
    links: ["Оптовые цены", "Брендирование боксов", "Снабжение офиса", "Счёт по УНП", "Документы"],
  },
];

function Column({ title, links }: { title: string; links: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-charcoal-foreground/10 py-3 md:border-0 md:py-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-sm font-bold md:pointer-events-none md:mb-4"
      >
        {title}
        <ChevronDown
          className={cn("size-4 transition-transform md:hidden", open && "rotate-180")}
        />
      </button>
      <ul className={cn("space-y-2.5 pt-3 md:block md:pt-0", !open && "hidden")}>
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              className="text-sm text-charcoal-foreground/60 transition-colors hover:text-primary"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-charcoal text-charcoal-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <img
              src={logo.url}
              alt="Dubai"
              loading="lazy"
              className="h-10 w-auto brightness-0 invert"
            />
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary" />
                +375 (44) 714-04-04
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary" />
                info@dubai-orexi.by
              </li>
              <li className="flex items-center gap-2 text-charcoal-foreground/60">
                <Clock className="size-4 shrink-0 text-primary" />
                Ежедневно с 9:00 до 20:30
              </li>
            </ul>
          </div>
          {columns.map((c) => (
            <Column key={c.title} {...c} />
          ))}
        </div>
        <p className="mt-10 border-t border-charcoal-foreground/10 pt-6 text-xs text-charcoal-foreground/50">
          © 2026 Dubai — орехи и сухофрукты. Минск · Ереван
        </p>
      </div>
    </footer>
  );
}
