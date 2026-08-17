import { Mic, X } from "lucide-react";
import { VoiceWaveform } from "@/components/voice/VoiceWaveform";
import type { VoiceMode } from "@/components/voice/voice-ui-context";

const DEMO_CHIPS = [
  { label: "Добавь 300 грамм арахиса", phrase: "Добавь 300 грамм арахиса" },
  { label: "Что взять к красному вину", phrase: "Что взять к красному сухому вину на двоих" },
  { label: "Полезный перекус в офис", phrase: "Собери полезный перекус в офис" },
] as const;

type ListeningOverlayProps = {
  mode: VoiceMode;
  transcript: string;
  speechSupported: boolean;
  speechError: string | null;
  onClose: () => void;
  onDemoPhrase: (phrase: string) => void;
};

export function ListeningOverlay({
  mode,
  transcript,
  speechSupported,
  speechError,
  onClose,
  onDemoPhrase,
}: ListeningOverlayProps) {
  const hint =
    mode === "sommelier"
      ? "Скажите, к чему подобрать сет…"
      : "Говорите — например, «добавь 300 грамм арахиса»";

  const showFallback = !speechSupported || speechError === "mic-denied" || speechError === "start-failed";

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-charcoal/70 backdrop-blur-md">
      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть"
        className="absolute right-4 top-4 grid size-11 place-items-center rounded-[10px] text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="size-6" />
      </button>

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-8 grid size-28 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
          <span className="grid size-20 place-items-center rounded-full bg-primary shadow-hover">
            <Mic className="size-9 text-primary-foreground" />
          </span>
        </div>
        <VoiceWaveform active />
        <h2 className="mt-8 max-w-2xl text-2xl font-extrabold leading-tight text-white md:text-4xl">
          {transcript.trim() || hint}
        </h2>
        {showFallback ? (
          <p className="mt-8 text-sm text-white/60">
            {speechError === "mic-denied"
              ? "Нет доступа к микрофону — выберите сценарий:"
              : "Голос недоступен в этом браузере — выберите сценарий:"}
          </p>
        ) : (
          <p className="mt-8 text-sm text-white/50">Или выберите сценарий:</p>
        )}
        <div className="mt-4 flex w-full max-w-lg flex-col gap-2">
          {DEMO_CHIPS.map((chip) => (
            <button
              key={chip.phrase}
              type="button"
              onClick={() => onDemoPhrase(chip.phrase)}
              className="rounded-[10px] border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
