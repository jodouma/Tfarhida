import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";

export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/50 p-4 backdrop-blur-sm">
      <Card className="max-h-[86vh] w-full max-w-xl overflow-auto">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-zinc-950">{title}</h2>
          <Button aria-label="Close" variant="ghost" className="h-11 w-11 px-0" onClick={onClose} icon={<X size={18} />} />
        </div>
        {children}
      </Card>
    </div>
  );
}
