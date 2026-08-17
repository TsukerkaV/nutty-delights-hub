import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const MIN_YEAR = 1920;

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatIsoToDisplay(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) {
    return "";
  }
  const year = match[1];
  const month = match[2];
  const day = match[3];
  return `${day}.${month}.${year}`;
}

export function maskBirthdayDigits(digits: string): string {
  const d = digitsOnly(digits).slice(0, 8);
  if (d.length <= 2) {
    return d;
  }
  if (d.length <= 4) {
    return `${d.slice(0, 2)}.${d.slice(2)}`;
  }
  return `${d.slice(0, 2)}.${d.slice(2, 4)}.${d.slice(4)}`;
}

export function parseDisplayToIso(display: string): string | null {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(display);
  if (!match) {
    return null;
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const now = new Date();
  const maxYear = now.getFullYear();
  if (month < 1 || month > 12 || year < MIN_YEAR || year > maxYear) {
    return null;
  }
  const dt = new Date(Date.UTC(year, month - 1, day));
  if (dt.getUTCFullYear() !== year || dt.getUTCMonth() !== month - 1 || dt.getUTCDate() !== day) {
    return null;
  }
  const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  if (dt.getTime() > todayUtc) {
    return null;
  }
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function BirthdayInput({
  isoValue,
  onIsoChange,
  className,
  id,
}: {
  isoValue: string;
  onIsoChange: (iso: string) => void;
  className?: string;
  id?: string;
}) {
  const [display, setDisplay] = useState(() => (isoValue ? formatIsoToDisplay(isoValue) : ""));
  const inputRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isoValue) {
      return;
    }
    setDisplay((current) =>
      parseDisplayToIso(current) === isoValue ? current : formatIsoToDisplay(isoValue),
    );
  }, [isoValue]);

  useLayoutEffect(() => {
    const el = inputRef.current;
    const caret = caretRef.current;
    if (!el || caret === null) {
      return;
    }
    el.setSelectionRange(caret, caret);
    caretRef.current = null;
  }, [display]);

  const applyDigits = (digits: string, caretAtEnd = true) => {
    const next = maskBirthdayDigits(digits);
    setDisplay(next);
    onIsoChange(parseDisplayToIso(next) ?? "");
    caretRef.current = caretAtEnd ? next.length : null;
  };

  const iso = parseDisplayToIso(display);
  const complete = digitsOnly(display).length === 8;
  const showError = complete && !iso;

  return (
    <div className="space-y-1.5">
      <Input
        ref={inputRef}
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="bday"
        placeholder="дд.мм.гггг"
        value={display}
        className={cn(showError && "border-destructive focus-visible:ring-destructive", className)}
        onKeyDown={(e) => {
          if (e.key !== "Backspace") {
            return;
          }
          const el = e.currentTarget;
          const pos = el.selectionStart ?? 0;
          const end = el.selectionEnd ?? pos;
          if (pos !== end || pos === 0) {
            return;
          }
          if (display[pos - 1] !== ".") {
            return;
          }
          e.preventDefault();
          const withoutDotAndDigit = display.slice(0, pos - 2) + display.slice(pos);
          applyDigits(digitsOnly(withoutDotAndDigit), false);
          caretRef.current = Math.max(0, pos - 2);
        }}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw.length < display.length && display.endsWith(".")) {
            applyDigits(digitsOnly(display).slice(0, -1));
            return;
          }
          const next = maskBirthdayDigits(raw);
          setDisplay(next);
          onIsoChange(parseDisplayToIso(next) ?? "");
          const pos = e.target.selectionStart ?? next.length;
          if (next.length > display.length && next.endsWith(".")) {
            caretRef.current = next.length;
          } else if (next[pos] === ".") {
            caretRef.current = pos + 1;
          } else {
            caretRef.current = Math.min(pos, next.length);
          }
        }}
      />
      {showError ? <p className="text-xs text-destructive">Проверьте дату</p> : null}
    </div>
  );
}
