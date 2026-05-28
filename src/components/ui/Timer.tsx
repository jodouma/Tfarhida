import { useEffect, useState } from "react";

export function Timer({ seconds, running, onDone }: { seconds: number; running: boolean; onDone?: () => void }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => setLeft(seconds), [seconds]);
  useEffect(() => {
    if (!running || left <= 0) return;
    const id = window.setTimeout(() => setLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [left, running]);
  useEffect(() => {
    if (left === 0) onDone?.();
  }, [left, onDone]);
  return <div className="rounded-2xl bg-red-500 px-4 py-2 text-lg font-black text-white tabular-nums">{left}s</div>;
}
