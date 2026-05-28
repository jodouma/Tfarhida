import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Clock, Copy, Crown, LogIn, Plus, RotateCcw, Share2, Sparkles, Trash2, Users, WifiOff, X } from "lucide-react";
import { useAppStore } from "./app/store";
import { GameCard } from "./components/games/GameCard";
import { Scoreboard } from "./components/games/Scoreboard";
import { PageLayout } from "./components/layout/PageLayout";
import { PlayerAvatar } from "./components/players/PlayerAvatar";
import { Badge } from "./components/ui/Badge";
import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";
import { Modal } from "./components/ui/Modal";
import { ProgressBar } from "./components/ui/ProgressBar";
import { Timer } from "./components/ui/Timer";
import { gameCatalog, guessWords, impostorPacks, quizQuestions, truthDarePrompts, wouldQuestions } from "./data/games/content";
import { t } from "./i18n/translations";
import { isFirebaseConfigured } from "./services/firebase";
import { storageService } from "./services/storageService";
import type { GameId, Lang, LocalizedText } from "./types";

const pick = <T,>(items: T[], index: number) => items[index % items.length];
const tx = (value: LocalizedText, lang: Lang) => value[lang];
const label = (key: string, lang: Lang, params?: Record<string, string | number>) => {
  let value = t(key, lang);
  Object.entries(params ?? {}).forEach(([k, v]) => {
    value = value.replace(`{${k}}`, String(v));
  });
  return value;
};
const catalogById = (id?: GameId) => gameCatalog.find((game) => game.id === id);
const publicUrl = "https://jodouma.github.io/Tfarhida/";
const firebaseDocUrl = "https://github.com/jodouma/Tfarhida/blob/main/docs/firebase-setup.md";
const localShareUrl = (gameId: GameId, lang: Lang) => `${publicUrl}#/play/${gameId}?lang=${lang}`;
const levelLabel = (level: string, lang: Lang) => {
  const labels: Record<string, LocalizedText> = {
    family: { tn: "عائلة", fr: "Famille", en: "Family" },
    friends: { tn: "صحاب", fr: "Amis", en: "Friends" },
    university: { tn: "جامعة", fr: "Université", en: "University" },
    "spicy-soft": { tn: "سخون خفيف", fr: "Spicy soft", en: "Spicy soft" },
  };
  return labels[level]?.[lang] ?? level;
};

function ActionStrip({ gameId }: { gameId?: GameId }) {
  const lang = useAppStore((s) => s.lang);
  const [copied, setCopied] = useState(false);
  if (!gameId) return null;
  return (
    <Card className="flex flex-col gap-3 bg-white/55 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-bold leading-6 text-zinc-700">{t("localShareInfo", lang)}</p>
      <Button
        variant="info"
        icon={<Copy size={17} />}
        onClick={() => {
          navigator.clipboard?.writeText(localShareUrl(gameId, lang));
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        }}
      >
        {copied ? "OK" : t("copyLink", lang)}
      </Button>
    </Card>
  );
}

function Home() {
  const lang = useAppStore((s) => s.lang);
  const players = useAppStore((s) => s.players);
  const history = useAppStore((s) => s.history);
  const lastGame = storageService.getLastGame() as GameId | undefined;
  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 py-8 sm:py-14">
        <Badge className="bg-orange-100 text-orange-800">PFE/PFA MVP</Badge>
        <h1 className="max-w-3xl text-5xl font-black leading-tight text-zinc-950 sm:text-7xl">
          Tfarhida
          <span className="block bg-gradient-to-r from-orange-500 via-pink-500 to-teal-500 bg-clip-text text-transparent">{t("subtitle", lang)}</span>
        </h1>
        <p className="max-w-2xl text-lg font-semibold leading-8 text-zinc-700">
          {lang === "tn"
            ? "سهرة تونسية في جيبك: ألعاب اجتماعية، تصويت، غموض، كويز وثقافة تونسية في UI خفيف على التلفون."
            : lang === "fr"
              ? "Une vraie mini-plateforme de jeux sociaux tunisiens, pensée pour téléphone, tablette et présentation PFE/PFA."
              : "A real Tunisian social mini-games platform for phones, tablets, and a polished PFE/PFA presentation."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/players"><Button icon={<Users size={18} />}>{t("startLocal", lang)}</Button></Link>
          <Link to="/games"><Button variant="info" icon={<Sparkles size={18} />}>{t("chooseGame", lang)}</Button></Link>
          <Link to="/online"><Button variant="secondary" icon={<LogIn size={18} />}>{t("onlineRooms", lang)}</Button></Link>
          {lastGame && players.length > 0 && <Link to={`/play/${lastGame}`}><Button variant="mystery">{t("continueLast", lang)}</Button></Link>}
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          {["5 mini-games", lang === "tn" ? "ثقافة تونسية" : lang === "fr" ? "Culture tunisienne" : "Tunisian culture", "Phone/tablet/PC", `${players.length} ${t("players", lang)}`].map((item) => (
            <div key={item} className="rounded-3xl bg-white/60 p-4 text-sm font-black text-zinc-700 ring-1 ring-white/80">{item}</div>
          ))}
        </div>
      </motion.div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {gameCatalog.slice(0, 3).map((game) => (
          <Card key={game.id} className="overflow-hidden p-0">
            <div className="relative flex items-center gap-4 p-4">
              <img src={game.image} alt={game.name[lang]} className="h-24 w-24 rounded-3xl object-cover" />
              <div>
                <p className="text-3xl">{game.icon}</p>
                <h2 className="text-xl font-black">{game.name[lang]}</h2>
                <p className="text-sm font-semibold text-zinc-600">{game.vibe[lang]} · {game.players} · {game.duration[lang]}</p>
              </div>
            </div>
          </Card>
        ))}
        {history.length > 0 && <Link to="/results"><Button variant="secondary" fullWidth>{t("history", lang)}</Button></Link>}
      </div>
    </section>
  );
}

function PlayerSetup() {
  const lang = useAppStore((s) => s.lang);
  const players = useAppStore((s) => s.players);
  const addPlayer = useAppStore((s) => s.addPlayer);
  const addBot = useAppStore((s) => s.addBot);
  const addBotsTo = useAppStore((s) => s.addBotsTo);
  const removeBots = useAppStore((s) => s.removeBots);
  const updatePlayer = useAppStore((s) => s.updatePlayer);
  const removePlayer = useAppStore((s) => s.removePlayer);
  const [name, setName] = useState("");
  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <Card className="space-y-5">
        <div>
          <Badge>{t("localReady", lang)}</Badge>
          <h1 className="mt-3 text-4xl font-black">{t("players", lang)}</h1>
          <p className="mt-2 font-bold text-zinc-600">{t("botNotice", lang)}</p>
        </div>
        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(event) => { event.preventDefault(); addPlayer(name.trim()); setName(""); }}>
          <input className="min-h-12 flex-1 rounded-2xl border border-zinc-200 bg-white px-4 font-bold outline-none focus:ring-4 focus:ring-orange-200" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("namePlaceholder", lang)} />
          <Button type="submit" icon={<Plus size={18} />}>{t("addPlayer", lang)}</Button>
        </form>
        <div className="flex flex-wrap gap-3">
          <Button variant="info" onClick={() => addPlayer()}>{t("addQuickPlayer", lang)}</Button>
          <Button variant="mystery" onClick={addBot}>{t("addBot", lang)}</Button>
          <Button variant="secondary" onClick={() => addBotsTo(3)}>{t("addEnoughBots", lang)}</Button>
          <Button variant="ghost" onClick={removeBots}>{t("removeBots", lang)}</Button>
        </div>
        {players.length === 0 ? (
          <div className="rounded-[2rem] border-2 border-dashed border-orange-200 bg-orange-50/70 p-8 text-center">
            <p className="text-4xl">🎉</p>
            <p className="mt-3 text-lg font-black text-zinc-800">{t("emptyPlayers", lang)}</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {players.map((player) => (
              <div key={player.id} className="rounded-3xl bg-white/70 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <PlayerAvatar player={player} />
                  <Button variant="ghost" className="h-10 w-10 px-0" onClick={() => removePlayer(player.id)} icon={<Trash2 size={17} />} />
                </div>
                <input className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 font-bold" value={player.name} onChange={(e) => updatePlayer(player.id, { name: e.target.value })} />
              </div>
            ))}
          </div>
        )}
      </Card>
      <div className="space-y-4">
        <Scoreboard />
        <Link to="/games"><Button fullWidth>{t("chooseGame", lang)}</Button></Link>
      </div>
    </section>
  );
}

function GameLibrary() {
  const lang = useAppStore((s) => s.lang);
  const players = useAppStore((s) => s.players);
  const [rules, setRules] = useState<GameId | undefined>();
  const navigate = useNavigate();
  const ruleGame = catalogById(rules);
  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge>{t("games", lang)}</Badge>
          <h1 className="mt-2 text-4xl font-black">{t("chooseGame", lang)}</h1>
        </div>
        <Link to="/players"><Button variant="secondary" icon={<Users size={17} />}>{t("players", lang)}</Button></Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {gameCatalog.map((game) => (
          <GameCard key={game.id} game={game} lang={lang} canPlay={players.length >= game.minPlayers} onPlay={() => navigate(`/play/${game.id}`)} onRules={() => setRules(game.id)} />
        ))}
      </div>
      <Modal open={Boolean(ruleGame)} title={ruleGame?.name[lang] ?? ""} onClose={() => setRules(undefined)}>
        <p className="text-base font-semibold leading-8 text-zinc-700">
          {lang === "tn"
            ? "اللعبة فيها تقدم واضح، أزرار كبار، وسكور في الآخر. إلعبوا باحترام وخليو الجو خفيف."
            : lang === "fr"
              ? "Le jeu propose une progression claire, de gros boutons et un score final. Jouez avec respect."
              : "This game has clear progress, big controls, and final scores. Keep it respectful and fun."}
        </p>
      </Modal>
    </>
  );
}

function GameFrame({ title, children, progress, gameId, onEnd }: { title: string; children: ReactNode; progress: number; gameId: GameId; onEnd: () => void }) {
  const lang = useAppStore((s) => s.lang);
  const [confirmEnd, setConfirmEnd] = useState(false);
  return (
    <div className="space-y-4">
      <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <Card className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Link to="/games" className="inline-flex items-center gap-1 text-sm font-black text-zinc-600"><ArrowLeft size={16} /> {t("games", lang)}</Link>
              <h1 className="mt-2 text-3xl font-black">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge>{Math.round(progress)}%</Badge>
              <Button variant="danger" onClick={() => setConfirmEnd(true)}>{t("endGame", lang)}</Button>
            </div>
          </div>
          <ProgressBar value={progress} />
          {children}
        </Card>
        <Scoreboard />
      </section>
      <ActionStrip gameId={gameId} />
      <Modal open={confirmEnd} title={t("endGame", lang)} onClose={() => setConfirmEnd(false)}>
        <p className="mb-5 text-lg font-bold text-zinc-700">{t("endConfirm", lang)}</p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={onEnd}>{t("endGame", lang)}</Button>
          <Button variant="secondary" onClick={() => setConfirmEnd(false)}>{t("skip", lang)}</Button>
        </div>
      </Modal>
    </div>
  );
}

function NeedPlayers({ game }: { game: NonNullable<ReturnType<typeof catalogById>> }) {
  const lang = useAppStore((s) => s.lang);
  const addBot = useAppStore((s) => s.addBot);
  const addBotsTo = useAppStore((s) => s.addBotsTo);
  return (
    <Card className="mx-auto max-w-2xl space-y-5 text-center">
      <div className={`mx-auto grid h-24 w-24 place-items-center rounded-[2rem] bg-gradient-to-br ${game.color} text-5xl text-white`}>{game.icon}</div>
      <Badge>{game.name[lang]}</Badge>
      <h1 className="text-3xl font-black">{label("needPlayersDynamic", lang, { count: game.minPlayers })}</h1>
      <p className="font-bold text-zinc-600">{t("botNotice", lang)}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/players"><Button fullWidth icon={<Plus size={17} />}>{t("addPlayer", lang)}</Button></Link>
        <Button fullWidth variant="mystery" onClick={addBot}>{t("addBot", lang)}</Button>
        <Button fullWidth variant="info" onClick={() => addBotsTo(game.minPlayers)}>{t("addEnoughBots", lang)}</Button>
        <Link to="/games"><Button fullWidth variant="secondary">{t("chooseAnotherGame", lang)}</Button></Link>
      </div>
    </Card>
  );
}

function WouldRatherGame({ onEnd }: { onEnd: () => void }) {
  const lang = useAppStore((s) => s.lang);
  const players = useAppStore((s) => s.players);
  const addScore = useAppStore((s) => s.addScore);
  const [round, setRound] = useState(0);
  const [votes, setVotes] = useState<Record<string, "a" | "b">>({});
  const [scoredRound, setScoredRound] = useState<number | undefined>();
  const q = pick(wouldQuestions, round);
  const voter = players[Object.keys(votes).length];
  const complete = Object.keys(votes).length >= players.length;
  const aCount = Object.values(votes).filter((v) => v === "a").length;
  const bCount = Object.values(votes).filter((v) => v === "b").length;
  const winning = aCount >= bCount ? "a" : "b";
  useEffect(() => {
    if (complete && scoredRound !== round) {
      players.filter((player) => votes[player.id] === winning).forEach((player) => addScore(player.id, 1));
      setScoredRound(round);
    }
  }, [addScore, complete, players, round, scoredRound, votes, winning]);
  return (
    <GameFrame title={catalogById("would-you-rather")!.name[lang]} gameId="would-you-rather" progress={(round % 8) * 12.5 + (Object.keys(votes).length / players.length) * 12.5} onEnd={onEnd}>
      {!complete ? (
        <>
          <div className="rounded-[2rem] bg-white/70 p-4"><p className="text-sm font-black text-zinc-500">{t("currentPlayer", lang)}</p>{voter && <PlayerAvatar player={voter} />}</div>
          <p className="font-bold text-zinc-600">{Object.keys(votes).length}/{players.length} {t("voted", lang)}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {(["a", "b"] as const).map((side) => (
              <Button key={side} variant={side === "a" ? "choiceA" : "choiceB"} className="min-h-40 text-2xl leading-snug" onClick={() => voter && setVotes({ ...votes, [voter.id]: side })}>
                {tx(q[side], lang)}
              </Button>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {(["a", "b"] as const).map((side) => {
              const count = side === "a" ? aCount : bCount;
              const percent = Math.round((count / players.length) * 100);
              return <div key={side} className="rounded-[2rem] bg-white/75 p-5"><p className="text-xl font-black">{tx(q[side], lang)}</p><p className="mt-2 text-3xl font-black text-orange-600">{percent}%</p><ProgressBar value={percent} /></div>;
            })}
          </div>
          <Badge>{t("winningSide", lang)}: {winning === "a" ? t("choiceA", lang) : t("choiceB", lang)}</Badge>
          <div className="grid gap-2 sm:grid-cols-2">{players.map((player) => <div key={player.id} className="rounded-2xl bg-white/70 p-3 text-sm font-black">{player.name}: {votes[player.id] === "a" ? tx(q.a, lang) : tx(q.b, lang)}</div>)}</div>
          <div className="flex gap-3"><Button onClick={() => { setRound(round + 1); setVotes({}); setScoredRound(undefined); }}>{t("nextRound", lang)}</Button><Button variant="danger" onClick={onEnd}>{t("endGame", lang)}</Button></div>
        </div>
      )}
    </GameFrame>
  );
}

function TruthDareGame({ onEnd }: { onEnd: () => void }) {
  const lang = useAppStore((s) => s.lang);
  const players = useAppStore((s) => s.players);
  const addScore = useAppStore((s) => s.addScore);
  const [turn, setTurn] = useState(0);
  const [kind, setKind] = useState<"truth" | "dare">("truth");
  const [level, setLevel] = useState("family");
  const prompts = truthDarePrompts.filter((p) => p.kind === kind && p.level === level);
  const prompt = pick(prompts.length ? prompts : truthDarePrompts.filter((p) => p.kind === kind), turn);
  const player = pick(players, turn);
  return (
    <GameFrame title={catalogById("truth-or-dare")!.name[lang]} gameId="truth-or-dare" progress={(turn % 12) * 8} onEnd={onEnd}>
      <div className="rounded-[2rem] bg-white/70 p-4"><p className="text-sm font-black text-zinc-500">{t("currentPlayer", lang)}</p><PlayerAvatar player={player} /></div>
      <div className="flex flex-wrap gap-2">{["family", "friends", "university", "spicy-soft"].map((item) => <Button key={item} variant={level === item ? "info" : "secondary"} selected={level === item} onClick={() => setLevel(item)}>{levelLabel(item, lang)}</Button>)}</div>
      <div className="grid gap-4 sm:grid-cols-2"><Button variant="choiceA" className="min-h-24 text-xl" selected={kind === "truth"} onClick={() => setKind("truth")}>{t("truth", lang)}</Button><Button variant="choiceB" className="min-h-24 text-xl" selected={kind === "dare"} onClick={() => setKind("dare")}>{t("dare", lang)}</Button></div>
      <div className="rounded-[2rem] bg-gradient-to-br from-rose-500 to-orange-400 p-8 text-3xl font-black leading-snug text-white shadow-glow">{prompt.text[lang]}</div>
      <div className="grid gap-3 sm:grid-cols-2"><Button variant="success" icon={<Check size={18} />} onClick={() => { addScore(player.id, 2); setTurn(turn + 1); }}>{t("done", lang)}</Button><Button variant="secondary" icon={<X size={18} />} onClick={() => setTurn(turn + 1)}>{t("skip", lang)}</Button></div>
    </GameFrame>
  );
}

function GuessWordGame({ onEnd }: { onEnd: () => void }) {
  const lang = useAppStore((s) => s.lang);
  const players = useAppStore((s) => s.players);
  const addScore = useAppStore((s) => s.addScore);
  const [turn, setTurn] = useState(0);
  const [running, setRunning] = useState(false);
  const [hidden, setHidden] = useState(true);
  const word = pick(guessWords, turn);
  const player = pick(players, turn);
  const advance = () => { setTurn(turn + 1); setRunning(false); setHidden(true); };
  return (
    <GameFrame title={catalogById("guess-word")!.name[lang]} gameId="guess-word" progress={(turn % 15) * 6.6} onEnd={onEnd}>
      <div className="flex flex-wrap items-center justify-between gap-3"><PlayerAvatar player={player} /><Timer seconds={45} running={running} onDone={() => setRunning(false)} /></div>
      <Badge>{word.category[lang]}</Badge>
      <button className="rounded-[2rem] bg-gradient-to-br from-cyan-500 to-teal-400 p-8 text-center text-5xl font-black text-white shadow-glow" onClick={() => setHidden(false)}>{hidden ? t("reveal", lang) : word.word[lang]}</button>
      {!hidden && <div className="flex flex-wrap gap-2">{word.taboo.map((x) => <Badge key={x.en}>{x[lang]}</Badge>)}</div>}
      <div className="grid gap-3 sm:grid-cols-3"><Button variant="info" icon={<Clock size={18} />} onClick={() => setRunning(true)}>{t("start", lang)}</Button><Button variant="success" onClick={() => { addScore(player.id, 1); advance(); }}>{t("correct", lang)}</Button><Button variant="secondary" onClick={advance}>{t("skip", lang)}</Button></div>
    </GameFrame>
  );
}

function ImpostorGame({ onEnd }: { onEnd: () => void }) {
  const lang = useAppStore((s) => s.lang);
  const players = useAppStore((s) => s.players);
  const addScore = useAppStore((s) => s.addScore);
  const [round, setRound] = useState(0);
  const [step, setStep] = useState(0);
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [scoredRound, setScoredRound] = useState<number | undefined>();
  const pack = pick(impostorPacks, round);
  const impostor = useMemo(() => players[round % Math.max(players.length, 1)], [players, round]);
  const current = players[step];
  const revealing = step < players.length;
  const voter = players[Object.keys(votes).length];
  const votedOut = Object.values(votes).sort((a, b) => Object.values(votes).filter((v) => v === b).length - Object.values(votes).filter((v) => v === a).length)[0];
  const complete = !revealing && Object.keys(votes).length >= players.length;
  useEffect(() => {
    if (complete && votedOut && scoredRound !== round) {
      if (votedOut === impostor.id) players.filter((p) => p.id !== impostor.id).forEach((p) => addScore(p.id, 2));
      else addScore(impostor.id, 3);
      setScoredRound(round);
    }
  }, [addScore, complete, impostor.id, players, round, scoredRound, votedOut]);
  return (
    <GameFrame title={catalogById("impostor")!.name[lang]} gameId="impostor" progress={revealing ? (step / players.length) * 45 : 50 + (Object.keys(votes).length / players.length) * 50} onEnd={onEnd}>
      {revealing ? (
        <>
          <Badge>{t("hideBeforePass", lang)}</Badge>
          <PlayerAvatar player={current} />
          <div className="rounded-[2rem] bg-gradient-to-br from-violet-600 to-fuchsia-500 p-8 text-center text-white">
            <p className="text-sm font-black uppercase opacity-80">{current.id === impostor.id ? catalogById("impostor")!.name[lang] : pack.category[lang]}</p>
            <p className="mt-3 text-4xl font-black">{current.id === impostor.id ? pack.impostorHint[lang] : pack.secret[lang]}</p>
          </div>
          <Button variant="mystery" onClick={() => setStep(step + 1)}>{t("next", lang)}</Button>
        </>
      ) : !complete ? (
        <>
          <Badge>{t("discussion", lang)}</Badge>
          <p className="text-lg font-black">{Object.keys(votes).length}/{players.length} {t("voted", lang)}</p>
          <div className="rounded-[2rem] bg-white/70 p-4"><p className="text-sm font-black text-zinc-500">{t("vote", lang)}</p>{voter && <PlayerAvatar player={voter} />}</div>
          <div className="grid gap-3 sm:grid-cols-2">{players.map((p) => <Button key={p.id} variant="secondary" onClick={() => voter && setVotes({ ...votes, [voter.id]: p.id })}>{p.avatar} {p.name}</Button>)}</div>
        </>
      ) : (
        <>
          <div className="rounded-[2rem] bg-gradient-to-br from-zinc-950 to-violet-950 p-8 text-center text-white">
            <p className="text-sm font-black uppercase text-zinc-300">{t("reveal", lang)}</p>
            <p className="mt-2 text-3xl font-black">{players.find((p) => p.id === votedOut)?.name} vs {impostor.name}</p>
            <p className="mt-4 text-xl font-bold">{votedOut === impostor.id ? t("crewWins", lang) : t("impostorWins", lang)}</p>
          </div>
          <Button variant="mystery" icon={<Crown size={18} />} onClick={() => { setRound(round + 1); setStep(0); setVotes({}); setScoredRound(undefined); }}>{t("nextRound", lang)}</Button>
        </>
      )}
    </GameFrame>
  );
}

function QuizGame({ onEnd }: { onEnd: () => void }) {
  const lang = useAppStore((s) => s.lang);
  const players = useAppStore((s) => s.players);
  const addScore = useAppStore((s) => s.addScore);
  const [turn, setTurn] = useState(0);
  const [chosen, setChosen] = useState<number | undefined>();
  const [scored, setScored] = useState(false);
  const q = pick(quizQuestions, turn);
  const player = players.length ? pick(players, turn) : undefined;
  return (
    <GameFrame title={catalogById("tunisian-quiz")!.name[lang]} gameId="tunisian-quiz" progress={(turn % 15) * 6.6} onEnd={onEnd}>
      {player && <PlayerAvatar player={player} />}
      <Badge>{q.category[lang]}</Badge>
      <h2 className="text-3xl font-black leading-snug">{q.question[lang]}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {q.options.map((option, index) => (
          <Button key={option.en} variant={chosen === undefined ? "secondary" : index === q.answerIndex ? "success" : chosen === index ? "danger" : "secondary"} onClick={() => {
            if (chosen !== undefined) return;
            setChosen(index);
            if (index === q.answerIndex && player && !scored) { addScore(player.id, 2); setScored(true); }
          }}>{option[lang]}</Button>
        ))}
      </div>
      {chosen !== undefined && <><p className="rounded-2xl bg-white/70 p-4 font-bold text-zinc-700">{q.explanation[lang]}</p><Button onClick={() => { setChosen(undefined); setScored(false); setTurn(turn + 1); }}>{t("next", lang)}</Button></>}
    </GameFrame>
  );
}

function PlayRouter() {
  const { id } = useParams<{ id: GameId }>();
  const saveResult = useAppStore((s) => s.saveResult);
  const players = useAppStore((s) => s.players);
  const navigate = useNavigate();
  const game = catalogById(id);
  if (!game || !id) return <GameLibrary />;
  if (players.length < game.minPlayers) return <NeedPlayers game={game} />;
  storageService.setLastGame(id);
  const finish = () => { saveResult(id); navigate("/results"); };
  if (id === "would-you-rather") return <WouldRatherGame onEnd={finish} />;
  if (id === "truth-or-dare") return <TruthDareGame onEnd={finish} />;
  if (id === "guess-word") return <GuessWordGame onEnd={finish} />;
  if (id === "impostor") return <ImpostorGame onEnd={finish} />;
  return <QuizGame onEnd={finish} />;
}

function Results() {
  const lang = useAppStore((s) => s.lang);
  const players = useAppStore((s) => [...s.players].sort((a, b) => b.score - a.score));
  const history = useAppStore((s) => s.history);
  const resetScores = useAppStore((s) => s.resetScores);
  const winner = players.find((player) => player.score > 0);
  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <Card className="space-y-5 text-center">
        <Crown className="mx-auto text-amber-500" size={56} />
        <Badge>{t("results", lang)}</Badge>
        <h1 className="text-5xl font-black">{winner?.name ?? (lang === "tn" ? "ما فماش رابح بعد" : lang === "fr" ? "Pas encore de gagnant" : "No winner yet")}</h1>
        <p className="font-bold text-zinc-600">{winner ? (lang === "fr" ? "Champion de la session" : lang === "tn" ? "بطل السهرة" : "Party champion") : t("playAgain", lang)}</p>
        <div className="space-y-3 text-start">{players.map((player) => <div key={player.id} className="flex items-center justify-between rounded-3xl bg-white/80 p-4"><PlayerAvatar player={player} /><b>{player.score} pts</b></div>)}</div>
        <div className="flex flex-wrap justify-center gap-3"><Link to="/games"><Button>{t("playAgain", lang)}</Button></Link><Button variant="secondary" icon={<RotateCcw size={17} />} onClick={resetScores}>{t("clearScores", lang)}</Button></div>
      </Card>
      <Card className="space-y-3">
        <h2 className="text-2xl font-black">{t("history", lang)}</h2>
        {history.length === 0 ? <p className="font-bold text-zinc-600">{lang === "tn" ? "كمّل لعبة باش تتحفظ هنا." : lang === "fr" ? "Termine un jeu pour créer l'historique." : "End a game to save history."}</p> : history.map((item) => <div key={item.id} className="rounded-2xl bg-white/70 p-3"><p className="font-black">{catalogById(item.gameId)?.name[lang]}</p><p className="text-sm font-bold text-zinc-600">{item.winner ?? "-"} · {new Date(item.date).toLocaleDateString()}</p></div>)}
      </Card>
    </section>
  );
}

function Online() {
  const lang = useAppStore((s) => s.lang);
  return (
    <Card className="mx-auto max-w-2xl space-y-5">
      <Badge>{t("online", lang)}</Badge>
      <h1 className="text-4xl font-black">{t("onlineRooms", lang)}</h1>
      {isFirebaseConfigured ? (
        <div className="space-y-3"><input className="w-full rounded-2xl border border-zinc-200 px-4 py-3 font-bold" placeholder="email@example.com" /><input className="w-full rounded-2xl border border-zinc-200 px-4 py-3 font-bold" placeholder="Password" type="password" /><Button>{lang === "tn" ? "دخول / تسجيل" : lang === "fr" ? "Connexion / inscription" : "Login / register"}</Button></div>
      ) : (
        <>
          <div className="rounded-3xl bg-amber-100 p-5 font-bold text-amber-900"><WifiOff className="mb-2" />{t("onlineNeedsFirebase", lang)}<br />{t("localReady", lang)}</div>
          <div className="flex flex-wrap gap-3"><Link to="/players"><Button>{t("playLocallyNow", lang)}</Button></Link><a href={firebaseDocUrl} target="_blank" rel="noreferrer"><Button variant="secondary">{t("readFirebaseSetup", lang)}</Button></a><Link to="/"><Button variant="ghost">{t("backHome", lang)}</Button></Link></div>
        </>
      )}
    </Card>
  );
}

function RoomLinkPage() {
  const lang = useAppStore((s) => s.lang);
  const { roomCode } = useParams<{ roomCode: string }>();
  return <Card className="mx-auto max-w-2xl space-y-5 text-center"><Share2 className="mx-auto text-teal-500" size={54} /><Badge>{roomCode}</Badge><h1 className="text-4xl font-black">{t("onlineRooms", lang)}</h1><p className="font-bold text-zinc-700">{t("roomNeedsFirebase", lang)}</p><Link to="/online"><Button>{t("onlineRooms", lang)}</Button></Link></Card>;
}

function Settings() {
  const lang = useAppStore((s) => s.lang);
  const players = useAppStore((s) => s.players);
  return (
    <Card className="mx-auto max-w-3xl space-y-5">
      <Badge>{t("settings", lang)}</Badge>
      <h1 className="text-4xl font-black">{t("settings", lang)}</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl bg-white/70 p-4"><p className="font-black">LocalStorage</p><p className="font-semibold text-zinc-600">tfarhida.v1.* · {players.length} {t("players", lang)}</p></div>
        <div className="rounded-3xl bg-white/70 p-4"><p className="font-black">Firebase</p><p className="font-semibold text-zinc-600">{isFirebaseConfigured ? "configured" : "missing env"}</p></div>
      </div>
      <div className="flex flex-wrap gap-3"><Button variant="danger" onClick={() => { if (confirm(t("confirmReset", lang))) { storageService.clearAll(); window.location.reload(); } }}>{t("resetLocalData", lang)}</Button><Link to="/about"><Button variant="secondary">{t("about", lang)}</Button></Link></div>
    </Card>
  );
}

function About() {
  const lang = useAppStore((s) => s.lang);
  return <Card className="mx-auto max-w-4xl space-y-5"><Badge>{t("about", lang)}</Badge><h1 className="text-5xl font-black">Tfarhida</h1><p className="text-lg font-semibold leading-8 text-zinc-700">{lang === "tn" ? "Tfarhida تحل مشكلة ألعاب السهرات اللي تكون مشتتة ومش مترجمة، وتجمع mini-games تونسية في تطبيق static يخدم local ويتوسع بFirebase." : lang === "fr" ? "Tfarhida répond au besoin d'une expérience de jeux sociaux locale, culturelle et présentable: un frontend statique GitHub Pages, mode local immédiat, et architecture Firebase optionnelle." : "Tfarhida turns local party games into a polished Tunisian web app: static GitHub Pages frontend, immediate local mode, and optional Firebase online architecture."}</p><div className="grid gap-3 sm:grid-cols-3">{["React/Vite", "LocalStorage", "Firebase-ready"].map((item) => <div key={item} className="rounded-3xl bg-white/70 p-4 font-black">{item}</div>)}</div></Card>;
}

export default function App() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/players" element={<PlayerSetup />} />
        <Route path="/games" element={<GameLibrary />} />
        <Route path="/play/:id" element={<PlayRouter />} />
        <Route path="/room/:roomCode" element={<RoomLinkPage />} />
        <Route path="/results" element={<Results />} />
        <Route path="/online" element={<Online />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </PageLayout>
  );
}
