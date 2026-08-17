import { useRef, useState } from "react";
import { Building2, Home, LogOut, MapPin, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BirthdayInput } from "@/components/auth/BirthdayInput";
import { UserAvatar } from "@/components/auth/UserAvatar";
import { toast } from "sonner";
import { fileToAvatarDataUrl } from "@/lib/avatar";
import {
  useAuth,
  displayPhone,
  type AddressLabel,
  type SavedAddress,
  type AuthUser,
} from "@/lib/auth";

export function ProfilePanel() {
  const { user, updateUser, addAddress, logout, setAvatar, clearAvatar } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [birthday, setBirthday] = useState(user?.birthday ?? "");
  const [adding, setAdding] = useState(false);

  if (!user) {
    return null;
  }

  const save = () => {
    const patch: Partial<AuthUser> = {
      firstName: firstName.trim() || user.firstName,
    };
    const nextLast = lastName.trim();
    const nextEmail = email.trim();
    if (nextLast) {
      patch.lastName = nextLast;
    }
    if (nextEmail) {
      patch.email = nextEmail;
    }
    if (birthday) {
      patch.birthday = birthday;
    }
    updateUser(patch);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="text-lg font-extrabold">Личные данные и адреса</h2>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <UserAvatar src={user.avatar} name={user.firstName} className="size-20 text-2xl" />
          <div className="space-y-2">
            <p className="text-sm font-semibold">Аватар</p>
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) {
                    return;
                  }
                  void fileToAvatarDataUrl(file)
                    .then((url) => {
                      setAvatar(url);
                      toast.success("Фото обновлено");
                    })
                    .catch((err: unknown) => {
                      toast.error(err instanceof Error ? err.message : "Не удалось загрузить фото");
                    });
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="rounded-[10px]"
                onClick={() => fileRef.current?.click()}
              >
                Загрузить фото
              </Button>
              {user.avatar ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-[10px]"
                  onClick={() => {
                    clearAvatar();
                    toast.success("Фото удалено");
                  }}
                >
                  Удалить
                </Button>
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground">JPG или PNG, сохранится в этом браузере.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-semibold">Имя</span>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-semibold">Фамилия</span>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-semibold">Телефон</span>
            <Input value={displayPhone(user.phone)} readOnly className="bg-secondary" />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-semibold">Email</span>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-sm font-semibold">Дата рождения</span>
            <BirthdayInput isoValue={birthday} onIsoChange={setBirthday} />
            <span className="text-xs text-muted-foreground">
              500 бонусов в подарок на День рождения
            </span>
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button type="button" className="rounded-[10px]" onClick={save}>
            Сохранить
          </Button>
          <Button type="button" variant="outline" className="rounded-[10px]" onClick={logout}>
            <LogOut className="size-4" />
            Выйти
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h3 className="text-lg font-extrabold">Сохранённые адреса доставки</h3>
        <ul className="mt-4 space-y-3">
          {user.addresses.map((addr) => (
            <li
              key={addr.id}
              className="flex items-start gap-3 rounded-xl border border-border bg-secondary/50 p-4"
            >
              <AddressIcon label={addr.label} />
              <div>
                <p className="text-sm font-bold">{addr.title}</p>
                <p className="text-sm text-muted-foreground">{formatAddress(addr)}</p>
              </div>
            </li>
          ))}
        </ul>
        {adding ? (
          <AddressForm
            onCancel={() => setAdding(false)}
            onSave={(next) => {
              addAddress(next);
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
            Добавить новый адрес
          </button>
        )}
      </section>
    </div>
  );
}

function AddressIcon({ label }: { label: AddressLabel }) {
  switch (label) {
    case "home":
      return <Home className="mt-0.5 size-5 text-primary" />;
    case "office":
      return <Building2 className="mt-0.5 size-5 text-primary" />;
    case "other":
      return <MapPin className="mt-0.5 size-5 text-primary" />;
    default: {
      const _never: never = label;
      return _never;
    }
  }
}

function formatAddress(addr: SavedAddress): string {
  const apt = addr.apt ? `, кв. ${addr.apt}` : "";
  return `${addr.city}, ${addr.street} ${addr.building}${apt}`;
}

function parseLabel(value: string): AddressLabel {
  if (value === "home" || value === "office" || value === "other") {
    return value;
  }
  return "other";
}

function AddressForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (address: Omit<SavedAddress, "id">) => void;
}) {
  const [label, setLabel] = useState<AddressLabel>("home");
  const [title, setTitle] = useState("Дом");
  const [city, setCity] = useState("Минск");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [apt, setApt] = useState("");

  return (
    <form
      className="mt-4 grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!street.trim() || !building.trim()) {
          return;
        }
        const next: Omit<SavedAddress, "id"> = {
          label,
          title: title.trim() || "Адрес",
          city: city.trim() || "Минск",
          street: street.trim(),
          building: building.trim(),
        };
        const nextApt = apt.trim();
        if (nextApt) {
          next.apt = nextApt;
        }
        onSave(next);
      }}
    >
      <label className="space-y-1.5">
        <span className="text-sm font-semibold">Метка</span>
        <select
          value={label}
          onChange={(e) => {
            const next = parseLabel(e.target.value);
            setLabel(next);
            if (next === "home") setTitle("Дом");
            if (next === "office") setTitle("Офис");
            if (next === "other") setTitle("Другое");
          }}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="home">Дом</option>
          <option value="office">Офис</option>
          <option value="other">Другое</option>
        </select>
      </label>
      <label className="space-y-1.5">
        <span className="text-sm font-semibold">Название</span>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label className="space-y-1.5">
        <span className="text-sm font-semibold">Город</span>
        <Input value={city} onChange={(e) => setCity(e.target.value)} />
      </label>
      <label className="space-y-1.5">
        <span className="text-sm font-semibold">Улица</span>
        <Input value={street} onChange={(e) => setStreet(e.target.value)} required />
      </label>
      <label className="space-y-1.5">
        <span className="text-sm font-semibold">Дом</span>
        <Input value={building} onChange={(e) => setBuilding(e.target.value)} required />
      </label>
      <label className="space-y-1.5">
        <span className="text-sm font-semibold">Квартира</span>
        <Input value={apt} onChange={(e) => setApt(e.target.value)} />
      </label>
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit" className="rounded-[10px]">
          Сохранить адрес
        </Button>
        <Button type="button" variant="outline" className="rounded-[10px]" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
}
