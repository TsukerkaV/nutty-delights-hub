import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BirthdayInput } from "@/components/auth/BirthdayInput";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import {
  useAuth,
  type DialCode,
  digitsOnly,
  formatNational,
  nationalLength,
  normalizePhone,
  parseDialCode,
  WELCOME_BONUSES,
} from "@/lib/auth";
import { cn } from "@/lib/utils";

type AuthStep = "phone" | "otp" | "complete";

const dialOptions: { code: DialCode; flag: string; label: string }[] = [
  { code: "+375", flag: "BY", label: "+375" },
  { code: "+374", flag: "AM", label: "+374" },
];

export function AuthModal() {
  const { authOpen, closeAuth, isKnownPhone, signInKnown, signInTelegram, completeNewUser } =
    useAuth();
  const [step, setStep] = useState<AuthStep>("phone");
  const [dial, setDial] = useState<DialCode>("+375");
  const [national, setNational] = useState("");
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);

  const needed = nationalLength(dial);
  const phone = normalizePhone(dial, national);

  useEffect(() => {
    if (!authOpen) {
      setStep("phone");
      setNational("");
      setOtp("");
      setFirstName("");
      setBirthday("");
      setPhoneError(null);
      setResendIn(0);
    }
  }, [authOpen]);

  useEffect(() => {
    if (step !== "otp" || resendIn <= 0) {
      return;
    }
    const id = window.setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [step, resendIn]);

  const goOtp = () => {
    if (digitsOnly(national).length !== needed) {
      setPhoneError(`Введите ${needed} цифр номера`);
      return;
    }
    setPhoneError(null);
    setOtp("");
    setResendIn(30);
    setStep("otp");
  };

  const submitOtp = (code = otp) => {
    if (code.length !== 4) {
      return;
    }
    if (isKnownPhone(phone)) {
      signInKnown(phone);
      return;
    }
    setStep("complete");
  };

  const submitProfile = () => {
    if (!firstName.trim() || !birthday) {
      return;
    }
    completeNewUser({ phone, firstName, birthday });
  };

  return (
    <Dialog open={authOpen} onOpenChange={(open) => !open && closeAuth()}>
      <DialogContent className="max-w-md rounded-2xl sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle>Вход или регистрация в Dubai Club</DialogTitle>
          <DialogDescription>
            {stepCopy(step)}
          </DialogDescription>
        </DialogHeader>
        {renderStep({
          step,
          dial,
          setDial,
          national,
          setNational,
          phoneError,
          needed,
          goOtp,
          otp,
          setOtp,
          submitOtp,
          resendIn,
          setResendIn,
          firstName,
          setFirstName,
          birthday,
          setBirthday,
          submitProfile,
          signInTelegram,
        })}
      </DialogContent>
    </Dialog>
  );
}

function stepCopy(step: AuthStep): string {
  switch (step) {
    case "phone":
      return "Введите номер телефона для входа или создания аккаунта.";
    case "otp":
      return "Код из SMS или Telegram. Для демо подойдёт любая комбинация из 4 цифр (например 1234).";
    case "complete":
      return "Два поля — и аккаунт готов. На счёт сразу зачислятся приветственные бонусы.";
    default: {
      const _never: never = step;
      return _never;
    }
  }
}

function renderStep(props: {
  step: AuthStep;
  dial: DialCode;
  setDial: (d: DialCode) => void;
  national: string;
  setNational: (v: string) => void;
  phoneError: string | null;
  needed: number;
  goOtp: () => void;
  otp: string;
  setOtp: (v: string) => void;
  submitOtp: (code?: string) => void;
  resendIn: number;
  setResendIn: (n: number) => void;
  firstName: string;
  setFirstName: (v: string) => void;
  birthday: string;
  setBirthday: (v: string) => void;
  submitProfile: () => void;
  signInTelegram: () => void;
}) {
  switch (props.step) {
    case "phone":
      return <PhoneStep {...props} />;
    case "otp":
      return <OtpStep {...props} />;
    case "complete":
      return <CompleteStep {...props} />;
    default: {
      const _never: never = props.step;
      return _never;
    }
  }
}

function PhoneStep({
  dial,
  setDial,
  national,
  setNational,
  phoneError,
  goOtp,
  signInTelegram,
}: {
  dial: DialCode;
  setDial: (d: DialCode) => void;
  national: string;
  setNational: (v: string) => void;
  phoneError: string | null;
  goOtp: () => void;
  signInTelegram: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <select
          value={dial}
          onChange={(e) => setDial(parseDialCode(e.target.value))}
          className="h-11 shrink-0 rounded-xl border border-input bg-background px-2 text-sm font-semibold"
          aria-label="Код страны"
        >
          {dialOptions.map((opt) => (
            <option key={opt.code} value={opt.code}>
              {opt.flag} {opt.label}
            </option>
          ))}
        </select>
        <Input
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="(29) 000-00-00"
          value={formatNational(national)}
          onChange={(e) => setNational(digitsOnly(e.target.value).slice(0, 9))}
          className="h-11 rounded-xl text-base"
        />
      </div>
      {phoneError ? <p className="text-sm text-destructive">{phoneError}</p> : null}
      <Button type="button" className="h-11 w-full rounded-[10px] bg-primary text-base font-semibold" onClick={goOtp}>
        Получить код в SMS / Telegram
      </Button>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        или войти через
        <span className="h-px flex-1 bg-border" />
      </div>
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full rounded-[10px] text-base font-semibold"
        onClick={signInTelegram}
      >
        <Send className="size-4" />
        Быстрый вход через Telegram
      </Button>
      <p className="text-xs text-muted-foreground">
        Авторизуясь, вы получаете {WELCOME_BONUSES} приветственных бонусов на счёт
      </p>
    </div>
  );
}

function OtpStep({
  otp,
  setOtp,
  submitOtp,
  resendIn,
  setResendIn,
}: {
  otp: string;
  setOtp: (v: string) => void;
  submitOtp: (code?: string) => void;
  resendIn: number;
  setResendIn: (n: number) => void;
}) {
  return (
    <div className="space-y-4">
      <InputOTP
        maxLength={4}
        value={otp}
        onChange={setOtp}
        onComplete={(value) => submitOtp(value)}
      >
        <InputOTPGroup className={cn("w-full justify-center gap-2")}>
          <InputOTPSlot index={0} className="h-12 w-12 rounded-xl border text-lg first:rounded-xl" />
          <InputOTPSlot index={1} className="h-12 w-12 rounded-xl border text-lg first:rounded-xl" />
          <InputOTPSlot index={2} className="h-12 w-12 rounded-xl border text-lg first:rounded-xl" />
          <InputOTPSlot index={3} className="h-12 w-12 rounded-xl border text-lg last:rounded-xl" />
        </InputOTPGroup>
      </InputOTP>
      <Button
        type="button"
        className="h-11 w-full rounded-[10px] font-semibold"
        disabled={otp.length !== 4}
        onClick={() => submitOtp()}
      >
        Подтвердить код
      </Button>
      <button
        type="button"
        disabled={resendIn > 0}
        onClick={() => setResendIn(30)}
        className="w-full text-center text-sm font-semibold text-primary disabled:text-muted-foreground"
      >
        {resendIn > 0 ? `Отправить код ещё раз через ${resendIn} с` : "Отправить код ещё раз"}
      </button>
    </div>
  );
}

function CompleteStep({
  firstName,
  setFirstName,
  birthday,
  setBirthday,
  submitProfile,
}: {
  firstName: string;
  setFirstName: (v: string) => void;
  birthday: string;
  setBirthday: (v: string) => void;
  submitProfile: () => void;
}) {
  return (
    <div className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold">Как к вам обращаться?</span>
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Анна"
          className="h-11 rounded-xl"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold">Дата рождения</span>
        <BirthdayInput isoValue={birthday} onIsoChange={setBirthday} className="h-11 rounded-xl" />
        <span className="text-xs text-muted-foreground">
          Укажите, чтобы получить 500 бонусов в подарок на День рождения
        </span>
      </label>
      <Button
        type="button"
        className="h-11 w-full rounded-[10px] font-semibold"
        disabled={!firstName.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(birthday)}
        onClick={submitProfile}
      >
        Готово, войти
      </Button>
    </div>
  );
}
