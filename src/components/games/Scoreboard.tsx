import { Trophy } from "lucide-react";
import { useAppStore } from "../../app/store";
import { PlayerAvatar } from "../players/PlayerAvatar";
import { Card } from "../ui/Card";

export function Scoreboard() {
  const players = useAppStore((s) => [...s.players].sort((a, b) => b.score - a.score));
  return (
    <Card className="space-y-3">
      <div className="flex items-center gap-2 text-lg font-black text-zinc-950"><Trophy className="text-amber-500" /> Scoreboard</div>
      {players.map((player, index) => (
        <div key={player.id} className="flex items-center justify-between rounded-2xl bg-white/70 p-3">
          <PlayerAvatar player={player} compact />
          <span className="text-xl font-black text-zinc-900">#{index + 1}</span>
        </div>
      ))}
    </Card>
  );
}
