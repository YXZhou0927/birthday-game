/**
 * 巨城篇 — 娃娃、逛街、日落照片、愛心 1–2 → 燒肉
 */
import { UNCLE_SHAWN } from "./places.js";

const BIGCITY_PHOTO = [
  "assets/art/bigcity-frames/01.png",
  "assets/art/bigcity-frames/02.png",
  "assets/art/bigcity-frames/03.png",
  "assets/art/bigcity-frames/04.png",
  "assets/art/bigcity-frames/05.png",
  "assets/art/bigcity-frames/06.png",
  "assets/art/bigcity-frames/07.png",
  "assets/art/bigcity-frames/08.png",
];

export default {
  id: "big-city",
  title: "巨城篇",
  startWithPlay: true,
  steps: [
    { type: "vista", id: "doll-shop", waitTap: false, props: { dollName: "新夥伴" } },
    {
      type: "narration",
      text: "推開星·奇·市的門，貨架上全是軟軟的、圓圓的——這天的生日，我們多了一位可愛的新夥伴。",
    },
    { type: "prompt", text: "給新夥伴取個名字吧" },
    {
      type: "input",
      label: "新夥伴叫什麼名字？",
      placeholder: "例如：林寶貝",
      storeAs: "dollName",
      button: "就是這個！",
    },
    { type: "heart", piece: 1 },
    { type: "vista", id: "doll-shop", waitTap: true, autoClear: false },
    {
      type: "narration",
      text: "於是 {dollName} 正式加入我們的隊伍！店員笑咪咪地看著，旁邊還有其他客人在挑盲盒。",
    },
    {
      type: "dialogue",
      text: "希望每個娃娃都能陪著我們，讓彼此永遠不孤單。",
    },
    {
      type: "narration",
      text: "{dollName} 好像也會偷偷說「我愛妳」呢——當然，是用最軟的聲音。",
    },
    {
      type: "narration",
      text: "不過來巨城，絕對不只買娃娃而已。今天我們可是要好好 Shopping 的日子！",
    },
    { type: "confirm", label: "我們逛完了！" },
    {
      type: "choose",
      prompt: "我們還買了哪些？（可複選；若沒買請選最後一項）",
      multi: true,
      min: 1,
      exclusiveId: "none",
      storeAs: "gifts",
      button: "就是這樣！",
      options: [
        { id: "clothes", label: "衣服" },
        { id: "accessory", label: "飾品" },
        { id: "perfume", label: "香水" },
        { id: "skincare", label: "保養品" },
        { id: "stationery", label: "文具" },
        { id: "none", label: "沒有買但是一起逛街也很開心" },
      ],
    },
    {
      type: "if",
      check: "giftsNone",
      then: [
        { type: "vista", id: "shopping-stroll", waitTap: true, autoClear: false },
        {
          type: "narration",
          text: "袋子是空的也沒關係——我們手牽手慢慢逛，比什麼戰利品都甜。",
        },
      ],
      else: [
        { type: "vista", id: "shopping-haul", waitTap: true, autoClear: false },
        {
          type: "narration",
          text: "我們抱著新買的{gifts}，笑得眼睛都彎起來了——連旁邊的客人都被傳染了。",
        },
      ],
    },
    { type: "heart", piece: 2 },
    {
      type: "narration",
      text: "那天我們收穫滿滿。黃昏時分，還在巨城附近拍了一張照片——晚霞、花束，還有她笑得很開心的樣子。",
    },
    {
      type: "reel",
      mode: "fade",
      frames: BIGCITY_PHOTO,
      perFrameMs: 420,
      fadeIn: 500,
      fadeOut: 700,
      holdEnd: 400,
    },
    {
      type: "narration",
      text: "後來每當翻到這張照片，我們都會想起那天的風，還有花香混著夕陽的味道。",
    },
    {
      type: "narration",
      text: "但冒險還沒結束——晚上，還要去吃最新歡的料理。",
    },
    {
      type: "narration",
      text: "燒肉！而且是家附近評價超高、超有名的那家燒肉餐酒館。",
    },
    { type: "prompt", text: "前往 Uncle Shawn 燒肉餐酒館" },
    {
      type: "confirm",
      label: "我們到餐廳了！",
      gps: UNCLE_SHAWN,
      waitingText: "正在感應我們是否靠近 Uncle Shawn…",
      farText: "我們還沒到燒肉店喔",
      nearText: "香氣飄來了！可以確認",
      rejectText: "再走近餐廳一點吧",
    },
    { type: "clear" },
    { type: "goto", level: "restaurant" },
  ],
};
