import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type DefaultGrams = 100 | 250 | 500;

export type AiPrefs = {
  noPeanut: boolean;
  noSugar: boolean;
  vegan: boolean;
  defaultGrams: DefaultGrams;
};

const STORAGE_KEY = "dubai-ai-prefs";

export const defaultAiPrefs: AiPrefs = {
  noPeanut: false,
  noSugar: false,
  vegan: false,
  defaultGrams: 100,
};

function readPrefs(): AiPrefs {
  if (typeof window === "undefined") {
    return defaultAiPrefs;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultAiPrefs;
    }
    const parsed = JSON.parse(raw) as Partial<AiPrefs>;
    const grams = parsed.defaultGrams;
    const defaultGrams: DefaultGrams = grams === 250 || grams === 500 ? grams : 100;
    return {
      noPeanut: Boolean(parsed.noPeanut),
      noSugar: Boolean(parsed.noSugar),
      vegan: Boolean(parsed.vegan),
      defaultGrams,
    };
  } catch {
    return defaultAiPrefs;
  }
}

type AiPrefsContextValue = {
  prefs: AiPrefs;
  setPrefs: (next: AiPrefs) => void;
};

const AiPrefsContext = createContext<AiPrefsContextValue | null>(null);

export function AiPrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefsState] = useState<AiPrefs>(defaultAiPrefs);

  useEffect(() => {
    setPrefsState(readPrefs());
  }, []);

  const setPrefs = useCallback((next: AiPrefs) => {
    setPrefsState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const value = useMemo(() => ({ prefs, setPrefs }), [prefs, setPrefs]);

  return <AiPrefsContext.Provider value={value}>{children}</AiPrefsContext.Provider>;
}

export function useAiPrefs() {
  const ctx = useContext(AiPrefsContext);
  if (!ctx) {
    throw new Error("useAiPrefs must be used within AiPrefsProvider");
  }
  return ctx;
}
