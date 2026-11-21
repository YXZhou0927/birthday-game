/**
 * Lightweight procedural BGM (no external audio files).
 * Cheerful pentatonic loop — starts after the first user gesture (play).
 */

let ctx = null;
let master = null;
let timer = null;
let started = false;
let muted = false;

const TEMPO = 108;
const BEAT = 60 / TEMPO;

/** C major pentatonic-ish cheerful motif (Hz). */
const PHRASE = [
  523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 392.0,
  440.0, 523.25, 587.33, 659.25, 587.33, 523.25, 440.0, 392.0,
];

function ensureCtx() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.045;
  master.connect(ctx.destination);
  return ctx;
}

function beep(freq, when, dur = 0.22) {
  if (!ctx || !master || muted) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(0.55, when + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  osc.connect(g);
  g.connect(master);
  osc.start(when);
  osc.stop(when + dur + 0.02);
}

function scheduleLoop() {
  if (!ctx || muted) return;
  const t0 = ctx.currentTime + 0.05;
  PHRASE.forEach((f, i) => {
    beep(f, t0 + i * BEAT * 0.5, 0.28);
  });
  const span = PHRASE.length * BEAT * 0.5 * 1000 + 180;
  timer = window.setTimeout(scheduleLoop, span);
}

export async function startBgm() {
  try {
    if (started) {
      await ensureCtx()?.resume?.();
      return;
    }
    const c = ensureCtx();
    if (!c) return;
    // Never block the story if audio unlock hangs (some headless / mobile WebViews)
    await Promise.race([
      c.resume(),
      new Promise((r) => setTimeout(r, 400)),
    ]);
    started = true;
    scheduleLoop();
  } catch (err) {
    console.warn("[bgm] start skipped", err);
  }
}

export function stopBgm() {
  if (timer) clearTimeout(timer);
  timer = null;
  started = false;
}

export function setMuted(next) {
  muted = Boolean(next);
  if (master) master.gain.value = muted ? 0 : 0.045;
  if (!muted && started) scheduleLoop();
  else if (muted && timer) {
    clearTimeout(timer);
    timer = null;
  }
}

export function isMuted() {
  return muted;
}
