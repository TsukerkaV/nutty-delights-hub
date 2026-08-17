export type DiscountTier = {
  min: number;
  max: number;
  discount: number;
  label: string;
  perk?: string;
};

export const BOX_UNIT_PRICE = 49;

export const quantityMin = 10;
export const quantityMax = 500;

export const discountTiers: DiscountTier[] = [
  { min: 10, max: 50, discount: 0, label: "Базовая цена" },
  { min: 51, max: 150, discount: 0.1, label: "−10%" },
  { min: 151, max: 300, discount: 0.15, label: "−15%", perk: "Бесплатная гравировка" },
  { min: 301, max: 500, discount: 0.2, label: "−20%", perk: "Бесплатная гравировка" },
];

export function tierForQty(qty: number): DiscountTier {
  const match = discountTiers.find((t) => qty >= t.min && qty <= t.max);
  return match ?? discountTiers[discountTiers.length - 1]!;
}

export function quoteBoxes(qty: number): { total: number; savings: number; unit: number; tier: DiscountTier } {
  const tier = tierForQty(qty);
  const unit = BOX_UNIT_PRICE * (1 - tier.discount);
  const total = unit * qty;
  const savings = BOX_UNIT_PRICE * qty - total;
  return { total, savings, unit, tier };
}

export type OfficePlanId = "startup" | "business" | "enterprise";

export type OfficePlan = {
  id: OfficePlanId;
  name: string;
  employees: string;
  volume: string;
  price: number | null;
};

export const officePlans: OfficePlan[] = [
  {
    id: "startup",
    name: "Startup",
    employees: "до 20 сотрудников",
    volume: "5 кг орехов и сухофруктов в месяц",
    price: 189,
  },
  {
    id: "business",
    name: "Business",
    employees: "до 50 сотрудников",
    volume: "15 кг в месяц",
    price: 479,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    employees: "от 50 сотрудников",
    volume: "кастомный расчёт объёма",
    price: null,
  },
];
