import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export type ClubTab = "card" | "subscriptions" | "history" | "profile" | "companies" | "cards" | "prefs";

const tabs: { id: ClubTab; label: string }[] = [
  { id: "card", label: "Карта Dubai Club" },
  { id: "subscriptions", label: "Мои подписки" },
  { id: "history", label: "История покупок" },
  { id: "profile", label: "Личные данные и адреса" },
  { id: "companies", label: "Мои компании (B2B)" },
  { id: "cards", label: "Сохранённые карты" },
  { id: "prefs", label: "Настройки AI и вкусов" },
];

function clubSearch(id: ClubTab): { tab?: Exclude<ClubTab, "card"> } {
  switch (id) {
    case "card":
      return {};
    case "subscriptions":
    case "history":
    case "prefs":
    case "profile":
    case "companies":
    case "cards":
      return { tab: id };
    default: {
      const _never: never = id;
      return _never;
    }
  }
}

export function ClubLayout({ tab, children }: { tab: ClubTab; children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[240px_minmax(0,1fr)]">
      <nav className="flex gap-2 overflow-x-auto no-scrollbar lg:flex-col lg:overflow-visible">
        {tabs.map((item) => {
          const active = tab === item.id;
          return (
            <Link
              key={item.id}
              to="/club"
              search={clubSearch(item.id)}
              className={cn(
                "shrink-0 rounded-[10px] px-4 py-2.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div>{children}</div>
    </div>
  );
}
