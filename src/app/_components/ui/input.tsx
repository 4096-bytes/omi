import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "./cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

