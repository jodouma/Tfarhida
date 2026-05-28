import { Info, Play } from "lucide-react";
import type { GameMeta, Lang } from "../../types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export function GameCard({ game, lang, onPlay, onRules }: { game: GameMeta; lang: Lang; onPlay: () => void; onRules: () => void }) {
  return (
    <Card className="group overflow-hidden p-0">
      <div className="relative h-40 overflow-hidden rounded-t-[2rem]">
        <img src={game.image} alt={game.name[lang]} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-55 mix-blend-multiply`} />
        <div className="absolute left-4 top-4 text-4xl">{game.icon}</div>
        <Badge className="absolute bottom-4 right-4">{game.players}</Badge>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="text-xl font-black text-zinc-950">{game.name[lang]}</h3>
            <Badge>{game.vibe[lang]}</Badge>
          </div>
          <p className="text-sm font-semibold leading-6 text-zinc-600">{game.short[lang]}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={onPlay} icon={<Play size={17} />}>Play</Button>
          <Button variant="secondary" onClick={onRules} icon={<Info size={17} />}>Rules</Button>
        </div>
      </div>
    </Card>
  );
}
