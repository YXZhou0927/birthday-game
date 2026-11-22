/** Cross-level player memory (doll name, gifts, etc.). */

const KEY = "ann-birthday-2026-memory";

export const GIFT_LABELS = {
  clothes: "衣服",
  accessory: "飾品",
  perfume: "香水",
  skincare: "保養品",
  stationery: "文具",
  none: "沒有買，但一起逛街也很開心",
};

const defaults = () => ({
  dollName: "",
  gifts: [],
  mealDone: false,
});

export function loadMemory() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    return { ...defaults(), ...JSON.parse(raw) };
  } catch {
    return defaults();
  }
}

export function saveMemory(patch) {
  const next = { ...loadMemory(), ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

export function giftsAreNone(mem = loadMemory()) {
  const g = mem.gifts || [];
  return g.length === 1 && g[0] === "none";
}

export function giftLabels(mem = loadMemory()) {
  return (mem.gifts || [])
    .filter((id) => id !== "none")
    .map((id) => GIFT_LABELS[id] || id);
}

export function fillTemplate(text, mem = loadMemory()) {
  if (!text) return text;
  const labels = giftLabels(mem);
  return String(text)
    .replaceAll("{dollName}", mem.dollName || "小娃娃")
    .replaceAll("{gifts}", labels.join("、") || "好多禮物");
}
