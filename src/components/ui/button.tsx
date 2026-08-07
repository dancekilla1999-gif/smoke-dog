import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap font-sans text-[11px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/60 disabled:pointer-events-none disabled:opacity-45 active:translate-y-[1px]",
  {
    variants: {
      variant: {
        gold:
          "rounded-none bg-gold text-noir hover:bg-gold-soft border border-gold",
        outline:
          "rounded-none border border-white/25 bg-transparent text-bone hover:border-gold hover:bg-white/[0.04] hover:text-gold-soft",
        ghost: "rounded-none text-bone/80 hover:text-gold",
        link: "rounded-none text-gold underline-offset-4 hover:underline tracking-wide2",
        glass:
          "rounded-none border border-white/15 bg-white/[0.06] text-bone backdrop-blur-md hover:bg-white/[0.1] hover:border-gold/40",
      },
      size: {
        default: "h-12 px-7",
        lg: "h-14 px-9 text-[12px]",
        sm: "h-10 px-5 text-[10px]",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "gold", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
