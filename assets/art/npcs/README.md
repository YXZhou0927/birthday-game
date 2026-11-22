# NPC animation packs (AB-13)

Distinct Q版 pixel NPCs for street / shop scenes. Transparent RGBA PNGs.

## Style

Matches couple pack: **64×64** logical → **256×256** display, ~16-color warm palette, dark outlines, magenta-keyed backgrounds.

## Characters

| Folder | Role | Visual ID |
|--------|------|-----------|
| `passerby_01/` | Young passerby | Short bob, pink hairclip, mint hoodie, beige skirt |
| `passerby_02/` | Middle-aged passerby | Thinning brown hair, stubble, mustard polo, navy pants |
| `passerby_03/` | Elder passerby | Silver bun, lavender cardigan, cane |
| `blindbox_clerk/` | 盲盒店 clerk | Teal hair, glasses, black apron + colorful pin |
| `yakiniku_clerk/` | 燒肉店 clerk | Red headband, brown apron, tongs, glasses |

## Per-NPC files

### Walk

`walk_{down|up|left|right}_f{1..4}.png`

### Stand

`stand_{down|up|left|right}.png`  
Optional: `stand_{dir}_f2.png`

### Previews

- `{id}_preview_sheet.png` — 4×4 walk grid  
- `{id}_stand_preview.png` — 4 stand directions

## Notes

- Left/right pairs are mirrored where source sheets lacked a distinct opposite profile.
- Use nearest-neighbor scaling only.
