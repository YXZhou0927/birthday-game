import prologue from "./prologue.js?v=20261122f";
import bigCity from "./big-city.js?v=20261122f";
import restaurant from "./restaurant.js?v=20261122f";
import stairs from "./stairs.js?v=20261122f";
import epilogue from "./epilogue.js?v=20261122f";

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
