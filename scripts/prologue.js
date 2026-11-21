/**
 * 序章 — NFC 啟動後的第一關
 *
 * 素材：reel 沿用現有 pixel 小短片；approach 暫用同一組圖當 placeholder，
 * 之後把 src 換成「Q版像素新竹巨城」即可。
 */

const REEL_FRAMES = [
  "pixel/01.png",
  "pixel/02.png",
  "pixel/03.png",
  "pixel/04.png",
  "pixel/05.png",
  "pixel/06.png",
  "pixel/07.png",
  "pixel/08.png",
];

/** 新竹巨城 Big City（約略中心；radius 約步行 1 分鐘） */
export const BIG_CITY = {
  lat: 24.80972,
  lng: 120.97535,
  radiusMeters: 120,
};

export default {
  id: "prologue",
  title: "序章",
  startWithPlay: true,
  steps: [
    {
      type: "narration",
      text: "奇怪…怎麼會有這個影片？是因為碰了那個貼紙的關係嗎？",
    },
    {
      type: "reel",
      frames: REEL_FRAMES,
      duration: 15000,
    },
    {
      type: "narration",
      text: "這是之前的生日影片吧！好可愛！",
    },
    {
      type: "narration",
      text: "在清大讀書的日子大概有一半的時間都是我們一起度過的吧",
    },
    {
      type: "narration",
      text: "就算分隔兩地我們也總是像在身邊一樣每天互相鼓勵著彼此",
    },
    {
      type: "narration",
      text: "在新竹的日子裡我每天都想跟你出去玩",
    },
    {
      type: "narration",
      text: "而我們最常去的地方應該就是那裏了吧！",
    },
    {
      type: "prompt",
      text: "前往我們最常去的那個地方吧",
    },
    {
      type: "confirm",
      label: "我到了！",
      gps: BIG_CITY,
      waitingText: "正在感應你是否靠近巨城…",
      farText: "還沒到巨城喔",
      nearText: "到了！可以按下確認",
      errorText: "需要定位權限才能確認是否抵達",
      rejectText: "好像還不夠近，再走近巨城一點吧",
    },
    {
      type: "approach",
      // TODO: 換成 Q版像素「新竹巨城」立面圖
      src: "pixel/03.png",
      fromScale: 0.38,
      toScale: 1.08,
      duration: 4500,
    },
    {
      type: "dialogue",
      text: "寶貝，人生有妳讓我生活變得有趣了不少！",
    },
    {
      type: "dialogue",
      text: "我們在這裡有很多美好的回憶，就比如說 B1 那個很多娃娃的地方…",
    },
    {
      type: "prompt",
      text: "下一關：新竹巨城",
      holdMs: 1800,
    },
    {
      type: "goto",
      level: "big-city",
    },
  ],
};
