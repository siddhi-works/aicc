"use client";
import * as React from "react";
import { Chess } from "chess.js";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { Board, type BoardCell } from "@/components/chess/board";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const noop = () => {};

/** Animated, step-through replay of a list of SAN moves from an optional start FEN. */
export function Replay({
  moves,
  fen,
  autoplay = false,
  className,
}: {
  moves: string[];
  fen?: string;
  autoplay?: boolean;
  className?: string;
}) {
  const [idx, setIdx] = React.useState(0);
  const [playing, setPlaying] = React.useState(autoplay);

  const { chess, hist } = React.useMemo(() => {
    const c = fen ? new Chess(fen) : new Chess();
    for (const m of moves.slice(0, idx)) c.move(m);
    return { chess: c, hist: c.history({ verbose: true }) };
  }, [moves, fen, idx]);

  React.useEffect(() => {
    if (!playing) return;
    if (idx >= moves.length) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setIdx((i) => i + 1), 1100);
    return () => clearTimeout(id);
  }, [playing, idx, moves.length]);

  const last = hist[hist.length - 1];
  const done = idx >= moves.length;
  const startMove = fen ? Number(fen.split(" ")[5] ?? 1) : 1;
  const startsBlack = fen?.split(" ")[1] === "b";

  const label = (i: number) => {
    const ply = i + (startsBlack ? 1 : 0);
    return `${startMove + Math.floor(ply / 2)}${ply % 2 ? "…" : "."}`;
  };

  const checkSquare = chess.inCheck()
    ? chess.board().flat().find((c) => c && c.type === "k" && c.color === chess.turn())?.square ?? null
    : null;

  return (
    <div className={cn("space-y-3", className)}>
      <Board
        board={chess.board() as BoardCell[][]}
        orientation="w"
        selected={null}
        targets={new Set()}
        captureTargets={new Set()}
        lastMove={last ? { from: last.from, to: last.to } : null}
        checkSquare={checkSquare}
        disabled
        animateKey={idx}
        onSquareClick={noop}
        onDrop={noop}
      />
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1">
          <Button size="icon" variant="secondary" aria-label="Restart" onClick={() => { setIdx(0); setPlaying(false); }}><RotateCcw /></Button>
          <Button size="icon" variant="secondary" aria-label="Previous move" disabled={idx === 0} onClick={() => { setPlaying(false); setIdx((i) => Math.max(0, i - 1)); }}><SkipBack /></Button>
          <Button size="icon" aria-label={playing ? "Pause" : "Play"} onClick={() => { if (done) setIdx(0); setPlaying((p) => !p); }}>{playing ? <Pause /> : <Play />}</Button>
          <Button size="icon" variant="secondary" aria-label="Next move" disabled={done} onClick={() => { setPlaying(false); setIdx((i) => Math.min(moves.length, i + 1)); }}><SkipForward /></Button>
        </div>
        <p className="min-w-0 truncate text-right font-mono text-sm" aria-live="polite">
          {idx === 0 ? <span className="text-muted">Start · {moves.length} moves</span> : <span><span className="text-muted">{label(idx - 1)}</span> <span className="text-gold-soft">{moves[idx - 1]}</span></span>}
        </p>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-surface-2" aria-hidden>
        <div className="h-full bg-gold transition-all duration-500" style={{ width: `${(idx / Math.max(1, moves.length)) * 100}%` }} />
      </div>
    </div>
  );
}
