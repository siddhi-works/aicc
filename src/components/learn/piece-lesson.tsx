"use client";
import * as React from "react";
import type { PieceSymbol, Square } from "chess.js";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Board, Piece, type BoardCell } from "@/components/chess/board";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const noop = () => {};
const files = "abcdefgh";

const PIECES: { type: PieceSymbol; name: string; value: number | "∞"; start: Square; text: string; tip: string }[] = [
  { type: "k", name: "King", value: "∞", start: "d4", text: "Moves one square in any direction. Protect it at all costs — if it can't escape attack, you lose.", tip: "Can never move into check." },
  { type: "q", name: "Queen", value: 9, start: "d4", text: "The most powerful piece: slides any distance along a row, column or diagonal.", tip: "Don't bring her out too early." },
  { type: "r", name: "Rook", value: 5, start: "d4", text: "Slides any distance in straight lines — forwards, backwards and sideways.", tip: "Rooks love open files." },
  { type: "b", name: "Bishop", value: 3, start: "d4", text: "Slides any distance diagonally. Each bishop stays on its starting colour forever.", tip: "Two bishops together are very strong." },
  { type: "n", name: "Knight", value: 3, start: "d4", text: "Moves in an L: two squares one way, one square sideways. The only piece that can jump over others.", tip: "Knights are best near the centre." },
  { type: "p", name: "Pawn", value: 1, start: "e2", text: "Moves forward one square (two from its starting row). Captures one square diagonally forward.", tip: "Pawns can never move backwards." },
];

const sq = (c: number, r: number) => `${files[c]}${r}` as Square; // r = 1..8
const parse = (s: string) => ({ c: files.indexOf(s[0]), r: Number(s[1]) });

/** Geometry on an otherwise empty board. */
function targetsFor(type: PieceSymbol, s: Square): { moves: Square[]; captures: Square[] } {
  const { c, r } = parse(s);
  const out: Square[] = [];
  const caps: Square[] = [];
  const ok = (cc: number, rr: number) => cc >= 0 && cc < 8 && rr >= 1 && rr <= 8;
  const ray = (dc: number, dr: number) => {
    for (let k = 1; ; k++) {
      const cc = c + dc * k, rr = r + dr * k;
      if (!ok(cc, rr)) break;
      out.push(sq(cc, rr));
    }
  };
  const orth = [[1, 0], [-1, 0], [0, 1], [0, -1]], diag = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  if (type === "r") orth.forEach(([a, b]) => ray(a, b));
  if (type === "b") diag.forEach(([a, b]) => ray(a, b));
  if (type === "q") [...orth, ...diag].forEach(([a, b]) => ray(a, b));
  if (type === "k") [...orth, ...diag].forEach(([a, b]) => ok(c + a, r + b) && out.push(sq(c + a, r + b)));
  if (type === "n")
    [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]].forEach(([a, b]) => ok(c + a, r + b) && out.push(sq(c + a, r + b)));
  if (type === "p") {
    if (r < 8) out.push(sq(c, r + 1));
    if (r === 2) out.push(sq(c, 4));
    [-1, 1].forEach((d) => ok(c + d, r + 1) && caps.push(sq(c + d, r + 1)));
  }
  return { moves: out, captures: caps };
}

export function PieceLesson() {
  const [i, setI] = React.useState(1);
  const info = PIECES[i];
  const [pos, setPos] = React.useState<Square>(info.start);
  const [from, setFrom] = React.useState<Square>(info.start);
  const [n, setN] = React.useState(0);
  const [auto, setAuto] = React.useState(true);

  const pick = (k: number) => {
    setI(k);
    setPos(PIECES[k].start);
    setFrom(PIECES[k].start);
    setN(0);
  };
  const go = React.useCallback((to: Square) => {
    setFrom(pos);
    setPos(to);
    setN((x) => x + 1);
  }, [pos]);

  const { moves, captures } = targetsFor(info.type, pos);

  React.useEffect(() => {
    if (!auto) return;
    const id = setTimeout(() => {
      const pool = moves;
      if (!pool.length) return setPos(info.start);
      go(pool[Math.floor(Math.random() * pool.length)]);
    }, 1300);
    return () => clearTimeout(id);
  }, [auto, moves, pos, info, go]);

  const board: BoardCell[][] = Array.from({ length: 8 }, (_, r) =>
    Array.from({ length: 8 }, (_, c) => {
      const s = `${files[c]}${8 - r}` as Square;
      return s === pos ? { type: info.type, color: "w", square: s } : null;
    }),
  );

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,520px)_1fr]">
      <div>
        <Board
          board={board}
          orientation="w"
          selected={pos}
          targets={new Set(moves)}
          captureTargets={new Set()}
          lastMove={n ? { from, to: pos } : null}
          checkSquare={null}
          animateKey={n ? n : undefined}
          onSquareClick={(s) => { setAuto(false); if (moves.includes(s)) go(s); }}
          onDrop={noop}
        />
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setAuto((a) => !a)}>{auto ? <><Pause />Pause demo</> : <><Play />Auto demo</>}</Button>
          <Button size="sm" variant="secondary" onClick={() => { setPos(info.start); setN(0); }}><RotateCcw />Reset</Button>
          <p className="ml-auto self-center text-xs text-muted">Click a dotted square to move.</p>
        </div>
      </div>
      <div>
        <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Choose a piece">
          {PIECES.map((p, k) => (
            <button key={p.type} role="tab" aria-selected={i === k} onClick={() => pick(k)}
              className={cn("flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all", i === k ? "border-gold bg-gold/10 text-gold-soft" : "border-border text-muted hover:text-foreground")}>
              <span className="text-2xl"><Piece type={p.type} color="w" /></span>{p.name}
            </button>
          ))}
        </div>
        <div key={info.type} className="animate-fade-up">
          <h3 className="font-serif text-3xl font-semibold">The {info.name}</h3>
          <p className="mt-3 text-muted">{info.text}</p>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-surface-2 p-4"><dt className="text-xs uppercase tracking-wider text-muted">Value</dt><dd className="font-serif text-2xl text-gold-soft">{info.value}{info.value !== "∞" && " pts"}</dd></div>
            <div className="rounded-xl bg-surface-2 p-4"><dt className="text-xs uppercase tracking-wider text-muted">Pro tip</dt><dd className="mt-1">{info.tip}</dd></div>
          </dl>
          {info.type === "p" && captures.length > 0 && <p className="mt-4 text-sm text-muted">Pawns capture diagonally — from here that would be {captures.join(" or ")}.</p>}
        </div>
      </div>
    </div>
  );
}
