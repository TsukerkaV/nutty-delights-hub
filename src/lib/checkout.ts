import { loyaltyWallet } from "@/data/loyalty";
import type { CityId } from "@/data/stores";

export type Fulfillment = "express" | "pickup" | "post";

export const AMD_RATE = 140;
export const EXPRESS_FEE = 5;
export const POST_FEE = 8;

export function deliveryFee(method: Fulfillment): number {
  switch (method) {
    case "express":
      return EXPRESS_FEE;
    case "pickup":
      return 0;
    case "post":
      return POST_FEE;
    default: {
      const _never: never = method;
      return _never;
    }
  }
}

export function toDisplay(amountByn: number, city: CityId): { value: number; currency: string } {
  if (city === "yerevan") {
    return { value: amountByn * AMD_RATE, currency: "AMD" };
  }
  return { value: amountByn, currency: "BYN" };
}

export function formatMoney(amountByn: number, city: CityId): string {
  const { value, currency } = toDisplay(amountByn, city);
  const formatted = city === "yerevan" ? Math.round(value).toLocaleString("ru-RU") : value.toFixed(2);
  return `${formatted} ${currency}`;
}

export function loyaltyDiscount(redeem: boolean): number {
  return redeem ? loyaltyWallet.bonusByn : 0;
}

export function payable(goods: number, redeem: boolean, method: Fulfillment): number {
  return Math.max(0, goods - loyaltyDiscount(redeem) + deliveryFee(method));
}

export function courierEta(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 45);
  return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

export function maskPhone(raw: string, city: CityId): string {
  const digits = raw.replace(/\D/g, "");
  if (city === "yerevan") {
    const rest = digits.startsWith("374") ? digits.slice(3) : digits;
    const a = rest.slice(0, 2);
    const b = rest.slice(2, 5);
    const c = rest.slice(5, 8);
    let out = "+374";
    if (a) out += ` (${a}`;
    if (a.length === 2) out += ")";
    if (b) out += ` ${b}`;
    if (c) out += ` ${c}`;
    return out;
  }
  const rest = digits.startsWith("375") ? digits.slice(3) : digits;
  const a = rest.slice(0, 2);
  const b = rest.slice(2, 5);
  const c = rest.slice(5, 7);
  const e = rest.slice(7, 9);
  let out = "+375";
  if (a) out += ` (${a}`;
  if (a.length === 2) out += ")";
  if (b) out += ` ${b}`;
  if (c) out += ` ${c}`;
  if (e) out += ` ${e}`;
  return out;
}

export const CHECKOUT_SNAPSHOT_KEY = "dubai-checkout-order";

export type CheckoutSnapshot = {
  orderId: string;
  storeLabel: string;
  fulfillment: Fulfillment;
  totalLabel: string;
};

export function saveSnapshot(data: CheckoutSnapshot) {
  sessionStorage.setItem(CHECKOUT_SNAPSHOT_KEY, JSON.stringify(data));
}

export function loadSnapshot(): CheckoutSnapshot | null {
  try {
    const raw = sessionStorage.getItem(CHECKOUT_SNAPSHOT_KEY);
    return raw ? (JSON.parse(raw) as CheckoutSnapshot) : null;
  } catch {
    return null;
  }
}
