import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function UserAvatar({
  src,
  name,
  className,
}: {
  src?: string | undefined;
  name: string;
  className?: string;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <Avatar className={cn("size-8", className)}>
      {src ? <AvatarImage src={src} alt={name} /> : null}
      <AvatarFallback className="bg-primary/15 font-bold text-primary-dark text-[length:inherit]">
        {initial}
      </AvatarFallback>
    </Avatar>
  );
}
