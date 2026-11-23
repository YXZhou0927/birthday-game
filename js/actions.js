/** Step action handlers for the birthday game engine. */

import { distanceMeters, readPosition, watchUntilNear } from "./geo.js";
import { playHeartCollect } from "./heart.js";
import {
  fillTemplate,
  loadMemory,
  saveMemory,
  giftsAreNone,
} from "./memory.js";
import { mountVista, clearVista, buildVista, walkActorTo, futureArt } from "./vistas.js";
import { playVistaTrack, playSfx, playTrack } from "./audio.js";

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

async function animateTravel(el, from, to, duration, apply) {
  const start = performance.now();
  await new Promise((resolve) => {
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      apply(from + (to - from) * easeInOut(t), t);
      if (t < 1) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });
}

function t(text) {
  return fillTemplate(text, loadMemory());
}

export function createActions(ui, ctx) {
  const {
    els,
    wait,
    show,
    hide,
    hideAllText,
    hideSpeech,
    waitForTap,
    say,
    preloadImages,
  } = ui;

  return {
    async narration(step) {
      await say("回憶", t(step.text), {
        fade: step.fade ?? 420,
        holdMs: step.holdMs ?? null,
      });
      if (step.holdMs != null) await hideSpeech(280);
    },

    async dialogue(step) {
      const body = t(step.text);
      const text = step.speaker ? `${step.speaker}\n「${body}」` : `「${body}」`;
      await say("低語", text, {
        fade: step.fade ?? 420,
        holdMs: step.holdMs ?? null,
      });
      if (step.holdMs != null) await hideSpeech(280);
    },

    async prompt(step) {
      await say("提示", t(step.text), {
        fade: step.fade ?? 420,
        holdMs: step.holdMs ?? null,
      });
      if (step.holdMs != null) await hideSpeech(280);
    },

    async reel(step) {
      await hideAllText(700);
      const frames = step.frames ?? [];
      const mode = step.mode || "fade"; // fade = cinematic crossfade; scroll = legacy vertical pan
      await preloadImages(frames.filter((f) => !String(f).startsWith("vista:")));

      if (mode === "fade") {
        els.reel.classList.add("reel--fade");
        els.strip.innerHTML = "";
        els.strip.style.transform = "none";
        const stage = document.createElement("div");
        stage.className = "reel__fade-stage";
        els.strip.appendChild(stage);

        for (const src of frames) {
          const slide = document.createElement("div");
          slide.className = "reel__slide";
          if (String(src).startsWith("vista:")) {
            const node = buildVista(String(src).slice(6), loadMemory());
            if (node) slide.appendChild(node);
          } else {
            const img = document.createElement("img");
            img.src = src;
            img.alt = "";
            img.draggable = false;
            slide.appendChild(img);
          }
          stage.appendChild(slide);
        }

        await show(els.reel, step.fadeIn ?? 700);
        const slides = [...stage.querySelectorAll(".reel__slide")];
        const per = step.perFrameMs ?? 1600;
        for (let i = 0; i < slides.length; i++) {
          slides.forEach((s, j) => s.classList.toggle("is-on", j === i));
          await wait(per);
        }
        await wait(step.holdEnd ?? 500);
        await hide(els.reel, step.fadeOut ?? 900);
        els.reel.classList.remove("reel--fade");
        els.strip.innerHTML = "";
        return;
      }

      // Legacy vertical scroll
      els.reel.classList.remove("reel--fade");
      els.strip.innerHTML = "";
      for (const src of frames) {
        if (String(src).startsWith("vista:")) {
          const wrap = document.createElement("div");
          wrap.className = "reel__vista";
          const node = buildVista(String(src).slice(6), loadMemory());
          if (node) wrap.appendChild(node);
          els.strip.appendChild(wrap);
        } else {
          const img = document.createElement("img");
          img.src = src;
          img.alt = "";
          img.draggable = false;
          els.strip.appendChild(img);
        }
      }
      els.strip.style.transform = "translate3d(0, 0, 0)";
      await show(els.reel, step.fadeIn ?? 1200);

      const viewport = els.reel.clientHeight;
      const total = els.strip.scrollHeight;
      const travel = Math.max(0, total - viewport);
      const duration = step.duration ?? 15000;
      const start = performance.now();
      await new Promise((resolve) => {
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration);
          els.strip.style.transform = `translate3d(0, ${-travel * easeInOut(p)}px, 0)`;
          if (p < 1) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      });

      await wait(step.holdEnd ?? 400);
      await hide(els.reel, step.fadeOut ?? 1200);
      els.strip.style.transform = "translate3d(0, 0, 0)";
      els.strip.innerHTML = "";
    },

    async image(step) {
      await preloadImages([step.src]);
      els.sceneImg.src = step.src;
      els.sceneImg.style.transform = step.fit ?? "scale(1)";
      els.scene.classList.toggle("scene--dim", Boolean(step.dim));
      if (els.scene.hidden) await show(els.scene, step.fade ?? 1000);
      else {
        els.sceneImg.classList.remove("is-visible");
        void els.sceneImg.offsetWidth;
        els.sceneImg.classList.add("is-visible");
        await wait(step.fade ?? 1000);
      }
      if (step.clear) {
        await wait(step.holdMs ?? 0);
        await hide(els.scene, step.fade ?? 1000);
      }
    },

    async approach(step) {
      await hideAllText(600);
      await preloadImages([step.src]);
      els.sceneImg.src = step.src;
      els.scene.classList.remove("scene--dim");
      const from = step.fromScale ?? 0.42;
      const to = step.toScale ?? 1.05;
      els.sceneImg.style.transform = `scale(${from}) translateY(8%)`;
      await show(els.scene, step.fadeIn ?? 800);
      await animateTravel(els.sceneImg, from, to, step.duration ?? 4200, (scale, p) => {
        const bob = Math.sin(p * Math.PI * 6) * 1.2;
        els.sceneImg.style.transform = `scale(${scale}) translateY(${8 - p * 8 + bob}%)`;
      });
      await wait(step.holdEnd ?? 600);
      if (step.clear !== false) await hide(els.scene, step.fadeOut ?? 900);
    },

    /** Mount a CSS/HTML interactive vista under the text layers. */
    async vista(step) {
      const mem = loadMemory();
      const props = { ...mem, ...(step.props || {}) };
      if (step.clear) {
        await clearVista(els.vista);
        return;
      }
      playSfx("whoosh");
      mountVista(els.vista, step.id, props);
      playVistaTrack(step.id);
      if (step.holdMs != null) {
        await wait(step.holdMs);
        if (step.autoClear) await clearVista(els.vista);
        return;
      }
      if (step.waitTap !== false) {
        await waitForTap();
      }
      if (step.autoClear) await clearVista(els.vista);
    },

    /** Free-text input → saved into memory[storeAs]. */
    async input(step) {
      await hideAllText(500);
      els.inputLabel.textContent = t(step.label ?? "請輸入");
      els.inputField.value = "";
      els.inputField.placeholder = step.placeholder ?? "";
      els.inputSubmit.textContent = step.button ?? "確認";
      await show(els.inputForm, 500);
      els.inputField.focus();

      const value = await new Promise((resolve) => {
        const onSubmit = (e) => {
          e.preventDefault();
          const v = els.inputField.value.trim();
          if (!v) {
            els.inputField.classList.add("is-shake");
            setTimeout(() => els.inputField.classList.remove("is-shake"), 400);
            return;
          }
          els.inputForm.removeEventListener("submit", onSubmit);
          resolve(v);
        };
        els.inputForm.addEventListener("submit", onSubmit);
      });

      const key = step.storeAs || "dollName";
      saveMemory({ [key]: value });
      await hide(els.inputForm, 500);
    },

    /**
     * Choice chips → memory[storeAs].
     * Supports exclusiveId: selecting it clears others (and vice versa).
     */
    async choose(step) {
      await hideAllText(500);
      const multi = step.multi !== false;
      const exclusiveId = step.exclusiveId || null;
      els.chooserPrompt.textContent = t(step.prompt ?? "請選擇");
      els.chooserOptions.innerHTML = "";
      const selected = new Set();

      const syncDisabled = () => {
        els.chooserSubmit.disabled = selected.size < (step.min ?? 1);
      };

      const paint = () => {
        els.chooserOptions.querySelectorAll(".chip").forEach((btn) => {
          btn.classList.toggle("is-on", selected.has(btn.dataset.id));
        });
        syncDisabled();
      };

      for (const opt of step.options ?? []) {
        const id = typeof opt === "string" ? opt : opt.id;
        const label = typeof opt === "string" ? opt : opt.label;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "chip";
        btn.dataset.id = id;
        if (id === exclusiveId) btn.classList.add("chip--exclusive");
        btn.textContent = label;
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (exclusiveId && id === exclusiveId) {
            selected.clear();
            selected.add(exclusiveId);
          } else if (multi) {
            if (exclusiveId) selected.delete(exclusiveId);
            if (selected.has(id)) selected.delete(id);
            else selected.add(id);
          } else {
            selected.clear();
            selected.add(id);
          }
          paint();
        });
        els.chooserOptions.appendChild(btn);
      }

      els.chooserSubmit.textContent = step.button ?? "選好了！";
      els.chooserSubmit.disabled = true;
      await show(els.chooser, 500);

      await new Promise((resolve) => {
        const onDone = () => {
          if (els.chooserSubmit.disabled) return;
          els.chooserSubmit.removeEventListener("click", onDone);
          const list = [...selected];
          const key = step.storeAs || "gifts";
          saveMemory({ [key]: list });
          resolve();
        };
        els.chooserSubmit.addEventListener("click", onDone);
      });

      await hide(els.chooser, 500);
    },

    /** Run nested steps based on memory checks. */
    async if(step) {
      const mem = loadMemory();
      let ok = false;
      if (step.check === "giftsNone") ok = giftsAreNone(mem);
      else if (step.check === "giftsBought") ok = !giftsAreNone(mem) && (mem.gifts || []).length > 0;
      else if (typeof step.check === "function") ok = !!step.check(mem);
      const branch = ok ? step.then : step.else;
      if (branch?.length && ctx.runSteps) await ctx.runSteps(branch);
    },

    async confirm(step) {
      await hideAllText(280);
      els.confirm.textContent = t(step.label ?? "確認");
      els.confirm.disabled = false;
      els.gateHint.hidden = true;
      els.gateHint.textContent = "";
      await show(els.gate, 400);

      const gps = step.gps;
      let stopWatch = null;

      const finish = async () => {
        stopWatch?.();
        els.confirm.disabled = true;
        playSfx("confirm");
        await hide(els.gate, 400);
      };

      if (!gps) {
        await new Promise((resolve) => {
          const onClick = async () => {
            els.confirm.removeEventListener("click", onClick);
            await finish();
            resolve();
          };
          els.confirm.addEventListener("click", onClick);
        });
        return;
      }

      els.confirm.disabled = true;
      els.gateHint.hidden = false;
      els.gateHint.textContent = step.waitingText ?? "正在確認你的位置…";
      const target = { lat: gps.lat, lng: gps.lng };
      const radius = gps.radiusMeters ?? 100;

      const updateHint = ({ here, dist, near, error }) => {
        if (ctx.debug) {
          const d =
            dist == null
              ? "—"
              : dist < 1000
                ? `${Math.round(dist)} m`
                : `${(dist / 1000).toFixed(1)} km`;
          ctx.setDebug(
            `GPS ${target.lat.toFixed(5)}, ${target.lng.toFixed(5)}\n` +
              `you: ${here ? `${here.lat.toFixed(5)}, ${here.lng.toFixed(5)}` : "n/a"}\n` +
              `dist: ${d} / ${radius}m${near ? " ✓" : ""}`
          );
        }
        if (error) {
          els.gateHint.textContent =
            step.errorText ?? "無法取得定位，請開啟定位權限後再試";
          return;
        }
        if (near) {
          els.gateHint.textContent = step.nearText ?? "已抵達！可以確認了";
          els.confirm.disabled = false;
        } else if (dist != null) {
          const pretty =
            dist < 1000
              ? `還有約 ${Math.round(dist)} 公尺`
              : `還有約 ${(dist / 1000).toFixed(1)} 公里`;
          els.gateHint.textContent = `${step.farText ?? "再靠近一點"}（${pretty}）`;
          els.confirm.disabled = true;
        }
      };

      if (ctx.skipGps) {
        els.gateHint.textContent = "（試玩）已略過 GPS，可直接確認";
        els.confirm.disabled = false;
      } else {
        const { stop } = watchUntilNear(target, radius, { onUpdate: updateHint });
        stopWatch = stop;
      }

      await new Promise((resolve) => {
        const onClick = async () => {
          if (els.confirm.disabled) return;
          if (!ctx.skipGps && gps) {
            const here = await readPosition();
            if (!here || distanceMeters(target, here) > radius) {
              els.gateHint.textContent =
                step.rejectText ?? "好像還不夠近，再走近一點再確認吧";
              els.confirm.disabled = true;
              return;
            }
          }
          els.confirm.removeEventListener("click", onClick);
          await finish();
          resolve();
        };
        els.confirm.addEventListener("click", onClick);
      });
    },

    async heart(step) {
      await hideAllText(500);
      await playHeartCollect(ui, step.piece ?? 1);
    },

    async wait(step) {
      await wait(step.ms ?? 800);
    },

    async clear(step) {
      await hideAllText(step.fade ?? 600);
      if (!els.scene.hidden) await hide(els.scene, step.fade ?? 600);
      if (!els.reel.hidden) await hide(els.reel, step.fade ?? 600);
      if (!els.vista.hidden) await clearVista(els.vista);
    },

    async bgm(step) {
      await playTrack(step?.track || "overall");
      els.mute.hidden = false;
      els.mute.classList.add("is-visible");
    },

    /**
     * Stairs finale: heart → shrink into kid's cake → kid exits right door →
     * mom stands from bed and exits the same door.
     */
    async finale(step) {
      await hideAllText(280);
      playTrack("cozy");
      mountVista(els.vista, "future-room");
      playSfx("whoosh");
      await wait(700);

      const heart = els.vista.querySelector("#future-heart");
      const kid = els.vista.querySelector("#future-kid");
      const mom = els.vista.querySelector("#future-mom");

      heart?.classList.add("is-complete");
      await wait(1100);
      heart?.classList.add("is-shrink");
      await wait(700);
      if (heart) heart.hidden = true;

      if (kid) {
        kid.hidden = false;
        kid.classList.add("is-pop");
        playSfx("heart");
      }
      await wait(900);

      await say("低語", `「${t(step.kidLine || "媽媽——來吃蛋糕了！")}」`);
      await hideSpeech(280);

      // Child carries cake out the right-hand door.
      if (kid) {
        await walkActorTo(kid, 28, 10, {
          frames: futureArt.kidWalkRightCake(),
          ms: 1600,
        });
        kid.classList.add("is-exit");
        await wait(450);
        kid.hidden = true;
      }

      await say("回憶", t(step.momLine || "小孩捧著愛心蛋糕跑出房門——媽媽輕輕起身，跟了上去。"));
      await hideSpeech(280);

      if (mom) {
        const walk = futureArt.momWalkRight();
        mom.src = walk[0];
        mom.dataset.idleA = walk[0];
        mom.dataset.idleB = walk[1] || walk[0];
        await walkActorTo(mom, 28, 10, { frames: walk, ms: 1800 });
        mom.classList.add("is-exit");
        await wait(450);
        mom.hidden = true;
      }

      await say(
        "回憶",
        t(
          step.blessing ||
            "安安，願我們往後每一歲都被溫柔接住。今天的冒險很棒——現在，回家吃生日蛋糕吧。"
        )
      );
      await hideSpeech(280);
      await wait(400);
      await clearVista(els.vista);
    },

    /** Epilogue cinematic: party → present hug → phone → voucher. */
    async epilogueShow() {
      await hideAllText(280);
      playTrack("cozy");
      mountVista(els.vista, "epilogue");
      playSfx("whoosh");
      await wait(900);
      await say("回憶", "客廳裡好熱鬧——我們一家人圍著蛋糕，唱起生日快樂歌。");
      await hideSpeech(280);

      const party = els.vista.querySelector("#epi-party");
      const present = els.vista.querySelector("#epi-present");
      const voucher = els.vista.querySelector("#epi-voucher");
      party?.classList.add("is-shrink");
      await wait(900);
      if (party) party.hidden = true;
      if (present) {
        present.hidden = false;
        present.classList.add("is-in");
      }

      await say(
        "回憶",
        "畫面忽然縮小——原來是現在的我們：安安正拿著手機，看完了這段故事。"
      );
      await hideSpeech(280);

      await say("回憶", "她把手機輕輕放下，轉頭抱住身旁的他。");
      await hideSpeech(280);

      const phone = els.vista.querySelector("#phone-back");
      phone?.classList.add("is-zoom");
      await wait(1200);

      if (voucher) {
        voucher.hidden = false;
        voucher.classList.add("is-in");
      }
      playSfx("confirm");
      await say("提示", "獲得：Apple 兌換券");
      await hideSpeech(280);
      await say("回憶", "（悄悄話：這個周末，我們或許還會一起去挑一支新手機喔。）");
      await hideSpeech(280);
      await say("提示", "—— 遊戲結束，生日快樂安安 ——", {
        holdMs: 2600,
      });
      await hideSpeech(400);
    },

    async goto(step) {
      const id = step.level;
      const url = new URL(window.location.href);
      url.searchParams.set("level", id);
      if (step.replace !== false) window.location.replace(url.toString());
      else window.location.href = url.toString();
      await new Promise(() => {});
    },
  };
}
