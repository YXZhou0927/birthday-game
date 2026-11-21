/** DOM stage helpers shared by engine actions. */

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function createUi(root = document) {
  const els = {
    stage: root.getElementById("stage"),
    vista: root.getElementById("vista"),
    play: root.getElementById("play"),
    line: root.getElementById("line"),
    prompt: root.getElementById("prompt"),
    dialogue: root.getElementById("dialogue"),
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
    tap: root.getElementById("tap"),
    mute: root.getElementById("mute"),
    debug: root.getElementById("debug"),
  };

  const show = async (el, ms = 900) => {
    el.hidden = false;
    void el.offsetWidth;
    el.classList.add("is-visible");
    if (ms > 0) await wait(ms);
  };

  const hide = async (el, ms = 900) => {
    el.classList.remove("is-visible");
    if (ms > 0) await wait(ms);
    el.hidden = true;
  };

  const hideAllText = async (ms = 700) => {
    const textEls = [els.line, els.prompt, els.dialogue];
    await Promise.all(
      textEls.filter((el) => !el.hidden).map((el) => hide(el, ms))
    );
  };

  const waitForTap = () =>
    new Promise((resolve) => {
      els.tap.hidden = false;
      const done = () => {
        els.tap.hidden = true;
        els.tap.removeEventListener("click", done);
        resolve();
      };
      els.tap.addEventListener("click", done);
    });

  const setText = async (el, text, { fade = 900, holdMs = null } = {}) => {
    await hideAllText(fade);
    el.textContent = text;
    await show(el, fade);
    if (holdMs != null) {
      await wait(holdMs);
      return;
    }
    await waitForTap();
  };

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
    waitForTap,
    setText,
    preloadImages,
  };
}
