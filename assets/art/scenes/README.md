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
| `big_city_plaza_walkable.png` | Same plaza, open walk floor |
| `yakiniku_interior.png` | BBQ restaurant (style / angle **source of truth**) |
| `pop_circus.png` | B1 POP CIRCUS / 星·奇·市 blind-box store |
| `boutique_floor.png` | Big City 1F accessory boutique |
| `campus_stairs.png` | Campus courtyard — lower stairs + landing |
| `preview_sheet.png` | 3×2 labeled collage |
| `README.md` | This doc |

## Style rules (match yakiniku)

1. Same 3/4 oblique angle as `yakiniku_interior.png` — not eye-level facade, not one-point aisle.
2. Floor reads as a neat tile grid; props sit on tile edges.
3. Warm limited palette; nearest-neighbor scale only (no bilinear blur).
4. Empty of player/NPC characters (sprites are overlaid at runtime).

## Suggested walkable zones (tile coords, origin top-left)

### Plaza (`big_city_plaza*.png`)

| Zone | Approx tiles | Notes |
|------|----------------|--------|
| Walk floor | rows 9–17, cols 4–27 | Open plaza |
| Blocked | tree / Santa left ~cols 1–8, rows 4–12 | Landmark |
| Blocked | wreath / Santa right ~cols 24–30 | Landmark |
| Transition | doors ~cols 13–18, row 6–8 | Enter mall |

### Yakiniku

| Zone | Approx tiles | Notes |
|------|----------------|--------|
| Aisles | between table rows / south edge | Primary path |
| Blocked | tables + chairs | Sit / interact |
| Overlay | copper hoods | Draw above actors |
| NPC | left counter ~cols 2–5 | Clerk |

### POP CIRCUS

| Zone | Approx tiles | Notes |
|------|----------------|--------|
| Aisles | around center island | Walk loops |
| Blocked | island + wall shelves | Browse |
| NPC | back shelves / counter | Clerk |

### Boutique

| Zone | Approx tiles | Notes |
|------|----------------|--------|
| Lanes | cream tile aisles between islands | Free roam |
| Blocked | display pedestals | Bag browse |
| Landmark | LOWRYS FARM back wall | North boundary |

### Campus stairs

| Zone | Approx tiles | Notes |
|------|----------------|--------|
| Courtyard | grass + path, south half | Approach |
| Stairs | center lower flight | Climb |
| Landing | mid landing top of lower flight | Confession event |
| Blocked | stone stools, ivy mass | Decor |

## Pipeline

GenerateImage (yakiniku as style + angle ref) → BOX downsample to 320×180 → ~40-color median-cut → 4× nearest → PNG.
