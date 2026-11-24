import { ACCESS_PASSWORD } from "./access-config.js";

const STORAGE_KEY = "ann-birthday-access-v1";
const PARAM_KEYS = ["pw", "password", "key"];

function readProvidedPassword() {
  const params = new URLSearchParams(location.search);
  for (const k of PARAM_KEYS) {
    const v = params.get(k);
    if (v != null && String(v).length) return String(v);
  }
  return "";
}

function stripPasswordFromUrl() {
  const url = new URL(location.href);
  let changed = false;
  for (const k of PARAM_KEYS) {
    if (url.searchParams.has(k)) {
      url.searchParams.delete(k);
      changed = true;
    }
  }
  if (changed) history.replaceState({}, "", url);
}

function showDenied() {
  document.documentElement.dataset.access = "denied";
  document.body.innerHTML = `
    <main class="access-denied" role="alert">
      <p class="access-denied__title">無法開啟</p>
      <p class="access-denied__body">需要正確的邀請連結才能查看這份卡片。</p>
    </main>`;
  document.title = "無法開啟";
}

function injectDeniedStyles() {
  if (document.getElementById("access-denied-style")) return;
  const style = document.createElement("style");
  style.id = "access-denied-style";
  style.textContent = `
    .access-denied {
      min-height: 100dvh;
      margin: 0;
      display: grid;
      place-content: center;
      gap: 0.6rem;
      padding: 2rem;
      background: #1a1210;
      color: #f5ebe4;
      font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
      text-align: center;
    }
    .access-denied__title {
      margin: 0;
      font-size: clamp(1.6rem, 4vw, 2.2rem);
      letter-spacing: 0.04em;
    }
    .access-denied__body {
      margin: 0;
      opacity: 0.78;
      font-size: 1rem;
      line-height: 1.5;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Gate the current page. Returns true when access is allowed.
 * Success is remembered in sessionStorage for this tab.
 */
export async function assertAccess() {
  injectDeniedStyles();

  const expected = String(ACCESS_PASSWORD ?? "");
  if (!expected) {
    // Empty config = gate disabled (dev escape hatch).
    return true;
  }

  const provided = readProvidedPassword();
  if (provided) {
    if (provided === expected) {
      sessionStorage.setItem(STORAGE_KEY, "ok");
      stripPasswordFromUrl();
      return true;
    }
    sessionStorage.removeItem(STORAGE_KEY);
    showDenied();
    return false;
  }

  if (sessionStorage.getItem(STORAGE_KEY) === "ok") {
    return true;
  }

  showDenied();
  return false;
}
