import type { Lang, Player, SessionResult } from "../types";

const prefix = "tfarhida.v1.";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(prefix + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(prefix + key, JSON.stringify(value));
}

export const storageService = {
  getLang: () => read<Lang>("language", "tn"),
  setLang: (lang: Lang) => write("language", lang),
  getPlayers: () => read<Player[]>("players", []),
  setPlayers: (players: Player[]) => write("players", players),
  getHistory: () => read<SessionResult[]>("history", []),
  addHistory: (result: SessionResult) => write("history", [result, ...read<SessionResult[]>("history", [])].slice(0, 20)),
  getSetting: <T>(key: string, fallback: T) => read<T>(`settings.${key}`, fallback),
  setSetting: <T>(key: string, value: T) => write(`settings.${key}`, value),
};
