import { type ButtonHTMLAttributes } from "react";

import { cn, type ClassValue } from "./cn";

type ButtonVariant = "default" | "secondary" | "ghost";
type ButtonSize = "default" | "sm" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const base: ClassValue =
  "inline-flex items-center justify-center rounded-md text-sm font-semibold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-70";

const variants: Record<ButtonVariant, ClassValue> = {
  default: "bg-white text-slate-900 hover:bg-white/90",
  secondary: "bg-white/10 text-white hover:bg-white/15",
  ghost: "bg-transparent text-white hover:bg-white/10",
};

const sizes: Record<ButtonSize, ClassValue> = {
  default: "px-4 py-3",
  sm: "px-3 py-2",
  lg: "px-6 py-4",
};

export function Button({
  className,
  type = "button",
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      type={type}
      {...props}
    />
  );
}

