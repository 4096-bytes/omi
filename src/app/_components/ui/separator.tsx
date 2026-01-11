import { type HTMLAttributes } from "react";

import { cn } from "./cn";

export type SeparatorProps = HTMLAttributes<HTMLDivElement>;

export function Separator({ className, ...props }: SeparatorProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("h-px bg-white/10", className)}
      {...props}
    />
  );
}
