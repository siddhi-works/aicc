// Tiny WebAudio sound effects (no audio files). Muted preference is remembered.
let ctx: AudioContext | null = null;
const MUTE = "aicc.muted";

export const isMuted = () => { try { return localStorage.getItem(MUTE) === "1"; } catch { return false; } };
export const setMuted = (m: boolean) => { try { localStorage.setItem(MUTE, m ? "1" : "0"); } catch {} };

function tone(freq: number, start: number, dur: number, type: OscillatorType = "triangle", vol = 0.12) {
  if (!ctx) return;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime + start);
  g.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  o.connect(g).connect(ctx.destination);
  o.start(ctx.currentTime + start); o.stop(ctx.currentTime + start + dur + 0.05);
}

export function play(kind: "move" | "capture" | "check" | "win" | "lose" | "start") {
  if (isMuted()) return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    if (kind === "move") tone(330, 0, 0.09, "triangle");
    if (kind === "capture") { tone(180, 0, 0.12, "square", 0.08); tone(120, 0.05, 0.15, "square", 0.08); }
    if (kind === "check") { tone(660, 0, 0.1); tone(880, 0.09, 0.14); }
    if (kind === "start") { tone(392, 0, 0.1); tone(523, 0.1, 0.16); }
    if (kind === "win") [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.13, 0.25));
    if (kind === "lose") [330, 262, 196].forEach((f, i) => tone(f, i * 0.18, 0.3, "sawtooth", 0.06));
  } catch {}
}
