import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  icon?: ReactNode;
};

const styles = {
  primary: "bg-zinc-950 text-white shadow-glow hover:bg-zinc-800",
  secondary: "bg-white/85 text-zinc-950 ring-1 ring-zinc-200 hover:bg-white",
  ghost: "bg-transparent text-zinc-700 hover:bg-white/60",
  danger: "bg-red-500 text-white hover:bg-red-600",
  success: "bg-emerald-500 text-white hover:bg-emerald-600",
};

export function Button({ children, className = "", variant = "primary", icon, ...props }: Props) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold transition disabled:cursor-not-allowed disabled:opacity-45 ${styles[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
