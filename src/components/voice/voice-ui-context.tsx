import { createContext, useContext, type ReactNode } from "react";

export type VoiceMode = "search" | "sommelier";

export type VoiceUiContextValue = {
  openListening: (mode?: VoiceMode) => void;
};

export const VoiceUiContext = createContext<VoiceUiContextValue | null>(null);

export function useVoiceUi() {
  const ctx = useContext(VoiceUiContext);
  if (!ctx) {
    throw new Error("useVoiceUi must be used within VoiceAssistant");
  }
  return ctx;
}

export function VoiceUiProvider({
  value,
  children,
}: {
  value: VoiceUiContextValue;
  children: ReactNode;
}) {
  return <VoiceUiContext.Provider value={value}>{children}</VoiceUiContext.Provider>;
}
