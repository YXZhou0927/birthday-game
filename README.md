# Ann Birthday 2026

方向已調整為 **場景背景 + Q 版像素電子生日卡**（不再以遊玩關卡為主）。

## 電子卡片（預設）

開啟根目錄或 `cards.html`：場景當背景，右側浮入對折卡片；點擊向左翻開。

| page | 主題 |
| --- | --- |
| `big-city` | 聖誕巨城：花圈封面、香水／口紅／包／項鍊／戒指標 |
| `boutique` | Boutique：大耳狗封面、大耳狗／Labubu／Jellycat 點綴 |
| `restaurant` | 燒肉：香氣封面、烤肉串／肉片／夾子點綴 |

例：`cards.html?page=big-city`

左側照片暫用 `pixel/`（也可換 `assets/art/cards/photos/`）；右側為信紙橫線 + DotGothic16 像素中文字型範本。

## 舊版遊戲（可選）

NFC 關卡流程仍可用：`?mode=game&level=prologue&skipGps=1`

線上：https://yxzhou0927.github.io/birthday-game/

## 關卡（NFC 可各寫一張）

| level | 說明 |
| --- | --- |
| `prologue` | 序章：小短片 → 巨城 GPS |
| `big-city` | 娃娃取名、shopping、愛心 1–2 → 燒肉 GPS |
| `restaurant` | 燒肉互動、愛心 3 → 階梯 GPS |
| `stairs` | 愛心 4、未來房間與蛋糕揭示 |
| `epilogue` | 慶生、擁抱、Apple 兌換券暗示 |

例：`?level=big-city&skipGps=1`

## 本機

```bash
python3 -m http.server 5173 --bind 127.0.0.1
```

## 架構

- `scripts/*.js` — 改劇情／GPS／選項（支援 `{dollName}` `{gifts}`）
- `js/vistas.js` — CSS 動態／可互動場景
- `js/map.js` — 鎖定地圖格線（32×18 tiles @ 40px → 1280×720）；角色用 `tileStyle(col, row)` 對齊
- `js/bgm.js` — 輕快程序化背景音樂（右上角可靜音）
- `js/memory.js` — 跨關卡記憶（娃娃名、購物清單）

場景素材統一為燒肉店同款 **3/4 RPG 俯視**（星奇市更俯視）；貨架／餐桌／椅子為獨立 prop 並依格線列做景深。除錯格線加 `?grid=1`。結局 `finale`：愛心縮小 → 小孩捧蛋糕 → 右側門離場 → 媽媽跟上。

步驟型別：`narration` `dialogue` `prompt` `reel` `vista` `input` `choose` `confirm`(+gps) `heart` `finale` `epilogueShow` `goto` …

## GPS

座標在 `scripts/places.js`（巨城、Uncle Shawn、清大階梯）。試玩請加 `skipGps=1`。
