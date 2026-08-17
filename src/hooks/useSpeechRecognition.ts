import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionResultLike = {
  0: { transcript: string };
  isFinal: boolean;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") {
    return null;
  }
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getSpeechRecognitionCtor() !== null;
}

type UseSpeechRecognitionOptions = {
  active: boolean;
  onSettled: (transcript: string) => void;
  pauseMs?: number;
};

export function useSpeechRecognition({
  active,
  onSettled,
  pauseMs = 800,
}: UseSpeechRecognitionOptions) {
  const [transcript, setTranscript] = useState("");
  const [supported] = useState(isSpeechRecognitionSupported);
  const [error, setError] = useState<string | null>(null);
  const onSettledRef = useRef(onSettled);
  onSettledRef.current = onSettled;
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef("");

  const clearPause = () => {
    if (pauseTimer.current) {
      clearTimeout(pauseTimer.current);
      pauseTimer.current = null;
    }
  };

  const scheduleSettle = useCallback(() => {
    clearPause();
    pauseTimer.current = setTimeout(() => {
      const text = latest.current.trim();
      if (text) {
        onSettledRef.current(text);
      }
    }, pauseMs);
  }, [pauseMs]);

  useEffect(() => {
    if (!active) {
      setTranscript("");
      latest.current = "";
      setError(null);
      clearPause();
      return;
    }

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      return;
    }

    const recognition = new Ctor();
    recognition.lang = "ru-RU";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let combined = "";
      for (let i = 0; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result) {
          combined += result[0].transcript;
        }
      }
      latest.current = combined;
      setTranscript(combined);
      scheduleSettle();
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setError("mic-denied");
      } else if (event.error !== "no-speech" && event.error !== "aborted") {
        setError(event.error);
      }
    };

    recognition.onend = () => {
      if (!active) {
        return;
      }
      try {
        recognition.start();
      } catch {
        // already started
      }
    };

    try {
      recognition.start();
    } catch {
      setError("start-failed");
    }

    return () => {
      clearPause();
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      try {
        recognition.abort();
      } catch {
        // ignore
      }
    };
  }, [active, scheduleSettle]);

  return { transcript, supported, error };
}
