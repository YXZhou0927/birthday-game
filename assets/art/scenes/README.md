# Scene maps (AB-15 / AB-16–AB-20)

Q版像素 (chibi-friendly) playable environment maps for Ann Birthday Game. Coarse readable pixels, warm limited palette aligned with `media/art/couple/` and intro-pixel frames. Display size **1280×720** (logical ~320×180, 4× nearest). Suitable for overlaying **64px-scale** characters.

Photo refs: `media/scene-refs/01`…`05`. Repo mirror: `assets/art/scenes/`.

## Files

| File | Scene | Task |
|------|--------|------|
| `big_city_plaza.png` | Hsinchu Big City night plaza + Christmas tree | AB-16 |
| `big_city_plaza_walkable.png` | Same plaza, clearer open floor for collision | AB-16 |
| `yakiniku_interior.png` | BBQ restaurant seating (red booth, copper hoods) | AB-17 |
| `pop_circus.png` | B1 POP CIRCUS / 星·奇·市 blind-box store | AB-18 |
| `boutique_floor.png` | Big City 1F accessory boutique / kiosk floor | AB-19 |
| `campus_stairs.png` | Campus courtyard — **lower** stairs + landing | AB-20 |
| `preview_sheet.png` | 3×2 labeled collage of all maps | AB-15 |
| `README.md` | This doc | AB-15 |

## View & scale

- Preferred view: **3/4 RPG** (top-down-ish) for walkable interiors/floors.
- `big_city_plaza.png` is more panoramic; use `big_city_plaza_walkable.png` when you need a flatter floor plan.
- Keep nearest-neighbor scaling; do not bilinear-blur.

## Suggested walkable zones

Approximate regions as fractions of the 1280×720 frame (x0–x1, y0–y1 from top-left). Block solid props (tables, shelves, tree base, railings).

### `big_city_plaza.png` / `_walkable.png`

| Zone | Region | Notes |
|------|--------|--------|
| Plaza floor | y ≈ 0.45–1.0, x ≈ 0.08–0.92 | Main walk area |
| Blocked | Tree + Santa sleigh (left ~0.05–0.32) | Landmark / obstacle |
| Blocked | Wreath + Santas (right ~0.70–0.95) | Landmark / obstacle |
| Transition | Center doors under “Big City” neon | Enter mall |

### `yakiniku_interior.png`

| Zone | Region | Notes |
|------|--------|--------|
| Aisles | Between table rows / along south edge | Primary path |
| Blocked | White tables + green chairs | Sit / interact |
| Blocked | Red booth strip (north) | Sit facing tables |
| Overlay | Copper hoods | Draw above character layer |
| NPC | Left service counter / neon window | Clerk spot |

### `pop_circus.png`

| Zone | Region | Notes |
|------|--------|--------|
| Aisles | Around central island + entrance strip | Walk loops |
| Blocked | Center island shelves | Browse / interact |
| Blocked | Wall shelves + star pillar (right) | Landmarks |
| NPC | Near back shelves / counter | Blind-box clerk |

### `boutique_floor.png`

| Zone | Region | Notes |
|------|--------|--------|
| Lanes | Cream tiles + darker beige path | Free roam between kiosks |
| Blocked | Circular / rectangular display islands | Bag browse |
| Landmark | LOWRYS FARM back wall | North boundary |
| Props | Mirrors, mannequin, A-frame sign | Decor / interact |

### `campus_stairs.png`

| Zone | Region | Notes |
|------|--------|--------|
| Courtyard | Grass + path (south half) | Approach |
| Stairs | Lower flight (center) | Climb |
| **Landing** | Mid landing at top of lower flight | **Confession / first flowers** event |
| Blocked | Stone stools, ivy balcony mass | Decor |

## Landmark notes

1. **Big City** — Red neon “Big City” sign; Christmas tree with star + red/gold bow; Santa sleigh base; hanging snowflakes.
2. **Yakiniku** — Continuous red booth; copper hoods over grills; olive chairs; warm amber light vs neon window.
3. **POP CIRCUS** — “星·奇·市 POP CIRCUS” header; black/white striped awnings; plushie + blind-box shelves; yellow-star pillar.
4. **Boutique** — Cream mall floor; white kiosk islands with bags; LOWRYS FARM storefront.
5. **Campus stairs** — Composition cropped to **lower** flight + landing (not the full zigzag). Warm concrete/brick + hanging ivy; quiet confession beat.

## Method

GenerateImage from scene-ref photos + intro-frame style refs → BOX downsample to 320×180 → ~40-color median-cut → 4× nearest → PNG.
