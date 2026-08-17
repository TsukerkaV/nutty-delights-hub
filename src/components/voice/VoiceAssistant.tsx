import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Check, Mic, Sparkles } from "lucide-react";
import { DisambiguationSheet } from "@/components/voice/DisambiguationSheet";
import { ListeningOverlay } from "@/components/voice/ListeningOverlay";
import { SommelierSheet } from "@/components/voice/SommelierSheet";
import { VoiceUiProvider, type VoiceMode } from "@/components/voice/voice-ui-context";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  assertNever,
  bundles,
  classifyVoice,
  findProduct,
  type VoiceBundleId,
  type VoiceIntent,
} from "@/data/voice-catalog";
import { toast } from "sonner";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useAiPrefs } from "@/lib/ai-prefs";
import { useCart } from "@/lib/cart";

type Phase =
  | { name: "closed" }
  | { name: "listening"; mode: VoiceMode }
  | { name: "picker"; grams: number }
  | { name: "bundle"; bundleId: VoiceBundleId };

export function VoiceAssistant({ children }: { children: ReactNode }) {
  const { add } = useCart();
  const { prefs } = useAiPrefs();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideFab = pathname.startsWith("/checkout");
  const [phase, setPhase] = useState<Phase>({ name: "closed" });

  const close = useCallback(() => setPhase({ name: "closed" }), []);

  const openListening = useCallback((mode: VoiceMode = "search") => {
    setPhase({ name: "listening", mode });
  }, []);

  const applyIntent = useCallback(
    (intent: VoiceIntent) => {
      switch (intent.kind) {
        case "disambiguate":
          setPhase({ name: "picker", grams: intent.grams });
          return;
        case "bundle":
          setPhase({ name: "bundle", bundleId: intent.bundleId });
          return;
        case "addExact": {
          const product = findProduct(intent.productId);
          if (product) {
            add({
              id: product.id,
              name: product.name,
              grams: intent.grams,
              pricePer100: product.pricePer100,
              image: product.image,
            });
          }
          setPhase({ name: "closed" });
          return;
        }
        case "blocked": {
          const fallback = findProduct(intent.fallbackId);
          const message =
            intent.reason === "peanut"
              ? "Арахис в исключениях — добавил кешью"
              : "Позиция с сахаром исключена — предложил клюкву";
          toast.message(message);
          if (fallback) {
            add({
              id: fallback.id,
              name: fallback.name,
              grams: intent.grams,
              pricePer100: fallback.pricePer100,
              image: fallback.image,
            });
          }
          setPhase({ name: "closed" });
          return;
        }
        case "unknown":
          return;
        default: {
          const _exhaustive: never = intent;
          return assertNever(_exhaustive);
        }
      }
    },
    [add],
  );

  const onSettled = useCallback(
    (transcript: string) => {
      applyIntent(classifyVoice(transcript, prefs));
    },
    [applyIntent, prefs],
  );

  const listening = phase.name === "listening";
  const { transcript, supported, error } = useSpeechRecognition({
    active: listening,
    onSettled,
  });

  const pickPeanut = (productId: string) => {
    if (phase.name !== "picker") {
      return;
    }
    applyIntent({ kind: "addExact", productId, grams: phase.grams });
  };

  const addBundle = () => {
    if (phase.name !== "bundle") {
      return;
    }
    const bundle = bundles[phase.bundleId];
    for (const line of bundle.items) {
      const product = findProduct(line.productId);
      if (!product) {
        continue;
      }
      if (prefs.noPeanut && product.peanut) {
        continue;
      }
      if ((prefs.noSugar || prefs.vegan) && product.addedSugar) {
        continue;
      }
      add({
        id: product.id,
        name: product.name,
        grams: line.grams,
        pricePer100: product.pricePer100,
        image: product.image,
      });
    }
    setPhase({ name: "closed" });
  };

  const otherVariant = () => {
    if (phase.name !== "bundle") {
      return;
    }
    let next: VoiceBundleId;
    switch (phase.bundleId) {
      case "wine":
        next = "wineAlt";
        break;
      case "wineAlt":
        next = "office";
        break;
      case "office":
        next = "wine";
        break;
      default: {
        const _exhaustive: never = phase.bundleId;
        return assertNever(_exhaustive);
      }
    }
    setPhase({ name: "bundle", bundleId: next });
  };

  const sheetOpen = phase.name === "picker" || phase.name === "bundle";

  const voiceValue = useMemo(() => ({ openListening }), [openListening]);

  return (
    <VoiceUiProvider value={voiceValue}>
      {children}

      {!hideFab && (
      <button
        type="button"
        onClick={() => openListening("search")}
        aria-label="Голосовой поиск Dubai AI"
        className="fixed bottom-6 right-4 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-hover md:hidden"
      >
        <Mic className="size-6" />
      </button>
      )}

      {phase.name === "listening" && (
        <ListeningOverlay
          mode={phase.mode}
          transcript={transcript}
          speechSupported={supported}
          speechError={error}
          onClose={close}
          onDemoPhrase={(phrase) => applyIntent(classifyVoice(phrase, prefs))}
        />
      )}

      <Drawer
        open={sheetOpen}
        onOpenChange={(open) => {
          if (!open) {
            close();
          }
        }}
        shouldScaleBackground={false}
      >
        <DrawerContent className="z-[70] max-h-[85vh] border-border bg-background/90 backdrop-blur-xl">
          {phase.name === "picker" && (
            <>
              <DrawerHeader className="text-left">
                <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="size-5" />
                </div>
                <DrawerTitle>Уточните, какой арахис вы предпочитаете?</DrawerTitle>
                <DrawerDescription>Один тап — и товар в корзине. Вес: {phase.grams}г.</DrawerDescription>
              </DrawerHeader>
              <div className="px-4 pb-6">
                <DisambiguationSheet grams={phase.grams} onPick={pickPeanut} />
              </div>
            </>
          )}
          {phase.name === "bundle" && (
            <>
              <DrawerHeader className="text-left">
                <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Sparkles className="size-5" />
                </div>
                <DrawerTitle>AI-Сомелье</DrawerTitle>
                <DrawerDescription>Готовый мини-набор по вашему запросу</DrawerDescription>
              </DrawerHeader>
              <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
                <SommelierSheet
                  bundle={bundles[phase.bundleId]}
                  onAddAll={addBundle}
                  onOtherVariant={otherVariant}
                />
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </VoiceUiProvider>
  );
}
