(() => {
  const play = document.getElementById("play");
  const line = document.getElementById("line");
  const reel = document.getElementById("reel");
  const strip = document.getElementById("reel-strip");

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const show = async (el, ms = 900) => {
    el.hidden = false;
    // force style recalc so opacity transition runs
    void el.offsetWidth;
    el.classList.add("is-visible");
    await wait(ms);
  };

  const hide = async (el, ms = 900) => {
    el.classList.remove("is-visible");
    await wait(ms);
    el.hidden = true;
  };

  const showLine = async (text, holdMs = 2200) => {
    line.textContent = text;
    await show(line, 900);
    await wait(holdMs);
    await hide(line, 900);
  };

  const runReel = async () => {
    await show(reel, 1200);

    const viewport = reel.clientHeight;
    const total = strip.scrollHeight;
    const travel = Math.max(0, total - viewport);
    const duration = 15000;

    const start = performance.now();
    await new Promise((resolve) => {
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        // ease-in-out for a gentle pan
        const eased =
          t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        strip.style.transform = `translate3d(0, ${-travel * eased}px, 0)`;
        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(tick);
    });

    await wait(400);
    await hide(reel, 1200);
    strip.style.transform = "translate3d(0, 0, 0)";
  };

  const sequence = async () => {
    play.disabled = true;
    await hide(play, 700);

    await showLine("誒，這是…？", 2000);
    await showLine("是以前那部影片吧！", 2400);
    await showLine("[2025/11/24 安安寶貝生日快樂❤️]", 4200);

    await runReel();

    await wait(500);
    await showLine("好懷念那些以前的日子啊", 1000000);
  };

  const boot = async () => {
    // preload stills
    const imgs = [...strip.querySelectorAll("img")];
    await Promise.all(
      imgs.map(
        (img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                img.addEventListener("load", resolve, { once: true });
                img.addEventListener("error", resolve, { once: true });
              })
      )
    );

    play.hidden = false;
    await show(play, 900);
  };

  play.addEventListener("click", () => {
    sequence().catch((err) => console.error(err));
  });

  boot().catch((err) => console.error(err));
})();
