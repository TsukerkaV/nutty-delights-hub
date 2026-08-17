import hero from "@/assets/hero-nuts.jpg";

const brands = ["EPAM", "Wargaming", "Yandex", "PicsArt", "IBA Group", "Itransition"];

export function B2bHero() {
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={hero}
        alt=""
        width={1920}
        height={1088}
        className="absolute inset-0 size-full object-cover opacity-50 grayscale"
      />
      <div className="absolute inset-0 bg-charcoal/75" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">B2B Hub</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
          Корпоративные подарки и полезные перекусы для вашей команды
        </h1>
        <p className="mt-4 max-w-2xl text-base text-white/75 md:text-lg">
          Собственное производство, брендирование от 10 штук, оплата по безналу и закрывающие
          документы в день отгрузки.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#branding"
            className="rounded-[10px] bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
          >
            Собрать брендированный бокс
          </a>
          <a
            href="#invoice"
            className="rounded-[10px] border border-white/20 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
          >
            Скачать счёт
          </a>
        </div>
      </div>
      <div className="relative border-t border-white/10 bg-charcoal/90">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
            Нам доверяют
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {brands.map((b) => (
              <span key={b} className="text-lg font-extrabold tracking-tight text-white/35">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
