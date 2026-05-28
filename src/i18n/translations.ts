import type { Lang, LocalizedText } from "../types";

export const languages: Array<{ code: Lang; label: string; native: string; dir: "rtl" | "ltr" }> = [
  { code: "tn", label: "Derja", native: "تونسي", dir: "rtl" },
  { code: "fr", label: "Français", native: "FR", dir: "ltr" },
  { code: "en", label: "English", native: "EN", dir: "ltr" },
];

export const ui: Record<string, LocalizedText> = {
  subtitle: { tn: "Mini-jeux sociaux تونسيين", fr: "Mini-jeux sociaux tunisiens", en: "Tunisian social mini-games" },
  startLocal: { tn: "إبدا سهرة محلية", fr: "Démarrer en local", en: "Start local party" },
  online: { tn: "ألعب أونلاين", fr: "Jouer en ligne", en: "Play online" },
  games: { tn: "الألعاب", fr: "Jeux", en: "Games" },
  players: { tn: "اللاعبين", fr: "Joueurs", en: "Players" },
  addPlayer: { tn: "زيد لاعب", fr: "Ajouter", en: "Add player" },
  namePlaceholder: { tn: "إسم اللاعب", fr: "Nom du joueur", en: "Player name" },
  play: { tn: "ألعب", fr: "Jouer", en: "Play" },
  rules: { tn: "القوانين", fr: "Règles", en: "Rules" },
  settings: { tn: "الإعدادات", fr: "Paramètres", en: "Settings" },
  about: { tn: "حول المشروع", fr: "À propos", en: "About" },
  scoreboard: { tn: "السكور", fr: "Scores", en: "Scoreboard" },
  results: { tn: "النتائج", fr: "Résultats", en: "Results" },
  backHome: { tn: "للدار", fr: "Accueil", en: "Home" },
  chooseGame: { tn: "إختار لعبة", fr: "Choisir un jeu", en: "Choose a game" },
  needPlayers: { tn: "لازم زوز لاعبين على الأقل.", fr: "Il faut au moins deux joueurs.", en: "At least two players are required." },
  done: { tn: "تم", fr: "Fait", en: "Done" },
  skip: { tn: "فوت", fr: "Passer", en: "Skip" },
  next: { tn: "التالي", fr: "Suivant", en: "Next" },
  reveal: { tn: "إكشف", fr: "Révéler", en: "Reveal" },
  vote: { tn: "صوّت", fr: "Voter", en: "Vote" },
  correct: { tn: "صحيح", fr: "Correct", en: "Correct" },
  wrong: { tn: "غلط", fr: "Faux", en: "Wrong" },
  finish: { tn: "كمّل اللعبة", fr: "Terminer", en: "Finish game" },
  playAgain: { tn: "عاود ألعب", fr: "Rejouer", en: "Play again" },
  onlineNeedsFirebase: {
    tn: "الأونلاين يحتاج Firebase configuration.",
    fr: "Le mode en ligne nécessite une configuration Firebase.",
    en: "Online mode needs Firebase configuration.",
  },
  localReady: { tn: "المود المحلي يخدم توّة بلا كونت.", fr: "Le mode local fonctionne sans compte.", en: "Local mode works without an account." },
};

export const t = (key: keyof typeof ui, lang: Lang) => ui[key][lang];
