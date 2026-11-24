import { CARDS, CARD_ORDER } from "./cards-data.js";

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

function iconsHtml(urls) {
  return urls
    .map(
      (src, i) =>
        `<img class="card-deco card-deco--${i}" src="${src}" alt="" draggable="false" />`
    )
    .join("");
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

    <p class="card-hint" id="card-hint">點擊卡片往左掀開 ✦</p>

    <button type="button" class="greeting-card" id="greeting-card" aria-expanded="false" aria-label="生日卡，點擊往左掀開">
      <div class="greeting-card__book">
        <!-- Stickers sit on the outer card edge (centers on border) -->
        <div class="card-stickers" aria-hidden="true">${iconsHtml(data.icons)}</div>

        <!-- Right leaf: letter -->
        <div class="card-leaf card-leaf--right">
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
              <p class="cover-fold-hint">左右對折 · 點擊掀開</p>
            </div>
          </div>
          <div class="leaf-face leaf-face--photo">
            <div class="photo-frame">
              <img class="photo-img" src="${data.photo}" alt="卡片照片" draggable="false" />
            </div>
            <p class="photo-caption">${escapeHtml(data.photoCaption)}</p>
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

  requestAnimationFrame(() => {
    card.classList.add("is-visible");
  });

  card.addEventListener("click", () => {
    const open = card.classList.toggle("is-open");
    card.setAttribute("aria-expanded", open ? "true" : "false");
    if (hint) {
      hint.textContent = open ? "再點一次可合上 ✦" : "點擊卡片往左掀開 ✦";
    }
  });

  host.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const next = btn.getAttribute("data-goto");
      if (!next || next === id) return;
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
