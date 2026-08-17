import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FulfillmentStep } from "@/components/checkout/FulfillmentStep";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PaymentStep } from "@/components/checkout/PaymentStep";
import { RecipientStep } from "@/components/checkout/RecipientStep";
import { useCheckoutUi } from "@/components/checkout/CheckoutShell";
import { storesForCity, type Store } from "@/data/stores";
import { useCart } from "@/lib/cart";
import {
  formatMoney,
  payable,
  saveSnapshot,
  type Fulfillment,
} from "@/lib/checkout";
import { toast } from "sonner";
import { downloadInvoicePdf } from "@/lib/invoice-pdf";
import { useOrgModal } from "@/lib/org-modal";
import { type SavedCompany } from "@/lib/auth";

export function CheckoutForm() {
  const { items, total } = useCart();
  const { city } = useCheckoutUi();
  const navigate = useNavigate();
  const [redeem, setRedeem] = useState(false);
  const [method, setMethod] = useState<Fulfillment>("express");
  const [address, setAddress] = useState("");
  const [store, setStore] = useState<Store | null>(storesForCity(city)[0] ?? null);
  const [postService, setPostService] = useState(city === "minsk" ? "Европочта" : "Haypost");
  const [name, setName] = useState("Анна");
  const [phone, setPhone] = useState(city === "minsk" ? "+375 (29) 123 45 67" : "+374 (11) 123 456");
  const [comment, setComment] = useState("");
  const [asGift, setAsGift] = useState(false);
  const [giftName, setGiftName] = useState("");
  const [giftPhone, setGiftPhone] = useState("");
  const [payMethod, setPayMethod] = useState(city === "minsk" ? "wallet" : "idram");
  const [legal, setLegal] = useState<SavedCompany | null>(null);
  const { openOrgModal } = useOrgModal();

  useEffect(() => {
    setStore(storesForCity(city)[0] ?? null);
    setPostService(city === "minsk" ? "Европочта" : "Haypost");
    setPayMethod(city === "minsk" ? "wallet" : "idram");
    setPhone(city === "minsk" ? "+375 (29) 123 45 67" : "+374 (11) 123 456");
  }, [city]);

  const due = payable(total, redeem, method);

  const choosePay = (id: string) => {
    setPayMethod(id);
    if (id === "invoice") {
      openOrgModal({
        onContinue: (company) => {
          setLegal(company);
          toast.success(`Счёт для ${company.name}`);
        },
      });
    }
  };

  const storeLabel = (() => {
    switch (method) {
      case "express":
        return "Магазин на пр. Победителей";
      case "pickup":
        return store?.name ?? "магазин Dubai";
      case "post":
        return postService;
      default: {
        const _n: never = method;
        return _n;
      }
    }
  })();

  const pay = () => {
    if (items.length === 0) {
      toast.error("Корзина пуста");
      return;
    }
    if (!name.trim() || phone.replace(/\D/g, "").length < 10) {
      toast.error("Укажите имя и телефон");
      return;
    }
    if (method === "express" && address.trim().length < 5) {
      toast.error("Укажите адрес доставки");
      return;
    }
    if (method === "pickup" && !store) {
      toast.error("Выберите магазин");
      return;
    }
    if (asGift && (!giftName.trim() || giftPhone.replace(/\D/g, "").length < 10)) {
      toast.error("Укажите данные получателя подарка");
      return;
    }
    if (payMethod === "invoice") {
      if (!legal) {
        openOrgModal({
          onContinue: (company) => {
            setLegal(company);
            toast.success(`Выбрано: ${company.name}`);
          },
        });
        toast.message("Укажите организацию для счёта");
        return;
      }
      downloadInvoicePdf({
        taxId: legal.taxId,
        companyName: legal.name,
        address: legal.address,
        qty: items.length,
        total: due,
        savings: 0,
        position: items.map((i) => `${i.name} ${i.grams}г`).join(", "),
        note: "Безналичный расчёт. Демо-счёт по заказу из корзины.",
      });
    }
    const orderId = String(4000 + Math.floor(Math.random() * 900));
    saveSnapshot({
      orderId,
      storeLabel,
      fulfillment: method,
      totalLabel: formatMoney(due, city),
    });
    void navigate({ to: "/checkout/success" });
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold">Корзина пуста</h1>
        <p className="mt-2 text-sm text-muted-foreground">Добавьте орехи или сет, затем вернитесь к оплате.</p>
        <Link to="/" className="mt-6 inline-block rounded-[10px] bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">
          В каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,0.9fr)]">
        <div className="space-y-8">
          <div className="hidden space-y-8 lg:block">
            <section>
              <h2 className="mb-3 text-lg font-extrabold">1. Доставка</h2>
              <FulfillmentStep
                method={method}
                onMethod={setMethod}
                address={address}
                onAddress={setAddress}
                store={store}
                onStore={setStore}
                postService={postService}
                onPostService={setPostService}
              />
            </section>
            <section>
              <h2 className="mb-3 text-lg font-extrabold">2. Получатель</h2>
              <RecipientStep
                name={name}
                phone={phone}
                comment={comment}
                asGift={asGift}
                giftName={giftName}
                giftPhone={giftPhone}
                onName={setName}
                onPhone={setPhone}
                onComment={setComment}
                onGift={setAsGift}
                onGiftName={setGiftName}
                onGiftPhone={setGiftPhone}
              />
            </section>
            <section>
              <h2 className="mb-3 text-lg font-extrabold">3. Оплата</h2>
              <PaymentStep method={payMethod} onMethod={choosePay} />
            </section>
            <PayButton
              label={
                payMethod === "invoice"
                  ? `Получить счёт и оформить · ${formatMoney(due, city)}`
                  : `Оплатить ${formatMoney(due, city)}`
              }
              onClick={pay}
            />
          </div>

          <div className="lg:hidden">
            <OrderSummary redeem={redeem} onRedeem={setRedeem} fulfillment={method} />
            <Accordion type="single" collapsible defaultValue="ship" className="mt-6">
              <AccordionItem value="ship">
                <AccordionTrigger>1. Доставка</AccordionTrigger>
                <AccordionContent>
                  <FulfillmentStep
                    method={method}
                    onMethod={setMethod}
                    address={address}
                    onAddress={setAddress}
                    store={store}
                    onStore={setStore}
                    postService={postService}
                    onPostService={setPostService}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="who">
                <AccordionTrigger>2. Получатель</AccordionTrigger>
                <AccordionContent>
                  <RecipientStep
                    name={name}
                    phone={phone}
                    comment={comment}
                    asGift={asGift}
                    giftName={giftName}
                    giftPhone={giftPhone}
                    onName={setName}
                    onPhone={setPhone}
                    onComment={setComment}
                    onGift={setAsGift}
                    onGiftName={setGiftName}
                    onGiftPhone={setGiftPhone}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="pay">
                <AccordionTrigger>3. Оплата</AccordionTrigger>
                <AccordionContent>
                  <PaymentStep method={payMethod} onMethod={choosePay} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="mt-6">
            <PayButton
              label={
                payMethod === "invoice"
                  ? `Получить счёт и оформить · ${formatMoney(due, city)}`
                  : `Оплатить ${formatMoney(due, city)}`
              }
              onClick={pay}
            />
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <OrderSummary redeem={redeem} onRedeem={setRedeem} fulfillment={method} />
        </div>
      </div>
    </div>
  );
}

function PayButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="checkout-shine relative w-full overflow-hidden rounded-[10px] bg-primary py-4 text-base font-extrabold text-primary-foreground shadow-hover"
    >
      {label}
    </button>
  );
}
