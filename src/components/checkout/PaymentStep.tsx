import { cn } from "@/lib/utils";
import { useCheckoutUi } from "@/components/checkout/CheckoutShell";

type PaymentStepProps = {
  method: string;
  onMethod: (id: string) => void;
};

const byMethods = [
  { id: "wallet", label: "Apple Pay / Google Pay", accent: true },
  { id: "card", label: "Картой онлайн (bePaid / Webpay)", accent: false },
  { id: "erip", label: "ЕРИП", accent: false },
  { id: "invoice", label: "Счёт для юрлица (УНП/ИНН)", accent: false },
  { id: "cod", label: "Наличными / картой при получении", accent: false },
];

const amMethods = [
  { id: "idram", label: "Idram", accent: true },
  { id: "telcell", label: "Telcell Wallet", accent: false },
  { id: "am-card", label: "Местная банковская карта", accent: false },
  { id: "invoice", label: "Счёт для юрлица (ИНН)", accent: false },
];

export function PaymentStep({ method, onMethod }: PaymentStepProps) {
  const { city } = useCheckoutUi();
  const methods = city === "minsk" ? byMethods : amMethods;

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {methods.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onMethod(m.id)}
          className={cn(
            "rounded-2xl border px-4 py-4 text-left text-sm font-bold",
            method === m.id ? "border-primary bg-primary/10" : "border-border",
            m.accent && method !== m.id && "ring-1 ring-primary/30",
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
