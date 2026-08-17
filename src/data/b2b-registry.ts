export type RegistryCountry = "BY" | "AM";

export type RegistryCompany = {
  taxId: string;
  name: string;
  address: string;
  country: RegistryCountry;
  bankAccount: string;
};

export const demoCompanies: RegistryCompany[] = [
  {
    taxId: "193456789",
    name: 'ООО "ТехСолюшн"',
    address: "г. Минск, ул. Одоевского, 117",
    country: "BY",
    bankAccount: "BY12 ALFA 3012 0000 0000 1934 5678",
  },
  {
    taxId: "190123456",
    name: 'ООО "АйТи Парк Сервис"',
    address: "г. Минск, пр-т Независимости, 117",
    country: "BY",
    bankAccount: "BY44 ALFA 3012 0000 0000 1901 2345",
  },
  {
    taxId: "123456789",
    name: 'ЗАО "Вкусмарт"',
    address: "г. Минск, ул. Тимирязева, 65",
    country: "BY",
    bankAccount: "BY88 ALFA 3012 0000 0000 1234 5678",
  },
  {
    taxId: "00123456",
    name: "«PicsArt Armenia» ՍՊԸ",
    address: "г. Ереван, ул. Амиряна, 4/6",
    country: "AM",
    bankAccount: "AM12 AMEE 0000 0000 0012 3456",
  },
  {
    taxId: "02781234",
    name: "Teamable CJSC",
    address: "г. Ереван, ул. Арама, 9",
    country: "AM",
    bankAccount: "AM34 AMEE 0000 0000 0278 1234",
  },
];

export function lookupCompany(raw: string): RegistryCompany | undefined {
  const id = raw.replace(/\s+/g, "");
  return demoCompanies.find((c) => c.taxId === id);
}

export function guessCountry(taxId: string): RegistryCountry {
  return taxId.replace(/\D/g, "").length <= 8 ? "AM" : "BY";
}
