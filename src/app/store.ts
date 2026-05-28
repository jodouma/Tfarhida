import { create } from "zustand";
import type { GameId, Lang, Player, SessionResult } from "../types";
import { storageService } from "../services/storageService";

const avatars = ["😄", "😎", "🤩", "🥳", "🧠", "🔥", "🎧", "⚽", "🍋", "🌶️"];
const colors = ["#f97316", "#ec4899", "#8b5cf6", "#14b8a6", "#22c55e", "#0ea5e9", "#ef4444", "#f59e0b"];

type AppState = {
  lang: Lang;
  players: Player[];
  history: SessionResult[];
  activeGame?: GameId;
  setLang: (lang: Lang) => void;
  addPlayer: (name?: string) => void;
  updatePlayer: (id: string, patch: Partial<Player>) => void;
  removePlayer: (id: string) => void;
  addScore: (id: string, amount: number) => void;
  resetScores: () => void;
  setActiveGame: (game?: GameId) => void;
  saveResult: (gameId: GameId) => SessionResult;
};

const initialPlayers = storageService.getPlayers();

export const useAppStore = create<AppState>((set, get) => ({
  lang: storageService.getLang(),
  players: initialPlayers.length
    ? initialPlayers
    : [
        { id: crypto.randomUUID(), name: "Youssef", avatar: "😎", color: "#f97316", score: 0 },
        { id: crypto.randomUUID(), name: "Amira", avatar: "🤩", color: "#ec4899", score: 0 },
      ],
  history: storageService.getHistory(),
  setLang: (lang) => {
    storageService.setLang(lang);
    set({ lang });
  },
  addPlayer: (name) =>
    set((state) => {
      const index = state.players.length;
      const players = [
        ...state.players,
        { id: crypto.randomUUID(), name: name || `Player ${index + 1}`, avatar: avatars[index % avatars.length], color: colors[index % colors.length], score: 0 },
      ];
      storageService.setPlayers(players);
      return { players };
    }),
  updatePlayer: (id, patch) =>
    set((state) => {
      const players = state.players.map((player) => (player.id === id ? { ...player, ...patch } : player));
      storageService.setPlayers(players);
      return { players };
    }),
  removePlayer: (id) =>
    set((state) => {
      const players = state.players.filter((player) => player.id !== id);
      storageService.setPlayers(players);
      return { players };
    }),
  addScore: (id, amount) =>
    set((state) => {
      const players = state.players.map((player) => (player.id === id ? { ...player, score: player.score + amount } : player));
      storageService.setPlayers(players);
      return { players };
    }),
  resetScores: () =>
    set((state) => {
      const players = state.players.map((player) => ({ ...player, score: 0 }));
      storageService.setPlayers(players);
      return { players };
    }),
  setActiveGame: (activeGame) => set({ activeGame }),
  saveResult: (gameId) => {
    const players = [...get().players].sort((a, b) => b.score - a.score);
    const result: SessionResult = {
      id: crypto.randomUUID(),
      gameId,
      date: new Date().toISOString(),
      scores: players.map(({ id, name, score }) => ({ playerId: id, name, score })),
      winner: players[0]?.name,
    };
    storageService.addHistory(result);
    set({ history: storageService.getHistory() });
    return result;
  },
}));
