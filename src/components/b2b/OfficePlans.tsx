import { toast } from "sonner";
import { officePlans, type OfficePlanId } from "@/data/b2b-pricing";

type OfficePlansProps = {
  onSubscribe: (planId: OfficePlanId) => void;
};

export function OfficePlans({ onSubscribe }: OfficePlansProps) {
  return (
    <section id="office" className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Снабжение офиса</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
          Регулярная доставка перекусов
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {officePlans.map((plan) => (
            <article
              key={plan.id}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <h3 className="text-lg font-extrabold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.employees}</p>
              <p className="mt-4 flex-1 text-sm">{plan.volume}</p>
              <p className="mt-4 text-xl font-extrabold">
                {plan.price ? `${plan.price} BYN / мес` : "По запросу"}
              </p>
              <button
                type="button"
                onClick={() => {
                  toast.success(`Тариф ${plan.name} — перейдите к счёту`);
                  onSubscribe(plan.id);
                }}
                className="mt-5 rounded-[10px] bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
              >
                Оформить корпоративную подписку
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
