import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "border-border bg-surface-2 text-muted",
        gold: "border-gold/40 bg-gold/10 text-gold-soft",
        green: "border-emerald/40 bg-emerald/10 text-emerald",
        red: "border-ruby/40 bg-ruby/10 text-ruby",
        prototype: "border-dashed border-gold/60 bg-gold/5 text-gold",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/** Marks a feature as a non-functional prototype. */
export function PrototypeBadge({ label = "Prototype" }: { label?: string }) {
  return <Badge variant="prototype" title="This feature is simulated with mock data">{label}</Badge>;
}
