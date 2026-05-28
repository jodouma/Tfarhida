import { create } from "zustand";
import type { GameId, Lang, Player, SessionResult } from "../types";
import { storageService } from "../services/storageService";
import { createId } from "../utils/id";

const avatars = ["😄", "😎", "🤩", "🥳", "🧠", "🔥", "🎧", "⚽", "🍋", "🌶️"];
const colors = ["#f97316", "#ec4899", "#8b5cf6", "#14b8a6", "#22c55e", "#0ea5e9", "#ef4444", "#f59e0b"];
const botNames = ["Bot Chleka", "Bot Lablabi", "Bot Dawcha", "Bot Harissa", "Bot Bambalouni"];

type AppState = {
  lang: Lang;
  players: Player[];
  history: SessionResult[];
  activeGame?: GameId;
  setLang: (lang: Lang) => void;
  addPlayer: (name?: string) => void;
  addBot: () => void;
  addBotsTo: (count: number) => void;
  removeBots: () => void;
  updatePlayer: (id: string, patch: Partial<Player>) => void;
  removePlayer: (id: string) => void;
  addScore: (id: string, amount: number) => void;
  resetScores: () => void;
  setActiveGame: (game?: GameId) => void;
  saveResult: (gameId: GameId) => SessionResult;
};

function migratePlayers(players: Player[]) {
  const oldDefaults = players.length === 2 && players.some((p) => p.name === "Youssef") && players.some((p) => p.name === "Amira");
  if (oldDefaults) {
    storageService.setPlayers([]);
    return [];
  }
  return players;
}

const initialPlayers = migratePlayers(storageService.getPlayers());

const createPlayer = (index: number, name?: string, isBot = false): Player => ({
  id: createId(),
  name: isBot ? `🤖 ${botNames[index % botNames.length]}` : name || `Player ${index + 1}`,
  avatar: isBot ? "🤖" : avatars[index % avatars.length],
  color: colors[index % colors.length],
  score: 0,
  isBot,
});

export const useAppStore = create<AppState>((set, get) => ({
  lang: storageService.getLang(),
  players: initialPlayers,
  history: storageService.getHistory(),
  setLang: (lang) => {
    storageService.setLang(lang);
    set({ lang });
  },
  addPlayer: (name) =>
    set((state) => {
      const index = state.players.length;
      const players = [...state.players, createPlayer(index, name)];
      storageService.setPlayers(players);
      return { players };
    }),
  addBot: () =>
    set((state) => {
      const players = [...state.players, createPlayer(state.players.length, undefined, true)];
      storageService.setPlayers(players);
      return { players };
    }),
  addBotsTo: (count) =>
    set((state) => {
      const missing = Math.max(0, count - state.players.length);
      const players = [...state.players, ...Array.from({ length: missing }, (_, i) => createPlayer(state.players.length + i, undefined, true))];
      storageService.setPlayers(players);
      return { players };
    }),
  removeBots: () =>
    set((state) => {
      const players = state.players.filter((player) => !player.isBot);
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
    const hasScore = players.some((player) => player.score > 0);
    const result: SessionResult = {
      id: createId(),
      gameId,
      date: new Date().toISOString(),
      scores: players.map(({ id, name, score }) => ({ playerId: id, name, score })),
      winner: hasScore ? players[0]?.name : undefined,
    };
    if (hasScore) {
      storageService.addHistory(result);
      set({ history: storageService.getHistory() });
    }
    return result;
  },
}));
