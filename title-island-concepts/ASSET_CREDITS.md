# Latchlings Procedural Floating-Island Concept Credits

This directory is a design-selection prototype. The production `index.html` title screen remains unchanged.

## Procedural environment

All visible environmental forms in the focused `title-island-concepts/index.html` preview are built in-browser from HTML/CSS geometry: the floating island, earth sides, grassy top, clouds, path, rocks, trees, cottage, fence, deck, bridge and flowers. No premade environment sprite or model is referenced by the active preview.

## Latchlings

The preview Latchlings are live HTML/CSS/SVG and copy the shipping game's current visual language from `style400-game.css` and `game400-a.js`: the exact coral/blue/mint/gold/lavender palette values, body gradient treatment, 29% crown suit mark, shipping suit SVG paths, eye proportions, seven shipping expressions, and asynchronous face/blink timing. They are project artwork, not third-party assets.

## ambientCG material textures

The procedural geometry uses three locally vendored **color/albedo maps only** from ambientCG. ambientCG releases its assets under **Creative Commons CC0 1.0 Universal**, allowing commercial use, modification and redistribution without attribution.

- `textures/grass.jpg` — ambientCG **Grass005** (`Grass005_1K-JPG_Color.jpg`), used as the grass material surface.
- `textures/earth.jpg` — ambientCG **Ground085** (`Ground085_1K-JPG_Color.jpg`), used as the floating-island earth/rock material surface.
- `textures/wood.jpg` — ambientCG **Wood093** (`Wood093_1K-JPG_Color.jpg`), used on procedural wood planes and props.

Source pages / downloads:
- https://ambientcg.com/get?file=Grass005_1K-JPG.zip
- https://ambientcg.com/get?file=Ground085_1K-JPG.zip
- https://ambientcg.com/get?file=Wood093_1K-JPG.zip
- https://ambientcg.com/

For this mobile prototype the 1K source color maps are downscaled to 512×512 JPEGs. No normal, roughness, displacement, preview, model, spritesheet or catalog image is shipped in the focused preview.

## Archived prior experiments

Older Kenney/platformer/isometric files may remain in the repository as design-history artifacts, but the active focused preview does not reference them. If this procedural direction is selected for production, unused experimental art can be removed in a separate cleanup pass.
