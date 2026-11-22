/**
 * 階梯篇 — 愛心 4、未來揭示、祝福回家
 */

export default {
  id: "stairs",
  title: "階梯篇",
  startWithPlay: true,
  steps: [
    { type: "vista", id: "stairs", waitTap: false },
    {
      type: "narration",
      text: "對很多人來說，這裡只是校園裡普通的階梯，走過無數次也不會多看一眼。",
    },
    {
      type: "narration",
      text: "可對我們來說——這裡，是幸福故事的起點。",
    },
    {
      type: "narration",
      text: "第一年，我們坐在這裡聊天、抱抱。那麼單純，又那麼可愛。",
    },
    { type: "vista", id: "stairs-memory", waitTap: true, autoClear: false },
    {
      type: "narration",
      text: "花還在手裡，風還在樹葉間——那一刻的我們，好像把整個世界都收進同一個畫面裡了。",
    },
    {
      type: "narration",
      text: "希望這樣的幸福，可以一直一直持續下去。",
    },
    { type: "heart", piece: 4 },
    {
      type: "narration",
      text: "四片愛心湊齊的瞬間，回憶也悄悄走到了尾聲……",
      holdMs: 1600,
    },
    {
      type: "finale",
      kidLine: "媽媽——來吃蛋糕了！",
      blessing:
        "安安，願我們往後每一歲都被溫柔接住。今天的冒險很棒——現在，回家吃生日蛋糕吧。",
    },
    { type: "prompt", text: "下一章：額外篇章", holdMs: 1400 },
    { type: "goto", level: "epilogue" },
  ],
};
