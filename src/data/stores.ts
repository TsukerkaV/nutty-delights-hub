export type CityId = "minsk" | "yerevan";

export type Store = {
  id: string;
  city: CityId;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export const stores: Store[] = [
  {
    id: "pobeditel",
    city: "minsk",
    name: "Магазин на пр. Победителей",
    address: "пр. Победителей, 84",
    lat: 53.921,
    lng: 27.523,
  },
  {
    id: "zamok",
    city: "minsk",
    name: "ТРЦ Замок",
    address: "ул. Притыцкого, 156",
    lat: 53.907,
    lng: 27.454,
  },
  {
    id: "amiryan",
    city: "yerevan",
    name: "Магазин на Амиряна",
    address: "ул. Амиряна, 4/6",
    lat: 40.181,
    lng: 44.514,
  },
  {
    id: "northern",
    city: "yerevan",
    name: "ТРЦ Northern Avenue",
    address: "Северный проспект, 7",
    lat: 40.183,
    lng: 44.515,
  },
];

export function storesForCity(city: CityId): Store[] {
  return stores.filter((s) => s.city === city);
}

export function osmEmbed(store: Store): string {
  const d = 0.012;
  const bbox = `${store.lng - d},${store.lat - d},${store.lng + d},${store.lat + d}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${store.lat}%2C${store.lng}`;
}
