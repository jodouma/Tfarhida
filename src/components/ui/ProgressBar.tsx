export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-3 overflow-hidden rounded-full bg-white/70">
      <div className="h-full rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-teal-400 transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
