import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Pause, SkipForward, Pencil } from "lucide-react";
import { defaultSubscription, type SubscriptionStatus } from "@/data/loyalty";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SubscriptionsPanel() {
  const [status, setStatus] = useState<SubscriptionStatus>("active");

  const statusLabel = (() => {
    switch (status) {
      case "active":
        return "Активна";
      case "paused":
        return "На паузе";
      case "skipped":
        return "Следующая доставка пропущена";
      default: {
        const _never: never = status;
        return _never;
      }
    }
  })();

  return (
    <article className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold">{defaultSubscription.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{defaultSubscription.cadence}</p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-bold",
            status === "active" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground",
          )}
        >
          {statusLabel}
        </span>
      </div>

      <div className="mt-6 space-y-1 text-sm">
        <p>
          Ближайшая доставка:{" "}
          <span className="font-semibold">
            {status === "skipped" ? "1 сентября 2026" : defaultSubscription.nextDelivery}
          </span>
        </p>
        <p className="text-muted-foreground">
          Списание с карты ****{defaultSubscription.cardLast4} произойдет{" "}
          {status === "skipped" ? "31 августа" : defaultSubscription.chargeDate}.
        </p>
      </div>

      <div className="mt-8 grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => {
            setStatus((s) => (s === "paused" ? "active" : "paused"));
            toast.success(status === "paused" ? "Подписка возобновлена" : "Подписка на паузе");
          }}
          className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-border py-3 text-sm font-semibold hover:bg-secondary"
        >
          <Pause className="size-4" />
          {status === "paused" ? "Снять паузу" : "Поставить на паузу"}
        </button>
        <button
          type="button"
          onClick={() => {
            setStatus("skipped");
            toast.success("Эта доставка пропущена");
          }}
          className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-border py-3 text-sm font-semibold hover:bg-secondary"
        >
          <SkipForward className="size-4" />
          Пропустить эту доставку
        </button>
        <Link
          to="/constructor"
          className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
        >
          <Pencil className="size-4" />
          Изменить состав бокса
        </Link>
      </div>
    </article>
  );
}
