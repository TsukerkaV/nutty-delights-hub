export type B2bDocKind = "invoice" | "act" | "ttn";

export type B2bDoc = {
  id: string;
  taxId: string;
  kind: B2bDocKind;
  title: string;
  date: string;
  total: number;
  qty: number;
  note: string;
};

export const b2bDocs: B2bDoc[] = [
  {
    id: "inv-ny-2025",
    taxId: "193456789",
    kind: "invoice",
    title: "Счёт-фактура №NY-2025",
    date: "12.12.2025",
    total: 486,
    qty: 24,
    note: "Новогодний корпоративный заказ 2025. Демо-документ.",
  },
  {
    id: "act-2026-q1",
    taxId: "193456789",
    kind: "act",
    title: "Акт сверки за 1 кв. 2026",
    date: "31.03.2026",
    total: 612.4,
    qty: 1,
    note: "Сальдо согласовано. Демо-акт сверки взаимных расчётов.",
  },
  {
    id: "ttn-4012",
    taxId: "193456789",
    kind: "ttn",
    title: "ТТН №4012",
    date: "14.08.2026",
    total: 38.4,
    qty: 2,
    note: "Товарно-транспортная накладная. Демо-макет для кабинета.",
  },
];

export function docsForCompany(taxId: string): B2bDoc[] {
  const own = b2bDocs.filter((d) => d.taxId === taxId);
  if (own.length > 0) {
    return own;
  }
  return b2bDocs.map((d) => ({ ...d, taxId, id: `${d.id}-${taxId}` }));
}

export function docTitle(kind: B2bDocKind): string {
  switch (kind) {
    case "invoice":
      return "Счёт-фактура (демо)";
    case "act":
      return "Акт сверки (демо)";
    case "ttn":
      return "ТТН (демо)";
    default: {
      const _never: never = kind;
      return _never;
    }
  }
}
