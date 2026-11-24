# Big City photo reel (Q-pixel)

8-frame Q版 pixel photo of Ann on a sunset balcony with flowers — Big City chapter memory stills.

## Spec

| Spec | Value |
|------|--------|
| Frames | `01.png` … `08.png` |
| Size | **560×420** (same as `intro-frames/`) |
| Pipeline | BOX → 140×105 → ~48-color median-cut → 4× nearest |
| Sheet | `spritesheet_vertical.png` (560×3360, 01→08 top to bottom) |

Photo ref: `assets/art/refs/bigcity_ann_sunset.jpg`

## Playback order

| # | Beat |
|---|------|
| 1 | Base look-back smile, kicked heel, bouquet |
| 2 | Heel a bit higher, bow flutter |
| 3 | Eye sparkle, flowers tilt, sun glow |
| 4 | Ponytail sway, blush |
| 5 | Cute wink |
| 6 | Tulip bob, kick high |
| 7 | Bow flutter + sky sparkles |
| 8 | Settle pose, soft hearts near bouquet |

## Style notes

- Match `intro-frames` Q-chibi language (cream sweater Ann, warm palette).
- Prefer cream `#FAF2E3` compositing when a solid mat is needed.
- Nearest-neighbor only — do not bilinear-blur.
