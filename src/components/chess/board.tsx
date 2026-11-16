"use client";
import * as React from "react";
import type { Color, PieceSymbol, Square } from "chess.js";
import { cn } from "@/lib/utils";

export type BoardCell = { type: PieceSymbol; color: Color; square: Square } | null;

// Filled glyphs for both colors; ︎ forces text (non-emoji) rendering for the pawn.
const GLYPH: Record<PieceSymbol, string> = {
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟︎",
};
const NAME: Record<PieceSymbol, string> = { k: "king", q: "queen", r: "rook", b: "bishop", n: "knight", p: "pawn" };

export function Piece({ type, color, className }: { type: PieceSymbol; color: Color; className?: string }) {
  return (
    <span aria-hidden className={cn("leading-none select-none", color === "w" ? "piece-white" : "piece-black", className)}>
      {GLYPH[type]}
    </span>
  );
}

interface BoardProps {
  board: BoardCell[][];
  orientation: Color;
  selected: Square | null;
  targets: Set<string>;
  captureTargets: Set<string>;
  lastMove: { from: string; to: string } | null;
  checkSquare: string | null;
  disabled?: boolean;
  animateKey?: number;
  onSquareClick: (sq: Square) => void;
  onDrop: (from: Square, to: Square) => void;
}

export function Board({
  board,
  orientation,
  selected,
  targets,
  captureTargets,
  lastMove,
  checkSquare,
  disabled,
  animateKey,
  onSquareClick,
  onDrop,
}: BoardProps) {
  const files = "abcdefgh";
  const rows = orientation === "w" ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];
  const cols = orientation === "w" ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border-4 border-[#0f0c2e] shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8),0_0_0_1px_rgb(255_159_46/0.25)]"
      style={{ containerType: "inline-size" }}
      role="grid"
      aria-label="Chess board"
    >
      <div className="grid aspect-square grid-cols-8 grid-rows-8">
        {rows.map((r, ri) =>
          cols.map((c, ci) => {
            const sq = `${files[c]}${8 - r}` as Square;
            const cell = board[r][c];
            const dark = (r + c) % 2 === 1;
            const isSel = selected === sq;
            const isLast = lastMove && (lastMove.from === sq || lastMove.to === sq);
            const isTarget = targets.has(sq);
            const isCapture = captureTargets.has(sq);
            const isCheck = checkSquare === sq;
            let slide: { dx: number; dy: number } | null = null;
            if (animateKey !== undefined && lastMove && lastMove.to === sq) {
              const f = (s: string) => ({ x: files.indexOf(s[0]), y: 8 - Number(s[1]) });
              const a = f(lastMove.from), b = f(sq), k = orientation === "w" ? 1 : -1;
              slide = { dx: (a.x - b.x) * k, dy: (a.y - b.y) * k };
            }
            return (
              <button
                key={sq}
                type="button"
                role="gridcell"
                disabled={disabled}
                aria-label={`${sq}${cell ? `, ${cell.color === "w" ? "white" : "black"} ${NAME[cell.type]}` : ", empty"}${isTarget ? ", legal move" : ""}`}
                onClick={() => onSquareClick(sq)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const from = e.dataTransfer.getData("text/plain") as Square;
                  if (from && from !== sq) onDrop(from, sq);
                }}
                className={cn(
                  "relative flex items-center justify-center transition-colors duration-150 focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold",
                  dark ? "bg-[var(--sq-dark)]" : "bg-[var(--sq-light)]",
                  isLast && (dark ? "!bg-[#8c9a4a]" : "!bg-[#e9dd8a]"),
                  isSel && "!bg-[#f0c84f]",
                  isCheck && "!bg-[radial-gradient(circle,#ff4d5e_0%,#c0283a_55%,transparent_75%)]",
                  !disabled && "cursor-pointer hover:brightness-110",
                )}
              >
                {ci === 0 && (
                  <span className={cn("absolute left-0.5 top-0.5 text-[min(2.4cqw,11px)] font-bold", dark ? "text-[var(--sq-light)]" : "text-[var(--sq-dark)]")}>
                    {8 - r}
                  </span>
                )}
                {ri === 7 && (
                  <span className={cn("absolute bottom-0 right-1 text-[min(2.4cqw,11px)] font-bold", dark ? "text-[var(--sq-light)]" : "text-[var(--sq-dark)]")}>
                    {files[c]}
                  </span>
                )}
                {cell && (
                  <span
                    key={isLast && lastMove?.to === sq ? animateKey : "static"}
                    draggable={!disabled}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", sq);
                      e.dataTransfer.effectAllowed = "move";
                      onSquareClick(sq);
                    }}
                    className={cn("transition-transform duration-150 hover:scale-105", slide && "animate-slide relative z-10")}
                    style={{ fontSize: "10.5cqw", ...(slide ? ({ "--dx": slide.dx, "--dy": slide.dy } as React.CSSProperties) : {}) }}
                  >
                    <Piece type={cell.type} color={cell.color} />
                  </span>
                )}
                {isTarget && !isCapture && <span className="absolute size-[28%] rounded-full bg-black/25" />}
                {isCapture && <span className="absolute inset-[3%] rounded-full border-[0.9cqw] border-black/25" />}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
