/** Cross-level player memory (doll name, gifts, etc.). */

const KEY = "ann-birthday-2026-memory";

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

export function fillTemplate(text, mem = loadMemory()) {
  if (!text) return text;
  return String(text)
    .replaceAll("{dollName}", mem.dollName || "小娃娃")
    .replaceAll("{gifts}", (mem.gifts || []).join("、") || "好多禮物");
}
