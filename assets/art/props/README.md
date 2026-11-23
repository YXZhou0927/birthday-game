# Furniture props (depth-sorted / raised layers)

Transparent Q-pixel props placed on empty floor maps.

## Full-map raised layers (preferred)

| File | Use |
|------|-----|
| `boutique_shelves.png` | All boutique handbag islands as **one** 1280×720 RGBA object (already raised) |
| `yakiniku_furniture.png` | All BBQ tables + chairs as **one** 1280×720 RGBA object (hoods stay on scene floor) |

Runtime: `layerProp()` in `js/vistas.js` → CSS `.prop--layer`.

## Single-tile props (still used by POP CIRCUS etc.)

| File | Use |
|------|-----|
| `shelf_island.png` | POP CIRCUS center islands |
| `shelf_wall.png` | POP CIRCUS side wall shelves |
| `bbq_table.png` | Single table + grill (+ hood) source |
| `chair.png` | Single restaurant chair |
| `display_table.png` | Single boutique pedestal (legacy) |

Logical ~64×64 → display 256×256 (4× nearest) for single-tile props. Anchor feet/base at tile center.
