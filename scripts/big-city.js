/**
 * 關卡 2 — 新竹巨城 / 星奇式 POP CIRCUS
 *
 * 素材路徑都是 placeholder，之後替換成門市、娃娃、女友抱娃娃等像素圖即可。
 */

export default {
  id: "big-city",
  title: "新竹巨城",
  startWithPlay: true,
  steps: [
    {
      type: "approach",
      // TODO: Q版像素「星奇式 POP CIRCUS 巨城門市」＋店員與客人
      src: "pixel/05.png",
      fromScale: 0.45,
      toScale: 1.05,
      duration: 4000,
      clear: false,
    },
    {
      type: "dialogue",
      text: "是妳讓我知道每個娃娃都可以有不同的個性與名字",
    },
    {
      type: "prompt",
      text: "挑一個娃娃吧！",
    },
    {
      type: "confirm",
      label: "我選好了！",
      // 無 gps → 手動確認即可
    },
    {
      type: "heart",
      piece: 1,
    },
    {
      type: "dialogue",
      text: "希望每個娃娃都能代替我陪妳，讓妳永遠不孤單",
    },
    {
      type: "image",
      // TODO: 換成「抱著林寶貝的女友」Q版像素風照片
      src: "pixel/07.png",
      dim: true,
      fade: 1100,
    },
    {
      type: "narration",
      text: "林寶貝還會天天跟我說我愛妳呢！",
    },
    {
      type: "clear",
      fade: 900,
    },
    {
      type: "prompt",
      text: "愛心碎片 1 / 4 已蒐集",
    },
  ],
};
