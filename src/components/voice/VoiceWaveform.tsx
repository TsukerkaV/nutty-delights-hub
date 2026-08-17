import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const BAR_COUNT = 7;

export function VoiceWaveform({ active }: { active: boolean }) {
  const [levels, setLevels] = useState<number[]>(() => Array.from({ length: BAR_COUNT }, () => 0.2));

  useEffect(() => {
    if (!active) {
      setLevels(Array.from({ length: BAR_COUNT }, () => 0.2));
      return;
    }

    let cancelled = false;
    let raf = 0;
    let stream: MediaStream | null = null;
    let audioCtx: AudioContext | null = null;
    let pulse = 0;

    const fallbackPulse = () => {
      pulse += 0.12;
      setLevels(
        Array.from({ length: BAR_COUNT }, (_, i) => 0.25 + 0.55 * Math.abs(Math.sin(pulse + i * 0.55))),
      );
      raf = requestAnimationFrame(fallbackPulse);
    };

    const startAnalyser = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);

        const tick = () => {
          analyser.getByteFrequencyData(data);
          const next = Array.from({ length: BAR_COUNT }, (_, i) => {
            const idx = Math.floor((i + 1) * (data.length / (BAR_COUNT + 2)));
            return Math.max(0.12, (data[idx] ?? 0) / 255);
          });
          setLevels(next);
          raf = requestAnimationFrame(tick);
        };
        tick();
      } catch {
        fallbackPulse();
      }
    };

    void startAnalyser();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
      void audioCtx?.close();
    };
  }, [active]);

  return (
    <div className="flex h-16 items-end justify-center gap-1.5" aria-hidden>
      {levels.map((level, i) => (
        <span
          key={i}
          className={cn("w-1.5 rounded-full bg-primary transition-[height] duration-75")}
          style={{ height: `${Math.round(12 + level * 52)}px` }}
        />
      ))}
    </div>
  );
}
