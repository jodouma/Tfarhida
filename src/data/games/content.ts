import type { GameMeta, GuessWord, ImpostorPack, QuizQuestion, TruthDarePrompt, WouldQuestion } from "../../types";

const img = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

export const gameCatalog: GameMeta[] = [
  {
    id: "impostor",
    name: { tn: "شكون الدخيل؟", fr: "Qui est l'imposteur ?", en: "Who's the Impostor?" },
    short: { tn: "كلمة سرية، برشة شك، وتصويت في الآخر.", fr: "Un mot secret, du bluff et un vote final.", en: "A secret word, bluffing, then a final vote." },
    vibe: { tn: "غموض", fr: "Mystère", en: "Mystery" },
    players: "3+",
    minPlayers: 3,
    duration: { tn: "8-12 دق", fr: "8-12 min", en: "8-12 min" },
    color: "from-violet-600 to-fuchsia-500",
    icon: "🕵️",
    image: img("app/games/game-impostor.jpg"),
  },
  {
    id: "truth-or-dare",
    name: { tn: "صراحة ولا تحدّي", fr: "Action ou Vérité", en: "Truth or Dare" },
    short: { tn: "أسئلة وتحديات خفيفة للصحاب والعائلة.", fr: "Questions et défis safe pour animer le groupe.", en: "Safe prompts and dares for the whole group." },
    vibe: { tn: "ضحك", fr: "Fun", en: "Fun" },
    players: "2+",
    minPlayers: 2,
    duration: { tn: "5-10 دق", fr: "5-10 min", en: "5-10 min" },
    color: "from-rose-500 to-orange-400",
    icon: "🎲",
    image: img("app/games/game-truth-or-dare.jpg"),
  },
  {
    id: "would-you-rather",
    name: { tn: "تختار شنوّة؟", fr: "Tu préfères ?", en: "Would You Rather?" },
    short: { tn: "زوز اختيارات، الكل يصوّت، والنتيجة تخرج.", fr: "Deux choix, tout le monde vote, les stats parlent.", en: "Two choices, everyone votes, stats decide." },
    vibe: { tn: "تصويت", fr: "Vote", en: "Vote" },
    players: "2+",
    minPlayers: 2,
    duration: { tn: "4-8 دق", fr: "4-8 min", en: "4-8 min" },
    color: "from-amber-400 to-pink-500",
    icon: "⚖️",
    image: img("app/games/game-would-you-rather.jpg"),
  },
  {
    id: "guess-word",
    name: { tn: "إحزر الكلمة", fr: "Devine le mot", en: "Guess the Word" },
    short: { tn: "فسّر الكلمة من غير ما تقول الكلمات الممنوعة.", fr: "Fais deviner sans dire les mots interdits.", en: "Explain the word without saying taboo clues." },
    vibe: { tn: "سرعة", fr: "Rapide", en: "Fast" },
    players: "2+",
    minPlayers: 2,
    duration: { tn: "6-10 دق", fr: "6-10 min", en: "6-10 min" },
    color: "from-cyan-500 to-teal-400",
    icon: "💬",
    image: img("app/games/game-guess-word.jpg"),
  },
  {
    id: "tunisian-quiz",
    name: { tn: "كويز تونسي", fr: "Quiz culturel tunisien", en: "Tunisian Culture Quiz" },
    short: { tn: "ماكلة، مدن، لهجة، تاريخ وكورة.", fr: "Cuisine, villes, dialecte, histoire et foot.", en: "Food, cities, dialect, history and football." },
    vibe: { tn: "ثقافة", fr: "Culture", en: "Culture" },
    players: "1+",
    minPlayers: 1,
    duration: { tn: "5-9 دق", fr: "5-9 min", en: "5-9 min" },
    color: "from-emerald-500 to-sky-500",
    icon: "🇹🇳",
    image: img("app/games/game-quiz.jpg"),
  },
];

const wouldSeeds = [
  ["كسكروت كفتاجي سخون", "لبلابي في الشتاء", "Un sandwich kefteji chaud", "Un lablabi en hiver", "A hot kefteji sandwich", "Lablabi in winter"],
  ["سهرة في سيدي بوسعيد", "خرجة للمدينة العربي", "Une soirée à Sidi Bou Saïd", "Une sortie à la médina", "A night in Sidi Bou Said", "A medina walk"],
  ["تسمع مزود عام كامل", "تسمع راب تونسي عام كامل", "Écouter du mezoued toute l'année", "Écouter du rap tunisien toute l'année", "Only mezoued for a year", "Only Tunisian rap for a year"],
  ["تقرا بكري كل نهار", "تفيق بكري كل نهار", "Étudier tôt chaque jour", "Se réveiller tôt chaque jour", "Study early every day", "Wake early every day"],
  ["ديما عندك كعبة بريك", "ديما عندك كاس تاي", "Avoir toujours un brik", "Avoir toujours un thé", "Always have a brik", "Always have mint tea"],
  ["تربح ماتش بلا جول", "تربح كويز بلا غلطة", "Gagner un match sans but", "Gagner un quiz sans faute", "Win a match with no goal", "Win a quiz perfectly"],
  ["تعيش في الحمامات", "تعيش في طبرقة", "Vivre à Hammamet", "Vivre à Tabarka", "Live in Hammamet", "Live in Tabarka"],
  ["تكون DJ في عرس", "تكون photographe في عرس", "Être DJ dans un mariage", "Être photographe dans un mariage", "Be the wedding DJ", "Be the wedding photographer"],
  ["تاكل مقرونة كل نهار", "تاكل روز جربي كل نهار", "Manger des pâtes chaque jour", "Manger du riz djerbien chaque jour", "Eat pasta daily", "Eat Djerbian rice daily"],
  ["تعرف كل أمثال جدتك", "تعرف كل memes صحابك", "Connaître tous les proverbes de ta grand-mère", "Connaître tous les memes de tes amis", "Know every grandma proverb", "Know every friend meme"],
];

export const wouldQuestions: WouldQuestion[] = Array.from({ length: 30 }, (_, i) => {
  const s = wouldSeeds[i % wouldSeeds.length];
  return { id: `wyr_${i + 1}`, a: { tn: s[0], fr: s[2], en: s[4] }, b: { tn: s[1], fr: s[3], en: s[5] } };
});

const promptBase: Array<[TruthDarePrompt["kind"], TruthDarePrompt["level"], string, string, string]> = [
  ["truth", "family", "قول عادة تونسية تحبها برشة.", "Dis une tradition tunisienne que tu aimes beaucoup.", "Name a Tunisian tradition you love."],
  ["truth", "friends", "شكون أكثر واحد يضحكك في القروب؟", "Qui te fait le plus rire dans le groupe ?", "Who makes you laugh the most here?"],
  ["truth", "university", "شنوّة matière كنت تحب تفوتها؟", "Quelle matière voulais-tu toujours sécher ?", "Which class did you always want to skip?"],
  ["truth", "spicy-soft", "قول موقف عملت فيه روحك فاهم وإنت ضايع.", "Raconte un moment où tu as fait semblant de comprendre.", "Tell a time you pretended to understand."],
  ["dare", "family", "قل مثل تونسي بصوت مذيع.", "Dis un proverbe tunisien avec une voix de présentateur.", "Say a Tunisian proverb like a TV host."],
  ["dare", "friends", "قلّد واحد معروف في القروب بلطف.", "Imite gentiment quelqu'un du groupe.", "Kindly imitate someone in the group."],
  ["dare", "university", "اعمل pitch لمشروع PFE في 20 ثانية.", "Fais le pitch d'un PFE en 20 secondes.", "Pitch a final-year project in 20 seconds."],
  ["dare", "spicy-soft", "غنّي 10 ثواني من أغنية تونسية.", "Chante 10 secondes d'une chanson tunisienne.", "Sing 10 seconds of a Tunisian song."],
];

export const truthDarePrompts: TruthDarePrompt[] = Array.from({ length: 40 }, (_, i) => {
  const [kind, level, tn, fr, en] = promptBase[i % promptBase.length];
  return { id: `td_${i + 1}`, kind, level, text: { tn, fr, en } };
});

const wordSeeds = [
  ["ماكلة", "Cuisine", "Food", "بريك", "Brik", "Brik", ["عظمة", "thon", "frit"]],
  ["مدن", "Villes", "Cities", "سوسة", "Sousse", "Sousse", ["بحر", "رباط", "ساحل"]],
  ["جامعة", "Université", "University", "رابور", "Rapport", "Report", ["PFE", "page", "prof"]],
  ["كورة", "Football", "Football", "دربي", "Derby", "Derby", ["ماتش", "ترجي", "إفريقي"]],
  ["ثقافة", "Culture", "Culture", "مالوف", "Malouf", "Malouf", ["موسيقى", "أندلسي", "عود"]],
  ["حياة يومية", "Vie quotidienne", "Daily life", "تاكسي جماعي", "Taxi collectif", "Shared taxi", ["لواج", "طريق", "بلاصة"]],
  ["تقاليد", "Traditions", "Traditions", "حنة", "Henné", "Henna", ["عرس", "يد", "فرح"]],
  ["لهجة", "Dialecte", "Dialect", "برشا", "Barsha", "A lot", ["كثير", "تونسي", "كلمة"]],
];

export const guessWords: GuessWord[] = Array.from({ length: 40 }, (_, i) => {
  const s = wordSeeds[i % wordSeeds.length];
  return {
    id: `gw_${i + 1}`,
    category: { tn: s[0] as string, fr: s[1] as string, en: s[2] as string },
    word: { tn: s[3] as string, fr: s[4] as string, en: s[5] as string },
    taboo: (s[6] as string[]).map((x) => ({ tn: x, fr: x, en: x })),
  };
});

const impostorSeeds = [
  ["ماكلة", "Cuisine", "Food", "كسكسي", "Couscous", "Couscous", "حاجة تتلمّ عليها العائلة", "Un plat familial", "A family dish"],
  ["بلايص", "Lieux", "Places", "سيدي بوسعيد", "Sidi Bou Saïd", "Sidi Bou Said", "أزرق وأبيض", "Bleu et blanc", "Blue and white"],
  ["جامعة", "Université", "University", "سوتنانس", "Soutenance", "Defense", "نهار التقديم", "Jour de présentation", "Presentation day"],
  ["كورة", "Football", "Football", "حارس مرمى", "Gardien", "Goalkeeper", "آخر واحد يوقف", "Le dernier rempart", "The last defender"],
  ["موسيقى", "Musique", "Music", "مزود", "Mezoued", "Mezoued", "إيقاع تونسي", "Rythme tunisien", "Tunisian rhythm"],
  ["تقليد", "Tradition", "Tradition", "عرس تونسي", "Mariage tunisien", "Tunisian wedding", "فرحة كبيرة", "Grande fête", "Big celebration"],
];

export const impostorPacks: ImpostorPack[] = Array.from({ length: 30 }, (_, i) => {
  const s = impostorSeeds[i % impostorSeeds.length];
  return { id: `imp_${i + 1}`, category: { tn: s[0], fr: s[1], en: s[2] }, secret: { tn: s[3], fr: s[4], en: s[5] }, impostorHint: { tn: s[6], fr: s[7], en: s[8] } };
});

const quizSeeds = [
  ["ماكلة", "شنوّة أصل اللبلابي؟", "Quelle est la base du lablabi ?", "What is lablabi mainly made from?", ["حمص", "روز", "سميد", "عدس"], 0, "اللبلابي يتعمل أساسا بالحمص والخبز.", "Le lablabi est surtout à base de pois chiches.", "Lablabi is mainly chickpea-based."],
  ["مدن", "قرطاج قريبة من أي مدينة كبرى؟", "Carthage est proche de quelle grande ville ?", "Carthage is near which major city?", ["تونس", "صفاقس", "قابس", "الكاف"], 0, "قرطاج في الضاحية الشمالية لتونس.", "Carthage est dans la banlieue nord de Tunis.", "Carthage is in Tunis's northern suburbs."],
  ["لهجة", "كلمة برشا معناها؟", "Que veut dire barsha ?", "What does barsha mean?", ["كثير", "قليل", "غدوة", "باهي"], 0, "برشا من أشهر كلمات الدارجة.", "Barsha veut dire beaucoup.", "Barsha means a lot."],
  ["تقاليد", "الحنة ترتبط عادة ب؟", "Le henné est souvent associé à ?", "Henna is often linked to?", ["الأعراس", "الامتحانات", "الماتشات", "السفر"], 0, "الحنة حاضرة في برشة مناسبات.", "Le henné est présent dans plusieurs fêtes.", "Henna appears in many celebrations."],
  ["كورة", "شنوّة الرياضة الشعبية الأولى؟", "Quel sport est le plus populaire ?", "Which sport is most popular?", ["كرة القدم", "كرة اليد", "تنس", "سباحة"], 0, "الكورة عندها جمهور كبير في تونس.", "Le football a un grand public en Tunisie.", "Football has a huge Tunisian following."],
  ["تاريخ", "قرطاج ارتبطت باسم؟", "Carthage est associée à quel nom ?", "Carthage is associated with which name?", ["حنبعل", "نابليون", "قيصر", "أديسون"], 0, "حنبعل من أشهر قادة قرطاج.", "Hannibal est un grand nom de Carthage.", "Hannibal is a famous Carthaginian leader."],
  ["موسيقى", "المالوف موسيقى ذات جذور؟", "Le malouf a des racines ?", "Malouf has roots in?", ["أندلسية", "يابانية", "إسكندنافية", "لاتينية"], 0, "المالوف مرتبط بالتراث الأندلسي.", "Le malouf est lié au patrimoine andalou.", "Malouf is tied to Andalusian heritage."],
  ["حياة يومية", "اللواج هو؟", "Le louage est ?", "A louage is?", ["نقل جماعي", "حلويات", "لباس", "آلة موسيقية"], 0, "اللواج وسيلة نقل بين المدن.", "Le louage relie souvent les villes.", "Louages often connect cities."],
];

export const quizQuestions: QuizQuestion[] = Array.from({ length: 40 }, (_, i) => {
  const s = quizSeeds[i % quizSeeds.length];
  return {
    id: `quiz_${i + 1}`,
    category: { tn: s[0] as string, fr: s[0] as string, en: s[0] as string },
    question: { tn: s[1] as string, fr: s[2] as string, en: s[3] as string },
    options: (s[4] as string[]).map((x) => ({ tn: x, fr: x, en: x })),
    answerIndex: s[5] as number,
    explanation: { tn: s[6] as string, fr: s[7] as string, en: s[8] as string },
  };
});
