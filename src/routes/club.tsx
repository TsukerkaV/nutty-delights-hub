import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ClubLayout, type ClubTab } from "@/components/club/ClubLayout";
import { LoyaltyCard } from "@/components/club/LoyaltyCard";
import { SubscriptionsPanel } from "@/components/club/SubscriptionsPanel";
import { PurchaseHistory } from "@/components/club/PurchaseHistory";
import { AiPrefsPanel } from "@/components/club/AiPrefsPanel";
import { ProfilePanel } from "@/components/club/ProfilePanel";
import { CompaniesPanel } from "@/components/club/CompaniesPanel";
import { SavedCardsPanel } from "@/components/club/SavedCardsPanel";
import { useAuth } from "@/lib/auth";
import { User } from "lucide-react";

function parseTab(value: unknown): ClubTab {
  if (
    value === "subscriptions" ||
    value === "history" ||
    value === "prefs" ||
    value === "profile" ||
    value === "companies" ||
    value === "cards"
  ) {
    return value;
  }
  return "card";
}

export const Route = createFileRoute("/club")({
  validateSearch: (search: Record<string, unknown>): { tab?: Exclude<ClubTab, "card"> } => {
    const tab = parseTab(search["tab"]);
    return tab === "card" ? {} : { tab };
  },
  head: () => ({
    meta: [
      { title: "Dubai Club — личный кабинет" },
      {
        name: "description",
        content:
          "Личный кабинет Dubai Club: карта лояльности, подписки, адреса, карты и настройки вкусов.",
      },
    ],
  }),
  component: ClubPage,
});

function ClubTabPanel({ tab }: { tab: ClubTab }) {
  switch (tab) {
    case "card":
      return <LoyaltyCard />;
    case "subscriptions":
      return <SubscriptionsPanel />;
    case "history":
      return <PurchaseHistory />;
    case "profile":
      return <ProfilePanel />;
    case "companies":
      return <CompaniesPanel />;
    case "cards":
      return <SavedCardsPanel />;
    case "prefs":
      return <AiPrefsPanel />;
    default: {
      const _exhaustive: never = tab;
      return _exhaustive;
    }
  }
}

function ClubGuestGate() {
  const { openAuth } = useAuth();
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-secondary">
        <User className="size-7 text-primary" />
      </div>
      <h2 className="mt-5 text-2xl font-extrabold">Войдите, чтобы открыть кабинет</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Карта Dubai Club, бонусы, адреса и сохранённые карты доступны после входа. Регистрация — по
        номеру телефона, без пароля.
      </p>
      <button
        type="button"
        onClick={openAuth}
        className="mt-6 rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
      >
        Войти / Регистрация
      </button>
    </div>
  );
}

function ClubPage() {
  const search = Route.useSearch();
  const tab = parseTab(search.tab);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="border-b border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Dubai Club</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Личный кабинет</h1>
          </div>
        </div>
        {user ? (
          <ClubLayout tab={tab}>
            <ClubTabPanel tab={tab} />
          </ClubLayout>
        ) : (
          <ClubGuestGate />
        )}
      </main>
      <Footer />
    </div>
  );
}
