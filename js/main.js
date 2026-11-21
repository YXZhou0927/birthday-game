import { GameEngine } from "./engine.js";
import { resolveLevel, levels, defaultLevelId } from "../scripts/registry.js";

function readFlags() {
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.replace(/^#/, "");
  const level =
    params.get("level") || params.get("l") || hash || defaultLevelId;
  const debug =
    params.has("debug") ||
    params.get("debug") === "1" ||
    params.get("debug") === "true";
  const skipGps =
    params.has("skipGps") ||
    params.get("skipGps") === "1" ||
    params.get("skipGps") === "true";
  return { level, debug, skipGps };
}

async function boot() {
  const { level, debug, skipGps } = readFlags();
  const script = resolveLevel(level);

  if (!levels[level] && debug) {
    console.warn(`[main] unknown level "${level}", falling back to ${script.id}`);
  }

  // Warm a few known frames so the first reel feels snappy
  const warm = (script.steps ?? [])
    .flatMap((s) => s.frames ?? (s.src ? [s.src] : []))
    .slice(0, 12);
  await Promise.all(
    warm.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        })
    )
  );

  const engine = new GameEngine({ debug, skipGps });
  await engine.run(script);
}

boot().catch((err) => {
  console.error(err);
});
