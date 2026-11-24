import { CARDS, CARD_ORDER } from "./cards-data.js";
import {
  unlockAudio,
  playTrack,
  setMuted,
  isMuted,
  playSfx,
} from "./audio.js";

const FLIP_MID_MS = 450;

const PAGE_BGM = {
  "big-city": "plaza",
  boutique: "circus",
  restaurant: "bbq",
  home: "cozy",
};

function $(sel, root = document) {
  return root.querySelector(sel);
}

function readPage() {
  const params = new URLSearchParams(location.search);
  const id = params.get("page") || params.get("card") || params.get("p") || "big-city";
  return CARDS[id] ? id : "big-city";
}

function setPage(id) {
  const url = new URL(location.href);
  url.searchParams.set("page", id);
  history.replaceState({}, "", url);
}

function letterHtml(lines) {
  return lines
    .map((line) => {
      if (!line) return `<p class="letter-line letter-line--blank">&nbsp;</p>`;
      return `<p class="letter-line">${escapeHtml(line)}</p>`;
    })
    .join("");
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function couponPeekHtml(data) {
  if (data.id !== "home") return "";
  return `
    <button type="button" class="coupon-peek" id="coupon-peek" aria-label="發現隱藏兌換券一角">
      <span class="coupon-peek__tab" aria-hidden="true"></span>
    </button>`;
}

function couponModalHtml() {
  return `
  <div class="coupon-modal" id="coupon-modal" hidden>
    <div class="coupon-modal__glow" aria-hidden="true"></div>
    <div class="coupon-modal__rays" aria-hidden="true"></div>
    <div class="coupon-card" role="dialog" aria-modal="true" aria-labelledby="coupon-title">
      <img class="coupon-card__art" src="assets/art/cards/home/coupon.png?v=1" alt="" draggable="false" />
      <div class="coupon-card__copy">
        <p class="coupon-card__brand">Apple 兌換券</p>
        <p class="coupon-card__title" id="coupon-title">恭喜找到隱藏兌換券</p>
        <p class="coupon-card__sub">趕快叫我帶她去吧</p>
      </div>
    </div>
    <button type="button" class="coupon-modal__close" id="coupon-close">收起來</button>
  </div>`;
}

function buildCard(data) {
  const muted = isMuted();
  return `
  <div class="card-stage ${data.themeClass}" data-card-id="${data.id}">
    <img class="card-bg" src="${data.bg}" alt="" draggable="false" />
    <div class="card-dim"></div>

    <nav class="card-nav" aria-label="卡片頁面">
      ${CARD_ORDER.map((id) => {
        const c = CARDS[id];
        const on = id === data.id ? "is-active" : "";
        return `<button type="button" class="card-nav__btn ${on}" data-goto="${id}">${escapeHtml(c.title)}</button>`;
      }).join("")}
    </nav>

    <button type="button" class="bgm-toggle ${muted ? "is-muted" : ""}" id="bgm-toggle" aria-pressed="${muted ? "true" : "false"}" aria-label="${muted ? "開啟背景音樂" : "關閉背景音樂"}">
      ${muted ? "音樂關" : "音樂開"}
    </button>

    <div class="greeting-card" id="greeting-card" role="button" tabindex="0" aria-expanded="false" aria-label="生日卡，點擊往左掀開">
      <div class="greeting-card__book">
        <!-- Right leaf: letter -->
        <div class="card-leaf card-leaf--right">
          <div class="inner-frame" aria-hidden="true"></div>
          <div class="letter-sheet">
            ${letterHtml(data.letter)}
          </div>
          ${couponPeekHtml(data)}
        </div>

        <!-- Left leaf: cover front → flips left to show photo -->
        <div class="card-leaf card-leaf--left">
          <div class="leaf-face leaf-face--cover">
            <div class="cover-frame">
              <img class="cover-logo" src="${data.cover}?v=home1" alt="" draggable="false" />
              <p class="cover-title">${escapeHtml(data.coverTitle)}</p>
              <p class="cover-sub">${escapeHtml(data.coverSub)}</p>
            </div>
          </div>
          <div class="leaf-face leaf-face--photo">
            <div class="inner-frame" aria-hidden="true"></div>
            <div class="photo-frame">
              <img class="photo-img" src="${data.photo}" alt="卡片照片" draggable="false" />
            </div>
          </div>
        </div>
      </div>
    </div>

    ${couponModalHtml()}
  </div>`;
}

function isMobileLike() {
  return (
    window.matchMedia("(max-width: 900px), (pointer: coarse)").matches ||
    window.matchMedia("(orientation: portrait) and (max-width: 900px)").matches
  );
}

/** Prefer native landscape on phones; CSS rotates the stage as fallback. */
async function requestLandscapeExperience() {
  if (!isMobileLike()) return;

  try {
    const root = document.documentElement;
    if (!document.fullscreenElement && root.requestFullscreen) {
      await root.requestFullscreen({ navigationUI: "hide" }).catch(() => {});
    }
  } catch {
    /* fullscreen may be blocked until a gesture; ignore */
  }

  try {
    const orientation = screen.orientation;
    if (orientation && typeof orientation.lock === "function") {
      await orientation.lock("landscape").catch(() => {});
    }
  } catch {
    /* iOS / desktop often disallow lock; CSS fallback handles layout */
  }
}

async function ensureBgmForPage(id) {
  await unlockAudio();
  const track = PAGE_BGM[id] || "overall";
  await playTrack(track);
}

function wireBgmToggle(host) {
  const btn = $("#bgm-toggle", host);
  if (!btn) return;
  btn.addEventListener("click", async (e) => {
    e.stopPropagation();
    await unlockAudio();
    const next = !isMuted();
    setMuted(next);
    btn.classList.toggle("is-muted", next);
    btn.setAttribute("aria-pressed", next ? "true" : "false");
    btn.setAttribute("aria-label", next ? "開啟背景音樂" : "關閉背景音樂");
    btn.textContent = next ? "音樂關" : "音樂開";
    if (!next) {
      const id = host.querySelector(".card-stage")?.dataset.cardId;
      await ensureBgmForPage(id || readPage());
    }
    playSfx("click");
  });
}

function wireCoupon(host, card) {
  const peek = $("#coupon-peek", host);
  const modal = $("#coupon-modal", host);
  const closeBtn = $("#coupon-close", host);
  if (!peek || !modal) return;

  const openCoupon = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!card.classList.contains("is-open")) return;
    await unlockAudio();
    playSfx("confirm");
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("is-show"));
  };

  const closeCoupon = (e) => {
    e?.stopPropagation();
    modal.classList.remove("is-show");
    window.setTimeout(() => {
      modal.hidden = true;
    }, 280);
    playSfx("whoosh");
  };

  peek.addEventListener("click", openCoupon);
  closeBtn?.addEventListener("click", closeCoupon);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeCoupon(e);
  });
}

function mount(id) {
  const data = CARDS[id];
  const host = $("#cards-root");
  host.innerHTML = buildCard(data);
  document.title = `${data.title} · Ann Birthday Card`;
  document.documentElement.dataset.cardTheme = id;

  const card = $("#greeting-card");
  let flipTimer = 0;

  requestAnimationFrame(() => {
    card.classList.add("is-visible");
  });

  wireBgmToggle(host);
  wireCoupon(host, card);

  const toggleCard = async () => {
    requestLandscapeExperience();
    await ensureBgmForPage(id);
    const opening = !card.classList.contains("is-open");
    window.clearTimeout(flipTimer);

    // Don't flip while coupon modal is open
    const modal = $("#coupon-modal", host);
    if (modal && !modal.hidden) return;

    if (opening) {
      card.classList.add("is-open");
      card.setAttribute("aria-expanded", "true");
      flipTimer = window.setTimeout(() => {
        card.classList.add("is-cover-mid");
      }, FLIP_MID_MS);
      playSfx("whoosh");
    } else {
      card.classList.remove("is-open");
      card.setAttribute("aria-expanded", "false");
      flipTimer = window.setTimeout(() => {
        card.classList.remove("is-cover-mid");
      }, FLIP_MID_MS);
    }
  };

  card.addEventListener("click", toggleCard);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleCard();
    }
  });

  host.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      requestLandscapeExperience();
      const next = btn.getAttribute("data-goto");
      if (!next || next === id) return;
      window.clearTimeout(flipTimer);
      playSfx("click");
      setPage(next);
      mount(next);
      await ensureBgmForPage(next);
    });
  });
}

function boot() {
  requestLandscapeExperience();
  const id = readPage();
  setPage(id);
  mount(id);
}

boot();
