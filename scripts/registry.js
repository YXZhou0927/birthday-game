import prologue from "./prologue.js";
import bigCity from "./big-city.js";

/** @type {Record<string, object>} */
export const levels = {
  [prologue.id]: prologue,
  [bigCity.id]: bigCity,
};

export const defaultLevelId = "prologue";

export function resolveLevel(id) {
  if (id && levels[id]) return levels[id];
  return levels[defaultLevelId];
}
