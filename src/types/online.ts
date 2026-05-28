import type { GameId } from "./index";

export type OnlinePhase = "lobby" | "playing" | "results" | "ended";
export type OnlineRoundPhase = "question" | "results";
export type OnlineSupportedGameId = "would-you-rather";

export type OnlineRoom = {
  code: string;
  gameId: OnlineSupportedGameId;
  hostUid: string;
  hostName: string;
  phase: OnlinePhase;
  roundId?: string;
  roundIndex: number;
  minPlayers: number;
  maxPlayers?: number;
  createdAt?: unknown;
  updatedAt?: unknown;
  settings: {
    maxRounds: number;
  };
  scores: Record<string, number>;
  message?: string;
};

export type OnlinePlayer = {
  uid: string;
  displayName: string;
  avatar: string;
  color: string;
  isHost: boolean;
  joinedAt?: unknown;
  lastSeenAt?: unknown;
  online: boolean;
  score: number;
};

export type OnlineRound = {
  roundId: string;
  gameId: GameId;
  phase: OnlineRoundPhase;
  roundIndex: number;
  promptId: string;
  choiceA: string;
  choiceB: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type OnlineSubmission = {
  uid: string;
  value: "a" | "b";
  submittedAt?: unknown;
};

export type OnlinePrivatePayload = {
  uid: string;
  gameId: GameId;
  privatePayload: Record<string, unknown>;
};
