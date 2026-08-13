import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BoxBuilder } from "@/components/site/BoxBuilder";

const title = "Конструктор боксов Dubai — соберите свой набор орехов";
const description =
  "Соберите персональный бокс орехов и сухофруктов Dubai: выберите формат, до 8 вкусов, фасовку 50–200 г и упаковку. Цена пересчитывается мгновенно.";

export const Route = createFileRoute("/constructor")({
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
  component: ConstructorPage,
});

function ConstructorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <BoxBuilder />
      </main>
      <Footer />
    </div>
  );
}
