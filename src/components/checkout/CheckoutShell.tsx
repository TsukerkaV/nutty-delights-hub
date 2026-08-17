import { createContext, useContext, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { type CityId } from "@/data/stores";
import { cn } from "@/lib/utils";
import { publicUrl } from "@/lib/public-url";

type CheckoutUi = {
  city: CityId;
  setCity: (city: CityId) => void;
};

const CheckoutUiContext = createContext<CheckoutUi | null>(null);

export function useCheckoutUi() {
  const ctx = useContext(CheckoutUiContext);
  if (!ctx) {
    throw new Error("useCheckoutUi must be used within CheckoutShell");
  }
  return ctx;
}

export function CheckoutShell({ children }: { children: ReactNode }) {
  const [city, setCity] = useState<CityId>("minsk");

  return (
    <CheckoutUiContext.Provider value={{ city, setCity }}>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
            <Link to="/" className="shrink-0">
              <img src={publicUrl("dubai-logo.png")} alt="Dubai" className="h-10 w-auto" />
            </Link>
            <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Lock className="size-3.5 text-primary" />
              Безопасная оплата
            </p>
            <div className="grid grid-cols-2 rounded-[10px] bg-secondary p-1 text-xs font-semibold">
              {(
                [
                  ["minsk", "Минск"],
                  ["yerevan", "Ереван"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setCity(id)}
                  className={cn(
                    "rounded-md px-3 py-1.5",
                    city === id ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </header>
        {children}
      </div>
    </CheckoutUiContext.Provider>
  );
}
