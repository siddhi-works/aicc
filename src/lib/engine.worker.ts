import { Chess } from "chess.js";
import { chooseMove, type Level } from "./engine";

// Runs the search off the main thread so the UI never freezes while the computer thinks.
self.onmessage = (e: MessageEvent<{ fen: string; level: Level }>) => {
  const m = chooseMove(new Chess(e.data.fen), e.data.level);
  (self as unknown as Worker).postMessage({ fen: e.data.fen, move: m ? { from: m.from, to: m.to, promotion: m.promotion } : null });
};
