import { Building2, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { type Audience } from "@/lib/audience";
import { cn } from "@/lib/utils";

export function AudienceToggle({ audience }: { audience: Audience }) {
  const options: { id: Audience; label: string; icon: typeof User }[] = [
    { id: "b2c", label: "Частным клиентам", icon: User },
    { id: "b2b", label: "Бизнесу и Опту", icon: Building2 },
  ];

  return (
    <div className="grid grid-cols-2 rounded-[10px] bg-secondary p-1 text-xs font-semibold sm:text-sm">
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = audience === opt.id;
        return (
          <Link
            key={opt.id}
            to="/"
            search={opt.id === "b2b" ? { audience: "b2b" } : {}}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-md px-2 py-2 transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-card"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-3.5 shrink-0" />
            <span className="truncate">{opt.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
