import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Building2, FileDown, Pencil, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { docsForCompany, docTitle, type B2bDoc } from "@/data/b2b-docs";
import { fillings } from "@/data/box-builder";
import { downloadInvoicePdf } from "@/lib/invoice-pdf";
import { useAuth, type SavedCompany } from "@/lib/auth";
import { useOrgModal } from "@/lib/org-modal";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

const nyOrderIds = ["cashew", "pistachio", "mix"] as const;

export function CompaniesPanel() {
  const { user, setActiveCompany, updateCompany } = useAuth();
  const { openOrgModal } = useOrgModal();
  const { add } = useCart();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  const companies = user.companies ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold">Мои компании (B2B-профили)</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Переключайтесь между юрлицами в один клик при заказе.
          </p>
        </div>
        <Button
          type="button"
          className="rounded-[10px]"
          onClick={() => openOrgModal({ forceAdd: true })}
        >
          <Plus className="size-4" />
          Добавить компанию
        </Button>
      </div>

      {companies.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Пока нет сохранённых юрлиц. Добавьте УНП или ИНН — реквизиты подтянутся из демо-реестра.
        </p>
      ) : (
        <ul className="space-y-4">
          {companies.map((company) => (
            <CompanyCard
              key={company.taxId}
              company={company}
              active={user.activeCompanyTaxId === company.taxId}
              editing={editing === company.taxId}
              onSelect={() => setActiveCompany(company.taxId)}
              onEdit={() => setEditing(company.taxId)}
              onCancel={() => setEditing(null)}
              onSave={(patch) => {
                updateCompany(company.taxId, patch);
                setEditing(null);
                toast.success("Реквизиты обновлены");
              }}
            />
          ))}
        </ul>
      )}

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h3 className="text-base font-extrabold">Повторить корпоративный заказ</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Новогодний набор 2025: кешью, фисташка и энергетический микс.
        </p>
        <button
          type="button"
          onClick={() => {
            for (const id of nyOrderIds) {
              const product = fillings.find((f) => f.id === id);
              if (product) {
                add({
                  id: product.id,
                  name: product.name,
                  grams: 250,
                  pricePer100: product.pricePer100,
                  image: product.image,
                });
              }
            }
            toast.success("Новогодний заказ 2025 в корзине");
            void navigate({ to: "/checkout" });
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
        >
          <RefreshCw className="size-4" />
          Повторить новогодний заказ 2025 года
        </button>
      </section>
    </div>
  );
}

function CompanyCard({
  company,
  active,
  editing,
  onSelect,
  onEdit,
  onCancel,
  onSave,
}: {
  company: SavedCompany;
  active: boolean;
  editing: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (patch: Partial<SavedCompany>) => void;
}) {
  const [name, setName] = useState(company.name);
  const [address, setAddress] = useState(company.address);
  const docs = docsForCompany(company.taxId);

  return (
    <li
      className={cn(
        "rounded-2xl border bg-card p-5 shadow-card",
        active ? "border-primary" : "border-border",
      )}
    >
      <button type="button" onClick={onSelect} className="w-full text-left">
        <div className="flex items-start gap-3">
          <Building2 className="mt-0.5 size-5 text-primary" />
          <div>
            <p className="font-bold">{company.name}</p>
            <p className="text-sm text-muted-foreground">
              {company.country === "BY" ? "УНП" : "ИНН"}: {company.taxId}
              {active ? " · активная для заказа" : ""}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{company.address}</p>
            {company.bankAccount ? (
              <p className="text-xs text-muted-foreground">Р/с: {company.bankAccount}</p>
            ) : null}
          </div>
        </div>
      </button>

      {editing ? (
        <form
          className="mt-4 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ name: name.trim() || company.name, address: address.trim() || company.address });
          }}
        >
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          <div className="flex gap-2">
            <Button type="submit" className="rounded-[10px]">
              Сохранить
            </Button>
            <Button type="button" variant="outline" className="rounded-[10px]" onClick={onCancel}>
              Отмена
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="rounded-[10px]" onClick={onEdit}>
            <Pencil className="size-4" />
            Редактировать
          </Button>
        </div>
      )}

      <ul className="mt-4 space-y-2 border-t border-border pt-4">
        {docs.map((doc) => (
          <li key={doc.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span>
              <span className="font-semibold">{doc.title}</span>
              <span className="text-muted-foreground"> · {doc.date}</span>
            </span>
            <button
              type="button"
              onClick={() => downloadDoc(company, doc)}
              className="inline-flex items-center gap-1 rounded-[10px] px-3 py-2 font-semibold text-primary hover:bg-secondary"
            >
              <FileDown className="size-4" />
              Скачать
            </button>
          </li>
        ))}
      </ul>
    </li>
  );
}

function downloadDoc(company: SavedCompany, doc: B2bDoc) {
  downloadInvoicePdf({
    taxId: company.taxId,
    companyName: company.name,
    address: company.address,
    qty: doc.qty,
    total: doc.total,
    savings: 0,
    title: docTitle(doc.kind),
    filename: `${doc.kind}-${company.taxId}.pdf`,
    position: doc.title,
    note: doc.note,
  });
}
