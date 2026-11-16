"use client";
import { Chess } from "chess.js";
import { Board, type BoardCell } from "./board";

const noop = () => {};

/** Static showcase board (a Scholar's-mate-style attack) for the landing page. */
export function HeroBoard() {
  const chess = new Chess("r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 6");
  return (
    <div className="relative animate-float">
      <div className="absolute -inset-6 rounded-[2rem] bg-gold/10 blur-2xl" aria-hidden />
      <div className="relative -rotate-2 transition-transform duration-500 hover:rotate-0">
        <Board
          board={chess.board() as BoardCell[][]}
          orientation="w"
          selected={null}
          targets={new Set()}
          captureTargets={new Set()}
          lastMove={{ from: "d2", to: "d3" }}
          checkSquare={null}
          disabled
          onSquareClick={noop}
          onDrop={noop}
        />
      </div>
    </div>
  );
}
