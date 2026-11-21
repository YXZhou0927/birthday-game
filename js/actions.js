/** Step action handlers for the birthday game engine. */

import { distanceMeters, readPosition, watchUntilNear } from "./geo.js";
import { playHeartCollect } from "./heart.js";

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

export function createActions(ui, ctx) {
  const { els, wait, show, hide, hideAllText, waitForTap, setText, preloadImages } =
    ui;

  return {
    /** Auto or tap narration (centered). */
    async narration(step) {
      await setText(els.line, step.text, {
        fade: step.fade ?? 900,
        holdMs: step.holdMs ?? null,
      });
      if (step.holdMs != null) await hide(els.line, step.fade ?? 900);
    },

    /** Quoted dialogue line. */
    async dialogue(step) {
      const text = step.speaker
        ? `${step.speaker}\n「${step.text}」`
        : `「${step.text}」`;
      await setText(els.dialogue, text, {
        fade: step.fade ?? 900,
        holdMs: step.holdMs ?? null,
      });
      if (step.holdMs != null) await hide(els.dialogue, step.fade ?? 900);
    },

    /** Emphasized stage direction / quest prompt. */
    async prompt(step) {
      await setText(els.prompt, step.text, {
        fade: step.fade ?? 900,
        holdMs: step.holdMs ?? null,
      });
      if (step.holdMs != null) await hide(els.prompt, step.fade ?? 900);
    },

    /** Multi-frame vertical “short film” reel (from the original demo). */
    async reel(step) {
      await hideAllText(700);
      const frames = step.frames ?? [];
      await preloadImages(frames);

      els.strip.innerHTML = "";
      for (const src of frames) {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "";
        img.draggable = false;
        els.strip.appendChild(img);
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
          const t = Math.min(1, (now - start) / duration);
          const eased = easeInOut(t);
          els.strip.style.transform = `translate3d(0, ${-travel * eased}px, 0)`;
          if (t < 1) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      });

      await wait(step.holdEnd ?? 400);
      await hide(els.reel, step.fadeOut ?? 1200);
      els.strip.style.transform = "translate3d(0, 0, 0)";
      els.strip.innerHTML = "";
    },

    /** Fade in a still (optionally stay under later steps). */
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

    /** First-person walk: image grows from far → near. */
    async approach(step) {
      await hideAllText(600);
      await preloadImages([step.src]);
      els.sceneImg.src = step.src;
      els.scene.classList.remove("scene--dim");
      const from = step.fromScale ?? 0.42;
      const to = step.toScale ?? 1.05;
      els.sceneImg.style.transform = `scale(${from}) translateY(8%)`;
      await show(els.scene, step.fadeIn ?? 800);

      await animateTravel(
        els.sceneImg,
        from,
        to,
        step.duration ?? 4200,
        (scale, t) => {
          const bob = Math.sin(t * Math.PI * 6) * 1.2;
          els.sceneImg.style.transform = `scale(${scale}) translateY(${8 - t * 8 + bob}%)`;
        }
      );

      await wait(step.holdEnd ?? 600);
      if (step.clear !== false) {
        await hide(els.scene, step.fadeOut ?? 900);
      }
    },

    /**
     * Confirm gate.
     * - no gps → manual confirm
     * - gps → must be within radius (or debug skip)
     */
    async confirm(step) {
      await hideAllText(600);

      els.confirm.textContent = step.label ?? "確認";
      els.confirm.disabled = false;
      els.gateHint.hidden = true;
      els.gateHint.textContent = "";
      await show(els.gate, 700);

      const gps = step.gps;
      let stopWatch = null;

      const finish = async () => {
        stopWatch?.();
        els.confirm.disabled = true;
        await hide(els.gate, 700);
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

      // GPS gate
      els.confirm.disabled = true;
      els.gateHint.hidden = false;
      els.gateHint.textContent = step.waitingText ?? "正在確認你的位置…";

      const target = { lat: gps.lat, lng: gps.lng };
      const radius = gps.radiusMeters ?? 100;

      const updateHint = ({ here, dist, near, error }) => {
        if (ctx.debug) {
          const d =
            dist == null ? "—" : dist < 1000 ? `${Math.round(dist)} m` : `${(dist / 1000).toFixed(1)} km`;
          ctx.setDebug(
            `GPS target ${target.lat.toFixed(5)}, ${target.lng.toFixed(5)}\n` +
              `you: ${here ? `${here.lat.toFixed(5)}, ${here.lng.toFixed(5)} (±${Math.round(here.accuracy || 0)}m)` : "n/a"}\n` +
              `dist: ${d} / ${radius} m${near ? " ✓" : ""}`
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
        els.gateHint.textContent = "（debug）已略過 GPS，可直接確認";
        els.confirm.disabled = false;
      } else {
        const { promise, stop } = watchUntilNear(target, radius, {
          onUpdate: updateHint,
        });
        stopWatch = stop;
        // Also allow immediate check from a one-shot if already near
        promise.catch(() => {});
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

    /** Collect a heart quarter (piece 1–4). */
    async heart(step) {
      await hideAllText(500);
      await playHeartCollect(ui, step.piece ?? 1);
    },

    async wait(step) {
      await wait(step.ms ?? 800);
    },

    /** Clear lingering scene / text layers. */
    async clear(step) {
      await hideAllText(step.fade ?? 600);
      if (!els.scene.hidden) await hide(els.scene, step.fade ?? 600);
      if (!els.reel.hidden) await hide(els.reel, step.fade ?? 600);
    },

    /** Jump to another level (NFC-style deep link). */
    async goto(step) {
      const id = step.level;
      const url = new URL(window.location.href);
      url.searchParams.set("level", id);
      if (step.replace !== false) {
        window.location.replace(url.toString());
      } else {
        window.location.href = url.toString();
      }
      // Keep engine paused while navigation happens
      await new Promise(() => {});
    },
  };
}
