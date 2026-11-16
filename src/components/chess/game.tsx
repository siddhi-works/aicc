"use client";
import * as React from "react";
import Link from "next/link";
import { Chess, type Color, type PieceSymbol, type Square } from "chess.js";
import { Flag, Handshake, RefreshCw, RotateCcw, Undo2, Bot, Users, Globe, Play, Loader2, Shuffle, Save, Download, Trash2, FolderOpen, Volume2, VolumeX, Check } from "lucide-react";
import { Board, Piece, type BoardCell } from "./board";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge, PrototypeBadge } from "@/components/ui/badge";
import { chooseMove, levels, type Level } from "@/lib/engine";
import { timeControls } from "@/lib/mock";
import { useProfile } from "@/lib/profile-context";
import { cn } from "@/lib/utils";
import { loadSaves, writeSaves, loadCurrent, writeCurrent, type SavedGame } from "@/lib/saves";
import { play as sfx, isMuted, setMuted } from "@/lib/sound";

const CONFETTI_COLORS = ["#ff9f2e", "#2ed38a", "#ff5d73", "#6c8cff", "#ffc46b"];
function Confetti() {
  const bits = React.useMemo(
    () => Array.from({ length: 48 }, (_, i) => ({ i, left: Math.random() * 100, delay: Math.random() * 0.8, dur: 2.2 + Math.random() * 1.8, c: CONFETTI_COLORS[i % 5] })),
    [],
  );
  return (
    <>
      {bits.map((b) => (
        <span key={b.i} aria-hidden className="confetti-bit" style={{ left: `${b.left}vw`, background: b.c, animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s` }} />
      ))}
    </>
  );
}

type Mode = "bot" | "local";
type SideChoice = Color | "random";
type End = { result: "1-0" | "0-1" | "1/2-1/2"; reason: string } | null;

const VALUE: Record<PieceSymbol, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const clocks = [{ id: "none", label: "No clock", base: 0, inc: 0 }, ...timeControls];

function fmt(ms: number) {
  const s = Math.max(0, ms) / 1000;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  if (s < 10) return `${m}:${sec.toString().padStart(2, "0")}.${Math.floor((s * 10) % 10)}`;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function Game({ initialTc = "none", initialMode = "bot" }: { initialTc?: string; initialMode?: Mode }) {
  // ---------- setup ----------
  const [phase, setPhase] = React.useState<"setup" | "playing">("setup");
  const [mode, setMode] = React.useState<Mode>(initialMode);
  const [level, setLevel] = React.useState<Level>("easy");
  const [sideChoice, setSideChoice] = React.useState<SideChoice>("w");
  const [tcId, setTcId] = React.useState(clocks.some((t) => t.id === initialTc) ? initialTc : "none");
  const [youColor, setYouColor] = React.useState<Color>("w");

  // ---------- game ----------
  const { profile } = useProfile();
  const [chess, setChess] = React.useState(() => new Chess());
  const [, force] = React.useReducer((x: number) => x + 1, 0);
  const tc = clocks.find((t) => t.id === tcId)!;
  const timed = tc.base > 0;
  const [times, setTimes] = React.useState({ w: tc.base * 1000, b: tc.base * 1000 });
  const [selected, setSelected] = React.useState<Square | null>(null);
  const [orientation, setOrientation] = React.useState<Color>("w");
  const [end, setEnd] = React.useState<End>(null);
  const [promo, setPromo] = React.useState<{ from: Square; to: Square } | null>(null);
  const [drawOffer, setDrawOffer] = React.useState(false);
  const historyRef = React.useRef<HTMLOListElement>(null);
  const [saves, setSaves] = React.useState<SavedGame[]>([]);
  const [current, setCurrent] = React.useState<SavedGame | null>(null);
  const [toast, setToast] = React.useState<string | null>(null);
  const [muted, setMutedState] = React.useState(false);
  React.useEffect(() => {
    setSaves(loadSaves());
    setCurrent(loadCurrent());
    setMutedState(isMuted());
  }, []);
  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2200);
  };

  const history = chess.history({ verbose: true });
  const turn = chess.turn();
  const botTurn = mode === "bot" && turn !== youColor;

  const natural: End = (() => {
    if (chess.isCheckmate()) return { result: turn === "w" ? "0-1" : "1-0", reason: "Checkmate" };
    if (chess.isStalemate()) return { result: "1/2-1/2", reason: "Stalemate" };
    if (chess.isInsufficientMaterial()) return { result: "1/2-1/2", reason: "Insufficient material" };
    if (chess.isThreefoldRepetition()) return { result: "1/2-1/2", reason: "Threefold repetition" };
    if (chess.isDraw()) return { result: "1/2-1/2", reason: "Fifty-move rule" };
    return null;
  })();
  const result = end ?? natural;
  const over = !!result;
  const soundedRef = React.useRef(false);
  React.useEffect(() => {
    if (!result) {
      soundedRef.current = false;
      return;
    }
    if (soundedRef.current) return;
    soundedRef.current = true;
    if (result.reason === "Checkmate") return; // checkmate move already played its fanfare
    const lost = mode === "bot" && result.result !== "1/2-1/2" && (result.result === "1-0") !== (youColor === "w");
    sfx(lost ? "lose" : "win");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  // clocks (start once both sides have moved)
  React.useEffect(() => {
    if (phase !== "playing" || !timed || over || history.length < 2) return;
    let last = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      const dt = now - last;
      last = now;
      setTimes((t) => ({ ...t, [turn]: Math.max(0, t[turn] - dt) }));
    }, 100);
    return () => clearInterval(id);
  }, [phase, timed, over, turn, history.length]);

  React.useEffect(() => {
    if (timed && !end && !natural && history.length >= 2) {
      if (times.w <= 0) setEnd({ result: "0-1", reason: "White ran out of time" });
      else if (times.b <= 0) setEnd({ result: "1-0", reason: "Black ran out of time" });
    }
  }, [times, timed, end, natural, history.length]);

  React.useEffect(() => {
    historyRef.current?.scrollTo({ top: historyRef.current.scrollHeight, behavior: "smooth" });
  }, [history.length]);

  const applyMove = React.useCallback(
    (from: Square, to: Square, promotion?: PieceSymbol) => {
      try {
        const mover = chess.turn();
        const mv = chess.move({ from, to, promotion });
        sfx(chess.isCheckmate() ? "win" : mv.san.includes("+") ? "check" : mv.captured ? "capture" : "move");
        const inc = tc.inc * 1000;
        if (inc && chess.history().length >= 3) setTimes((t) => ({ ...t, [mover]: t[mover] + inc }));
        setSelected(null);
        setDrawOffer(false);
        force();
        return true;
      } catch {
        return false;
      }
    },
    [chess, tc.inc],
  );

  const legalFrom = (sq: Square) => chess.moves({ square: sq, verbose: true });

  const tryMove = (from: Square, to: Square) => {
    const piece = chess.get(from);
    const isPromo =
      piece?.type === "p" && (to[1] === "8" || to[1] === "1") && legalFrom(from).some((m) => m.to === to);
    if (isPromo) {
      setPromo({ from, to });
      setSelected(null);
      return;
    }
    if (!applyMove(from, to)) setSelected(null);
  };

  const onSquareClick = (sq: Square) => {
    if (over || botTurn || promo) return;
    if (selected && selected !== sq && legalFrom(selected).some((m) => m.to === sq)) return tryMove(selected, sq);
    const piece = chess.get(sq);
    setSelected(piece && piece.color === turn && selected !== sq ? sq : null);
  };

  const onDrop = (from: Square, to: Square) => {
    if (over || botTurn || promo) return;
    const piece = chess.get(from);
    if (piece && piece.color === turn) tryMove(from, to);
  };

  // computer move (deferred so the UI can paint "thinking" first)
  React.useEffect(() => {
    if (phase !== "playing" || !botTurn || over) return;
    const fen = chess.fen();
    let cancelled = false;
    let worker: Worker | null = null;
    const play = (mv: { from: Square; to: Square; promotion?: string } | null) => {
      if (!cancelled && mv) applyMove(mv.from, mv.to, mv.promotion as PieceSymbol | undefined);
    };
    const id = setTimeout(() => {
      try {
        worker = new Worker(new URL("../../lib/engine.worker.ts", import.meta.url));
        worker.onmessage = (e) => play(e.data.move);
        worker.onerror = () => {
          const m = chooseMove(chess, level); // fallback: main thread
          play(m && { from: m.from, to: m.to, promotion: m.promotion });
        };
        worker.postMessage({ fen, level });
      } catch {
        const m = chooseMove(chess, level);
        play(m && { from: m.from, to: m.to, promotion: m.promotion });
      }
    }, 400 + Math.random() * 300);
    return () => {
      cancelled = true;
      clearTimeout(id);
      worker?.terminate();
    };
  }, [phase, botTurn, over, chess, level, applyMove, history.length]);

  const snapshot = (name: string): SavedGame => ({
    id: `${Date.now()}`, name, savedAt: Date.now(), pgn: chess.pgn(), mode, level, youColor, tcId, times,
    result: result ? `${result.result} · ${result.reason}` : null,
  });

  // autosave the game in progress so a refresh never loses it
  React.useEffect(() => {
    if (phase !== "playing") return;
    if (over || history.length === 0) {
      writeCurrent(null);
      return;
    }
    writeCurrent(snapshot("Last game"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, history.length, over]);

  const saveNow = () => {
    const label = `${mode === "bot" ? `vs Computer (${levels.find((l) => l.id === level)!.name})` : "Multiplayer"} · ${history.length} moves`;
    const list = [snapshot(label), ...saves];
    setSaves(list);
    writeSaves(list);
    flash("Game saved!");
  };

  const resume = (g: SavedGame) => {
    const c = new Chess();
    try {
      c.loadPgn(g.pgn);
    } catch {
      flash("Could not load that save");
      return;
    }
    setMode(g.mode);
    setLevel(g.level as Level);
    setTcId(g.tcId);
    setYouColor(g.youColor);
    setOrientation(g.mode === "bot" ? g.youColor : "w");
    setChess(c);
    setTimes(g.times);
    setSelected(null);
    setPromo(null);
    setDrawOffer(false);
    setEnd(null);
    setPhase("playing");
    sfx("start");
  };

  const removeSave = (id: string) => {
    const list = saves.filter((x) => x.id !== id);
    setSaves(list);
    writeSaves(list);
  };

  const downloadPgn = () => {
    const blob = new Blob([chess.pgn() || "*"], { type: "application/x-chess-pgn" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "aicc-game.pgn";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const start = () => {
    const color: Color = mode === "local" ? "w" : sideChoice === "random" ? (Math.random() < 0.5 ? "w" : "b") : sideChoice;
    setYouColor(color);
    setOrientation(color);
    setChess(new Chess());
    setTimes({ w: tc.base * 1000, b: tc.base * 1000 });
    setSelected(null);
    setEnd(null);
    setPromo(null);
    setDrawOffer(false);
    setPhase("playing");
    writeCurrent(null);
    sfx("start");
  };

  const undo = () => {
    if (end || promo || botTurn) return;
    chess.undo();
    if (mode === "bot" && chess.turn() !== youColor) chess.undo();
    setSelected(null);
    force();
  };

  const resign = () => {
    const loser: Color = mode === "bot" ? youColor : turn;
    setEnd({ result: loser === "w" ? "0-1" : "1-0", reason: `${loser === "w" ? "White" : "Black"} resigned` });
  };

  // ======================= SETUP SCREEN =======================
  if (phase === "setup") {
    const modeCard = (m: Mode, Icon: typeof Bot, title: string, text: string) => (
      <button
        type="button"
        aria-pressed={mode === m}
        onClick={() => setMode(m)}
        className={cn(
          "group rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-1",
          mode === m ? "border-gold bg-gold/10 shadow-[0_20px_50px_-25px_rgb(255_159_46/0.7)]" : "border-border bg-surface hover:border-gold/40",
        )}
      >
        <Icon className={cn("mb-3 size-7 transition-transform group-hover:scale-110", mode === m ? "text-gold" : "text-muted")} />
        <p className="font-serif text-xl font-semibold">{title}</p>
        <p className="mt-1 text-sm text-muted">{text}</p>
      </button>
    );
    return (
      <div className="mx-auto max-w-3xl space-y-8 animate-fade-up">
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">1 · Choose how to play</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {modeCard("bot", Bot, "Play the computer", "Pick a difficulty and play right now.")}
            {modeCard("local", Users, "Multiplayer", "Two players, one screen. Take turns.")}
            <Link href="/lobby" className="group rounded-2xl border border-dashed border-gold/40 bg-surface p-5 transition-all hover:-translate-y-1 hover:border-gold">
              <Globe className="mb-3 size-7 text-muted transition-transform group-hover:scale-110" />
              <p className="flex items-center gap-2 font-serif text-xl font-semibold">Online <PrototypeBadge /></p>
              <p className="mt-1 text-sm text-muted">Lobby demo — simulated opponents.</p>
            </Link>
          </div>
        </section>

        {mode === "bot" && (
          <section className="animate-fade-up">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">2 · Difficulty</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {levels.map((l, i) => (
                <button
                  key={l.id}
                  type="button"
                  aria-pressed={level === l.id}
                  onClick={() => setLevel(l.id)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-all hover:border-gold/60",
                    level === l.id ? "border-gold bg-gold/10" : "border-border bg-surface",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg font-semibold">{l.name}</span>
                    <span className="flex gap-0.5" aria-hidden>
                      {levels.map((_, k) => <span key={k} className={cn("h-2 w-4 rounded-sm", k <= i ? "bg-gold" : "bg-border")} />)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{l.blurb}</p>
                  <p className="mt-1 text-xs text-gold-soft">Rough strength {l.elo}</p>
                </button>
              ))}
            </div>
            <h2 className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-gold">3 · Your colour</h2>
            <div className="flex gap-3">
              {([["w", "White"], ["b", "Black"], ["random", "Random"]] as [SideChoice, string][]).map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={sideChoice === v}
                  onClick={() => setSideChoice(v)}
                  className={cn("flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 transition-all", sideChoice === v ? "border-gold bg-gold/10" : "border-border bg-surface hover:border-gold/40")}
                >
                  {v === "random" ? <Shuffle className="size-5" /> : <span className="text-3xl"><Piece type="k" color={v} /></span>}
                  <span className="text-sm font-medium">{l}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">{mode === "bot" ? "4" : "2"} · Clock</h2>
          <div className="flex flex-wrap gap-2">
            {clocks.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={tcId === t.id}
                onClick={() => setTcId(t.id)}
                className={cn("rounded-full border px-4 py-1.5 text-sm transition-colors", tcId === t.id ? "border-gold bg-gold text-[#1a1305]" : "border-border text-muted hover:text-foreground")}
              >
                {t.id === "none" ? "No clock" : `${t.id} · ${t.label}`}
              </button>
            ))}
          </div>
        </section>

        <Button size="lg" className="w-full animate-pulse-ring" onClick={start}><Play />Start game</Button>

        <section id="saved" className="scroll-mt-28">
          <h2 className="mb-3 flex items-center gap-2 font-serif text-2xl font-bold"><FolderOpen className="size-5 text-gold" />Saved games</h2>
          {current && (
            <button onClick={() => resume(current)} className="mb-3 flex w-full items-center justify-between rounded-2xl border-2 border-gold bg-gold/10 p-4 text-left transition hover:bg-gold/20">
              <span>
                <span className="block font-bold">Continue your last game</span>
                <span className="text-sm text-muted">Saved automatically when you left</span>
              </span>
              <Play className="size-5 text-gold" />
            </button>
          )}
          {saves.length === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-border p-6 text-center text-sm text-muted">No saved games yet. Press Save game while playing to keep one here.</p>
          ) : (
            <ul className="space-y-2">
              {saves.map((g) => (
                <li key={g.id} className="flex items-center justify-between gap-3 rounded-2xl border-2 border-border bg-surface p-3">
                  <span className="min-w-0">
                    <span className="block truncate font-bold">{g.name}</span>
                    <span className="text-xs text-muted">{new Date(g.savedAt).toLocaleString()}{g.result ? ` · ${g.result}` : " · in progress"}</span>
                  </span>
                  <span className="flex shrink-0 gap-2">
                    <Button size="sm" onClick={() => resume(g)}><Play />Open</Button>
                    <Button size="icon" variant="ghost" aria-label={`Delete ${g.name}`} onClick={() => removeSave(g.id)}><Trash2 /></Button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    );
  }

  // ======================= GAME SCREEN =======================
  const targets = new Set<string>();
  const captureTargets = new Set<string>();
  if (selected) {
    for (const m of legalFrom(selected)) {
      targets.add(m.to);
      if (m.captured) captureTargets.add(m.to);
    }
  }
  const last = history[history.length - 1];
  const checkSquare = chess.inCheck()
    ? (chess.board().flat().find((c) => c && c.type === "k" && c.color === turn)?.square ?? null)
    : null;

  const captured: Record<Color, PieceSymbol[]> = { w: [], b: [] };
  history.forEach((m) => m.captured && captured[m.color].push(m.captured));
  const score = (c: Color) => captured[c].reduce((a, p) => a + VALUE[p], 0);
  const adv = score("w") - score("b");

  const pairs: { n: number; w: string; b?: string }[] = [];
  history.forEach((m, i) => {
    if (i % 2 === 0) pairs.push({ n: i / 2 + 1, w: m.san });
    else pairs[pairs.length - 1].b = m.san;
  });

  const lvl = levels.find((l) => l.id === level)!;
  const names: Record<Color, { name: string; sub: string; bot?: boolean }> =
    mode === "bot"
      ? {
          [youColor]: { name: profile?.username ?? "You", sub: "You" },
          [youColor === "w" ? "b" : "w"]: { name: `Computer · ${lvl.name}`, sub: lvl.elo, bot: true },
        } as never
      : { w: { name: "Player 1", sub: "White" }, b: { name: "Player 2", sub: "Black" } };

  const top: Color = orientation === "w" ? "b" : "w";
  const bottom: Color = orientation;

  const PlayerBar = ({ color }: { color: Color }) => {
    const active = turn === color && !over;
    const low = timed && times[color] < 20000;
    const n = names[color];
    return (
      <div className={cn("flex items-center justify-between gap-3 rounded-xl border px-3 py-2 transition-all duration-300", active ? "border-gold/60 bg-gold/5 shadow-[0_0_30px_-10px_rgb(255_159_46/0.6)]" : "border-border bg-surface")}>
        <div className="flex min-w-0 items-center gap-3">
          {n.bot ? (
            <span className={cn("grid size-9 place-items-center rounded-full bg-surface-2 ring-2 ring-white/10", active && "animate-pulse-ring")}><Bot className="size-5 text-gold" /></span>
          ) : (
            <Avatar name={n.name} color={mode === "bot" ? profile?.avatarColor : undefined} size={36} />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{n.name} <span className="font-normal text-muted">{n.sub}</span></p>
            <p className="flex h-5 items-center text-sm text-muted">
              {[...captured[color]].sort((a, b) => VALUE[b] - VALUE[a]).map((p, i) => (
                <span key={i} className="-mr-1 animate-pop text-lg"><Piece type={p} color={color === "w" ? "b" : "w"} /></span>
              ))}
              {((color === "w" && adv > 0) || (color === "b" && adv < 0)) && <span className="ml-2 text-xs">+{Math.abs(adv)}</span>}
            </p>
          </div>
        </div>
        {timed && (
          <div className={cn("rounded-lg px-3 py-1.5 font-mono text-2xl font-semibold tabular-nums transition-colors", active ? (low ? "bg-ruby/20 text-ruby" : "bg-gold text-[#1a1305]") : "bg-surface-2 text-muted")} aria-label={`${color === "w" ? "White" : "Black"} clock`}>
            {fmt(times[color])}
          </div>
        )}
      </div>
    );
  };

  const youWon = result && mode === "bot" && ((result.result === "1-0") === (youColor === "w")) && result.result !== "1/2-1/2";
  const headline = !result ? "" : result.result === "1/2-1/2" ? "Draw" : mode === "bot" ? (youWon ? "You win!" : "You lose") : result.result === "1-0" ? "White wins" : "Black wins";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,640px)_1fr] xl:grid-cols-[minmax(0,680px)_1fr] animate-fade-up">
      <div className="space-y-3">
        <PlayerBar color={top} />
        <div className="relative">
          <Board
            board={chess.board() as BoardCell[][]}
            orientation={orientation}
            selected={selected}
            targets={targets}
            captureTargets={captureTargets}
            lastMove={last ? { from: last.from, to: last.to } : null}
            checkSquare={checkSquare}
            disabled={over || botTurn}
            animateKey={history.length}
            onSquareClick={onSquareClick}
            onDrop={onDrop}
          />
          {promo && (
            <div className="absolute inset-0 z-20 grid place-items-center bg-black/60 backdrop-blur-sm" role="dialog" aria-label="Choose promotion piece">
              <div className="animate-pop rounded-2xl border border-gold/40 bg-surface p-4 text-center">
                <p className="mb-3 font-serif text-lg">Promote to</p>
                <div className="flex gap-2">
                  {(["q", "r", "b", "n"] as PieceSymbol[]).map((p) => (
                    <button key={p} aria-label={`Promote to ${p}`} onClick={() => { applyMove(promo.from, promo.to, p); setPromo(null); }}
                      className="grid size-16 place-items-center rounded-xl bg-[var(--sq-light)] text-5xl transition hover:scale-110 hover:ring-2 hover:ring-gold">
                      <Piece type={p} color={turn} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {result && result.result !== "1/2-1/2" && (mode === "local" || youWon) && <Confetti />}
          {result && (
            <div className="absolute inset-0 z-10 grid place-items-center bg-black/55 backdrop-blur-[2px]" role="status">
              <div className="mx-4 animate-pop rounded-2xl border border-gold/40 bg-surface/95 p-7 text-center shadow-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Game over</p>
                <p className="mt-2 font-serif text-4xl font-semibold">{headline}</p>
                <p className="mt-1 text-muted">{result.reason}</p>
                <div className="mt-5 flex justify-center gap-2">
                  <Button onClick={start}><RotateCcw />Rematch</Button>
                  <Button variant="secondary" onClick={() => setPhase("setup")}>New game</Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <PlayerBar color={bottom} />
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">{mode === "bot" ? `vs Computer · ${lvl.name}` : "Multiplayer · same screen"}</p>
              <p className="flex items-center gap-2 font-serif text-xl" aria-live="polite">
                {botTurn && !over && <Loader2 className="size-4 animate-spin text-gold" />}
                {result ? `${result.result} · ${result.reason}` : botTurn ? "Computer is thinking…" : `${turn === "w" ? "White" : "Black"} to move${chess.inCheck() ? " — check!" : ""}`}
              </p>
            </div>
            <Badge variant={over ? "red" : "green"}>{over ? "Finished" : "Live"}</Badge>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => setPhase("setup")}><RotateCcw />New game</Button>
          <Button variant="secondary" size="sm" onClick={() => setOrientation((o) => (o === "w" ? "b" : "w"))}><RefreshCw />Flip</Button>
          <Button variant="secondary" size="sm" onClick={undo} disabled={!history.length || !!end || botTurn}><Undo2 />Undo</Button>
          <Button variant="secondary" size="sm" onClick={() => (mode === "bot" ? setEnd({ result: "1/2-1/2", reason: "Draw by agreement" }) : setDrawOffer(true))} disabled={over || history.length < 2}><Handshake />Draw</Button>
          <Button variant="danger" size="sm" onClick={resign} disabled={over || !history.length}><Flag />Resign</Button>
          <Button size="sm" onClick={saveNow} disabled={!history.length}>{toast ? <Check /> : <Save />}{toast ?? "Save game"}</Button>
          <Button variant="secondary" size="sm" onClick={downloadPgn} disabled={!history.length}><Download />PGN</Button>
          <Button variant="ghost" size="icon" aria-label={muted ? "Turn sound on" : "Mute sound"} onClick={() => { setMuted(!muted); setMutedState(!muted); }}>{muted ? <VolumeX /> : <Volume2 />}</Button>
        </div>
        {drawOffer && !over && (
          <div className="flex items-center justify-between gap-2 rounded-lg border border-gold/40 bg-gold/5 p-3 text-sm animate-pop">
            <span>Draw offered — does the other player accept?</span>
            <span className="flex gap-2">
              <Button size="sm" onClick={() => setEnd({ result: "1/2-1/2", reason: "Draw by agreement" })}>Accept</Button>
              <Button size="sm" variant="ghost" onClick={() => setDrawOffer(false)}>Decline</Button>
            </span>
          </div>
        )}

        <Card>
          <CardHeader><CardTitle>Moves</CardTitle></CardHeader>
          <CardContent>
            <ol ref={historyRef} className="max-h-72 overflow-y-auto pr-1 font-mono text-sm" aria-label="Move history">
              {pairs.length === 0 && <li className="py-6 text-center font-sans text-muted">No moves yet. White to begin.</li>}
              {pairs.map((p, i) => (
                <li key={p.n} className={cn("grid grid-cols-[2rem_1fr_1fr] gap-2 rounded px-2 py-1 animate-pop", i % 2 && "bg-white/[0.03]")}>
                  <span className="text-muted">{p.n}.</span>
                  <span className={cn(i === pairs.length - 1 && !p.b && "text-gold-soft")}>{p.w}</span>
                  <span className={cn(i === pairs.length - 1 && p.b && "text-gold-soft")}>{p.b ?? ""}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
