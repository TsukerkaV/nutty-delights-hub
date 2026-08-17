import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loyaltyWallet } from "@/data/loyalty";
import { demoCompanies, type RegistryCountry } from "@/data/b2b-registry";

export type DialCode = "+375" | "+374";

export type AddressLabel = "home" | "office" | "other";

export type SavedAddress = {
  id: string;
  label: AddressLabel;
  title: string;
  city: string;
  street: string;
  building: string;
  apt?: string;
};

export type CardBrand = "visa" | "mastercard";

export type SavedCard = {
  id: string;
  brand: CardBrand;
  last4: string;
  expiry: string;
};

export type SavedCompany = {
  taxId: string;
  name: string;
  address: string;
  country: RegistryCountry;
  bankAccount?: string;
};

export type AuthUser = {
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
  birthday?: string;
  avatar?: string;
  isNew: boolean;
  bonuses: number;
  addresses: SavedAddress[];
  cards: SavedCard[];
  companies: SavedCompany[];
  activeCompanyTaxId?: string;
};

type StoredAuth = {
  session: AuthUser | null;
  accounts: Record<string, AuthUser>;
};

const STORAGE_KEY = "dubai-auth";
export const SEED_PHONE = "+375291234567";
export const WELCOME_BONUSES = 100;

const seedCompany: SavedCompany = {
  taxId: demoCompanies[0]!.taxId,
  name: demoCompanies[0]!.name,
  address: demoCompanies[0]!.address,
  country: demoCompanies[0]!.country,
  bankAccount: demoCompanies[0]!.bankAccount,
};

export const seedAnna: AuthUser = {
  firstName: "Анна",
  lastName: "Ковалева",
  phone: SEED_PHONE,
  email: "anka@example.com",
  birthday: "1992-05-14",
  isNew: false,
  bonuses: loyaltyWallet.bonuses,
  addresses: [
    {
      id: "addr-home",
      label: "home",
      title: "Дом",
      city: "Минск",
      street: "ул. Победителей",
      building: "12",
      apt: "4",
    },
    {
      id: "addr-office",
      label: "office",
      title: "Офис",
      city: "Минск",
      street: "ул. Одоевского",
      building: "117",
    },
  ],
  cards: [{ id: "card-4123", brand: "visa", last4: "4123", expiry: "08/28" }],
  companies: [seedCompany],
  activeCompanyTaxId: seedCompany.taxId,
};

const emptyStored: StoredAuth = { session: null, accounts: {} };

function normalizeUser(raw: AuthUser): AuthUser {
  const companies = Array.isArray(raw.companies) ? raw.companies : [];
  const nextCompanies =
    companies.length === 0 && raw.phone === SEED_PHONE ? [seedCompany] : companies;
  const next: AuthUser = {
    ...raw,
    companies: nextCompanies,
    addresses: Array.isArray(raw.addresses) ? raw.addresses : [],
    cards: Array.isArray(raw.cards) ? raw.cards : [],
  };
  if (!next.activeCompanyTaxId && nextCompanies[0]) {
    next.activeCompanyTaxId = nextCompanies[0].taxId;
  }
  return next;
}

function readStored(): StoredAuth {
  if (typeof window === "undefined") {
    return emptyStored;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyStored;
    }
    const parsed = JSON.parse(raw) as Partial<StoredAuth>;
    return {
      session: parsed.session ? normalizeUser(parsed.session as AuthUser) : null,
      accounts: parsed.accounts && typeof parsed.accounts === "object" ? parsed.accounts : {},
    };
  } catch {
    return emptyStored;
  }
}

function writeStored(next: StoredAuth) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatNational(digits: string): string {
  const d = digitsOnly(digits).slice(0, 9);
  const a = d.slice(0, 2);
  const b = d.slice(2, 5);
  const c = d.slice(5, 7);
  const e = d.slice(7, 9);
  if (d.length <= 2) {
    return a;
  }
  if (d.length <= 5) {
    return `(${a}) ${b}`;
  }
  if (d.length <= 7) {
    return `(${a}) ${b}-${c}`;
  }
  return `(${a}) ${b}-${c}-${e}`;
}

export function parseDialCode(value: string): DialCode {
  if (value === "+375" || value === "+374") {
    return value;
  }
  return "+375";
}

export function nationalLength(dial: DialCode): number {
  switch (dial) {
    case "+375":
      return 9;
    case "+374":
      return 8;
    default: {
      const _never: never = dial;
      return _never;
    }
  }
}

export function normalizePhone(dial: DialCode, national: string): string {
  return `${dial}${digitsOnly(national)}`;
}

export function displayPhone(phone: string): string {
  if (phone.startsWith("+375") && phone.length === 13) {
    const n = phone.slice(4);
    return `+375 (${n.slice(0, 2)}) ${n.slice(2, 5)}-${n.slice(5, 7)}-${n.slice(7, 9)}`;
  }
  if (phone.startsWith("+374")) {
    const n = phone.slice(4);
    return `+374 (${n.slice(0, 2)}) ${n.slice(2, 5)}-${n.slice(5, 7)}-${n.slice(7)}`;
  }
  return phone;
}

function persistAccount(stored: StoredAuth, user: AuthUser): StoredAuth {
  return {
    session: user,
    accounts: { ...stored.accounts, [user.phone]: user },
  };
}

type AuthContextValue = {
  user: AuthUser | null;
  authOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
  isKnownPhone: (phone: string) => boolean;
  signInKnown: (phone: string) => void;
  signInTelegram: () => void;
  completeNewUser: (input: { phone: string; firstName: string; birthday: string }) => void;
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  addAddress: (address: Omit<SavedAddress, "id">) => void;
  addCard: (card: Omit<SavedCard, "id">) => void;
  removeCard: (id: string) => void;
  setAvatar: (dataUrl: string) => void;
  clearAvatar: () => void;
  upsertCompany: (company: SavedCompany) => void;
  setActiveCompany: (taxId: string) => void;
  updateCompany: (taxId: string, patch: Partial<SavedCompany>) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<StoredAuth>(emptyStored);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    setStored(readStored());
  }, []);

  const commit = useCallback((next: StoredAuth) => {
    setStored(next);
    writeStored(next);
  }, []);

  const openAuth = useCallback(() => setAuthOpen(true), []);
  const closeAuth = useCallback(() => setAuthOpen(false), []);

  const isKnownPhone = useCallback(
    (phone: string) => phone === SEED_PHONE || Boolean(stored.accounts[phone]),
    [stored.accounts],
  );

  const signInKnown = useCallback(
    (phone: string) => {
      const fromStore = stored.accounts[phone];
      const raw = fromStore ?? (phone === SEED_PHONE ? { ...seedAnna, bonuses: loyaltyWallet.bonuses } : null);
      if (!raw) {
        return;
      }
      commit(persistAccount(stored, normalizeUser(raw)));
      setAuthOpen(false);
    },
    [commit, stored],
  );

  const signInTelegram = useCallback(() => {
    const raw = stored.accounts[SEED_PHONE] ?? { ...seedAnna, bonuses: loyaltyWallet.bonuses };
    commit(persistAccount(stored, normalizeUser(raw)));
    setAuthOpen(false);
  }, [commit, stored]);

  const completeNewUser = useCallback(
    (input: { phone: string; firstName: string; birthday: string }) => {
      const user: AuthUser = {
        firstName: input.firstName.trim(),
        phone: input.phone,
        birthday: input.birthday,
        isNew: true,
        bonuses: WELCOME_BONUSES,
        addresses: [],
        cards: [],
        companies: [],
      };
      commit(persistAccount(stored, user));
      setAuthOpen(false);
    },
    [commit, stored],
  );

  const logout = useCallback(() => {
    commit({ ...stored, session: null });
  }, [commit, stored]);

  const updateUser = useCallback(
    (patch: Partial<AuthUser>) => {
      if (!stored.session) {
        return;
      }
      const user = { ...stored.session, ...patch };
      commit(persistAccount(stored, user));
    },
    [commit, stored],
  );

  const addAddress = useCallback(
    (address: Omit<SavedAddress, "id">) => {
      if (!stored.session) {
        return;
      }
      const user: AuthUser = {
        ...stored.session,
        addresses: [...stored.session.addresses, { ...address, id: `addr-${Date.now()}` }],
      };
      commit(persistAccount(stored, user));
    },
    [commit, stored],
  );

  const addCard = useCallback(
    (card: Omit<SavedCard, "id">) => {
      if (!stored.session) {
        return;
      }
      const user: AuthUser = {
        ...stored.session,
        cards: [...stored.session.cards, { ...card, id: `card-${Date.now()}` }],
      };
      commit(persistAccount(stored, user));
    },
    [commit, stored],
  );

  const removeCard = useCallback(
    (id: string) => {
      if (!stored.session) {
        return;
      }
      const user: AuthUser = {
        ...stored.session,
        cards: stored.session.cards.filter((c) => c.id !== id),
      };
      commit(persistAccount(stored, user));
    },
    [commit, stored],
  );

  const setAvatar = useCallback(
    (dataUrl: string) => {
      if (!stored.session) {
        return;
      }
      commit(persistAccount(stored, { ...stored.session, avatar: dataUrl }));
    },
    [commit, stored],
  );

  const clearAvatar = useCallback(() => {
    if (!stored.session) {
      return;
    }
    const { avatar: _removed, ...rest } = stored.session;
    void _removed;
    commit(persistAccount(stored, rest));
  }, [commit, stored]);

  const upsertCompany = useCallback(
    (company: SavedCompany) => {
      if (!stored.session) {
        return;
      }
      const existing = stored.session.companies ?? [];
      const idx = existing.findIndex((c) => c.taxId === company.taxId);
      const companies =
        idx >= 0 ? existing.map((c, i) => (i === idx ? { ...c, ...company } : c)) : [...existing, company];
      commit(
        persistAccount(stored, {
          ...stored.session,
          companies,
          activeCompanyTaxId: company.taxId,
        }),
      );
    },
    [commit, stored],
  );

  const setActiveCompany = useCallback(
    (taxId: string) => {
      if (!stored.session) {
        return;
      }
      commit(persistAccount(stored, { ...stored.session, activeCompanyTaxId: taxId }));
    },
    [commit, stored],
  );

  const updateCompany = useCallback(
    (taxId: string, patch: Partial<SavedCompany>) => {
      if (!stored.session) {
        return;
      }
      const companies = (stored.session.companies ?? []).map((c) =>
        c.taxId === taxId ? { ...c, ...patch, taxId: c.taxId } : c,
      );
      commit(persistAccount(stored, { ...stored.session, companies }));
    },
    [commit, stored],
  );

  const value = useMemo(
    () => ({
      user: stored.session,
      authOpen,
      openAuth,
      closeAuth,
      isKnownPhone,
      signInKnown,
      signInTelegram,
      completeNewUser,
      logout,
      updateUser,
      addAddress,
      addCard,
      removeCard,
      setAvatar,
      clearAvatar,
      upsertCompany,
      setActiveCompany,
      updateCompany,
    }),
    [
      stored.session,
      authOpen,
      openAuth,
      closeAuth,
      isKnownPhone,
      signInKnown,
      signInTelegram,
      completeNewUser,
      logout,
      updateUser,
      addAddress,
      addCard,
      removeCard,
      setAvatar,
      clearAvatar,
      upsertCompany,
      setActiveCompany,
      updateCompany,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
