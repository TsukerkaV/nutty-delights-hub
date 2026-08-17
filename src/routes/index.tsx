import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { ProductCard, type Product } from "@/components/site/ProductCard";
import { BentoWhy } from "@/components/site/BentoWhy";
import { Reviews } from "@/components/site/Reviews";
import { Footer } from "@/components/site/Footer";
import { B2bHome } from "@/components/b2b/B2bHome";
import { parseAudience } from "@/lib/audience";
import almond from "@/assets/p-almond.jpg";
import cashew from "@/assets/p-cashew.jpg";
import pistachio from "@/assets/p-pistachio.jpg";
import mango from "@/assets/p-mango.jpg";

const title = "Dubai — орехи и сухофрукты с доставкой в Минске и Ереване";
const description =
  "Премиальные орехи, сухофрукты, цукаты и подарочные боксы Dubai. Экспресс-доставка от 30 минут, самовывоз из 12 магазинов, кэшбэк и подписка.";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { audience?: "b2b" } => {
    return parseAudience(search["audience"]) === "b2b" ? { audience: "b2b" } : {};
  },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const products: Product[] = [
  { id: "1", name: "Миндаль в жареной скорлупе", image: almond, cashback: 5, pricePer100: 10.34 },
  { id: "2", name: "Кешью жареный без соли", image: cashew, cashback: 7, pricePer100: 12.6 },
  { id: "3", name: "Фисташка солёная ж/с", image: pistachio, cashback: 5, pricePer100: 15.34 },
  { id: "4", name: "Манго сушёное без сахара", image: mango, cashback: 10, pricePer100: 6.96 },
];

function Index() {
  const search = Route.useSearch();
  const isB2b = search.audience === "b2b";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {isB2b ? (
          <B2bHome />
        ) : (
          <>
            <Hero />

            <section className="py-16">
              <div className="mx-auto max-w-7xl px-4">
                <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                  Рекомендуемые товары
                </h2>
                <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            </section>

            <BentoWhy />
            <Reviews />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
