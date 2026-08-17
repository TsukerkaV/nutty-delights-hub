import { useState } from "react";
import {
  ChevronDown,
  Heart,
  MapPin,
  Mic,
  Search,
  ShoppingCart,
  Sparkles,
  User,
} from "lucide-react";
import { Link, useSearch } from "@tanstack/react-router";
import { useVoiceUi } from "@/components/voice/voice-ui-context";
import { AudienceToggle } from "@/components/b2b/AudienceToggle";
import { UserAvatar } from "@/components/auth/UserAvatar";
import { useCart } from "@/lib/cart";
import { parseAudience } from "@/lib/audience";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const categories: { name: string; sub: string[]; hits: string[] }[] = [
  {
    name: "Орехи",
    sub: ["Кешью", "Миндаль", "Фисташки", "Фундук", "Грецкий орех", "Макадамия"],
    hits: ["Кешью жареный", "Миндаль в скорлупе", "Пекан в карамели"],
  },
  {
    name: "Сухофрукты",
    sub: ["Финики", "Курага", "Чернослив", "Инжир", "Клюква", "Манго"],
    hits: ["Финики Меджул", "Манго без сахара", "Клюква вяленая"],
  },
  {
    name: "Цукаты",
    sub: ["Ананас", "Имбирь", "Папайя", "Дыня", "Киви"],
    hits: ["Ананас кольцами", "Имбирь в сахаре"],
  },
  {
    name: "Подарочные боксы",
    sub: ["Деревянные боксы", "Крафт-тубусы", "Корпоративные наборы", "Мини-сеты"],
    hits: ["Бокс «Дубай Люкс»", "Тубус на 4 секции"],
  },
  {
    name: "Зож & Сладости",
    sub: ["Ореховые пасты", "Мёд", "Батончики", "Без сахара"],
    hits: ["Паста из кешью", "Мёд с пеканом"],
  },
  { name: "Подписка", sub: ["Офисный сет", "Семейный сет", "Персональный"], hits: ["Сет недели"] },
];

export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const { openListening } = useVoiceUi();
  const { total } = useCart();
  const { user, openAuth } = useAuth();
  const search = useSearch({ strict: false });
  const audience = parseAudience(search.audience);
  const isB2b = audience === "b2b";

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-charcoal text-charcoal-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-2 text-xs">
          <button className="flex min-w-0 items-center gap-2 transition-colors hover:text-primary">
            <MapPin className="size-3.5 shrink-0 text-primary" />
            <span className="truncate font-medium">Минск</span>
            <ChevronDown className="size-3 shrink-0 opacity-60" />
            <span className="ml-2 hidden min-w-0 truncate text-charcoal-foreground/60 lg:inline">
              <span className="mr-1.5 inline-block size-1.5 rounded-full bg-primary align-middle" />
              Магазин на Победителей: открыт
            </span>
          </button>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              to="/"
              search={{ audience: "b2b" }}
              className="text-charcoal-foreground/70 transition-colors hover:text-primary"
            >
              B2B / Опт
            </Link>
            {["О компании", "Доставка и оплата", "Адреса магазинов"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-charcoal-foreground/70 transition-colors hover:text-primary"
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-8">
          <Link
            to="/"
            search={audience === "b2b" ? { audience: "b2b" } : {}}
            className="shrink-0"
          >
            <img src="/dubai-logo.png" alt="Dubai — орехи и сухофрукты" className="h-14 w-auto" />
          </Link>

          <div className="order-3 col-span-2 lg:order-none lg:col-span-1">
            <div className="group flex items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2.5 transition-colors focus-within:border-primary focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder='Найти кешью или сказать «Собери сет к вину»...'
              />
              <button
                type="button"
                onClick={() => openListening("search")}
                aria-label="Голосовой поиск Dubai AI"
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary-dark transition-colors hover:bg-primary/20"
              >
                <Mic className="size-4" />
                <span className="hidden sm:inline">AI</span>
              </button>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button className="relative hidden size-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-secondary sm:flex">
              <Heart className="size-5" />
              <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                3
              </span>
            </button>
            {user ? (
              <>
                <Link
                  to="/club"
                  className="hidden items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm font-semibold transition-colors hover:bg-accent md:flex"
                >
                  <Sparkles className="size-4 text-primary" />
                  {user.bonuses}{" "}
                  <span className="font-normal text-muted-foreground">бонусов</span>
                </Link>
                <Link
                  to="/club"
                  search={{ tab: "profile" }}
                  className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm font-semibold transition-colors hover:bg-accent"
                >
                  <UserAvatar src={user.avatar} name={user.firstName} className="size-7 text-[11px]" />
                  <span className="hidden sm:inline">{user.firstName}</span>
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={openAuth}
                className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm font-semibold transition-colors hover:bg-accent"
              >
                <User className="size-4" />
                <span className="hidden sm:inline">Войти / Регистрация</span>
                <span className="sm:hidden">Войти</span>
              </button>
            )}
            <Link
              to="/checkout"
              className="flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-colors hover:bg-primary-dark"
            >
              <ShoppingCart className="size-4" />
              <span className="hidden sm:inline">{total.toFixed(2)} BYN</span>
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-3">
          <AudienceToggle audience={audience} />
        </div>
      </div>

      {!isB2b && (
      <div
        className="relative border-b border-border bg-background"
        onMouseLeave={() => setOpen(null)}
      >
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.name}
              onMouseEnter={() => setOpen(c.name)}
              className={cn(
                "shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
                open === c.name
                  ? "border-primary text-primary-dark"
                  : "border-transparent text-foreground hover:text-primary-dark",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>

        {open && (
          <div className="absolute inset-x-0 top-full hidden animate-fade-in border-b border-border bg-background shadow-hover lg:block">
            <div className="mx-auto grid max-w-7xl grid-cols-[1fr_1.2fr] gap-10 px-4 py-8">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                {categories
                  .find((c) => c.name === open)!
                  .sub.map((s) => (
                    <a
                      key={s}
                      href="#"
                      className="rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-primary-dark"
                    >
                      {s}
                    </a>
                  ))}
              </div>
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Популярное в разделе
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {categories
                    .find((c) => c.name === open)!
                    .hits.map((h) => (
                      <a
                        key={h}
                        href="#"
                        className="rounded-2xl border border-border bg-secondary/60 p-3 text-sm font-medium transition-shadow hover:shadow-hover"
                      >
                        {h}
                      </a>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      )}
    </header>
  );
}
