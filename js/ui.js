/** DOM stage helpers — dialogue lives in the bottom speech panel. */

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function createUi(root = document) {
  const els = {
    stage: root.getElementById("stage"),
    world: root.getElementById("world"),
    dock: root.getElementById("dock"),
    vista: root.getElementById("vista"),
    play: root.getElementById("play"),
    speech: root.getElementById("speech"),
    speechKind: root.getElementById("speech-kind"),
    speechText: root.getElementById("speech-text"),
    // legacy aliases kept so older action code paths stay safe
    line: root.getElementById("speech-text"),
    prompt: root.getElementById("speech-text"),
    dialogue: root.getElementById("speech-text"),
    reel: root.getElementById("reel"),
    strip: root.getElementById("reel-strip"),
    scene: root.getElementById("scene"),
    sceneImg: root.getElementById("scene-img"),
    inputForm: root.getElementById("input-form"),
    inputLabel: root.getElementById("input-label"),
    inputField: root.getElementById("input-field"),
    inputSubmit: root.getElementById("input-submit"),
    chooser: root.getElementById("chooser"),
    chooserPrompt: root.getElementById("chooser-prompt"),
    chooserOptions: root.getElementById("chooser-options"),
    chooserSubmit: root.getElementById("chooser-submit"),
    gate: root.getElementById("gate"),
    confirm: root.getElementById("confirm"),
    gateHint: root.getElementById("gate-hint"),
    heartOverlay: root.getElementById("heart-overlay"),
    heartLabel: root.getElementById("heart-label"),
    heartFull: root.getElementById("heart-full"),
    tap: root.getElementById("tap"),
    mute: root.getElementById("mute"),
    debug: root.getElementById("debug"),
  };

  const show = async (el, ms = 500) => {
    el.hidden = false;
    void el.offsetWidth;
    el.classList.add("is-visible");
    if (ms > 0) await wait(ms);
  };

  const hide = async (el, ms = 400) => {
    el.classList.remove("is-visible");
    if (ms > 0) await wait(ms);
    el.hidden = true;
  };

  const hideSpeech = async (ms = 280) => {
    if (els.speech.hidden) return;
    await hide(els.speech, ms);
  };

  const hideAllText = async (ms = 280) => hideSpeech(ms);

  const waitForTap = () =>
    new Promise((resolve) => {
      els.tap.hidden = false;
      els.speech?.classList.add("is-waiting");
      const done = () => {
        els.tap.hidden = true;
        els.speech?.classList.remove("is-waiting");
        els.tap.removeEventListener("click", done);
        resolve();
      };
      els.tap.addEventListener("click", done);
    });

  /**
   * Show a line in the bottom dialogue box.
   * @param {'回憶'|'提示'|'低語'|string} kind
   */
  const say = async (kind, text, { fade = 420, holdMs = null } = {}) => {
    await hideSpeech(fade > 200 ? 280 : fade);
    els.speechKind.textContent = kind || "回憶";
    els.speechText.textContent = text;
    els.speech.dataset.kind = kind || "回憶";
    await show(els.speech, fade);
    if (holdMs != null) {
      await wait(holdMs);
      return;
    }
    await waitForTap();
  };

  /** @deprecated use say() */
  const setText = async (_el, text, opts = {}) => say("回憶", text, opts);

  const preloadImages = (urls) =>
    Promise.all(
      urls.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => resolve(src);
            img.src = src;
          })
      )
    );

  return {
    els,
    wait,
    show,
    hide,
    hideAllText,
    hideSpeech,
    waitForTap,
    say,
    setText,
    preloadImages,
  };
}
