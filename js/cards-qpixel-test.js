/**
 * Test page: open greeting card with Q-pixel consecutive frames
 * on the left photo leaf (3:4, matching the private source photo).
 * Real photos are never loaded here — only generated pixel frames.
 */

import { assertAccess } from "./access-gate.js";

const FLIP_MID_MS = 450;

const FRAMES = [
  "assets/art/cards/photos/qpixel-test/f01.png",
  "assets/art/cards/photos/qpixel-test/f02.png",
  "assets/art/cards/photos/qpixel-test/f03.png",
  "assets/art/cards/photos/qpixel-test/f04.png",
];

const FRAME_MS = 380;

const LETTER = [
  "【Q 版像素連續幀測試】",
  "",
  "左側照片改為 3:4 連續幀，",
  "比例對齊原 iPhone 直向照片。",
  "真實照片不會上傳 GitHub。",
  "",
  "點卡片掀開後可看動畫。",
];

function $(sel, root = document) {
  return root.querySelector(sel);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function letterHtml(lines) {
  return lines
    .map((line) => {
      if (!line) return `<p class="letter-line letter-line--blank">&nbsp;</p>`;
      return `<p class="letter-line">${escapeHtml(line)}</p>`;
    })
    .join("");
}

function build() {
  return `
  <div class="card-stage card-theme--qpixel-test" data-card-id="qpixel-test">
    <img class="card-bg" src="assets/art/scenes/bedroom_future.png" alt="" draggable="false" />
    <div class="card-dim"></div>

    <nav class="card-nav" aria-label="測試導覽">
      <a class="card-nav__btn" href="cards.html?page=home">回正式卡片</a>
      <span class="card-nav__btn is-active">Q-pixel 測試</span>
    </nav>

    <div class="greeting-card" id="greeting-card" role="button" tabindex="0" aria-expanded="false" aria-label="測試卡，點擊掀開">
      <div class="greeting-card__book">
        <div class="card-leaf card-leaf--right">
          <div class="inner-frame" aria-hidden="true"></div>
          <div class="letter-sheet">${letterHtml(LETTER)}</div>
        </div>
        <div class="card-leaf card-leaf--left">
          <div class="leaf-face leaf-face--cover">
            <div class="cover-frame">
              <img class="cover-logo" src="assets/art/cards/home/cover.png" alt="" draggable="false" />
              <p class="cover-title">Happy Birthday</p>
              <p class="cover-sub">Q-pixel 連續幀測試</p>
            </div>
          </div>
          <div class="leaf-face leaf-face--photo">
            <div class="inner-frame" aria-hidden="true"></div>
            <div class="photo-frame">
              <img class="photo-img" id="qpixel-frame" src="${FRAMES[0]}" alt="Q 版像素連續幀" width="240" height="320" draggable="false" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <p class="qpixel-badge">測試頁 · 左圖 3:4 Q-pixel 連續幀（非真實照片）</p>
  </div>`;
}

function mount() {
  const host = $("#cards-root");
  host.innerHTML = build();
  document.title = "Q-pixel 連續幀測試 · Ann Birthday Card";

  const card = $("#greeting-card");
  const img = $("#qpixel-frame");
  let flipTimer = 0;
  let frameTimer = 0;
  let frameIdx = 0;

  const stopAnim = () => {
    window.clearInterval(frameTimer);
    frameTimer = 0;
  };

  const startAnim = () => {
    stopAnim();
    frameTimer = window.setInterval(() => {
      frameIdx = (frameIdx + 1) % FRAMES.length;
      img.src = FRAMES[frameIdx];
    }, FRAME_MS);
  };

  requestAnimationFrame(() => card.classList.add("is-visible"));

  const toggle = () => {
    const opening = !card.classList.contains("is-open");
    window.clearTimeout(flipTimer);
    if (opening) {
      card.classList.add("is-open");
      card.setAttribute("aria-expanded", "true");
      flipTimer = window.setTimeout(() => card.classList.add("is-cover-mid"), FLIP_MID_MS);
      startAnim();
    } else {
      card.classList.remove("is-open");
      card.setAttribute("aria-expanded", "false");
      flipTimer = window.setTimeout(() => card.classList.remove("is-cover-mid"), FLIP_MID_MS);
      stopAnim();
      frameIdx = 0;
      img.src = FRAMES[0];
    }
  };

  card.addEventListener("click", toggle);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });
}

async function boot() {
  if (!(await assertAccess())) return;
  mount();
}

boot();
