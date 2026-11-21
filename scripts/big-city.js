/**
 * 巨城篇 — 娃娃取名、shopping、愛心 1/4 & 2/4 → 燒肉
 */
import { UNCLE_SHAWN } from "./places.js?v=20261122f";

export default {
  id: "big-city",
  title: "巨城篇",
  startWithPlay: true,
  steps: [
    {
      type: "vista",
      id: "doll-shop",
      waitTap: false,
      props: { dollName: "新夥伴" },
    },
    {
      type: "narration",
      text: "這天的生日，多了一位可愛的新夥伴——對，就是那個被抱回家的娃娃。",
    },
    {
      type: "prompt",
      text: "給新夥伴取個名字吧",
    },
    {
      type: "input",
      label: "新夥伴叫什麼名字？",
      placeholder: "例如：林寶貝",
      storeAs: "dollName",
      button: "就是這個！",
    },
    {
      type: "heart",
      piece: 1,
    },
    {
      type: "vista",
      id: "doll-shop",
      waitTap: true,
      autoClear: false,
    },
    {
      type: "narration",
      text: "於是 {dollName} 加入隊伍！角落裡好多娃娃夥伴，圍著他們轉圈圈。",
    },
    {
      type: "dialogue",
      text: "希望每個娃娃都能陪著妳，讓妳永遠不孤單。",
    },
    {
      type: "narration",
      text: "{dollName} 好像也會偷偷說「我愛妳」呢——當然，是用最軟的聲音。",
    },
    {
      type: "narration",
      text: "不過來巨城，絕對不只買娃娃而已。今天可是要好好 Shopping 的日子！",
    },
    {
      type: "confirm",
      label: "東西買好了！",
    },
    {
      type: "choose",
      prompt: "還買了哪些好東西？（可複選）",
      multi: true,
      min: 1,
      storeAs: "gifts",
      button: "裝進袋子！",
      options: [
        "甜甜的小裙子",
        "香香的護手霜",
        "閃閃的飾品",
        "好吃的零食罐",
        "實用的小家電",
        "神秘的驚喜盲包",
      ],
    },
    {
      type: "vista",
      id: "shopping-haul",
      waitTap: true,
      autoClear: false,
    },
    {
      type: "narration",
      text: "袋子鼓鼓的：{gifts}——看她笑得眼睛都彎起來了。",
    },
    {
      type: "heart",
      piece: 2,
    },
    {
      type: "narration",
      text: "那天收穫滿滿。但冒險還沒結束——晚上，還要去吃她最新歡的料理。",
    },
    {
      type: "narration",
      text: "燒肉！而且是家附近評價超高、超有名的那家燒肉餐酒館。",
    },
    {
      type: "prompt",
      text: "前往 Uncle Shawn 燒肉餐酒館",
    },
    {
      type: "confirm",
      label: "我到餐廳了！",
      gps: UNCLE_SHAWN,
      waitingText: "正在感應你是否靠近 Uncle Shawn…",
      farText: "還沒到燒肉店喔",
      nearText: "香氣飄來了！可以確認",
      rejectText: "再走近餐廳一點吧",
    },
    { type: "clear" },
    { type: "goto", level: "restaurant" },
  ],
};
