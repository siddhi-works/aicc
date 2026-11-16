// Saved games live in this browser's localStorage only (no server).
export interface SavedGame {
  id: string;
  name: string;
  savedAt: number;
  pgn: string;
  mode: "bot" | "local";
  level: string;
  youColor: "w" | "b";
  tcId: string;
  times: { w: number; b: number };
  result: string | null;
}

const KEY = "aicc.saves.v1";
const CUR = "aicc.current.v1";

export function loadSaves(): SavedGame[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
export function writeSaves(list: SavedGame[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50))); } catch {}
}
export function loadCurrent(): SavedGame | null {
  try { return JSON.parse(localStorage.getItem(CUR) ?? "null"); } catch { return null; }
}
export function writeCurrent(g: SavedGame | null) {
  try { g ? localStorage.setItem(CUR, JSON.stringify(g)) : localStorage.removeItem(CUR); } catch {}
}
