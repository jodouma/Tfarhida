import type { GameId, Player } from "../types";
import { isFirebaseConfigured } from "./firebase";

export type RoomState = {
  code: string;
  hostId: string;
  gameId?: GameId;
  players: Player[];
  teams: Array<{ id: string; name: string; playerIds: string[] }>;
  scores: Record<string, number>;
  phase: "lobby" | "playing" | "results";
  updatedAt: number;
};

const roomCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();
const disabled = () => Promise.reject(new Error("Firebase SDK is optional. Install and wire Firestore after configuring env variables."));

export const roomService = {
  configured: isFirebaseConfigured,
  async createRoom(hostId: string, players: Player[] = []) {
    const state: RoomState = { code: roomCode(), hostId, players, teams: [], scores: {}, phase: "lobby", updatedAt: Date.now() };
    await disabled();
    return { id: "", ...state };
  },
  async joinRoom(_code: string, _player: Player) {
    return disabled();
  },
  async updateRoom(_id: string, _patch: Partial<RoomState>) {
    return disabled();
  },
  async saveRoom(_id: string, _state: RoomState) {
    return disabled();
  },
  async getRoom(_id: string) {
    await disabled();
    return undefined;
  },
  subscribe(_id: string, cb: (state?: RoomState & { id: string }) => void) {
    cb(undefined);
    return () => undefined;
  },
};
