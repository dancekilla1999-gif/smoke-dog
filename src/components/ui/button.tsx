import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap font-sans text-[12px] font-semibold uppercase tracking-[0.18em] transition-all duration-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/50 disabled:pointer-events-none disabled:opacity-45 active:scale-[0.97]",
  {
    variants: {
      variant: {
        /* Smoke oval — main CTA */
        gold:
          "btn-smoke-fill text-noir",
        /* Smoke ring outline */
        outline:
          "btn-smoke-ring text-bone hover:text-gold-soft",
        /* Soft glass oval */
        glass:
          "btn-smoke-glass text-bone",
        ghost: "rounded-full text-bone hover:text-gold",
        link: "rounded-full text-gold underline-offset-4 hover:underline tracking-wide2",
      },
      size: {
        default: "h-12 min-w-[9.5rem] px-8",
        lg: "h-14 min-w-[11rem] px-10 text-[13px]",
        sm: "h-10 min-w-[7rem] px-5 text-[12px]",
        icon: "h-11 w-11 min-w-0 rounded-full",
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
