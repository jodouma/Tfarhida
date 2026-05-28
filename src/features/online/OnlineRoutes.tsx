import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Copy, Crown, Plus, Share2, WifiOff } from "lucide-react";
import { useAppStore } from "../../app/store";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { gameCatalog, wouldQuestions } from "../../data/games/content";
import { t } from "../../i18n/translations";
import { authService } from "../../services/authService";
import { isFirebaseConfigured } from "../../services/firebaseConfig";
import { roomService } from "../../services/roomService";
import type { GameId, Lang, LocalizedText } from "../../types";
import type { OnlinePlayer, OnlineRoom, OnlineRound, OnlineSubmission } from "../../types/online";

const publicUrl = "https://jodouma.github.io/Tfarhida/";
const firebaseDocUrl = "https://github.com/jodouma/Tfarhida/blob/main/docs/firebase-setup.md";
const tx = (value: LocalizedText, lang: Lang) => value[lang];
const catalogById = (id?: GameId) => gameCatalog.find((game) => game.id === id);
const label = (key: string, lang: Lang, params?: Record<string, string | number>) => {
  let value = t(key, lang);
  Object.entries(params ?? {}).forEach(([k, v]) => {
    value = value.replace(`{${k}}`, String(v));
  });
  return value;
};

export function Online() {
  const lang = useAppStore((s) => s.lang);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const startProfile = name.trim() || (lang === "tn" ? "لاعب أونلاين" : lang === "fr" ? "Joueur en ligne" : "Online player");
  const withAuth = async () => authService.guest(startProfile);

  const create = async () => {
    setBusy(true);
    setError("");
    try {
      const user = await withAuth();
      const room = await roomService.createRoom(user.uid, { displayName: startProfile });
      navigate(`/room/${room.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const join = async () => {
    setBusy(true);
    setError("");
    try {
      const user = await withAuth();
      await roomService.joinRoom(code, user.uid, { displayName: startProfile });
      navigate(`/room/${roomService.cleanCode(code)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl space-y-5">
      <Badge>{t("online", lang)}</Badge>
      <h1 className="text-4xl font-black">{t("onlineRooms", lang)}</h1>
      {isFirebaseConfigured ? (
        <div className="space-y-4">
          <div className="rounded-3xl bg-teal-50 p-4 text-sm font-bold leading-6 text-teal-900">{t("onlineSupportedGames", lang)}</div>
          <input className="w-full rounded-2xl border border-zinc-200 px-4 py-3 font-bold" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("displayName", lang)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Button loading={busy} onClick={create} icon={<Plus size={18} />}>{t("createRoom", lang)}</Button>
            <div className="flex gap-2">
              <input className="min-w-0 flex-1 rounded-2xl border border-zinc-200 px-4 py-3 font-bold uppercase" value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("roomCode", lang)} />
              <Button loading={busy} disabled={!code.trim()} onClick={join}>{t("joinRoom", lang)}</Button>
            </div>
          </div>
          {error && <div className="rounded-3xl bg-red-100 p-4 font-bold text-red-800">{error}</div>}
        </div>
      ) : (
        <>
          <div className="rounded-3xl bg-amber-100 p-5 font-bold text-amber-900"><WifiOff className="mb-2" />{t("onlineNeedsFirebase", lang)}<br />{t("localReady", lang)}</div>
          <div className="flex flex-wrap gap-3"><Link to="/players"><Button>{t("playLocallyNow", lang)}</Button></Link><a href={firebaseDocUrl} target="_blank" rel="noreferrer"><Button variant="secondary">{t("readFirebaseSetup", lang)}</Button></a><Link to="/"><Button variant="ghost">{t("backHome", lang)}</Button></Link></div>
        </>
      )}
    </Card>
  );
}

function OnlineWouldRather({ room, players, uid }: { room: OnlineRoom; players: OnlinePlayer[]; uid: string }) {
  const lang = useAppStore((s) => s.lang);
  const [round, setRound] = useState<OnlineRound | undefined>();
  const [submissions, setSubmissions] = useState<OnlineSubmission[]>([]);
  const [error, setError] = useState("");
  const isHost = room.hostUid === uid;
  const voted = submissions.find((item) => item.uid === uid);
  const prompt = wouldQuestions.find((item) => item.id === round?.promptId);
  const aCount = submissions.filter((item) => item.value === "a").length;
  const bCount = submissions.filter((item) => item.value === "b").length;
  const complete = round?.phase === "results";

  useEffect(() => roomService.subscribeRound(room.code, room.roundId, setRound), [room.code, room.roundId]);
  useEffect(() => roomService.subscribeSubmissions(room.code, room.roundId, setSubmissions), [room.code, room.roundId]);
  useEffect(() => {
    if (isHost && round?.phase === "question" && submissions.length >= players.length && players.length >= room.minPlayers) {
      roomService.revealWouldRatherRound(room.code, round.roundId).catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)));
    }
  }, [isHost, players.length, room.code, room.minPlayers, round, submissions.length]);

  const submit = async (value: "a" | "b") => {
    if (!round || voted) return;
    setError("");
    try {
      await roomService.submitWouldRatherVote(room.code, round.roundId, uid, value);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  if (!round || !prompt) return <div className="rounded-3xl bg-white/70 p-5 font-bold text-zinc-700">{t("waitingHost", lang)}</div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge>{round.roundIndex + 1}/{room.settings.maxRounds}</Badge>
        <Badge>{submissions.length}/{players.length} {t("voted", lang)}</Badge>
      </div>
      {!complete ? (
        <>
          <h2 className="text-2xl font-black">{voted ? t("waitingVotes", lang) : t("vote", lang)}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Button variant="choiceA" disabled={Boolean(voted)} selected={voted?.value === "a"} className="min-h-36 text-2xl leading-snug" onClick={() => submit("a")}>{tx(prompt.a, lang)}</Button>
            <Button variant="choiceB" disabled={Boolean(voted)} selected={voted?.value === "b"} className="min-h-36 text-2xl leading-snug" onClick={() => submit("b")}>{tx(prompt.b, lang)}</Button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {(["a", "b"] as const).map((side) => {
              const count = side === "a" ? aCount : bCount;
              const percent = players.length ? Math.round((count / players.length) * 100) : 0;
              return <div key={side} className="rounded-[2rem] bg-white/75 p-5"><p className="text-xl font-black">{tx(prompt[side], lang)}</p><p className="mt-2 text-3xl font-black text-orange-600">{percent}%</p><ProgressBar value={percent} /></div>;
            })}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">{players.map((player) => <div key={player.uid} className="rounded-2xl bg-white/70 p-3 text-sm font-black">{player.displayName}: {submissions.find((item) => item.uid === player.uid)?.value === "a" ? tx(prompt.a, lang) : tx(prompt.b, lang)}</div>)}</div>
          {isHost && <div className="flex flex-wrap gap-3"><Button onClick={() => roomService.nextWouldRatherRound(room.code, uid)}>{t("nextRound", lang)}</Button><Button variant="danger" onClick={() => roomService.finishGame(room.code, uid)}>{t("endGame", lang)}</Button></div>}
        </div>
      )}
      {error && <div className="rounded-3xl bg-red-100 p-4 font-bold text-red-800">{error}</div>}
    </div>
  );
}

export function RoomLinkPage() {
  const lang = useAppStore((s) => s.lang);
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const [uid, setUid] = useState<string | undefined>();
  const [name, setName] = useState("");
  const [room, setRoom] = useState<OnlineRoom | undefined>();
  const [players, setPlayers] = useState<OnlinePlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const code = roomService.cleanCode(roomCode ?? "");
  const currentPlayer = players.find((player) => player.uid === uid);
  const isHost = room?.hostUid === uid;
  const shareUrl = `${publicUrl}#/room/${code}`;

  useEffect(() => authService.onUser((user) => setUid(user?.uid)), []);
  useEffect(() => {
    if (!isFirebaseConfigured || !code) return undefined;
    if (!uid) {
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    const offRoom = roomService.subscribeRoom(code, (nextRoom) => {
      setRoom(nextRoom);
      setLoading(false);
    });
    const offPlayers = roomService.subscribePlayers(code, setPlayers);
    return () => {
      offRoom();
      offPlayers();
    };
  }, [code, uid]);

  const join = async () => {
    setError("");
    try {
      const displayName = name.trim() || (lang === "tn" ? "لاعب أونلاين" : lang === "fr" ? "Joueur en ligne" : "Online player");
      const user = await authService.guest(displayName);
      await roomService.joinRoom(code, user.uid, { displayName });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  if (!isFirebaseConfigured) {
    return <Card className="mx-auto max-w-2xl space-y-5 text-center"><Share2 className="mx-auto text-teal-500" size={54} /><Badge>{code}</Badge><h1 className="text-4xl font-black">{t("onlineRooms", lang)}</h1><p className="font-bold text-zinc-700">{t("roomNeedsFirebase", lang)}</p><Link to="/online"><Button>{t("onlineRooms", lang)}</Button></Link></Card>;
  }

  if (!uid) {
    return (
      <Card className="mx-auto max-w-2xl space-y-5">
        <Badge>{code}</Badge>
        <h1 className="text-4xl font-black">{t("joinRoom", lang)}</h1>
        <p className="font-bold text-zinc-600">{t("onlineSupportedGames", lang)}</p>
        <input className="w-full rounded-2xl border border-zinc-200 px-4 py-3 font-bold" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("displayName", lang)} />
        <Button onClick={join}>{t("joinRoom", lang)}</Button>
        {error && <div className="rounded-3xl bg-red-100 p-4 font-bold text-red-800">{error}</div>}
      </Card>
    );
  }

  if (loading) return <Card className="mx-auto max-w-2xl space-y-5 text-center"><Badge>{code}</Badge><h1 className="text-3xl font-black">{t("waitingPlayers", lang)}</h1></Card>;
  if (!room) return <Card className="mx-auto max-w-2xl space-y-5 text-center"><Badge>{code}</Badge><h1 className="text-3xl font-black">{t("roomNotFound", lang)}</h1><Link to="/online"><Button>{t("onlineRooms", lang)}</Button></Link></Card>;

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <Card className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Badge>{t("lobby", lang)} · {code}</Badge>
            <h1 className="mt-2 text-4xl font-black">{catalogById(room.gameId)?.name[lang] ?? t("onlineRooms", lang)}</h1>
            <p className="mt-2 font-bold text-zinc-600">{t("onlineSupportedGames", lang)}</p>
          </div>
          <Button variant="info" icon={<Copy size={17} />} onClick={() => navigator.clipboard?.writeText(shareUrl)}>{t("copyLink", lang)}</Button>
        </div>
        {!currentPlayer ? (
          <div className="space-y-3 rounded-[2rem] bg-white/70 p-5">
            <input className="w-full rounded-2xl border border-zinc-200 px-4 py-3 font-bold" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("displayName", lang)} />
            <Button onClick={join}>{t("joinRoom", lang)}</Button>
          </div>
        ) : room.phase === "lobby" ? (
          <div className="space-y-4">
            <div className="rounded-3xl bg-amber-100 p-4 font-bold text-amber-900">
              {players.length < room.minPlayers ? label("needPlayersDynamic", lang, { count: room.minPlayers }) : isHost ? t("startOnlineGame", lang) : t("waitingHost", lang)}
            </div>
            {isHost && <Button disabled={players.length < room.minPlayers} onClick={() => roomService.startGame(code, uid)}>{t("startOnlineGame", lang)}</Button>}
          </div>
        ) : room.phase === "ended" ? (
          <div className="rounded-[2rem] bg-white/70 p-6 text-center"><Crown className="mx-auto text-amber-500" size={50} /><h2 className="mt-3 text-3xl font-black">{t("results", lang)}</h2></div>
        ) : (
          <OnlineWouldRather room={room} players={players} uid={uid} />
        )}
        {error && <div className="rounded-3xl bg-red-100 p-4 font-bold text-red-800">{error}</div>}
      </Card>
      <Card className="space-y-4">
        <h2 className="text-2xl font-black">{t("players", lang)}</h2>
        {players.map((player) => <div key={player.uid} className="flex items-center justify-between rounded-3xl bg-white/75 p-3"><span className="font-black">{player.avatar} {player.displayName}</span><span className="font-black text-orange-600">{player.score} pts</span></div>)}
        {currentPlayer && <Button variant="secondary" fullWidth onClick={() => { roomService.leaveRoom(code, currentPlayer.uid); navigate("/online"); }}>{t("leaveRoom", lang)}</Button>}
      </Card>
    </section>
  );
}
