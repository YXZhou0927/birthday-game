/**
 * 序章 — 30 年後的「我們」回憶今年生日冒險的起點
 */
import { BIG_CITY } from "./places.js";

const REEL_FRAMES = [
  "assets/art/intro-frames/01.png",
  "assets/art/intro-frames/02.png",
  "assets/art/intro-frames/03.png",
  "assets/art/intro-frames/04.png",
  "assets/art/intro-frames/05.png",
  "assets/art/intro-frames/06.png",
  "assets/art/intro-frames/07.png",
  "vista:beach-card",
];

export default {
  id: "prologue",
  title: "序章",
  startWithPlay: true,
  steps: [
    { type: "vista", id: "sparkle", waitTap: false },
    {
      type: "narration",
      text: "奇怪……怎麼會冒出這支影片？是因為我們碰到那張貼紙了嗎？",
    },
    {
      type: "reel",
      mode: "fade",
      frames: REEL_FRAMES,
      perFrameMs: 1450,
      fadeIn: 700,
      fadeOut: 800,
    },
    {
      type: "narration",
      text: "啊，這是以前的生日影片吧。畫面一格一格亮起來，我們看著看著，心裡就暖起來了。",
    },
    {
      type: "narration",
      text: "清大那些日子，大概有一半的時間，都是我們一起度過的吧——圖書館、食堂、還有那個總是有風的階梯。",
    },
    {
      type: "narration",
      text: "就算後來分隔兩地，我們也總是像在身邊一樣，每天互相加油打氣。",
    },
    {
      type: "narration",
      text: "而今年這個生日……說真的，簡直像一場小小的冒險，好玩到現在還會偷笑。",
    },
    {
      type: "narration",
      text: "故事的起點，當然是新竹我們最常去的那個商場——巨城。",
    },
    { type: "prompt", text: "出發吧，去我們的冒險起點" },
    {
      type: "confirm",
      label: "我們到巨城了！",
      gps: BIG_CITY,
      waitingText: "正在感應我們是否靠近巨城…",
      farText: "我們還沒到巨城喔",
      nearText: "到了！按下確認開始冒險",
      errorText: "需要定位權限才能確認是否抵達",
      rejectText: "再走近巨城一點吧",
    },
    { type: "vista", id: "mall-approach", waitTap: true, autoClear: false },
    {
      type: "narration",
      text: "看——聖誕樹亮著，廣場上有人來來往往。我們開開心心往巨城走去，步伐都變得輕快了起來。",
    },
    {
      type: "narration",
      text: "不過來巨城，第一站通常不是亂逛……而是往 B1 那家我們最常去的店。",
    },
    { type: "prompt", text: "去 B1 盲盒店，找一個新夥伴吧", holdMs: 1800 },
    { type: "clear" },
    { type: "goto", level: "big-city" },
  ],
};
