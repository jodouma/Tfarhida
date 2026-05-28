import type { HTMLAttributes } from "react";

export function Badge({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={`inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-black text-zinc-700 ring-1 ring-zinc-200 ${className}`} {...props} />;
}
