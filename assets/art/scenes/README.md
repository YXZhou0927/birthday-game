# Scene maps (locked grid)

Q版像素 playable environment maps for Ann Birthday Game. Coarse readable pixels, warm limited palette (~40 colors), aligned with couple / intro-pixel frames.

## Locked size & grid

| Spec | Value |
|------|--------|
| Display | **1280×720** (16:9) |
| Logical | **320×180**, 4× nearest |
| Tile | **40×40** display px (= 10×10 logical) |
| Grid | **32 × 18** tiles |
| Camera | **3/4 RPG oblique** — axis-aligned walls; tops + fronts of props; orthogonal floor (no vanishing-point corridor) |

All furniture / landmarks must snap to whole tiles. Runtime placement uses `js/map.js` (`tileStyle(col, row)`). Debug overlay: `?grid=1`.

## Files

| File | Scene |
|------|--------|
| `big_city_plaza.png` | Hsinchu Big City night plaza + Christmas |
| `yakiniku_interior.png` | BBQ restaurant floor (tables/chairs are a separate raised layer) |
| `pop_circus.png` | B1 POP CIRCUS / 星·奇·市 blind-box store |
| `boutique_floor.png` | Big City 1F accessory boutique **floor only** (shelves separated) |
| `campus_stairs.png` | Campus courtyard — lower stairs + landing |
| `bedroom_future.png` | Future bedroom — center bed, right door (finale) |
| `living_room.png` | Cozy living room with cake / gifts (epilogue) |
| `preview_sheet.png` | Collage |
| `README.md` | This doc |

Raised furniture layers live in `assets/art/props/`:

| Prop | Use |
|------|-----|
| `boutique_shelves.png` | All boutique floor islands as **one** raised object |
| `yakiniku_furniture.png` | All BBQ tables + chairs as **one** raised object |

## Style rules (match yakiniku)

1. Same 3/4 oblique angle as `yakiniku_interior.png` — not eye-level facade, not one-point aisle.
2. Floor reads as a neat tile grid; raised layers sit above floor, characters depth-sort by row.
3. Warm limited palette; nearest-neighbor scale only (no bilinear blur).
4. Empty of player/NPC characters (sprites are overlaid at runtime).

## Pipeline

GenerateImage (yakiniku as style + angle ref) → BOX downsample to 320×180 → ~40-color median-cut → 4× nearest → PNG.
