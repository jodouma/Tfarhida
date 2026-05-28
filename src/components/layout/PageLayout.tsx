import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Home, Settings } from "lucide-react";
import { useAppStore } from "../../app/store";
import { languages, t } from "../../i18n/translations";
import { Button } from "../ui/Button";

export function PageLayout({ children }: { children: ReactNode }) {
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);
  const dir = languages.find((l) => l.code === lang)?.dir ?? "ltr";
  return (
    <div dir={dir} className="min-h-screen bg-party-mesh text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-zinc-950 text-2xl text-white shadow-glow">ت</div>
            <div>
              <p className="text-2xl font-black">Tfarhida</p>
              <p className="text-xs font-bold text-zinc-600">{t("subtitle", lang)}</p>
            </div>
          </Link>
          <nav className="flex flex-wrap items-center gap-2">
            {languages.map((item) => (
              <Button key={item.code} variant={item.code === lang ? "primary" : "secondary"} className="min-h-10 px-3 py-2" onClick={() => setLang(item.code)}>
                {item.native}
              </Button>
            ))}
            <Link to="/settings"><Button variant="secondary" className="min-h-10 px-3 py-2" icon={<Settings size={17} />} /></Link>
            <Link to="/"><Button variant="ghost" className="min-h-10 px-3 py-2" icon={<Home size={17} />} /></Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
