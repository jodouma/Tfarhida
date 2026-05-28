import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "mystery" | "ghost" | "danger" | "success" | "info" | "choiceA" | "choiceB";
  icon?: ReactNode;
  fullWidth?: boolean;
  selected?: boolean;
  loading?: boolean;
};

const styles = {
  primary: "bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white shadow-glow hover:shadow-orange-500/30",
  secondary: "bg-white/85 text-zinc-950 ring-1 ring-white/80 hover:bg-white",
  mystery: "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-glow",
  ghost: "bg-white/25 text-zinc-800 ring-1 ring-white/60 hover:bg-white/70",
  danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white",
  success: "bg-gradient-to-r from-emerald-500 to-green-500 text-white",
  info: "bg-gradient-to-r from-cyan-500 to-teal-500 text-white",
  choiceA: "bg-gradient-to-br from-amber-300 via-orange-400 to-orange-500 text-white shadow-lg",
  choiceB: "bg-gradient-to-br from-pink-400 via-fuchsia-500 to-violet-600 text-white shadow-lg",
};

export function Button({ children, className = "", variant = "primary", icon, fullWidth, selected, loading, disabled, ...props }: Props) {
  return (
    <button
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 disabled:cursor-not-allowed disabled:opacity-45 ${fullWidth ? "w-full" : ""} ${selected ? "ring-4 ring-zinc-950/20" : ""} ${styles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {icon}
      {loading ? "..." : children}
    </button>
  );
}
