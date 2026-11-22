/** Scene BGM + soft SFX from assets/audio (CC0). */

const BGM = {
  overall: "assets/audio/bgm/overall_light.ogg",
  cozy: "assets/audio/bgm/overall_cozy_town.ogg",
  plaza: "assets/audio/bgm/big_city_plaza.ogg",
  circus: "assets/audio/bgm/pop_circus.ogg",
  boutique: "assets/audio/bgm/blindbox_shop.ogg",
  bbq: "assets/audio/bgm/yakiniku.ogg",
  stairs: "assets/audio/bgm/campus_stairs.ogg",
};

const SFX = {
  click: "assets/audio/sfx/ui_click.ogg",
  confirm: "assets/audio/sfx/ui_confirm.ogg",
  heart: "assets/audio/sfx/heart_pickup.ogg",
  whoosh: "assets/audio/sfx/soft_whoosh.ogg",
};

const VISTA_TRACK = {
  sparkle: "overall",
  "mall-approach": "plaza",
  "doll-shop": "circus",
  "shopping-haul": "boutique",
  "shopping-stroll": "boutique",
  bbq: "bbq",
  stairs: "stairs",
  "stairs-memory": "stairs",
  "future-room": "cozy",
  epilogue: "cozy",
  "beach-card": "overall",
};

let muted = false;
let unlocked = false;
let currentKey = null;
let bgmEl = null;

function ensureBgm() {
  if (bgmEl) return bgmEl;
  bgmEl = new Audio();
  bgmEl.loop = true;
  bgmEl.preload = "auto";
  bgmEl.volume = 0.38;
  return bgmEl;
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(resolve, ms)),
  ]);
}

export async function unlockAudio() {
  unlocked = true;
  const el = ensureBgm();
  try {
    await withTimeout(el.play().catch(() => {}), 800);
    el.pause();
    el.currentTime = 0;
  } catch {
    /* ignore */
  }
}

export async function playTrack(key = "overall") {
  if (!BGM[key]) key = "overall";
  const el = ensureBgm();
  if (currentKey === key && !el.paused) return;
  currentKey = key;
  el.src = BGM[key];
  el.volume = muted ? 0 : 0.38;
  if (!unlocked) return;
  try {
    await withTimeout(el.play().catch((err) => {
      console.warn("[audio] bgm play", err);
    }), 1200);
  } catch (err) {
    console.warn("[audio] bgm play", err);
  }
}

export function playVistaTrack(vistaId) {
  const key = VISTA_TRACK[vistaId] || "overall";
  return playTrack(key);
}

export function playSfx(name) {
  if (muted || !unlocked) return;
  const src = SFX[name];
  if (!src) return;
  const a = new Audio(src);
  a.volume = name === "heart" ? 0.55 : 0.4;
  a.play().catch(() => {});
}

export function setMuted(next) {
  muted = Boolean(next);
  if (bgmEl) bgmEl.volume = muted ? 0 : 0.38;
}

export function isMuted() {
  return muted;
}

/** Back-compat with engine imports. */
export async function startBgm() {
  await unlockAudio();
  await playTrack("overall");
}

export function stopBgm() {
  if (bgmEl) {
    bgmEl.pause();
    currentKey = null;
  }
}
