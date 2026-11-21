# Ann Birthday Game 2026

NFC 觸發的實境生日冒險：黑畫面 → 播放鍵 → 點擊推進劇情；部分關卡用手動／GPS 確認；蒐集四等分愛心碎片。

現有 `pixel/` 多圖捲動即「小短片」（`reel`）參考實作。

## 本機執行

```bash
python3 -m http.server 5173 --bind 127.0.0.1
```

| URL | 說明 |
| --- | --- |
| `http://127.0.0.1:5173/` | 序章 |
| `http://127.0.0.1:5173/?level=big-city` | 新竹巨城 |
| `http://127.0.0.1:5173/?debug=1&skipGps=1` | 略過 GPS，方便在家測 |

NFC 貼紙可直接連到帶 `?level=` 的網址。

## GitHub Pages（repo 可維持 private）

程式碼可用 `.github/workflows/pages.yml` 自動部署。**repo 不必改成 public**，但個人帳號若是 GitHub Free，private repo 通常**無法啟用 Pages**，需 [GitHub Pro](https://github.com/pricing)（或把 repo 改 public）。

在有 Pages 權限的前提下，於 GitHub 手動開一次：

1. **Settings → Pages**
2. Build and deployment → Source 選 **GitHub Actions**
3. 合併／推到 `main` 後等 Actions 跑完
4. 同一頁會出現網址，例如 `https://<user>.github.io/birthday-game/`

站台網址本身仍可被知道連結的人開啟（適合 NFC）；這與「原始碼 repo 是否 private」是分開的。家裡測可加 `?skipGps=1`。

## 架構

```
index.html          舞台 DOM
style.css           視覺
js/
  main.js           讀 query、啟動關卡
  engine.js         劇本 runner（播放鍵 → steps）
  actions.js        步驟型別實作
  ui.js             淡入淡出 / 點擊等待
  geo.js            GPS 距離
  heart.js          愛心碎片進度（localStorage）
scripts/
  registry.js       關卡註冊表
  prologue.js       序章劇本
  big-city.js       巨城劇本
pixel/              Q 版像素素材（可再擴充）
```

改劇情／素材：編輯 `scripts/*.js` 的 `steps` 與圖片路徑即可，不必改引擎。

## 步驟型別（`type`）

| type | 用途 |
| --- | --- |
| `narration` | 旁白；預設點擊繼續（可設 `holdMs` 自動） |
| `dialogue` | 「對白」 |
| `prompt` | 任務提示（``前往…`` 那種） |
| `reel` | 小短片：`frames[]` + `duration` |
| `approach` | 第一人稱走近：`src` 由遠放大到近 |
| `image` | 淡入靜態圖（可 `clear` / `holdMs`） |
| `confirm` | 確認鈕；可加 `gps: { lat, lng, radiusMeters }` |
| `heart` | 湊齊動畫：`piece` 為 1–4 |
| `wait` | 停頓 `ms` |
| `goto` | 跳下一關 `level` |

## 新增關卡

1. 新增 `scripts/my-level.js`，`export default { id, title, startWithPlay, steps }`
2. 在 `scripts/registry.js` 註冊
3. 用 `/?level=my-level` 開啟

## 備註

- GPS 需 HTTPS（或 localhost）與定位權限；步行約 1 分鐘範圍可調 `radiusMeters`（序章預設 120m）。
- 愛心進度鍵名：`ann-birthday-2026-heart`。
- 舊版單一 demo 流程已收進引擎的 `reel` + 序章劇本。
