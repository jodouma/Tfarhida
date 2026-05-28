import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-[2rem] border border-white/70 bg-white/78 p-5 shadow-xl shadow-orange-900/5 backdrop-blur ${className}`} {...props} />;
}
