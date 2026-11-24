import { CARDS, CARD_ORDER } from "./cards-data.js";

const FLIP_MS = 900;
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

    <p class="card-hint" id="card-hint">點擊卡片往左掀開</p>

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
              <img class="cover-logo" src="${data.cover}" alt="" draggable="false" />
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

function mount(id) {
  const data = CARDS[id];
  const host = $("#cards-root");
  host.innerHTML = buildCard(data);
  document.title = `${data.title} · Ann Birthday Card`;
  document.documentElement.dataset.cardTheme = id;

  const card = $("#greeting-card");
  const hint = $("#card-hint");
  let flipTimer = 0;

  requestAnimationFrame(() => {
    card.classList.add("is-visible");
  });

  card.addEventListener("click", () => {
    const opening = !card.classList.contains("is-open");
    window.clearTimeout(flipTimer);

    if (opening) {
      card.classList.add("is-open");
      card.setAttribute("aria-expanded", "true");
      // Hide cover logo/title at flip midpoint
      flipTimer = window.setTimeout(() => {
        card.classList.add("is-cover-mid");
      }, FLIP_MID_MS);
      if (hint) hint.textContent = "再點一次可合上";
    } else {
      card.classList.remove("is-open");
      card.setAttribute("aria-expanded", "false");
      // Reveal cover logo/title at flip midpoint while closing
      flipTimer = window.setTimeout(() => {
        card.classList.remove("is-cover-mid");
      }, FLIP_MID_MS);
      if (hint) hint.textContent = "點擊卡片往左掀開";
    }
  });

  host.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const next = btn.getAttribute("data-goto");
      if (!next || next === id) return;
      window.clearTimeout(flipTimer);
      setPage(next);
      mount(next);
    });
  });
}

function boot() {
  const id = readPage();
  setPage(id);
  mount(id);
}

boot();
