export const LOYALTY_MEMBER_ID = "48291";

export const loyaltyWallet = {
  status: "GOLD" as const,
  cashbackPercent: 10,
  bonuses: 450,
  bonusByn: 15,
  expiringBonuses: 50,
  toPlatinumByn: 120,
  platinumCashback: 15,
  progressPercent: 88,
};

export type SubscriptionStatus = "active" | "paused" | "skipped";

export const defaultSubscription = {
  name: "Офисный сет перекусов + Кофе",
  cadence: "Каждые 2 недели",
  nextDelivery: "18 августа 2026",
  chargeDate: "17 августа",
  cardLast4: "4123",
};

export type HistoryChannel = "online" | "store";

export type HistoryOrder = {
  id: string;
  channel: HistoryChannel;
  title: string;
  subtitle: string;
  date: string;
  total: number;
  items: { productId: string; grams: number }[];
};

export const purchaseHistory: HistoryOrder[] = [
  {
    id: "4012",
    channel: "online",
    title: "Заказ №4012",
    subtitle: "Доставлен курьером",
    date: "14 августа",
    total: 38.4,
    items: [
      { productId: "cashew-roasted", grams: 150 },
      { productId: "cranberry", grams: 100 },
    ],
  },
  {
    id: "pos-zamok",
    channel: "store",
    title: "Покупка на кассе",
    subtitle: "Магазин ТЦ Замок (Минск)",
    date: "12 августа",
    total: 15.4,
    items: [{ productId: "pecan-caramel", grams: 100 }],
  },
  {
    id: "3990",
    channel: "online",
    title: "Заказ №3990",
    subtitle: "Самовывоз — Победителей",
    date: "5 августа",
    total: 22.94,
    items: [
      { productId: "almond-shell", grams: 100 },
      { productId: "mango", grams: 100 },
    ],
  },
  {
    id: "pos-yerevan",
    channel: "store",
    title: "Покупка на кассе",
    subtitle: "Магазин на Амиряна (Ереван)",
    date: "1 августа",
    total: 15.34,
    items: [{ productId: "pistachio", grams: 100 }],
  },
];
