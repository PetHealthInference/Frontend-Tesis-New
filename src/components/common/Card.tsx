import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn("rounded-lg border border-slate-100 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)]", className)}
      {...props}
    />
  );
}
