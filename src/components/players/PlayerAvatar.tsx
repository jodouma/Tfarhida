import type { Player } from "../../types";

export function PlayerAvatar({ player, compact = false }: { player: Player; compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`${compact ? "h-10 w-10 text-xl" : "h-14 w-14 text-3xl"} grid shrink-0 place-items-center rounded-2xl text-white shadow-lg`} style={{ background: player.color }}>
        {player.avatar}
      </div>
      <div className="min-w-0">
        <p className="truncate font-black text-zinc-950">{player.name}</p>
        <p className="text-xs font-bold text-zinc-500">{player.score} pts</p>
      </div>
    </div>
  );
}
