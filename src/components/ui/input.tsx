import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-12 w-full border-0 border-b border-white/15 bg-transparent px-1 py-2 text-[15px] text-bone placeholder:text-ash/60 transition-colors focus:border-gold focus:outline-none disabled:opacity-50 [color-scheme:dark]",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
