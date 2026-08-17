import { useState } from "react";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth, digitsOnly, type CardBrand, type SavedCard } from "@/lib/auth";

export function SavedCardsPanel() {
  const { user, addCard, removeCard } = useAuth();
  const [adding, setAdding] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h2 className="text-lg font-extrabold">Сохранённые карты</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Для мгновенной оплаты и автосписания по подпискам. Можно удалить в любой момент.
      </p>
      <ul className="mt-5 space-y-3">
        {user.cards.length === 0 ? (
          <li className="text-sm text-muted-foreground">Карт пока нет</li>
        ) : (
          user.cards.map((card) => (
            <li
              key={card.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/50 p-4"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="size-5 text-primary" />
                <div>
                  <p className="text-sm font-bold">
                    {brandLabel(card.brand)} •••• {card.last4}
                  </p>
                  <p className="text-xs text-muted-foreground">до {card.expiry}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeCard(card.id)}
                className="inline-flex items-center gap-1 rounded-[10px] px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-background hover:text-foreground"
              >
                <Trash2 className="size-4" />
                Удалить
              </button>
            </li>
          ))
        )}
      </ul>
      {adding ? (
        <CardForm
          onCancel={() => setAdding(false)}
          onSave={(card) => {
            addCard(card);
            setAdding(false);
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          <Plus className="size-4" />
          Добавить карту
        </button>
      )}
    </section>
  );
}

function brandLabel(brand: CardBrand): string {
  switch (brand) {
    case "visa":
      return "Visa";
    case "mastercard":
      return "Mastercard";
    default: {
      const _never: never = brand;
      return _never;
    }
  }
}

function detectBrand(digits: string): CardBrand {
  return digits.startsWith("5") ? "mastercard" : "visa";
}

function CardForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (card: Omit<SavedCard, "id">) => void;
}) {
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");

  const digits = digitsOnly(number);
  const last4 = digits.slice(-4);

  return (
    <form
      className="mt-4 grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (digits.length < 4 || expiry.trim().length < 4) {
          return;
        }
        onSave({
          brand: detectBrand(digits),
          last4: last4.padStart(4, "0").slice(-4),
          expiry: expiry.trim(),
        });
      }}
    >
      <label className="space-y-1.5 sm:col-span-2">
        <span className="text-sm font-semibold">Номер карты</span>
        <Input
          inputMode="numeric"
          placeholder="4111 1111 1111 1111"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
        />
      </label>
      <label className="space-y-1.5">
        <span className="text-sm font-semibold">Срок</span>
        <Input
          placeholder="08/28"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          required
        />
      </label>
      <div className="flex items-end gap-2">
        <Button type="submit" className="rounded-[10px]" disabled={digits.length < 4}>
          Сохранить карту
        </Button>
        <Button type="button" variant="outline" className="rounded-[10px]" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
}
