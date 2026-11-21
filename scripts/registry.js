import prologue from "./prologue.js";
import bigCity from "./big-city.js";
import restaurant from "./restaurant.js";
import stairs from "./stairs.js";
import epilogue from "./epilogue.js";

/** @type {Record<string, object>} */
export const levels = {
  [prologue.id]: prologue,
  [bigCity.id]: bigCity,
  [restaurant.id]: restaurant,
  [stairs.id]: stairs,
  [epilogue.id]: epilogue,
};

export const defaultLevelId = "prologue";

export function resolveLevel(id) {
  if (id && levels[id]) return levels[id];
  return levels[defaultLevelId];
}
