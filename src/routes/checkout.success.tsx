import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Check, Package, Truck } from "lucide-react";
import { loadSnapshot } from "@/lib/checkout";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout/success")({
  component: CheckoutSuccess,
});

const stages = [
  { id: "accepted", label: "Заказ принят", icon: Check },
  { id: "packing", label: "Собирается", icon: Package },
  { id: "courier", label: "Передан курьеру", icon: Truck },
] as const;

function CheckoutSuccess() {
  const snapshot = loadSnapshot();
  const [step, setStep] = useState(0);
  const orderId = snapshot?.orderId ?? "4120";
  const storeLabel = snapshot?.storeLabel ?? "ТРЦ Замок";

  useEffect(() => {
    const t1 = window.setTimeout(() => setStep(1), 800);
    const t2 = window.setTimeout(() => setStep(2), 1600);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-3xl font-extrabold tracking-tight">Заказ №{orderId} успешно оформлен!</h1>
      <p className="mt-2 text-sm text-muted-foreground">Собираем в «{storeLabel}». Сумма: {snapshot?.totalLabel ?? "—"}</p>

      <ol className="mt-10 space-y-3 text-left">
        {stages.map((stage, i) => {
          const Icon = stage.icon;
          const active = i <= step;
          const label =
            stage.id === "packing" ? `Собирается в ${storeLabel}` : stage.label;
          return (
            <li
              key={stage.id}
              className={cn(
                "flex items-center gap-3 rounded-2xl border p-4 transition-colors",
                active ? "border-primary bg-primary/10" : "border-border opacity-50",
              )}
            >
              <span
                className={cn(
                  "grid size-10 place-items-center rounded-full",
                  active ? "bg-primary text-primary-foreground" : "bg-secondary",
                )}
              >
                <Icon className="size-5" />
              </span>
              <span className="font-semibold">{label}</span>
            </li>
          );
        })}
      </ol>

      <a
        href="https://t.me/dubai_orehi_bot"
        target="_blank"
        rel="noreferrer"
        className="mt-8 inline-flex w-full items-center justify-center rounded-[10px] bg-primary py-4 text-sm font-bold text-primary-foreground"
      >
        Следить за статусом в Telegram-боте
      </a>
      <Link to="/" className="mt-3 inline-block text-sm font-semibold text-muted-foreground hover:text-foreground">
        На главную
      </Link>
    </div>
  );
}
