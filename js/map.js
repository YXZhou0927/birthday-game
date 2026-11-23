/**
 * Locked map grid for all playable scene maps.
 *
 * Display canvas: 1280×720 (16:9)
 * Logical pixels: 320×180 at 4× nearest (matches scene PNG pipeline)
 * Tile: 40×40 display px = 10×10 logical → 32×18 tiles
 *
 * All actors / props snap to integer tile centers.
 * Origin: top-left (col 0, row 0). Character feet sit on the tile center.
 */

export const MAP = Object.freeze({
  COLS: 32,
  ROWS: 18,
  TILE_PX: 40,
  WIDTH: 1280,
  HEIGHT: 720,
  LOGICAL_W: 320,
  LOGICAL_H: 180,
  SCALE: 4,
});

/** left% / bottom% for CSS absolute placement (feet at tile center). */
export function tileStyle(col, row) {
  const c = clamp(Math.round(col), 0, MAP.COLS - 1);
  const r = clamp(Math.round(row), 0, MAP.ROWS - 1);
  const left = ((c + 0.5) / MAP.COLS) * 100;
  const bottom = ((MAP.ROWS - r - 0.5) / MAP.ROWS) * 100;
  return `left:${left}%; bottom:${bottom}%;`;
}

export function tileLeft(col) {
  return ((clamp(Math.round(col), 0, MAP.COLS - 1) + 0.5) / MAP.COLS) * 100;
}

export function tileBottom(row) {
  return ((MAP.ROWS - clamp(Math.round(row), 0, MAP.ROWS - 1) - 0.5) / MAP.ROWS) * 100;
}

/** Nearest tile from legacy percent coords (left%, bottom%). */
export function percentToTile(leftPct, bottomPct) {
  const col = Math.round((leftPct / 100) * MAP.COLS - 0.5);
  const row = Math.round(MAP.ROWS - (bottomPct / 100) * MAP.ROWS - 0.5);
  return [clamp(col, 0, MAP.COLS - 1), clamp(row, 0, MAP.ROWS - 1)];
}

export function wantsGridOverlay() {
  try {
    const q = new URLSearchParams(location.search);
    if (q.get("grid") === "1" || q.get("grid") === "true") return true;
    return localStorage.getItem("birthday-game-grid") === "1";
  } catch {
    return false;
  }
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}
