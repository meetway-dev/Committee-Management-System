import { cn } from "@/lib/utils";

const gradients = [
  "from-violet-500 to-fuchsia-500",
  "from-fuchsia-500 to-pink-500",
  "from-purple-500 to-violet-600",
  "from-pink-500 to-rose-400",
  "from-indigo-500 to-purple-500",
  "from-violet-600 to-pink-500",
] as const;

function gradientFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return gradients[Math.abs(hash) % gradients.length];
}

const sizeMap = {
  xs: "h-6 w-6 text-[9px]",
  sm: "h-8 w-8 text-[10px]",
  md: "h-10 w-10 text-xs",
  lg: "h-12 w-12 text-sm",
} as const;

interface GradientAvatarProps {
  name: string;
  image?: string | null;
  size?: keyof typeof sizeMap;
  className?: string;
}

/**
 * Avatar with a deterministic violet/pink gradient fallback derived from the name,
 * so every member/committee gets a stable, on-brand identity colour.
 */
export function GradientAvatar({
  name,
  image,
  size = "md",
  className,
}: GradientAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br font-bold text-white",
        gradientFor(name || "?"),
        sizeMap[size],
        className
      )}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="select-none">{initials || "?"}</span>
      )}
    </div>
  );
}
