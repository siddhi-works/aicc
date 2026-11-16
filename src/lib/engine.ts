import { Chess, type Move, type PieceSymbol } from "chess.js";

export type Level = "beginner" | "easy" | "medium" | "hard";

export const levels: { id: Level; name: string; blurb: string; elo: string; depth: number; noise: number }[] = [
  { id: "beginner", name: "Beginner", blurb: "Moves almost at random. Great for learning the rules.", elo: "~400", depth: 0, noise: 0 },
  { id: "easy", name: "Easy", blurb: "Grabs free pieces but misses most tactics.", elo: "~800", depth: 1, noise: 1.2 },
  { id: "medium", name: "Medium", blurb: "Looks two moves ahead. Won't hang pieces easily.", elo: "~1200", depth: 2, noise: 0.25 },
  { id: "hard", name: "Hard", blurb: "Looks three moves ahead. Punishes mistakes.", elo: "~1500", depth: 3, noise: 0 },
];

const VAL: Record<PieceSymbol, number> = { p: 1, n: 3.2, b: 3.3, r: 5, q: 9, k: 0 };

function evaluate(chess: Chess): number {
  // score from the side-to-move's perspective
  let s = 0;
  const b = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = b[r][c];
      if (!p) continue;
      const center = 3.5 - Math.max(Math.abs(c - 3.5), Math.abs(r - 3.5)) + 0.5; // 0.5..3.5ish
      let v = VAL[p.type];
      if (p.type === "n" || p.type === "b") v += center * 0.06;
      if (p.type === "p") v += (p.color === "w" ? 6 - r : r - 1) * 0.05 + center * 0.02;
      s += p.color === "w" ? v : -v;
    }
  }
  return chess.turn() === "w" ? s : -s;
}

function order(moves: Move[]) {
  return moves.sort(
    (a, b) =>
      (b.captured ? VAL[b.captured] * 10 - VAL[b.piece] : 0) + (b.promotion ? 8 : 0) -
      ((a.captured ? VAL[a.captured] * 10 - VAL[a.piece] : 0) + (a.promotion ? 8 : 0)),
  );
}

function search(chess: Chess, depth: number, alpha: number, beta: number, ply: number): number {
  if (chess.isCheckmate()) return -1000 + ply;
  if (chess.isDraw() || chess.isStalemate()) return 0;
  if (depth === 0) return evaluate(chess);
  for (const m of order(chess.moves({ verbose: true }))) {
    chess.move(m);
    const score = -search(chess, depth - 1, -beta, -alpha, ply + 1);
    chess.undo();
    if (score >= beta) return beta;
    if (score > alpha) alpha = score;
  }
  return alpha;
}

export function chooseMove(chess: Chess, level: Level): Move | null {
  const moves = chess.moves({ verbose: true });
  if (!moves.length) return null;
  const cfg = levels.find((l) => l.id === level)!;

  if (cfg.depth === 0) {
    const caps = moves.filter((m) => m.captured || m.san.includes("#"));
    const pool = caps.length && Math.random() < 0.35 ? caps : moves;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const work = new Chess(chess.fen());
  let best = moves[0];
  let bestScore = -Infinity;
  for (const m of order(moves)) {
    work.move(m);
    const score = -search(work, cfg.depth - 1, -Infinity, Infinity, 1) + (Math.random() - 0.5) * 2 * cfg.noise;
    work.undo();
    if (score > bestScore) {
      bestScore = score;
      best = m;
    }
  }
  return best;
}
