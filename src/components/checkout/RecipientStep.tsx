import { Gift } from "lucide-react";
import { maskPhone } from "@/lib/checkout";
import { useCheckoutUi } from "@/components/checkout/CheckoutShell";

type RecipientStepProps = {
  name: string;
  phone: string;
  comment: string;
  asGift: boolean;
  giftName: string;
  giftPhone: string;
  onName: (v: string) => void;
  onPhone: (v: string) => void;
  onComment: (v: string) => void;
  onGift: (v: boolean) => void;
  onGiftName: (v: string) => void;
  onGiftPhone: (v: string) => void;
};

export function RecipientStep({
  name,
  phone,
  comment,
  asGift,
  giftName,
  giftPhone,
  onName,
  onPhone,
  onComment,
  onGift,
  onGiftName,
  onGiftPhone,
}: RecipientStepProps) {
  const { city } = useCheckoutUi();
  const phonePlaceholder = city === "minsk" ? "+375 (__) ___ __ __" : "+374 (__) ___ ___";

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold">Имя</label>
        <input
          value={name}
          onChange={(e) => onName(e.target.value)}
          className="mt-1 w-full rounded-[10px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="text-sm font-semibold">Телефон</label>
        <input
          value={phone}
          onChange={(e) => onPhone(maskPhone(e.target.value, city))}
          placeholder={phonePlaceholder}
          className="mt-1 w-full rounded-[10px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="text-sm font-semibold">Комментарий курьеру</label>
        <textarea
          value={comment}
          onChange={(e) => onComment(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-[10px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          checked={asGift}
          onChange={(e) => onGift(e.target.checked)}
          className="size-4 accent-primary"
        />
        <Gift className="size-4 text-primary" />
        Отправить как подарок
      </label>
      {asGift && (
        <div className="space-y-3 rounded-2xl border border-border bg-secondary/50 p-4">
          <div>
            <label className="text-sm font-semibold">Имя получателя</label>
            <input
              value={giftName}
              onChange={(e) => onGiftName(e.target.value)}
              className="mt-1 w-full rounded-[10px] border border-border bg-background px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Телефон получателя</label>
            <input
              value={giftPhone}
              onChange={(e) => onGiftPhone(maskPhone(e.target.value, city))}
              placeholder={phonePlaceholder}
              className="mt-1 w-full rounded-[10px] border border-border bg-background px-3 py-2.5 text-sm"
            />
          </div>
          <p className="text-xs font-medium text-primary">
            Мы не положим бумажный чек в коробку, а вам пришлём трек-номер, чтобы сюрприз удался.
          </p>
        </div>
      )}
    </div>
  );
}
