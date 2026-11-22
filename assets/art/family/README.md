# Family animation packs (AB-26)

Q-pixel chibi packs for **mom** (aged-up girlfriend likeness) and **kid** (slightly androgynous / neutral child). Same pipeline as couple packs.

## Style

- Logical **64×64** → display **256×256** (4× nearest)
- Warm earth palette, dark brown outlines, cream clothing
- Transparent RGBA PNG

## Characters

| Folder | Role | Visual ID |
|--------|------|-----------|
| `mom/` | Warm mom (Ann aged-up) | Dark hair + cream ribbon, cream cardigan / dress, soft smile |
| `kid/` | Neutral child | Short bowl-cut bangs (no ribbon), cream sweater + shorts, dark shoes |

## Naming (matches couple pack)

### Walk — 4 dirs × 4 frames

`walk_{down|up|left|right}_f{1..4}.png`

### Stand / idle

`stand_{down|up|left|right}.png`  
`stand_{dir}_f2.png` (idle variant from walk f3)

### Sit

- `sit_front.png`
- `sit_side.png`

### Previews

- `{mom|kid}_preview_sheet.png` — walk + stand + sit
- `{mom|kid}_stand_preview.png` — 4 stand directions

## Notes

- Use nearest-neighbor scaling only.
- Repo mirror: `assets/art/family/` in birthday-game.
