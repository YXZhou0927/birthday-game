/** Declarative script runner for Ann Birthday Game. */

import { createUi } from "./ui.js";
import { createActions } from "./actions.js";
import { startBgm, setMuted, isMuted } from "./bgm.js";

export class GameEngine {
  /**
   * @param {object} options
   * @param {boolean} [options.debug]
   * @param {boolean} [options.skipGps]
   */
  constructor(options = {}) {
    this.debug = Boolean(options.debug);
    this.skipGps = Boolean(options.skipGps);
    this.ui = createUi();
    this.ctx = {
      debug: this.debug,
      skipGps: this.skipGps,
      setDebug: (text) => this.setDebug(text),
    };
    this.actions = createActions(this.ui, this.ctx);
    this.running = false;

    if (this.debug) {
      this.ui.els.debug.hidden = false;
      this.setDebug("debug on" + (this.skipGps ? " · skipGps" : ""));
    }

    this.ui.els.mute?.addEventListener("click", () => {
      setMuted(!isMuted());
      this.ui.els.mute.classList.toggle("is-off", isMuted());
      this.ui.els.mute.textContent = isMuted() ? "🔇" : "♪";
    });
  }

  setDebug(text) {
    if (!this.debug) return;
    this.ui.els.debug.textContent = text;
  }

  async run(script) {
    if (this.running) return;
    this.running = true;
    document.title = script.title
      ? `${script.title} · Ann Birthday 2026`
      : "Ann Birthday Game 2026";

    try {
      if (script.startWithPlay !== false) {
        await this.waitForPlay();
      }
      for (const step of script.steps ?? []) {
        await this.runStep(step);
      }
      if (typeof script.onComplete === "function") {
        await script.onComplete(this);
      }
    } finally {
      this.running = false;
    }
  }

  async waitForPlay() {
    const { els, show, hide } = this.ui;

    // Attach listener before the button becomes visible so early taps count.
    const played = new Promise((resolve) => {
      const onPlay = async () => {
        els.play.removeEventListener("click", onPlay);
        els.play.disabled = true;
        await startBgm();
        els.mute.hidden = false;
        els.mute.classList.add("is-visible");
        await hide(els.play, 700);
        resolve();
      };
      els.play.addEventListener("click", onPlay);
    });

    els.play.hidden = false;
    els.play.disabled = false;
    await show(els.play, 900);
    await played;
  }

  async runStep(step) {
    if (!step || !step.type) return;
    const handler = this.actions[step.type];
    if (!handler) {
      console.warn(`[engine] unknown step type: ${step.type}`, step);
      return;
    }
    if (this.debug) {
      const tip = step.text || step.id || step.label || step.prompt || "";
      this.setDebug(`step: ${step.type}${tip ? `\n${String(tip).slice(0, 48)}` : ""}`);
    }
    await handler.call(this.actions, step);
  }
}
