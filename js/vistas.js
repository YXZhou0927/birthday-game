/** CSS/HTML vignettes — art-backed maps + sprite actors where available. */

const ART = {
  plaza: "assets/art/scenes/big_city_plaza_walkable.png",
  circus: "assets/art/scenes/pop_circus.png",
  boutique: "assets/art/scenes/boutique_floor.png",
  bbq: "assets/art/scenes/yakiniku_interior.png",
  stairs: "assets/art/scenes/campus_stairs.png",
  gfStand: "assets/art/couple/girlfriend/stand_down.png",
  gfStand2: "assets/art/couple/girlfriend/stand_down_f2.png",
  gfWalk1: "assets/art/couple/girlfriend/walk_right_f1.png",
  gfWalk2: "assets/art/couple/girlfriend/walk_right_f2.png",
  gfWalk3: "assets/art/couple/girlfriend/walk_right_f3.png",
  gfWalk4: "assets/art/couple/girlfriend/walk_right_f4.png",
  bfStand: "assets/art/couple/boyfriend/stand_down.png",
  bfStand2: "assets/art/couple/boyfriend/stand_down_f2.png",
  gfSit: "assets/art/couple/girlfriend/sit_front.png",
  bfSit: "assets/art/couple/boyfriend/sit_front.png",
  hug3: "assets/art/couple/together/hug_3.png",
  hug4: "assets/art/couple/together/hug_4.png",
  clerkBlind: "assets/art/npcs/blindbox_clerk/stand_down.png",
  clerkBlind2: "assets/art/npcs/blindbox_clerk/stand_down_f2.png",
  clerkBbq: "assets/art/npcs/yakiniku_clerk/stand_down.png",
  clerkBbq2: "assets/art/npcs/yakiniku_clerk/stand_down_f2.png",
  pass1: "assets/art/npcs/passerby_01/stand_down.png",
  pass1b: "assets/art/npcs/passerby_01/stand_down_f2.png",
  pass2: "assets/art/npcs/passerby_02/stand_down.png",
  pass3: "assets/art/npcs/passerby_03/stand_left.png",
};

const GIFT_ICON = {
  clothes: "👗",
  accessory: "💎",
  perfume: "🌸",
  skincare: "🧴",
  stationery: "✏️",
};

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

function actor(src, src2, className, style = "") {
  const idle = src2
    ? `data-idle-a="${src}" data-idle-b="${src2}"`
    : "";
  return `<img class="actor ${className}" src="${src}" alt="" draggable="false" ${idle} style="${style}" />`;
}

function wireIdle(root) {
  const nodes = [...root.querySelectorAll("[data-idle-a]")];
  if (!nodes.length) return;
  let flip = false;
  const timer = window.setInterval(() => {
    flip = !flip;
    nodes.forEach((img) => {
      img.src = flip ? img.dataset.idleB : img.dataset.idleA;
    });
  }, 480);
  root._idleTimer = timer;
}

function mapShell(bg, actorsHtml, caption = "", extraClass = "") {
  return el(`<div class="vista vista--map ${extraClass}">
    <div class="map-frame">
      <img class="map-bg" src="${bg}" alt="" draggable="false" />
      <div class="map-actors">${actorsHtml}</div>
    </div>
    ${caption ? `<p class="vista-caption">${caption}</p>` : ""}
  </div>`);
}

const builders = {
  sparkle() {
    return el(`<div class="vista vista--sparkle" aria-hidden="true">
      <div class="spark spark--1"></div><div class="spark spark--2"></div>
      <div class="spark spark--3"></div><div class="spark spark--4"></div>
    </div>`);
  },

  /** Walk toward Big City plaza with girlfriend + passersby. */
  "mall-approach"() {
    const actors =
      actor(ART.pass2, null, "npc npc--a", "left:12%; bottom:18%") +
      actor(ART.pass3, null, "npc npc--b", "left:78%; bottom:22%") +
      actor(ART.gfWalk1, ART.gfWalk2, "hero hero--walk", "left:28%; bottom:14%");
    const root = mapShell(ART.plaza, actors, "安安開心地往巨城走去", "vista--plaza");
    // simple walk cycle frames 1-4
    const hero = root.querySelector(".hero--walk");
    const frames = [ART.gfWalk1, ART.gfWalk2, ART.gfWalk3, ART.gfWalk4];
    let i = 0;
    root._idleTimer = window.setInterval(() => {
      i = (i + 1) % frames.length;
      if (hero) hero.src = frames[i];
    }, 160);
    return root;
  },

  /** POP CIRCUS blind-box shop. */
  "doll-shop"(props = {}) {
    const name = props.dollName || "新夥伴";
    const actors =
      actor(ART.clerkBlind, ART.clerkBlind2, "npc npc--clerk", "left:62%; bottom:34%") +
      actor(ART.pass1, ART.pass1b, "npc npc--shopper", "left:18%; bottom:20%") +
      actor(ART.bfStand, ART.bfStand2, "hero hero--bf", "left:40%; bottom:16%") +
      actor(ART.gfStand, ART.gfStand2, "hero hero--gf", "left:48%; bottom:14%");
    const root = mapShell(
      ART.circus,
      actors,
      `${escapeHtml(name)} 的新家！`,
      "vista--circus"
    );
    wireIdle(root);
    return root;
  },

  /** Bought gifts — girlfriend happy with floating icons. */
  "shopping-haul"(props = {}) {
    const gifts = (props.gifts || []).filter((g) => g !== "none");
    const icons = gifts
      .map(
        (g, i) =>
          `<span class="gift-float g${i}" style="--i:${i}">${GIFT_ICON[g] || "🎁"}</span>`
      )
      .join("");
    const actors =
      actor(ART.pass1, null, "npc npc--far", "left:12%; bottom:24%") +
      actor(ART.bfStand, ART.bfStand2, "hero hero--bf", "left:42%; bottom:14%") +
      actor(ART.gfStand, ART.gfStand2, "hero hero--gf hero--happy", "left:52%; bottom:12%");
    const root = mapShell(
      ART.boutique,
      actors + `<div class="gift-orbit">${icons}</div>`,
      "看她抱著戰利品笑得好開心",
      "vista--boutique"
    );
    wireIdle(root);
    return root;
  },

  /** No purchase — hand-in-hand stroll (hug frames as stand-in for holding hands). */
  "shopping-stroll"() {
    const actors =
      actor(ART.pass2, null, "npc npc--far", "left:70%; bottom:26%") +
      `<img class="actor hero hero--together" src="${ART.hug3}" alt="" draggable="false" data-idle-a="${ART.hug3}" data-idle-b="${ART.hug4}" style="left:44%; bottom:10%" />`;
    const root = mapShell(
      ART.boutique,
      actors,
      "手牽手逛街，也很幸福",
      "vista--boutique vista--stroll"
    );
    wireIdle(root);
    return root;
  },

  /** BBQ interior with couple seated + clerk + diners. */
  bbq() {
    const actors =
      actor(ART.clerkBbq, ART.clerkBbq2, "npc npc--clerk", "left:14%; bottom:36%") +
      actor(ART.pass1, null, "npc npc--diner", "left:72%; bottom:30%") +
      actor(ART.bfSit, null, "hero hero--bf-sit", "left:40%; bottom:18%") +
      actor(ART.gfSit, null, "hero hero--gf-sit", "left:50%; bottom:16%");
    const root = mapShell(
      ART.bbq,
      actors +
        `<div class="bbq-toys">
          <button type="button" class="meat m1" data-meat>🥩</button>
          <button type="button" class="meat m2" data-meat>🦐</button>
          <button type="button" class="meat m3" data-meat>🧀</button>
        </div>
        <p class="vista-hint">點一下餐點，滋滋作響～</p>`,
      "",
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
    const actors =
      actor(ART.bfSit, null, "hero hero--bf-sit", "left:40%; bottom:28%") +
      actor(ART.gfSit, null, "hero hero--gf-sit", "left:50%; bottom:26%");
    const root = mapShell(ART.stairs, actors, "", "vista--stairs-map");
    return root;
  },

  "future-room"() {
    return el(`<div class="vista vista--future">
      <div class="room-wall"></div>
      <div class="room-window"></div>
      <div class="future-heart" id="future-heart">♥</div>
      <div class="future-cake" id="future-cake" hidden>
        <span class="cake-body">🎂</span>
        <span class="cake-kid">🧒</span>
      </div>
      <div class="future-mom" id="future-mom">
        <img src="${ART.gfStand}" alt="" draggable="false" />
      </div>
    </div>`);
  },

  epilogue() {
    return el(`<div class="vista vista--epi">
      <div class="epi-party" id="epi-party">
        <div class="party-folk">👨‍👩‍👧🎂🎉</div>
        <p class="vista-caption">生日快樂，安安！</p>
      </div>
      <div class="epi-present" id="epi-present" hidden>
        <div class="present-hug">
          <img class="actor" src="${ART.hug4}" alt="" draggable="false" />
        </div>
        <div class="phone-back" id="phone-back">
          <span class="apple-mark"></span>
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
        <div class="footprints"></div>
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
    clearInterval(host._idleTimer);
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
    clearInterval(host._idleTimer);
    host._idleTimer = null;
  }
  const child = host.firstElementChild;
  if (child?._idleTimer) clearInterval(child._idleTimer);
  host.classList.remove("is-visible");
  return new Promise((resolve) => {
    setTimeout(() => {
      host.innerHTML = "";
      host.hidden = true;
      resolve();
    }, 700);
  });
}

export const vistaIds = Object.keys(builders);
