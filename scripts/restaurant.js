/**
 * 餐廳篇 — 燒肉、點餐互動、愛心 3/4 → 清大階梯
 */
import { NTHU_STAIRS } from "./places.js";

export default {
  id: "restaurant",
  title: "餐廳篇",
  startWithPlay: true,
  steps: [
    {
      type: "vista",
      id: "bbq",
      waitTap: false,
      autoClear: false,
    },
    {
      type: "narration",
      text: "推開門，炭火與醬香一起撲上來——這是他們第一次來這家燒肉餐酒館。",
    },
    {
      type: "narration",
      text: "聽說拉單槓可以喝免費啤酒，干貝漢堡更是必點！",
    },
    {
      type: "narration",
      text: "免費啤酒大概喝不到啦……但好吃的東西，可是點了好多好多。",
    },
    {
      type: "narration",
      text: "兩個人坐在座位上，菜單攤開，眼睛亮晶晶地討論要烤什麼。",
    },
    {
      type: "confirm",
      label: "點好餐了！",
    },
    {
      type: "vista",
      id: "bbq",
      waitTap: false,
      autoClear: false,
    },
    {
      type: "prompt",
      text: "點一點餐點玩看看～",
      holdMs: 1600,
    },
    {
      type: "confirm",
      label: "吃得好開心！",
    },
    {
      type: "narration",
      text: "滋滋——肉肉上桌！兩個人吃得好開心，連說話都帶著笑意。",
    },
    {
      type: "heart",
      piece: 3,
    },
    {
      type: "narration",
      text: "兩個人在一起的時光，總是這麼幸福快樂。",
    },
    {
      type: "narration",
      text: "回想起來，這一切幸福的原點……是從他第一次送花的那一刻開始的。",
    },
    {
      type: "vista",
      id: "stairs",
      waitTap: true,
      autoClear: false,
    },
    {
      type: "prompt",
      text: "去第一次送花的地方看看吧",
    },
    {
      type: "confirm",
      label: "我到階梯了！",
      gps: NTHU_STAIRS,
      waitingText: "正在感應清大校園位置…",
      farText: "還沒到那個階梯喔",
      nearText: "熟悉的風——可以確認了",
      rejectText: "再走近一點那個階梯吧",
    },
    { type: "clear" },
    { type: "goto", level: "stairs" },
  ],
};
