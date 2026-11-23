# Furniture props (depth-sorted)

Transparent Q-pixel props placed on empty floor maps. Runtime `z-index` follows tile row (`js/vistas.js` `depthZ`) so characters in front of shelves/tables draw above them.

| File | Use |
|------|-----|
| `shelf_island.png` | POP CIRCUS center islands |
| `shelf_wall.png` | POP CIRCUS side wall shelves |
| `bbq_table.png` | Yakiniku table + grill + hood |
| `chair.png` | Restaurant chair |
| `display_table.png` | Boutique handbag pedestal |

Logical ~64×64 → display 256×256 (4× nearest). Anchor feet/base at tile center.
