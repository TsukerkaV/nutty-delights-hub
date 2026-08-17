import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { LOYALTY_MEMBER_ID, loyaltyWallet } from "@/data/loyalty";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth";
import { publicUrl } from "@/lib/public-url";

function tokenForMinute(now: number) {
  const minute = Math.floor(now / 60_000);
  return `DUBAI-${LOYALTY_MEMBER_ID}-${minute}`;
}

export function LoyaltyCard() {
  const { user } = useAuth();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const token = tokenForMinute(now);
  const secondsLeft = 60 - Math.floor((now / 1000) % 60);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(token)}`;
  const bonuses = user?.bonuses ?? loyaltyWallet.bonuses;
  const bonusByn = user?.isNew ? Math.round((bonuses / 30) * 100) / 100 : loyaltyWallet.bonusByn;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-charcoal">
          Ваш статус:{" "}
          <span className="text-primary">{loyaltyWallet.status}</span>{" "}
          <span className="text-muted-foreground">(кэшбэк {loyaltyWallet.cashbackPercent}%)</span>
        </p>
        <Link
          to="/club"
          search={{ tab: "profile" }}
          className="rounded-[10px] border border-border px-3 py-2 text-sm font-semibold hover:bg-secondary"
        >
          Настройки профиля
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-charcoal via-[#2a2a2e] to-charcoal p-6 text-white shadow-hover">
        <div className="flex items-start justify-between gap-4">
          <img src={publicUrl("dubai_footer.png")} alt="Dubai Club" className="h-10 w-auto" />
          <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold">GOLD</span>
        </div>
        <p className="mt-8 text-xs uppercase tracking-wider text-white/50">Виртуальная карта</p>
        <p className="mt-1 text-2xl font-extrabold tabular-nums">{bonuses} бонусов</p>
        <p className="text-sm text-primary">{bonusByn.toFixed(2)} BYN</p>
        <p className="mt-3 text-xs text-white/50">
          Сгорят через 30 дней: {loyaltyWallet.expiringBonuses} бонусов
        </p>
      </div>

      <div className="grid gap-6 rounded-2xl border border-border bg-card p-6 shadow-card md:grid-cols-[180px_1fr] md:items-center">
        <img src={qrSrc} alt="QR для кассы" width={180} height={180} className="mx-auto rounded-2xl bg-white p-2" />
        <div>
          <p className="text-sm font-semibold">Динамический QR для кассы</p>
          <p className="mt-1 font-mono text-lg font-bold tracking-wide">{token}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Обновится через {secondsLeft} сек. Покажите сканеру в Минске или Ереване.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <p className="text-sm font-semibold">До статуса PLATINUM (кэшбэк {loyaltyWallet.platinumCashback}%)</p>
        <Progress value={loyaltyWallet.progressPercent} className="mt-3" />
        <p className="mt-2 text-sm text-muted-foreground">
          Осталось купить на {loyaltyWallet.toPlatinumByn} BYN
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => toast.success("В демо карта добавлена в Apple Wallet")}
          className="flex-1 rounded-[10px] bg-charcoal py-3 text-sm font-bold text-white"
        >
          Добавить в Apple Wallet
        </button>
        <button
          type="button"
          onClick={() => toast.success("В демо карта добавлена в Google Pay")}
          className="flex-1 rounded-[10px] border border-border bg-secondary py-3 text-sm font-bold"
        >
          Добавить в Google Pay
        </button>
      </div>
    </div>
  );
}
