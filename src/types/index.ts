export type Lang = "tn" | "fr" | "en";

export type LocalizedText = Record<Lang, string>;

export type GameId = "would-you-rather" | "truth-or-dare" | "guess-word" | "impostor" | "tunisian-quiz";

export type Player = {
  id: string;
  name: string;
  avatar: string;
  color: string;
  score: number;
};

export type GameMeta = {
  id: GameId;
  name: LocalizedText;
  short: LocalizedText;
  vibe: LocalizedText;
  players: string;
  color: string;
  icon: string;
  image: string;
};

export type SessionResult = {
  id: string;
  gameId: GameId;
  date: string;
  scores: Array<{ playerId: string; name: string; score: number }>;
  winner?: string;
};

export type WouldQuestion = {
  id: string;
  a: LocalizedText;
  b: LocalizedText;
};

export type TruthDarePrompt = {
  id: string;
  kind: "truth" | "dare";
  level: "family" | "friends" | "university" | "spicy-soft";
  text: LocalizedText;
};

export type GuessWord = {
  id: string;
  category: LocalizedText;
  word: LocalizedText;
  taboo: LocalizedText[];
};

export type ImpostorPack = {
  id: string;
  category: LocalizedText;
  secret: LocalizedText;
  impostorHint: LocalizedText;
};

export type QuizQuestion = {
  id: string;
  category: LocalizedText;
  question: LocalizedText;
  options: LocalizedText[];
  answerIndex: number;
  explanation: LocalizedText;
};
