/** CSS/HTML interactive vignettes — livelier than static photos. */

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

const builders = {
  /** Soft sparkle void used under narration. */
  sparkle() {
    return el(`<div class="vista vista--sparkle" aria-hidden="true">
      <div class="spark spark--1"></div><div class="spark spark--2"></div>
      <div class="spark spark--3"></div><div class="spark spark--4"></div>
    </div>`);
  },

  /** Q-style walk toward Big City. */
  "mall-approach"() {
    return el(`<div class="vista vista--mall">
      <div class="mall-sky"></div>
      <div class="mall-building">
        <span class="mall-sign">BIG CITY</span>
        <div class="mall-windows"></div>
      </div>
      <div class="mall-girl bounce-walk" title="安安">✿</div>
      <div class="mall-ground"></div>
    </div>`);
  },

  /** Blind-box / doll corner. */
  "doll-shop"(props = {}) {
    const name = props.dollName || "？？？";
    return el(`<div class="vista vista--dolls">
      <div class="shop-shelf"></div>
      <div class="doll-crowd">
        <span class="blob b1">♡</span><span class="blob b2">★</span>
        <span class="blob b3">♪</span><span class="blob b4">✿</span>
        <span class="blob b5">✦</span>
      </div>
      <div class="couple-pair">
        <span class="chibi boy">♂</span>
        <span class="chibi girl">♀</span>
      </div>
      <p class="vista-caption">${escapeHtml(name)} 加入隊伍！</p>
    </div>`);
  },

  /** Shopping haul — gifts float in. */
  "shopping-haul"(props = {}) {
    const gifts = props.gifts?.length ? props.gifts : ["驚喜小物"];
    const chips = gifts
      .map((g, i) => `<span class="gift-chip g${i % 5}">${escapeHtml(g)}</span>`)
      .join("");
    return el(`<div class="vista vista--shop">
      <div class="bags bounce-soft">🛍</div>
      <div class="gift-rain">${chips}</div>
      <div class="couple-pair couple-pair--front">
        <span class="chibi boy">♂</span>
        <span class="chibi girl">♀</span>
      </div>
    </div>`);
  },

  /** BBQ restaurant — tap meat to sear. */
  bbq() {
    const root = el(`<div class="vista vista--bbq">
      <div class="bbq-lamp"></div>
      <div class="bbq-table">
        <button type="button" class="meat m1" data-meat>🥩</button>
        <button type="button" class="meat m2" data-meat>🦐</button>
        <button type="button" class="meat m3" data-meat>🧀</button>
        <div class="grill-glow"></div>
      </div>
      <div class="couple-pair couple-pair--seat">
        <span class="chibi boy">♂</span>
        <span class="chibi girl">♀</span>
      </div>
      <p class="vista-hint">點一下餐點，滋滋作響～</p>
    </div>`);
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

  /** Campus stairs at dusk. */
  stairs() {
    return el(`<div class="vista vista--stairs">
      <div class="stairs-sky"></div>
      <div class="stairs-steps">
        <i></i><i></i><i></i><i></i><i></i>
      </div>
      <div class="stairs-couple float-soft">
        <span class="chibi boy">♂</span>
        <span class="chibi girl">♀</span>
      </div>
      <div class="petal p1"></div><div class="petal p2"></div><div class="petal p3"></div>
    </div>`);
  },

  /** 30 years later — room + heart becomes cake. */
  "future-room"() {
    return el(`<div class="vista vista--future">
      <div class="room-wall"></div>
      <div class="room-window"></div>
      <div class="future-heart" id="future-heart">♥</div>
      <div class="future-cake" id="future-cake" hidden>
        <span class="cake-body">🎂</span>
        <span class="cake-kid">🧒</span>
      </div>
      <div class="future-mom" id="future-mom">👩</div>
    </div>`);
  },

  /** Family party → phone zoom ending. */
  epilogue() {
    const root = el(`<div class="vista vista--epi">
      <div class="epi-party" id="epi-party">
        <div class="party-folk">👨‍👩‍👧🎂🎉</div>
        <p class="vista-caption">生日快樂，安安！</p>
      </div>
      <div class="epi-present" id="epi-present" hidden>
        <div class="present-hug">
          <span class="chibi girl">♀</span>
          <span class="chibi boy">♂</span>
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
    return root;
  },

  /** Beach birthday card for 安安 (replaces old 豆豆 frame). */
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

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function buildVista(id, props = {}) {
  const build = builders[id];
  if (!build) {
    console.warn(`[vistas] unknown: ${id}`);
    return null;
  }
  return build(props);
}

/**
 * @param {HTMLElement} host
 * @param {string} id
 * @param {object} [props]
 */
export function mountVista(host, id, props = {}) {
  const node = buildVista(id, props);
  if (!node) return null;
  host.innerHTML = "";
  host.appendChild(node);
  host.hidden = false;
  void host.offsetWidth;
  host.classList.add("is-visible");
  return node;
}

export function clearVista(host) {
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
