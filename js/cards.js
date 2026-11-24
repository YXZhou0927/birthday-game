import { CARDS, CARD_ORDER } from "./cards-data.js";

const FLIP_MID_MS = 450;

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

function buildCard(data) {
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

    <button type="button" class="greeting-card" id="greeting-card" aria-expanded="false" aria-label="生日卡，點擊往左掀開">
      <div class="greeting-card__book">
        <!-- Right leaf: letter -->
        <div class="card-leaf card-leaf--right">
          <div class="inner-frame" aria-hidden="true"></div>
          <div class="letter-sheet">
            ${letterHtml(data.letter)}
          </div>
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
    </button>
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

  card.addEventListener("click", () => {
    requestLandscapeExperience();
    const opening = !card.classList.contains("is-open");
    window.clearTimeout(flipTimer);

    if (opening) {
      card.classList.add("is-open");
      card.setAttribute("aria-expanded", "true");
      flipTimer = window.setTimeout(() => {
        card.classList.add("is-cover-mid");
      }, FLIP_MID_MS);
    } else {
      card.classList.remove("is-open");
      card.setAttribute("aria-expanded", "false");
      flipTimer = window.setTimeout(() => {
        card.classList.remove("is-cover-mid");
      }, FLIP_MID_MS);
    }
  });

  host.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      requestLandscapeExperience();
      const next = btn.getAttribute("data-goto");
      if (!next || next === id) return;
      window.clearTimeout(flipTimer);
      setPage(next);
      mount(next);
    });
  });
}

function boot() {
  // Best-effort on load (often ignored without gesture); gesture handlers retry.
  requestLandscapeExperience();
  const id = readPage();
  setPage(id);
  mount(id);
}

boot();
