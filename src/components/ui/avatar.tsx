import { cn } from "@/lib/utils";

const palette = ["#ff9f2e", "#46b88c", "#6c8cff", "#e0596a", "#b07cf0", "#e8884d"];

/** Deterministic initial-based avatar (no remote images needed). */
export function Avatar({
  name,
  color,
  size = 40,
  className,
}: {
  name: string;
  color?: string;
  size?: number;
  className?: string;
}) {
  const initials = name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const bg = color ?? palette[hash % palette.length];
  return (
    <span
      aria-hidden
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-serif font-semibold text-[#14110a] ring-2 ring-white/10", className)}
      style={{ width: size, height: size, background: bg, fontSize: size * 0.4 }}
    >
      {initials}
    </span>
  );
}
