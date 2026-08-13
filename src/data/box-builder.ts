import almond from "@/assets/p-almond.jpg";
import cashew from "@/assets/p-cashew.jpg";
import pistachio from "@/assets/p-pistachio.jpg";
import mango from "@/assets/p-mango.jpg";

export type BoxCategory = {
  id: string;
  title: string;
  subtitle: string;
  slots: number;
  basePrice: number;
  badge?: string;
};

export type Filling = {
  id: string;
  name: string;
  category: "Орехи" | "Сухофрукты" | "Цукаты" | "Снеки";
  image: string;
  pricePer100: number;
  tags: string[];
};

export type Packaging = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export const boxCategories: BoxCategory[] = [
  {
    id: "mini",
    title: "Мини-бокс",
    subtitle: "3 вкуса · компактный крафт-бокс",
    slots: 3,
    basePrice: 9,
  },
  {
    id: "classic",
    title: "Классический бокс",
    subtitle: "5 вкусов · самый популярный формат",
    slots: 5,
    basePrice: 14,
    badge: "Хит",
  },
  {
    id: "gift",
    title: "Подарочный бокс",
    subtitle: "6 вкусов · деревянный кейс с лентой",
    slots: 6,
    basePrice: 29,
    badge: "Premium",
  },
  {
    id: "corporate",
    title: "Корпоративный",
    subtitle: "8 вкусов · логотип компании на крышке",
    slots: 8,
    basePrice: 45,
    badge: "B2B",
  },
];

export const fillings: Filling[] = [
  { id: "almond", name: "Миндаль жареный", category: "Орехи", image: almond, pricePer100: 10.34, tags: ["Без соли", "Белок"] },
  { id: "cashew", name: "Кешью жареный", category: "Орехи", image: cashew, pricePer100: 12.6, tags: ["Мягкий вкус"] },
  { id: "pistachio", name: "Фисташка солёная", category: "Орехи", image: pistachio, pricePer100: 15.34, tags: ["Солёная"] },
  { id: "hazelnut", name: "Фундук обжаренный", category: "Орехи", image: almond, pricePer100: 13.2, tags: ["Хрустящий"] },
  { id: "mango", name: "Манго сушёное", category: "Сухофрукты", image: mango, pricePer100: 6.96, tags: ["Без сахара"] },
  { id: "apricot", name: "Курага королевская", category: "Сухофрукты", image: mango, pricePer100: 5.4, tags: ["Узбекистан"] },
  { id: "fig", name: "Инжир вяленый", category: "Сухофрукты", image: mango, pricePer100: 7.8, tags: ["Клетчатка"] },
  { id: "pineapple", name: "Ананас в цукатах", category: "Цукаты", image: mango, pricePer100: 4.9, tags: ["Сладкий"] },
  { id: "ginger", name: "Имбирь в цукатах", category: "Цукаты", image: mango, pricePer100: 5.2, tags: ["Пряный"] },
  { id: "cranberry", name: "Клюква в сахаре", category: "Цукаты", image: mango, pricePer100: 6.1, tags: ["Кислинка"] },
  { id: "mix", name: "Энергетический микс", category: "Снеки", image: cashew, pricePer100: 9.4, tags: ["Спорт"] },
  { id: "choco", name: "Фундук в шоколаде", category: "Снеки", image: cashew, pricePer100: 11.7, tags: ["Десерт"] },
];

export const fillingCategories = ["Все", "Орехи", "Сухофрукты", "Цукаты", "Снеки"] as const;

export const portions = [50, 100, 200] as const;

export const packagings: Packaging[] = [
  { id: "kraft", title: "Крафт-коробка", description: "Эко-картон, стикер Dubai", price: 0 },
  { id: "wood", title: "Деревянный кейс", description: "Шпон + сатиновая лента", price: 12 },
  { id: "premium", title: "Premium-футляр", description: "Магнитная крышка, тиснение", price: 22 },
];
