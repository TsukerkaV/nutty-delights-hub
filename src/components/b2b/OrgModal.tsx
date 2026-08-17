import { useEffect, useState } from "react";
import { Building2, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { guessCountry, lookupCompany } from "@/data/b2b-registry";
import { useAuth, type SavedCompany } from "@/lib/auth";

type OrgModalProps = {
  open: boolean;
  forceAdd: boolean;
  onClose: () => void;
  onFinish: (company: SavedCompany, save: boolean) => void;
  pendingSave: boolean;
};

export function OrgModal({ open, forceAdd, onClose, onFinish, pendingSave }: OrgModalProps) {
  const { user, openAuth, setActiveCompany } = useAuth();
  const companies = user?.companies ?? [];
  const showList = !forceAdd && companies.length > 0;
  const [adding, setAdding] = useState(!showList);
  const [taxId, setTaxId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [country, setCountry] = useState<SavedCompany["country"]>("BY");
  const [found, setFound] = useState(false);
  const [save, setSave] = useState(true);

  useEffect(() => {
    if (!open) {
      return;
    }
    setAdding(!showList);
    setTaxId("");
    setName("");
    setAddress("");
    setBankAccount("");
    setFound(false);
    setSave(true);
  }, [open, showList]);

  const find = () => {
    const id = taxId.replace(/\s+/g, "");
    if (id.length < 8) {
      toast.error("Введите 8–9 цифр УНП или ИНН");
      return;
    }
    const hit = lookupCompany(id);
    if (hit) {
      setTaxId(hit.taxId);
      setName(hit.name);
      setAddress(hit.address);
      setBankAccount(hit.bankAccount);
      setCountry(hit.country);
      setFound(true);
      toast.success("Реквизиты подтянуты из демо-реестра");
      return;
    }
    setFound(true);
    setCountry(guessCountry(id));
    toast.message("Компания не в демо-базе — заполните название и адрес вручную");
  };

  const continueWith = (company: SavedCompany) => {
    if (save && !user) {
      onFinish(company, true);
      openAuth();
      toast.message("Войдите, чтобы сохранить компанию в профиле");
      return;
    }
    onFinish(company, save);
  };

  const draft: SavedCompany | null =
    name.trim() && address.trim() && taxId.replace(/\s+/g, "").length >= 8
      ? {
          taxId: taxId.replace(/\s+/g, ""),
          name: name.trim(),
          address: address.trim(),
          country,
          ...(bankAccount.trim() ? { bankAccount: bankAccount.trim() } : {}),
        }
      : null;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-lg rounded-2xl sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle>Добавление организации для выставления счёта</DialogTitle>
          <DialogDescription>
            Введите УНП (Беларусь) или ИНН (Армения). Демо: 193456789, 190123456, 00123456.
          </DialogDescription>
        </DialogHeader>

        {pendingSave ? (
          <p className="rounded-[10px] bg-secondary px-3 py-2 text-sm">
            После входа компания сохранится в профиле автоматически.
          </p>
        ) : null}

        {showList && !adding ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold">Выберите компанию</p>
            <ul className="space-y-2">
              {companies.map((c) => {
                const active = user?.activeCompanyTaxId === c.taxId;
                return (
                  <li key={c.taxId}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCompany(c.taxId);
                        continueWith(c);
                      }}
                      className="flex w-full items-start gap-3 rounded-xl border border-border px-4 py-3 text-left hover:bg-secondary"
                    >
                      <Building2 className="mt-0.5 size-5 text-primary" />
                      <span>
                        <span className="block text-sm font-bold">{c.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {c.country === "BY" ? "УНП" : "ИНН"}: {c.taxId}
                          {active ? " · активная" : ""}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="text-sm font-semibold text-primary"
            >
              Добавить ещё одну компанию
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={taxId}
                onChange={(e) => setTaxId(e.target.value.replace(/[^\d]/g, "").slice(0, 9))}
                placeholder="193456789"
                inputMode="numeric"
                className="h-11 rounded-xl"
              />
              <Button type="button" className="h-11 rounded-[10px]" onClick={find}>
                <Search className="size-4" />
                Найти
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Система автоматически подтянет название, адрес и реквизиты из демо-БД
            </p>
            {found ? (
              <div className="space-y-3 rounded-xl bg-secondary p-4">
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground">Компания</span>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground">Юр. адрес</span>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                </label>
                {bankAccount ? (
                  <p className="text-xs text-muted-foreground">Р/с: {bankAccount}</p>
                ) : null}
              </div>
            ) : null}
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={save}
                onChange={(e) => setSave(e.target.checked)}
                className="mt-1"
              />
              Сохранить компанию в моём профиле для будущих заказов
            </label>
            <Button
              type="button"
              className="h-11 w-full rounded-[10px] font-semibold"
              disabled={!draft}
              onClick={() => draft && continueWith(draft)}
            >
              Сохранить и продолжить
            </Button>
            {showList ? (
              <button type="button" className="w-full text-sm text-muted-foreground" onClick={() => setAdding(false)}>
                Назад к списку
              </button>
            ) : null}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
