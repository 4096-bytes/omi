import { type HTMLAttributes } from "react";

import { cn } from "./cn";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground shadow-lg",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn("space-y-2 p-8", className)} {...props} />;
}

export function CardTitle({ className, ...props }: CardProps) {
  return (
    <h1
      className={cn("text-2xl font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: CardProps) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn("px-8 pb-8", className)} {...props} />;
}
