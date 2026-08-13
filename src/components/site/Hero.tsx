import { Leaf, Mic } from "lucide-react";
import hero from "@/assets/hero-nuts.jpg";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={hero}
        alt="Премиальные орехи и сухофрукты в деревянном подарочном боксе"
        width={1920}
        height={1088}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="hero-overlay absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary-foreground ring-1 ring-primary/40 backdrop-blur">
            <Leaf className="size-3.5 text-primary" />
            100% натуральный продукт
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-charcoal-foreground md:text-6xl">
            Орехи и сухофрукты премиального качества
          </h1>
          <p className="mt-4 max-w-lg text-base text-charcoal-foreground/75 md:text-lg">
            Доставка из ближайшего магазина в Минске и Ереване от 30 минут.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="rounded-[10px] bg-primary px-7 py-4 text-base font-bold text-primary-foreground shadow-hover transition-transform hover:scale-[1.02] hover:bg-primary-dark">
              Собрать свой бокс
            </button>
            <button className="flex items-center justify-center gap-2 rounded-[10px] border-2 border-primary px-7 py-4 text-base font-bold text-primary-foreground/95 backdrop-blur transition-colors hover:bg-primary/15">
              <Mic className="size-5 text-primary" />
              Запустить AI-Сомелье
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
