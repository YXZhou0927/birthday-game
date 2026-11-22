# Couple animation pack (AB-12)

Q版 chibi pixel sprites for girlfriend (Ann) + boyfriend. Transparent RGBA PNGs.

## Style

- Logical grid: **64×64**
- Display export: **256×256** (4× nearest-neighbor)
- Palette: ~16 warm earth tones; dark outlines; cream cardigan / brown–black–cream sweater
- Post-process: magenta chroma-key → BOX fit → median-cut → nearest upscale

## Folders

| Path | Contents |
|------|----------|
| `girlfriend/` | Walk, stand, sit |
| `boyfriend/` | Walk, stand, sit |
| `together/` | Shared hug then kiss sequences |

## Naming

### Walk (4 directions × 4 frames)

`walk_{down|up|left|right}_f{1..4}.png`

### Stand / idle

`stand_{down|up|left|right}.png`  
Optional second idle: `stand_{dir}_f2.png`

### Sit

- `sit_front.png` — facing camera  
- `sit_side.png` — profile

### Together

- `hug_1.png` … `hug_4.png` — approach → embrace  
- `kiss_1.png` … `kiss_4.png` — lean-in → kiss (+ hearts on last)

## Preview sheets

- `girlfriend/girlfriend_preview_sheet.png` — walk rows + stands + sits  
- `boyfriend/boyfriend_preview_sheet.png`  
- `together/together_preview_sheet.png` — hug row + kiss row  
- Per-character `*_stand_preview.png` where present

## Character cues

**Girlfriend:** dark ponytail + cream ribbon/scrunchie, cream cardigan, large dark eyes.  
**Boyfriend:** short bangs, round glasses, brown → black band → cream crewneck.
