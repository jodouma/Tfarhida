import { useMemo, useState, type ReactNode } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Crown, LogIn, Plus, RotateCcw, Trash2, Users, WifiOff, X } from "lucide-react";
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
import type { GameId, Lang, LocalizedText } from "./types";

const pick = <T,>(items: T[], index: number) => items[index % items.length];
const tx = (value: LocalizedText, lang: Lang) => value[lang];

function Home() {
  const lang = useAppStore((s) => s.lang);
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
            ? "سهرة تونسية في جيبك: إلعب مع صحابك، صوت، إكشف الدخيل، واجمع السكور بلا backend."
            : lang === "fr"
              ? "Une expérience de mini-jeux tunisiens sociale, responsive et prête pour GitHub Pages."
              : "A polished Tunisian mini-games party app, responsive and ready for GitHub Pages."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/players"><Button icon={<Users size={18} />}>{t("startLocal", lang)}</Button></Link>
          <Link to="/online"><Button variant="secondary" icon={<LogIn size={18} />}>{t("online", lang)}</Button></Link>
          <Link to="/games"><Button variant="ghost">{t("chooseGame", lang)}</Button></Link>
        </div>
      </motion.div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {gameCatalog.slice(0, 3).map((game) => (
          <Card key={game.id} className="overflow-hidden p-0">
            <div className="flex items-center gap-4 p-4">
              <img src={game.image} alt={game.name[lang]} className="h-24 w-24 rounded-3xl object-cover" />
              <div>
                <p className="text-3xl">{game.icon}</p>
                <h2 className="text-xl font-black">{game.name[lang]}</h2>
                <p className="text-sm font-semibold text-zinc-600">{game.vibe[lang]} · {game.players}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function PlayerSetup() {
  const lang = useAppStore((s) => s.lang);
  const players = useAppStore((s) => s.players);
  const addPlayer = useAppStore((s) => s.addPlayer);
  const updatePlayer = useAppStore((s) => s.updatePlayer);
  const removePlayer = useAppStore((s) => s.removePlayer);
  const [name, setName] = useState("");
  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <Card className="space-y-5">
        <div>
          <Badge>{t("localReady", lang)}</Badge>
          <h1 className="mt-3 text-4xl font-black">{t("players", lang)}</h1>
        </div>
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            addPlayer(name.trim());
            setName("");
          }}
        >
          <input className="min-h-12 flex-1 rounded-2xl border border-zinc-200 bg-white px-4 font-bold outline-none focus:ring-4 focus:ring-orange-200" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("namePlaceholder", lang)} />
          <Button type="submit" icon={<Plus size={18} />}>{t("addPlayer", lang)}</Button>
        </form>
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
      </Card>
      <div className="space-y-4">
        <Scoreboard />
        <Link to="/games"><Button className="w-full" disabled={players.length < 2}>{t("chooseGame", lang)}</Button></Link>
        {players.length < 2 && <p className="text-sm font-bold text-red-600">{t("needPlayers", lang)}</p>}
      </div>
    </section>
  );
}

function GameLibrary() {
  const lang = useAppStore((s) => s.lang);
  const [rules, setRules] = useState<GameId | undefined>();
  const navigate = useNavigate();
  const ruleGame = gameCatalog.find((g) => g.id === rules);
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
        {gameCatalog.map((game) => <GameCard key={game.id} game={game} lang={lang} onPlay={() => navigate(`/play/${game.id}`)} onRules={() => setRules(game.id)} />)}
      </div>
      <Modal open={Boolean(ruleGame)} title={ruleGame?.name[lang] ?? ""} onClose={() => setRules(undefined)}>
        <p className="text-base font-semibold leading-8 text-zinc-700">
          {lang === "tn"
            ? "كل لعبة فيها شرح بسيط، تقدم واضح، أزرار كبار، وسكور في الآخر. إلعبوا باحترام وخليو الضحك خفيف."
            : lang === "fr"
              ? "Chaque jeu contient des règles simples, une progression claire, de gros boutons et un résultat final. Jouez avec respect."
              : "Each game has simple rules, clear progress, big controls, and final results. Keep it respectful and fun."}
        </p>
      </Modal>
    </>
  );
}

function GameFrame({ title, children, progress }: { title: string; children: ReactNode; progress: number }) {
  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <Card className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link to="/games" className="inline-flex items-center gap-1 text-sm font-black text-zinc-600"><ArrowLeft size={16} /> Games</Link>
            <h1 className="mt-2 text-3xl font-black">{title}</h1>
          </div>
          <Badge>{Math.round(progress)}%</Badge>
        </div>
        <ProgressBar value={progress} />
        {children}
      </Card>
      <Scoreboard />
    </section>
  );
}

function WouldRatherGame() {
  const lang = useAppStore((s) => s.lang);
  const players = useAppStore((s) => s.players);
  const addScore = useAppStore((s) => s.addScore);
  const [round, setRound] = useState(0);
  const [votes, setVotes] = useState<Record<string, "a" | "b">>({});
  const q = pick(wouldQuestions, round);
  const complete = Object.keys(votes).length >= players.length;
  return (
    <GameFrame title={gameCatalog[2].name[lang]} progress={(round / 8) * 100}>
      <div className="grid gap-4 sm:grid-cols-2">
        {(["a", "b"] as const).map((side) => (
          <button key={side} className="rounded-[2rem] bg-white p-6 text-2xl font-black shadow-lg ring-1 ring-zinc-100 transition hover:-translate-y-1 hover:ring-orange-300" onClick={() => {
            const voter = players[Object.keys(votes).length];
            if (voter) setVotes({ ...votes, [voter.id]: side });
          }}>
            {tx(q[side], lang)}
          </button>
        ))}
      </div>
      <p className="font-bold text-zinc-600">{players[Object.keys(votes).length]?.name ?? t("results", lang)} {complete ? "" : "votes now"}</p>
      {complete && <Button onClick={() => {
        const a = Object.values(votes).filter((v) => v === "a").length;
        const winners = players.filter((p) => votes[p.id] === (a >= players.length - a ? "a" : "b"));
        winners.forEach((p) => addScore(p.id, 1));
        setVotes({});
        setRound(round + 1);
      }}>{t("next", lang)}</Button>}
    </GameFrame>
  );
}

function TruthDareGame() {
  const lang = useAppStore((s) => s.lang);
  const players = useAppStore((s) => s.players);
  const addScore = useAppStore((s) => s.addScore);
  const [turn, setTurn] = useState(0);
  const [kind, setKind] = useState<"truth" | "dare">("truth");
  const prompts = truthDarePrompts.filter((p) => p.kind === kind);
  const prompt = pick(prompts, turn);
  const player = pick(players, turn);
  return (
    <GameFrame title={gameCatalog[1].name[lang]} progress={(turn / 12) * 100}>
      <PlayerAvatar player={player} />
      <div className="flex gap-3"><Button variant={kind === "truth" ? "primary" : "secondary"} onClick={() => setKind("truth")}>Truth</Button><Button variant={kind === "dare" ? "primary" : "secondary"} onClick={() => setKind("dare")}>Dare</Button></div>
      <div className="rounded-[2rem] bg-gradient-to-br from-rose-500 to-orange-400 p-8 text-3xl font-black leading-snug text-white shadow-glow">{prompt.text[lang]}</div>
      <div className="flex gap-3"><Button variant="success" icon={<Check size={18} />} onClick={() => { addScore(player.id, 2); setTurn(turn + 1); }}>{t("done", lang)}</Button><Button variant="secondary" icon={<X size={18} />} onClick={() => setTurn(turn + 1)}>{t("skip", lang)}</Button></div>
    </GameFrame>
  );
}

function GuessWordGame() {
  const lang = useAppStore((s) => s.lang);
  const players = useAppStore((s) => s.players);
  const addScore = useAppStore((s) => s.addScore);
  const [turn, setTurn] = useState(0);
  const [running, setRunning] = useState(false);
  const word = pick(guessWords, turn);
  const player = pick(players, turn);
  return (
    <GameFrame title={gameCatalog[3].name[lang]} progress={(turn / 15) * 100}>
      <div className="flex flex-wrap items-center justify-between gap-3"><PlayerAvatar player={player} /><Timer seconds={45} running={running} onDone={() => setRunning(false)} /></div>
      <Badge>{word.category[lang]}</Badge>
      <div className="rounded-[2rem] bg-gradient-to-br from-cyan-500 to-teal-400 p-8 text-center text-5xl font-black text-white">{word.word[lang]}</div>
      <div className="flex flex-wrap gap-2">{word.taboo.map((x) => <Badge key={x.en}>{x[lang]}</Badge>)}</div>
      <div className="flex gap-3"><Button onClick={() => setRunning(true)}>Start</Button><Button variant="success" onClick={() => { addScore(player.id, 1); setTurn(turn + 1); setRunning(false); }}>{t("correct", lang)}</Button><Button variant="secondary" onClick={() => setTurn(turn + 1)}>{t("skip", lang)}</Button></div>
    </GameFrame>
  );
}

function ImpostorGame() {
  const lang = useAppStore((s) => s.lang);
  const players = useAppStore((s) => s.players);
  const addScore = useAppStore((s) => s.addScore);
  const [round, setRound] = useState(0);
  const [step, setStep] = useState(0);
  const [votes, setVotes] = useState<Record<string, string>>({});
  const pack = pick(impostorPacks, round);
  const impostor = useMemo(() => players[round % Math.max(players.length, 1)], [players, round]);
  const current = players[step];
  const revealing = step < players.length;
  const votedOut = Object.values(votes).sort((a, b) => Object.values(votes).filter((v) => v === b).length - Object.values(votes).filter((v) => v === a).length)[0];
  return (
    <GameFrame title={gameCatalog[0].name[lang]} progress={revealing ? (step / players.length) * 40 : 65 + (Object.keys(votes).length / players.length) * 35}>
      {revealing ? (
        <>
          <PlayerAvatar player={current} />
          <div className="rounded-[2rem] bg-gradient-to-br from-violet-600 to-fuchsia-500 p-8 text-center text-white">
            <p className="text-sm font-black uppercase opacity-80">{current.id === impostor.id ? "Impostor" : pack.category[lang]}</p>
            <p className="mt-3 text-4xl font-black">{current.id === impostor.id ? pack.impostorHint[lang] : pack.secret[lang]}</p>
          </div>
          <Button onClick={() => setStep(step + 1)}>{t("next", lang)}</Button>
        </>
      ) : Object.keys(votes).length < players.length ? (
        <>
          <p className="text-lg font-black">{pick(players, Object.keys(votes).length).name} {t("vote", lang)}</p>
          <div className="grid gap-3 sm:grid-cols-2">{players.map((p) => <Button key={p.id} variant="secondary" onClick={() => setVotes({ ...votes, [pick(players, Object.keys(votes).length).id]: p.id })}>{p.avatar} {p.name}</Button>)}</div>
        </>
      ) : (
        <>
          <div className="rounded-[2rem] bg-zinc-950 p-8 text-center text-white">
            <p className="text-sm font-black uppercase text-zinc-400">Reveal</p>
            <p className="mt-2 text-3xl font-black">{players.find((p) => p.id === votedOut)?.name} vs {impostor.name}</p>
            <p className="mt-4 text-xl font-bold">{votedOut === impostor.id ? "Crew wins!" : "Impostor wins!"}</p>
          </div>
          <Button icon={<Crown size={18} />} onClick={() => {
            if (votedOut === impostor.id) players.filter((p) => p.id !== impostor.id).forEach((p) => addScore(p.id, 2));
            else addScore(impostor.id, 3);
            setRound(round + 1); setStep(0); setVotes({});
          }}>{t("next", lang)}</Button>
        </>
      )}
    </GameFrame>
  );
}

function QuizGame() {
  const lang = useAppStore((s) => s.lang);
  const players = useAppStore((s) => s.players);
  const addScore = useAppStore((s) => s.addScore);
  const [turn, setTurn] = useState(0);
  const [chosen, setChosen] = useState<number | undefined>();
  const q = pick(quizQuestions, turn);
  const player = pick(players, turn);
  return (
    <GameFrame title={gameCatalog[4].name[lang]} progress={(turn / 15) * 100}>
      <PlayerAvatar player={player} />
      <Badge>{q.category[lang]}</Badge>
      <h2 className="text-3xl font-black leading-snug">{q.question[lang]}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {q.options.map((option, index) => (
          <Button key={option.en} variant={chosen === undefined ? "secondary" : index === q.answerIndex ? "success" : chosen === index ? "danger" : "secondary"} onClick={() => {
            setChosen(index);
            if (index === q.answerIndex) addScore(player.id, 2);
          }}>{option[lang]}</Button>
        ))}
      </div>
      {chosen !== undefined && <><p className="rounded-2xl bg-white/70 p-4 font-bold text-zinc-700">{q.explanation[lang]}</p><Button onClick={() => { setChosen(undefined); setTurn(turn + 1); }}>{t("next", lang)}</Button></>}
    </GameFrame>
  );
}

function PlayRouter() {
  const { id } = useParams<{ id: GameId }>();
  const saveResult = useAppStore((s) => s.saveResult);
  const navigate = useNavigate();
  const lang = useAppStore((s) => s.lang);
  const players = useAppStore((s) => s.players);
  if (players.length < 2 && id !== "tunisian-quiz") return <Card><p className="font-bold text-red-600">{t("needPlayers", lang)}</p><Link to="/players"><Button className="mt-4">{t("players", lang)}</Button></Link></Card>;
  const content = id === "would-you-rather" ? <WouldRatherGame /> : id === "truth-or-dare" ? <TruthDareGame /> : id === "guess-word" ? <GuessWordGame /> : id === "impostor" ? <ImpostorGame /> : id === "tunisian-quiz" ? <QuizGame /> : <GameLibrary />;
  return <div className="space-y-4">{content}<div className="flex justify-end"><Button variant="danger" onClick={() => { saveResult(id ?? "impostor"); navigate("/results"); }}>{t("finish", lang)}</Button></div></div>;
}

function Results() {
  const lang = useAppStore((s) => s.lang);
  const players = useAppStore((s) => [...s.players].sort((a, b) => b.score - a.score));
  const resetScores = useAppStore((s) => s.resetScores);
  return (
    <section className="mx-auto max-w-3xl">
      <Card className="space-y-5 text-center">
        <Crown className="mx-auto text-amber-500" size={56} />
        <Badge>{t("results", lang)}</Badge>
        <h1 className="text-5xl font-black">{players[0]?.name}</h1>
        <p className="font-bold text-zinc-600">{lang === "fr" ? "Champion de la session" : lang === "tn" ? "بطل السهرة" : "Party champion"}</p>
        <div className="space-y-3 text-start">{players.map((player) => <div key={player.id} className="flex items-center justify-between rounded-3xl bg-white/80 p-4"><PlayerAvatar player={player} /><b>{player.score} pts</b></div>)}</div>
        <div className="flex justify-center gap-3"><Link to="/games"><Button>{t("playAgain", lang)}</Button></Link><Button variant="secondary" icon={<RotateCcw size={17} />} onClick={resetScores}>Reset</Button></div>
      </Card>
    </section>
  );
}

function Online() {
  const lang = useAppStore((s) => s.lang);
  return (
    <Card className="mx-auto max-w-2xl space-y-5">
      <Badge>{t("online", lang)}</Badge>
      <h1 className="text-4xl font-black">Firebase Rooms</h1>
      {isFirebaseConfigured ? (
        <div className="space-y-3"><input className="w-full rounded-2xl border border-zinc-200 px-4 py-3 font-bold" placeholder="email@example.com" /><input className="w-full rounded-2xl border border-zinc-200 px-4 py-3 font-bold" placeholder="Password" type="password" /><Button>Create / Login</Button></div>
      ) : (
        <div className="rounded-3xl bg-amber-100 p-5 font-bold text-amber-900"><WifiOff className="mb-2" />{t("onlineNeedsFirebase", lang)}<br />{t("localReady", lang)}</div>
      )}
    </Card>
  );
}

function Settings() {
  const lang = useAppStore((s) => s.lang);
  return <Card className="mx-auto max-w-2xl space-y-4"><Badge>{t("settings", lang)}</Badge><h1 className="text-4xl font-black">{t("settings", lang)}</h1><p className="font-semibold text-zinc-700">LocalStorage namespace: <code>tfarhida.v1.*</code></p><p className="font-semibold text-zinc-700">Firebase: {isFirebaseConfigured ? "configured" : "missing env"}</p></Card>;
}

function About() {
  const lang = useAppStore((s) => s.lang);
  return <Card className="mx-auto max-w-3xl space-y-4"><Badge>{t("about", lang)}</Badge><h1 className="text-4xl font-black">Tfarhida</h1><p className="text-lg font-semibold leading-8 text-zinc-700">Projet PFE/PFA: application React statique, multilingue, responsive, avec mode local immédiat et architecture Firebase optionnelle pour comptes et salles temps réel.</p></Card>;
}

export default function App() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/players" element={<PlayerSetup />} />
        <Route path="/games" element={<GameLibrary />} />
        <Route path="/play/:id" element={<PlayRouter />} />
        <Route path="/results" element={<Results />} />
        <Route path="/online" element={<Online />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </PageLayout>
  );
}
