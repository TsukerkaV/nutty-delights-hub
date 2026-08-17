import { useCallback, useRef, useState, type DragEvent } from "react";
import { toast } from "sonner";
import almond from "@/assets/p-almond.jpg";
import cashew from "@/assets/p-cashew.jpg";
import hero from "@/assets/hero-nuts.jpg";
import { cn } from "@/lib/utils";

type Material = "wood" | "cardboard" | "ribbon";

const materials: { id: Material; label: string; hint: string }[] = [
  { id: "wood", label: "Дерево", hint: "гравировка" },
  { id: "cardboard", label: "Картон", hint: "печать" },
  { id: "ribbon", label: "Фирменная лента", hint: "паттерн" },
];

const backgrounds: Record<Material, string> = {
  wood: hero,
  cardboard: almond,
  ribbon: cashew,
};

export function BrandingTool() {
  const [logo, setLogo] = useState<string | null>(null);
  const [material, setMaterial] = useState<Material>("wood");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const applyFile = useCallback((file: File) => {
    const name = file.name.toLowerCase();
    if (name.endsWith(".ai")) {
      toast.error("Файл .AI не открывается в браузере — конвертируйте в PNG или SVG");
      return;
    }
    if (!file.type.startsWith("image/") && !name.endsWith(".svg")) {
      toast.error("Нужен PNG, SVG или JPEG");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogo(String(reader.result));
    reader.readAsDataURL(file);
  }, []);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      applyFile(file);
    }
  };

  return (
    <section id="branding" className="border-t border-border py-16">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Конструктор</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
          Брендирование в реальном времени
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Загрузите логотип — макет на крышке обновится сразу, без переписки с дизайнером.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-card",
              material === "wood" && "bg-[#5c3d24]",
              material === "cardboard" && "bg-[#d9c7a8]",
              material === "ribbon" && "bg-primary/20",
            )}
          >
            <img
              src={backgrounds[material]}
              alt=""
              className={cn(
                "absolute inset-0 size-full object-cover",
                material === "wood" && "opacity-70",
                material === "cardboard" && "opacity-40 grayscale",
                material === "ribbon" && "opacity-30",
              )}
            />
            <div className="absolute inset-0 grid place-items-center p-10">
              {logo ? (
                <img
                  src={logo}
                  alt="Ваш логотип на изделии"
                  className={cn(
                    "max-h-[45%] max-w-[55%] object-contain",
                    material === "wood" && "mix-blend-multiply sepia contrast-125",
                  )}
                />
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-white/70 bg-black/20 px-8 py-10 text-center backdrop-blur-sm">
                  <p className="text-sm font-semibold text-white">Ваш логотип</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="mb-2 text-sm font-semibold">Материал</p>
              <div className="grid grid-cols-3 gap-2">
                {materials.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMaterial(m.id)}
                    className={cn(
                      "rounded-[10px] border px-3 py-3 text-left transition-colors",
                      material === m.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-secondary",
                    )}
                  >
                    <span className="block text-sm font-bold">{m.label}</span>
                    <span className="text-xs text-muted-foreground">{m.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "flex min-h-40 flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors",
                dragging ? "border-primary bg-primary/10" : "border-border bg-secondary/50",
              )}
            >
              <p className="text-sm font-semibold">Перетащите логотип сюда</p>
              <p className="mt-1 text-xs text-muted-foreground">PNG, SVG, JPEG — или нажмите для выбора</p>
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,.svg,.png,.jpg,.jpeg,.ai"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  applyFile(file);
                }
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
