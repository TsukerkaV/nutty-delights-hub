import { FileDown } from "lucide-react";
import { toast } from "sonner";
import { officePlans, quoteBoxes, type OfficePlanId } from "@/data/b2b-pricing";
import { downloadInvoicePdf } from "@/lib/invoice-pdf";
import { useOrgModal } from "@/lib/org-modal";

type SmartInvoiceProps = {
  qty: number;
  planId: OfficePlanId | null;
};

export function SmartInvoice({ qty, planId }: SmartInvoiceProps) {
  const { openOrgModal } = useOrgModal();
  const quote = quoteBoxes(qty);
  const plan = officePlans.find((p) => p.id === planId);
  const heading = plan
    ? `Оформление B2B-подписки «${plan.name}»`
    : `Оформление B2B-заказа на ${qty} брендированных боксов`;

  const requestInvoice = () => {
    openOrgModal({
      onContinue: (company) => {
        downloadInvoicePdf({
          taxId: company.taxId,
          companyName: company.name,
          address: company.address,
          qty,
          total: quote.total,
          savings: quote.savings,
          note: plan
            ? `Корпоративная подписка ${plan.name}. Резерв 3 дня до оплаты.`
            : "Заказ резервируется на складе на 3 дня до поступления оплаты.",
        });
        toast.success("Счёт сформирован");
      },
    });
  };

  return (
    <section id="invoice" className="bg-secondary/60 py-16">
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Документы</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">{heading}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Счёт по УНП или ИНН за 5 секунд — без повторной регистрации. Демо-номера: 193456789,
          190123456, 00123456.
        </p>
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
          <p className="text-sm text-muted-foreground">
            Сумма: <span className="font-bold text-foreground">{quote.total.toFixed(2)} BYN</span>
            {quote.savings > 0 ? (
              <span className="ml-2 text-primary">экономия {quote.savings.toFixed(2)} BYN</span>
            ) : null}
          </p>
          <button
            type="button"
            onClick={requestInvoice}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
          >
            <FileDown className="size-4" />
            Получить счёт / Оформить как юрлицо
          </button>
        </div>
      </div>
    </section>
  );
}
