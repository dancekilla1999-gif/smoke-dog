import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap font-sans text-[12px] font-medium uppercase tracking-wide2 transition-all duration-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/70 disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98]",
  {
    variants: {
      variant: {
        gold:
          "bg-gold text-noir shadow-[0_16px_40px_-18px_rgba(176,139,90,0.85)] hover:bg-gold-soft hover:shadow-[0_20px_48px_-16px_rgba(176,139,90,0.95)]",
        outline:
          "border border-white/20 bg-transparent text-bone hover:border-gold/70 hover:bg-gold/5 hover:text-gold",
        ghost: "text-bone/85 hover:text-gold",
        link: "text-gold underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-8",
        lg: "h-[3.25rem] px-10 text-[13px]",
        sm: "h-10 px-5 text-[11px]",
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
