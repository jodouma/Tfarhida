import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { wouldQuestions } from "../data/games/content";
import type { OnlinePlayer, OnlineRoom, OnlineRound, OnlineSubmission, OnlineSupportedGameId } from "../types/online";
import { getFirebaseDb, requireFirebase } from "./firebase";
import { isFirebaseConfigured } from "./firebaseConfig";

type PlayerProfile = {
  displayName: string;
  avatar?: string;
  color?: string;
};

const colors = ["#f97316", "#ec4899", "#8b5cf6", "#14b8a6", "#22c55e", "#0ea5e9", "#ef4444", "#f59e0b"];
const avatars = ["😄", "😎", "🤩", "🥳", "🧠", "🔥", "🎧", "⚽"];

const cleanCode = (code: string) => code.trim().replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
const roomCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();
const disabled = () => Promise.reject(new Error("Firebase is not configured. Online rooms require Firebase Auth and Firestore."));

function roomRef(code: string) {
  return doc(requireFirebase().db, "rooms", cleanCode(code));
}

function maybeRoomRef(code: string) {
  const db = getFirebaseDb();
  return db ? doc(db, "rooms", cleanCode(code)) : undefined;
}

function playerDoc(code: string, uid: string) {
  return doc(roomRef(code), "players", uid);
}

function roundDoc(code: string, roundId: string) {
  return doc(roomRef(code), "rounds", roundId);
}

function submissionDoc(code: string, roundId: string, uid: string) {
  return doc(roundDoc(code, roundId), "submissions", uid);
}

function toPlayer(uid: string, profile: PlayerProfile, isHost = false, index = 0): OnlinePlayer {
  return {
    uid,
    displayName: profile.displayName.trim() || "Guest",
    avatar: profile.avatar ?? avatars[index % avatars.length],
    color: profile.color ?? colors[index % colors.length],
    isHost,
    joinedAt: serverTimestamp(),
    lastSeenAt: serverTimestamp(),
    online: true,
    score: 0,
  };
}

function buildRound(roundIndex: number): OnlineRound {
  const prompt = wouldQuestions[roundIndex % wouldQuestions.length];
  return {
    roundId: `round-${roundIndex + 1}`,
    gameId: "would-you-rather",
    phase: "question",
    roundIndex,
    promptId: prompt.id,
    choiceA: prompt.a.fr,
    choiceB: prompt.b.fr,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export const roomService = {
  configured: isFirebaseConfigured,

  cleanCode,

  async createRoom(uid: string, profile: PlayerProfile, gameId: OnlineSupportedGameId = "would-you-rather") {
    if (!isFirebaseConfigured) return disabled();
    const code = roomCode();
    const room: OnlineRoom = {
      code,
      gameId,
      hostUid: uid,
      hostName: profile.displayName.trim() || "Host",
      phase: "lobby",
      roundIndex: 0,
      minPlayers: 2,
      maxPlayers: 12,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      settings: { maxRounds: 5 },
      scores: {},
      message: "Online MVP supports Would You Rather realtime rounds.",
    };
    await setDoc(roomRef(code), room);
    await setDoc(playerDoc(code, uid), toPlayer(uid, profile, true));
    return room;
  },

  async joinRoom(code: string, uid: string, profile: PlayerProfile) {
    if (!isFirebaseConfigured) return disabled();
    const ref = roomRef(code);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) throw new Error("Room not found.");
    const playersSnapshot = await getDocs(collection(ref, "players"));
    const room = snapshot.data() as OnlineRoom;
    await setDoc(playerDoc(code, uid), toPlayer(uid, profile, uid === room.hostUid, playersSnapshot.size), { merge: true });
    return { ...(snapshot.data() as OnlineRoom), code: cleanCode(code) };
  },

  async leaveRoom(code: string, uid: string) {
    if (!isFirebaseConfigured) return disabled();
    await updateDoc(playerDoc(code, uid), { online: false, lastSeenAt: serverTimestamp() });
  },

  subscribeRoom(code: string, cb: (room?: OnlineRoom) => void): Unsubscribe {
    const ref = maybeRoomRef(code);
    if (!ref) {
      cb(undefined);
      return () => undefined;
    }
    return onSnapshot(ref, (snapshot) => cb(snapshot.exists() ? (snapshot.data() as OnlineRoom) : undefined), () => cb(undefined));
  },

  subscribePlayers(code: string, cb: (players: OnlinePlayer[]) => void): Unsubscribe {
    const ref = maybeRoomRef(code);
    if (!ref) {
      cb([]);
      return () => undefined;
    }
    return onSnapshot(collection(ref, "players"), (snapshot) => {
      cb(snapshot.docs.map((item) => item.data() as OnlinePlayer).sort((a, b) => Number(b.isHost) - Number(a.isHost) || a.displayName.localeCompare(b.displayName)));
    }, () => cb([]));
  },

  subscribeRound(code: string, roundId: string | undefined, cb: (round?: OnlineRound) => void): Unsubscribe {
    if (!roundId) {
      cb(undefined);
      return () => undefined;
    }
    const ref = maybeRoomRef(code);
    if (!ref) {
      cb(undefined);
      return () => undefined;
    }
    return onSnapshot(doc(ref, "rounds", roundId), (snapshot) => cb(snapshot.exists() ? (snapshot.data() as OnlineRound) : undefined), () => cb(undefined));
  },

  subscribeSubmissions(code: string, roundId: string | undefined, cb: (submissions: OnlineSubmission[]) => void): Unsubscribe {
    if (!roundId) {
      cb([]);
      return () => undefined;
    }
    const ref = maybeRoomRef(code);
    if (!ref) {
      cb([]);
      return () => undefined;
    }
    return onSnapshot(collection(doc(ref, "rounds", roundId), "submissions"), (snapshot) => {
      cb(snapshot.docs.map((item) => item.data() as OnlineSubmission));
    }, () => cb([]));
  },

  async startGame(code: string, uid: string) {
    if (!isFirebaseConfigured) return disabled();
    const ref = roomRef(code);
    const roomSnapshot = await getDoc(ref);
    if (!roomSnapshot.exists()) throw new Error("Room not found.");
    const room = roomSnapshot.data() as OnlineRoom;
    if (room.hostUid !== uid) throw new Error("Only the host can start the game.");
    const playersSnapshot = await getDocs(collection(ref, "players"));
    if (playersSnapshot.size < room.minPlayers) throw new Error(`You need at least ${room.minPlayers} players for this game.`);
    const round = buildRound(0);
    await setDoc(roundDoc(code, round.roundId), round);
    await updateDoc(ref, { phase: "playing", roundIndex: 0, roundId: round.roundId, updatedAt: serverTimestamp() });
    return round;
  },

  async submitWouldRatherVote(code: string, roundId: string, uid: string, value: "a" | "b") {
    if (!isFirebaseConfigured) return disabled();
    await runTransaction(requireFirebase().db, async (transaction) => {
      const ref = submissionDoc(code, roundId, uid);
      const existing = await transaction.get(ref);
      if (existing.exists()) throw new Error("Vote already submitted for this round.");
      transaction.set(ref, { uid, value, submittedAt: serverTimestamp() });
    });
  },

  async revealWouldRatherRound(code: string, roundId: string) {
    if (!isFirebaseConfigured) return disabled();
    const ref = roomRef(code);
    const submissionsSnapshot = await getDocs(collection(roundDoc(code, roundId), "submissions"));
    const submissions = submissionsSnapshot.docs.map((item) => item.data() as OnlineSubmission);
    await runTransaction(requireFirebase().db, async (transaction) => {
      const roomSnapshot = await transaction.get(ref);
      const roundSnapshot = await transaction.get(roundDoc(code, roundId));
      if (!roomSnapshot.exists() || !roundSnapshot.exists()) return;
      const room = roomSnapshot.data() as OnlineRoom;
      const round = roundSnapshot.data() as OnlineRound;
      if (round.phase === "results") return;
      const aCount = submissions.filter((item) => item.value === "a").length;
      const bCount = submissions.filter((item) => item.value === "b").length;
      const winning = aCount >= bCount ? "a" : "b";
      const scores = { ...(room.scores ?? {}) };
      submissions.filter((item) => item.value === winning).forEach((item) => {
        scores[item.uid] = (scores[item.uid] ?? 0) + 1;
        transaction.update(playerDoc(code, item.uid), { score: scores[item.uid], lastSeenAt: serverTimestamp() });
      });
      transaction.update(roundDoc(code, roundId), { phase: "results", updatedAt: serverTimestamp() });
      transaction.update(ref, { scores, phase: "results", updatedAt: serverTimestamp() });
    });
  },

  async nextWouldRatherRound(code: string, uid: string) {
    if (!isFirebaseConfigured) return disabled();
    const ref = roomRef(code);
    const roomSnapshot = await getDoc(ref);
    if (!roomSnapshot.exists()) throw new Error("Room not found.");
    const room = roomSnapshot.data() as OnlineRoom;
    if (room.hostUid !== uid) throw new Error("Only the host can advance the room.");
    const roundIndex = room.roundIndex + 1;
    const round = buildRound(roundIndex);
    await setDoc(roundDoc(code, round.roundId), round);
    await updateDoc(ref, { phase: "playing", roundIndex, roundId: round.roundId, updatedAt: serverTimestamp() });
  },

  async finishGame(code: string, uid: string) {
    if (!isFirebaseConfigured) return disabled();
    const ref = roomRef(code);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) throw new Error("Room not found.");
    const room = snapshot.data() as OnlineRoom;
    if (room.hostUid !== uid) throw new Error("Only the host can finish the room.");
    await updateDoc(ref, { phase: "ended", updatedAt: serverTimestamp() });
  },
};
