import { Switch } from "@/components/ui/switch";
import { useAiPrefs, type DefaultGrams } from "@/lib/ai-prefs";
import { cn } from "@/lib/utils";

const portions: DefaultGrams[] = [100, 250, 500];

export function AiPrefsPanel() {
  const { prefs, setPrefs } = useAiPrefs();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="text-lg font-extrabold">Аллергии и исключения</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Голосовой AI не предложит исключённые позиции.
        </p>
        <ul className="mt-5 space-y-4">
          <li className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold">Не предлагать арахис</span>
            <Switch
              checked={prefs.noPeanut}
              onCheckedChange={(checked) => setPrefs({ ...prefs, noPeanut: checked })}
            />
          </li>
          <li className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold">Убрать позиции с добавленным сахаром</span>
            <Switch
              checked={prefs.noSugar}
              onCheckedChange={(checked) => setPrefs({ ...prefs, noSugar: checked })}
            />
          </li>
          <li className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold">Веганский ассортимент</span>
            <Switch
              checked={prefs.vegan}
              onCheckedChange={(checked) => setPrefs({ ...prefs, vegan: checked })}
            />
          </li>
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="text-lg font-extrabold">Любимые форматы</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Предпочитаемая фасовка по умолчанию для быстрого голосового заказа.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {portions.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setPrefs({ ...prefs, defaultGrams: g })}
              className={cn(
                "rounded-[10px] py-3 text-sm font-bold",
                prefs.defaultGrams === g
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              {g}г
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
