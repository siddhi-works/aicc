import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-extrabold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 active:translate-y-[3px] active:shadow-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gold text-[#2a1600] shadow-[0_4px_0_0_#b8640a] hover:bg-gold-soft",
        secondary: "bg-surface-2 text-foreground border border-border shadow-[0_4px_0_0_#171248] hover:bg-[#3a32a0]",
        outline: "border-2 border-border bg-transparent text-foreground shadow-[0_3px_0_0_#171248] hover:border-gold hover:text-gold-soft",
        ghost: "text-muted hover:text-foreground hover:bg-white/5",
        danger: "bg-ruby/20 text-ruby border border-ruby/40 shadow-[0_4px_0_0_#7a2233] hover:bg-ruby/30",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";
export { buttonVariants };
