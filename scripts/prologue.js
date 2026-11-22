/**
 * 序章篇 — 30 年後的旁白（不揭身分）開啟今年生日冒險
 */
import { BIG_CITY } from "./places.js";

/** New intro pack — cinematic fade; last beat is 安安 card (skip 豆豆 frame 08). */
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
    {
      type: "vista",
      id: "sparkle",
      waitTap: false,
    },
    {
      type: "narration",
      text: "奇怪……怎麼會冒出這支影片？難道是因為碰到那張貼紙嗎？",
    },
    {
      type: "reel",
      mode: "fade",
      frames: REEL_FRAMES,
      perFrameMs: 1500,
      fadeIn: 800,
      fadeOut: 900,
    },
    {
      type: "narration",
      text: "啊，這是以前的生日影片吧。好可愛——看著看著，心裡忽然暖起來。",
    },
    {
      type: "narration",
      text: "清大那些日子，大概有一半的時間，都是兩個人一起度過的吧。",
    },
    {
      type: "narration",
      text: "就算後來分隔兩地，也還是像在身邊一樣，每天互相加油打氣。",
    },
    {
      type: "narration",
      text: "而今年這個生日……說真的，簡直像一場冒險一樣好玩。",
    },
    {
      type: "narration",
      text: "故事的起點，當然是新竹最常去的那個商場——巨城。",
    },
    {
      type: "prompt",
      text: "出發吧，去我們的冒險起點",
    },
    {
      type: "confirm",
      label: "我到巨城了！",
      gps: BIG_CITY,
      waitingText: "正在感應你是否靠近巨城…",
      farText: "還沒到巨城喔",
      nearText: "到了！按下確認開始冒險",
      errorText: "需要定位權限才能確認是否抵達",
      rejectText: "再走近巨城一點吧",
    },
    {
      type: "vista",
      id: "mall-approach",
      waitTap: true,
      autoClear: false,
    },
    {
      type: "narration",
      text: "看，她開開心心往巨城跑去——步伐都變得輕快了起來。",
    },
    {
      type: "narration",
      text: "不過來巨城，第一站通常不是亂逛……而是往 B1 那家最常去的店。",
    },
    {
      type: "prompt",
      text: "去 B1 盲盒店，找一個新夥伴吧",
      holdMs: 2000,
    },
    { type: "clear" },
    { type: "goto", level: "big-city" },
  ],
};
