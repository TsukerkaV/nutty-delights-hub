import almond from "@/assets/p-almond.jpg";
import cashew from "@/assets/p-cashew.jpg";
import pistachio from "@/assets/p-pistachio.jpg";
import mango from "@/assets/p-mango.jpg";
import { defaultAiPrefs, type AiPrefs } from "@/lib/ai-prefs";

export type VoiceProduct = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  pricePer100: number;
  keywords: string[];
  addedSugar?: boolean;
  peanut?: boolean;
};

export type VoiceBundleId = "wine" | "wineAlt" | "office";

export type VoiceBundle = {
  id: VoiceBundleId;
  prompt: string;
  items: { productId: string; grams: number }[];
};

export type VoiceIntent =
  | { kind: "disambiguate"; topic: "peanut"; grams: number }
  | { kind: "bundle"; bundleId: VoiceBundleId }
  | { kind: "addExact"; productId: string; grams: number }
  | { kind: "blocked"; reason: "peanut" | "sugar"; grams: number; fallbackId: string }
  | { kind: "unknown" };

export const peanutVariants: VoiceProduct[] = [
  {
    id: "peanut-roasted-salted",
    name: "Арахис жареный солёный",
    subtitle: "классика к столу",
    image: almond,
    pricePer100: 3.8,
    keywords: ["жарен", "солён", "солен"],
    peanut: true,
  },
  {
    id: "peanut-beer",
    name: "Арахис солёный к пиву",
    subtitle: "в скорлупе",
    image: pistachio,
    pricePer100: 4.1,
    keywords: ["пив", "скорлуп"],
    peanut: true,
  },
  {
    id: "peanut-blanched",
    name: "Арахис очищенный (сырой)",
    subtitle: "бланшированный",
    image: cashew,
    pricePer100: 3.5,
    keywords: ["сырой", "очищен", "бланш"],
    peanut: true,
  },
];

export const catalogProducts: VoiceProduct[] = [
  {
    id: "cashew-roasted",
    name: "Кешью жареный",
    subtitle: "без соли",
    image: cashew,
    pricePer100: 12.6,
    keywords: ["кешью"],
  },
  {
    id: "cranberry",
    name: "Сушеная клюква",
    subtitle: "без сахара",
    image: mango,
    pricePer100: 6.96,
    keywords: ["клюкв"],
  },
  {
    id: "pecan-caramel",
    name: "Пекан в карамели",
    subtitle: "десертный",
    image: almond,
    pricePer100: 15.4,
    keywords: ["пекан", "карамел"],
    addedSugar: true,
  },
  {
    id: "almond-shell",
    name: "Миндаль в жареной скорлупе",
    subtitle: "хрустящий",
    image: almond,
    pricePer100: 10.34,
    keywords: ["миндал"],
  },
  {
    id: "pistachio",
    name: "Фисташка солёная ж/с",
    subtitle: "жар/соль",
    image: pistachio,
    pricePer100: 15.34,
    keywords: ["фисташк"],
  },
  {
    id: "mango",
    name: "Манго сушёное без сахара",
    subtitle: "цукат",
    image: mango,
    pricePer100: 6.96,
    keywords: ["манго"],
  },
  ...peanutVariants,
];

export const bundles: Record<VoiceBundleId, VoiceBundle> = {
  wine: {
    id: "wine",
    prompt:
      "Отличный выбор. К терпкому вину идеально подойдут выдержанные сырные ноты и сладкие акценты. Я собрал сет на {total} BYN:",
    items: [
      { productId: "cashew-roasted", grams: 150 },
      { productId: "cranberry", grams: 100 },
      { productId: "pecan-caramel", grams: 100 },
    ],
  },
  wineAlt: {
    id: "wineAlt",
    prompt:
      "Другой вариант к красному: более ореховый, с солёным акцентом. Сет на {total} BYN:",
    items: [
      { productId: "almond-shell", grams: 150 },
      { productId: "pistachio", grams: 100 },
      { productId: "cranberry", grams: 80 },
    ],
  },
  office: {
    id: "office",
    prompt: "Лёгкий полезный перекус в офис без лишней сладости. Сет на {total} BYN:",
    items: [
      { productId: "cashew-roasted", grams: 100 },
      { productId: "almond-shell", grams: 100 },
      { productId: "mango", grams: 80 },
    ],
  },
};

export function findProduct(id: string): VoiceProduct | undefined {
  return catalogProducts.find((p) => p.id === id);
}

export function parseGrams(transcript: string, fallback = 100): number {
  const match = transcript.match(/(\d+)\s*(г|гр|грамм|грамма|граммов)/i);
  if (!match) {
    return fallback;
  }
  const grams = Number(match[1]);
  return grams > 0 ? grams : fallback;
}

export function hasExplicitGrams(transcript: string): boolean {
  return /(\d+)\s*(г|гр|грамм|грамма|граммов)/i.test(transcript);
}

export function classifyVoice(transcript: string, prefs: AiPrefs = defaultAiPrefs): VoiceIntent {
  const text = transcript.toLowerCase().replace(/ё/g, "е");
  const grams = hasExplicitGrams(text) ? parseGrams(text) : prefs.defaultGrams;

  const wineHit = /вин|сомел|на двоих|к красн/.test(text);
  const officeHit = /офис|перекус|полезн/.test(text);

  if (wineHit && !/арахис/.test(text)) {
    return { kind: "bundle", bundleId: "wine" };
  }
  if (officeHit && !/арахис/.test(text)) {
    return { kind: "bundle", bundleId: "office" };
  }

  if (/арахис/.test(text)) {
    if (prefs.noPeanut) {
      return { kind: "blocked", reason: "peanut", grams, fallbackId: "cashew-roasted" };
    }
    const specified = peanutVariants.find((variant) =>
      variant.keywords.some((kw) => text.includes(kw)),
    );
    if (specified) {
      return { kind: "addExact", productId: specified.id, grams };
    }
    return { kind: "disambiguate", topic: "peanut", grams };
  }

  const exact = catalogProducts.find((product) =>
    product.keywords.some((kw) => text.includes(kw)),
  );
  if (exact) {
    if (prefs.noPeanut && exact.peanut) {
      return { kind: "blocked", reason: "peanut", grams, fallbackId: "cashew-roasted" };
    }
    if ((prefs.noSugar || prefs.vegan) && exact.addedSugar) {
      return { kind: "blocked", reason: "sugar", grams, fallbackId: "cranberry" };
    }
    return { kind: "addExact", productId: exact.id, grams };
  }

  return { kind: "unknown" };
}

export function bundleTotal(bundle: VoiceBundle): number {
  return bundle.items.reduce((sum, line) => {
    const product = findProduct(line.productId);
    if (!product) {
      return sum;
    }
    return sum + (product.pricePer100 * line.grams) / 100;
  }, 0);
}

export function formatByn(value: number): string {
  return value.toFixed(2);
}

export function assertNever(value: never): never {
  throw new Error(`Unhandled intent: ${String(value)}`);
}
