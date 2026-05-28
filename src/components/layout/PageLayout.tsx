import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Gamepad2, History, Home, Settings, Users } from "lucide-react";
import { useAppStore } from "../../app/store";
import { languages, t } from "../../i18n/translations";
import { Button } from "../ui/Button";

export function PageLayout({ children }: { children: ReactNode }) {
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);
  const location = useLocation();
  const dir = languages.find((l) => l.code === lang)?.dir ?? "ltr";
  const nav = [
    { to: "/", icon: <Home size={17} />, label: t("backHome", lang) },
    { to: "/players", icon: <Users size={17} />, label: t("players", lang) },
    { to: "/games", icon: <Gamepad2 size={17} />, label: t("games", lang) },
    { to: "/results", icon: <History size={17} />, label: t("history", lang) },
    { to: "/settings", icon: <Settings size={17} />, label: t("settings", lang) },
  ];
  return (
    <div dir={dir} className="min-h-screen bg-party-mesh text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-orange-400 via-pink-500 to-teal-400 text-2xl text-white shadow-glow">ت</div>
            <div>
              <p className="text-2xl font-black">Tfarhida</p>
              <p className="text-xs font-bold text-zinc-600">{t("subtitle", lang)}</p>
            </div>
          </Link>
          <nav className="flex flex-wrap items-center gap-2">
            {nav.map((item) => (
              <Link key={item.to} to={item.to}>
                <Button variant={location.pathname === item.to ? "primary" : "secondary"} className="min-h-10 px-3 py-2" icon={item.icon}>
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            ))}
            {languages.map((item) => (
              <Button key={item.code} variant={item.code === lang ? "primary" : "secondary"} className="min-h-10 px-3 py-2" onClick={() => setLang(item.code)}>
                {item.native}
              </Button>
            ))}
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
