/**
 * Map vignettes tuned for 3/4 RPG scenes + chibi sprites.
 * Actors use facing that matches top-down maps; sized for floor contact.
 * Positions snap to the locked MAP grid (see map.js).
 */

import { MAP, tileStyle, tileBottom, wantsGridOverlay } from "./map.js";

const ART = {
  plaza: "assets/art/scenes/big_city_plaza_walkable.png",
  circus: "assets/art/scenes/pop_circus.png",
  boutique: "assets/art/scenes/boutique_floor.png",
  bbq: "assets/art/scenes/yakiniku_interior.png",
  stairs: "assets/art/scenes/campus_stairs.png",
  gf: {
    down: ["assets/art/couple/girlfriend/stand_down.png", "assets/art/couple/girlfriend/stand_down_f2.png"],
    up: ["assets/art/couple/girlfriend/stand_up.png", "assets/art/couple/girlfriend/stand_up_f2.png"],
    left: ["assets/art/couple/girlfriend/stand_left.png", "assets/art/couple/girlfriend/stand_left_f2.png"],
    right: ["assets/art/couple/girlfriend/stand_right.png", "assets/art/couple/girlfriend/stand_right_f2.png"],
    walkUp: [1, 2, 3, 4].map((i) => `assets/art/couple/girlfriend/walk_up_f${i}.png`),
    walkRight: [1, 2, 3, 4].map((i) => `assets/art/couple/girlfriend/walk_right_f${i}.png`),
    sit: "assets/art/couple/girlfriend/sit_front.png",
    sitSide: "assets/art/couple/girlfriend/sit_side.png",
  },
  bf: {
    down: ["assets/art/couple/boyfriend/stand_down.png", "assets/art/couple/boyfriend/stand_down_f2.png"],
    up: ["assets/art/couple/boyfriend/stand_up.png", "assets/art/couple/boyfriend/stand_up_f2.png"],
    left: ["assets/art/couple/boyfriend/stand_left.png", "assets/art/couple/boyfriend/stand_left_f2.png"],
    right: ["assets/art/couple/boyfriend/stand_right.png", "assets/art/couple/boyfriend/stand_right_f2.png"],
    sit: "assets/art/couple/boyfriend/sit_front.png",
    sitSide: "assets/art/couple/boyfriend/sit_side.png",
  },
  hug: ["assets/art/couple/together/hug_3.png", "assets/art/couple/together/hug_4.png"],
  kiss: ["assets/art/couple/together/kiss_3.png", "assets/art/couple/together/kiss_4.png"],
  clerkBlind: ["assets/art/npcs/blindbox_clerk/stand_down.png", "assets/art/npcs/blindbox_clerk/stand_down_f2.png"],
  clerkBbq: ["assets/art/npcs/yakiniku_clerk/stand_left.png", "assets/art/npcs/yakiniku_clerk/stand_left_f2.png"],
  pass1: ["assets/art/npcs/passerby_01/stand_down.png", "assets/art/npcs/passerby_01/stand_down_f2.png"],
  pass2: ["assets/art/npcs/passerby_02/walk_left_f1.png", "assets/art/npcs/passerby_02/walk_left_f2.png"],
  pass3: ["assets/art/npcs/passerby_03/stand_right.png", "assets/art/npcs/passerby_03/stand_right_f2.png"],
  mom: ["assets/art/family/mom/stand_down.png", "assets/art/family/mom/stand_down_f2.png"],
  kid: ["assets/art/family/kid/stand_down.png", "assets/art/family/kid/stand_down_f2.png"],
  icons: {
    clothes: "assets/art/icons/boutique_bag.png",
    accessory: "assets/art/icons/christmas_ornament.png",
    perfume: "assets/art/icons/flowers.png",
    skincare: "assets/art/icons/blindbox_package.png",
    stationery: "assets/art/icons/school_notebook.png",
    bags: "assets/art/icons/shopping_bags.png",
    plush: "assets/art/icons/plush_doll_ann.png",
    plush2: "assets/art/icons/plush_bunny_cream.png",
    plush3: "assets/art/icons/plush_cat_pink.png",
    phone: "assets/art/icons/phone.png",
    cake: "assets/art/icons/hearts/heart_cake.png",
    flowers: "assets/art/icons/flowers.png",
    nfc: "assets/art/icons/nfc_sticker.png",
  },
};

const GIFT_KEYS = ["clothes", "accessory", "perfume", "skincare", "stationery"];

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Place actor on tile (col, row); feet at tile center. Origin top-left. */
function actor(frames, className, col, row, scale = 1) {
  const list = Array.isArray(frames) ? frames : [frames];
  const a = list[0];
  const b = list[1] || list[0];
  return `<img class="actor ${className}" src="${a}" alt="" draggable="false"
    data-idle-a="${a}" data-idle-b="${b}" data-col="${col}" data-row="${row}"
    style="${tileStyle(col, row)} --scale:${scale}" />`;
}

function prop(src, className, col, row, scale = 1) {
  return `<img class="prop ${className}" src="${src}" alt="" draggable="false"
    data-col="${col}" data-row="${row}"
    style="${tileStyle(col, row)} --scale:${scale}" />`;
}

function wireIdle(root, ms = 520) {
  const nodes = [...root.querySelectorAll("[data-idle-a]")];
  if (!nodes.length) return;
  let flip = false;
  root._idleTimer = window.setInterval(() => {
    flip = !flip;
    nodes.forEach((img) => {
      if (img.dataset.walk) return;
      img.src = flip ? img.dataset.idleB : img.dataset.idleA;
    });
  }, ms);
}

function wireWalk(root, selector, frames, ms = 140) {
  const hero = root.querySelector(selector);
  if (!hero || !frames?.length) return;
  hero.dataset.walk = "1";
  let i = 0;
  const walkTimer = window.setInterval(() => {
    i = (i + 1) % frames.length;
    hero.src = frames[i];
  }, ms);
  const prev = root._idleTimer;
  root._idleTimer = {
    clear() {
      clearInterval(walkTimer);
      if (typeof prev === "number") clearInterval(prev);
      else prev?.clear?.();
    },
  };
}

function mapShell(bg, actorsHtml, extraClass = "") {
  const gridClass = wantsGridOverlay() ? " show-grid" : "";
  return el(`<div class="vista vista--map ${extraClass}${gridClass}">
    <div class="map-frame" data-cols="${MAP.COLS}" data-rows="${MAP.ROWS}">
      <img class="map-bg" src="${bg}" alt="" draggable="false" />
      <div class="map-dim"></div>
      <div class="map-grid" aria-hidden="true"></div>
      <div class="map-actors">${actorsHtml}</div>
    </div>
  </div>`);
}

const builders = {
  sparkle() {
    return el(`<div class="vista vista--sparkle">
      <img class="spark-nfc" src="${ART.icons.nfc}" alt="" />
      <div class="spark spark--1"></div><div class="spark spark--2"></div>
      <div class="spark spark--3"></div><div class="spark spark--4"></div>
    </div>`);
  },

  /** Walk deeper into plaza (facing up = into map). */
  "mall-approach"() {
    const actors =
      actor(ART.pass2, "npc", 5, 13, 0.85) +
      actor(ART.pass3, "npc", 25, 12, 0.85) +
      actor(ART.gf.walkUp, "hero hero--walk", 15, 15, 1.05) +
      prop(ART.icons.bags, "prop--float", 18, 15, 0.55);
    const root = mapShell(ART.plaza, actors, "vista--plaza");
    wireWalk(root, ".hero--walk", ART.gf.walkUp);
    // gentle upward drift (deeper into map = smaller row index)
    const hero = root.querySelector(".hero--walk");
    if (hero) {
      hero.style.transition = "bottom 3.6s ease-out";
      requestAnimationFrame(() => {
        hero.dataset.row = "10";
        hero.style.bottom = `${tileBottom(10)}%`;
      });
    }
    return root;
  },

  "doll-shop"(props = {}) {
    const name = props.dollName || "新夥伴";
    // Couple faces into the shop (up); clerk faces customers (down).
    const actors =
      actor(ART.clerkBlind, "npc npc--clerk", 18, 9, 0.95) +
      actor(ART.pass1, "npc", 5, 12, 0.8) +
      actor(ART.bf.up, "hero", 12, 14, 1) +
      actor(ART.gf.up, "hero hero--gf", 16, 14, 1) +
      prop(ART.icons.plush, "prop--plush", 15, 11, 0.72) +
      prop(ART.icons.plush2, "prop--plush", 10, 10, 0.55) +
      prop(ART.icons.plush3, "prop--plush", 22, 10, 0.55);
    const root = mapShell(
      ART.circus,
      actors + `<p class="map-tag">✦ ${escapeHtml(name)} ✦</p>`,
      "vista--circus"
    );
    wireIdle(root);
    return root;
  },

  "shopping-haul"(props = {}) {
    const gifts = (props.gifts || []).filter((g) => g !== "none" && GIFT_KEYS.includes(g));
    const floats = gifts
      .map((g, i) => {
        const col = 14 + i - Math.floor(gifts.length / 2);
        const row = 10 - (i % 2);
        return prop(ART.icons[g] || ART.icons.bags, `prop--gift g${i}`, col, row, 0.65);
      })
      .join("");
    // After shopping: face the camera with bags floating — celebratory beat.
    const actors =
      actor(ART.pass1, "npc", 4, 11, 0.8) +
      actor(ART.bf.down, "hero", 14, 13, 1) +
      actor(ART.gf.down, "hero hero--happy", 17, 13, 1) +
      floats;
    const root = mapShell(ART.boutique, actors, "vista--boutique");
    wireIdle(root);
    return root;
  },

  "shopping-stroll"() {
    const actors =
      actor(ART.pass2, "npc", 23, 11, 0.8) +
      actor(ART.hug, "hero hero--together", 15, 14, 1.35);
    const root = mapShell(ART.boutique, actors, "vista--boutique vista--stroll");
    wireIdle(root, 700);
    return root;
  },

  bbq() {
    // Seated at south-facing tables → sit_front reads toward camera; clerk at left counter.
    const actors =
      actor(ART.clerkBbq, "npc npc--clerk", 4, 9, 0.95) +
      actor(ART.pass1, "npc", 26, 10, 0.78) +
      actor([ART.bf.sit], "hero hero--sit", 13, 13, 1.05) +
      actor([ART.gf.sit], "hero hero--sit", 17, 13, 1.05) +
      prop(ART.icons.bags, "prop--table", 15, 12, 0.4);
    const root = mapShell(
      ART.bbq,
      actors +
        `<div class="bbq-toys">
          <button type="button" class="meat" data-meat><img src="assets/art/icons/grill_tongs.png" alt="" /></button>
          <button type="button" class="meat" data-meat><img src="assets/art/icons/chopsticks.png" alt="" /></button>
        </div>`,
      "vista--yakiniku"
    );
    wireIdle(root);
    root.querySelectorAll("[data-meat]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        btn.classList.add("is-seared");
        root.classList.add("is-sizzling");
        setTimeout(() => root.classList.remove("is-sizzling"), 400);
      });
    });
    return root;
  },

  stairs() {
    // Landing beat: sit side-by-side facing each other on the mid landing.
    const actors =
      actor([ART.bf.sitSide], "hero hero--sit", 13, 9, 1.05) +
      actor([ART.gf.sitSide], "hero hero--sit face-left", 18, 9, 1.05) +
      prop(ART.icons.flowers, "prop--flower", 15, 8, 0.75);
    return mapShell(ART.stairs, actors, "vista--stairs-map");
  },

  "stairs-memory"() {
    // Soft kiss memory beat on the landing.
    const actors =
      actor(ART.kiss, "hero hero--together", 16, 10, 1.4) +
      prop(ART.icons.flowers, "prop--flower", 20, 9, 0.65);
    const root = mapShell(ART.stairs, actors, "vista--stairs-map");
    wireIdle(root, 700);
    return root;
  },

  "future-room"() {
    return el(`<div class="vista vista--future">
      <div class="room-wall"></div>
      <div class="room-window"></div>
      <img class="future-heart-img" id="future-heart" src="assets/art/icons/hearts/heart_assembled.png" alt="" />
      <div class="future-cake" id="future-cake" hidden>
        <img src="assets/art/icons/hearts/heart_cake.png" alt="" />
        <img class="future-kid" src="${ART.kid[0]}" alt="" data-idle-a="${ART.kid[0]}" data-idle-b="${ART.kid[1]}" />
      </div>
      <img class="future-mom" id="future-mom" src="${ART.mom[0]}" alt="" data-idle-a="${ART.mom[0]}" data-idle-b="${ART.mom[1]}" />
    </div>`);
  },

  epilogue() {
    return el(`<div class="vista vista--epi">
      <div class="epi-party" id="epi-party">
        <div class="party-cast">
          <img src="${ART.mom[0]}" alt="" />
          <img src="${ART.kid[0]}" alt="" />
          <img src="assets/art/icons/hearts/heart_cake.png" class="party-cake" alt="" />
        </div>
      </div>
      <div class="epi-present" id="epi-present" hidden>
        <img class="present-hug" src="${ART.hug[1]}" alt="" />
        <div class="phone-back" id="phone-back">
          <img src="${ART.icons.phone}" alt="" />
          <span class="phone-label">iPhone 18 Pro</span>
        </div>
      </div>
      <div class="voucher" id="epi-voucher" hidden>
        <p>✦ Apple 兌換券 ✦</p>
        <small>週末有個小驚喜…或許是新手機？</small>
      </div>
    </div>`);
  },

  "beach-card"() {
    return el(`<div class="vista vista--beach">
      <div class="wave w1"></div><div class="wave w2"></div>
      <div class="sand">
        <p class="card-lines">To 安安<br/>HAPPY<br/>BIRTHDAY<br/><span>By 周 · 深圳</span></p>
      </div>
    </div>`);
  },
};

export function buildVista(id, props = {}) {
  const build = builders[id];
  if (!build) {
    console.warn(`[vistas] unknown: ${id}`);
    return null;
  }
  return build(props);
}

export function mountVista(host, id, props = {}) {
  if (host._idleTimer) {
    if (typeof host._idleTimer === "number") clearInterval(host._idleTimer);
    else host._idleTimer.clear?.();
    host._idleTimer = null;
  }
  const node = buildVista(id, props);
  if (!node) return null;
  host.innerHTML = "";
  host.appendChild(node);
  if (node._idleTimer) host._idleTimer = node._idleTimer;
  host.hidden = false;
  void host.offsetWidth;
  host.classList.add("is-visible");
  return node;
}

export function clearVista(host) {
  if (host._idleTimer) {
    if (typeof host._idleTimer === "number") clearInterval(host._idleTimer);
    else host._idleTimer.clear?.();
    host._idleTimer = null;
  }
  const child = host.firstElementChild;
  if (child?._idleTimer) {
    if (typeof child._idleTimer === "number") clearInterval(child._idleTimer);
    else child._idleTimer.clear?.();
  }
  host.classList.remove("is-visible");
  return new Promise((resolve) => {
    setTimeout(() => {
      host.innerHTML = "";
      host.hidden = true;
      resolve();
    }, 500);
  });
}

export const vistaIds = Object.keys(builders);
