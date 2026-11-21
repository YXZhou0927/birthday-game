/** Persistent heart-fragment progress (1/4 … 4/4). */

const STORAGE_KEY = "ann-birthday-2026-heart";

export function loadHeartProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const n = raw == null ? 0 : Number(raw);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.min(4, Math.floor(n));
  } catch {
    return 0;
  }
}

export function saveHeartProgress(count) {
  const n = Math.max(0, Math.min(4, Math.floor(count)));
  try {
    localStorage.setItem(STORAGE_KEY, String(n));
  } catch {
    /* ignore quota / private mode */
  }
  return n;
}

/**
 * Play collect animation for the next fragment.
 * @param {object} ui - createUi() result
 * @param {number} piece - 1..4 (absolute piece index after collect)
 */
export async function playHeartCollect(ui, piece) {
  const { els, wait, show, hide } = ui;
  const target = Math.max(1, Math.min(4, piece));
  const prev = loadHeartProgress();
  const next = Math.max(prev, target);
  saveHeartProgress(next);

  // Reset quarter lights, then reveal up to `next`
  for (let i = 1; i <= 4; i++) {
    const q = els.heartOverlay.querySelector(`.heart-q--${i}`);
    q?.classList.toggle("is-lit", i <= prev);
  }
  els.heartLabel.textContent = `${prev} / 4`;

  await show(els.heartOverlay, 700);
  await wait(350);

  if (next > prev) {
    for (let i = prev + 1; i <= next; i++) {
      const q = els.heartOverlay.querySelector(`.heart-q--${i}`);
      q?.classList.add("is-lit", "is-pop");
      els.heartLabel.textContent = `${i} / 4`;
      await wait(650);
      q?.classList.remove("is-pop");
    }
  } else {
    // Already had this piece — still show the board briefly
    for (let i = 1; i <= next; i++) {
      els.heartOverlay.querySelector(`.heart-q--${i}`)?.classList.add("is-lit");
    }
    els.heartLabel.textContent = `${next} / 4`;
    await wait(900);
  }

  if (next >= 4) {
    els.heartOverlay.classList.add("is-complete");
    await wait(1200);
    els.heartOverlay.classList.remove("is-complete");
  }

  await wait(500);
  await hide(els.heartOverlay, 800);
}
