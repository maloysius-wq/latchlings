# Latchlings Art Asset Credits

All third-party runtime art materials in this file are locally vendored and released under **Creative Commons CC0 1.0 / public-domain dedication**. Latchlings does not hotlink these assets at runtime. Attribution is not required by CC0, but provenance is retained here deliberately.

## ambientCG material sources

ambientCG states that all of its assets are released under CC0 and may be used without attribution, including commercially: https://ambientcg.com/ and https://docs.ambientcg.com/license/

The following three 512×512 source maps were already introduced for the Little Home title work and are now copied/optimized for the gameplay material system:

- **Grass005** → `assets/textures/grass.webp` (source copy: `title-island-concepts/textures/grass.jpg`)
  - Source: https://ambientcg.com/view?id=Grass005
- **Ground085** → `assets/textures/earth.webp` (source copy: `title-island-concepts/textures/earth.jpg`)
  - Source: https://ambientcg.com/view?id=Ground085
- **Wood093** → `assets/textures/wood.webp` (source copy: `title-island-concepts/textures/wood.jpg`)
  - Source: https://ambientcg.com/view?id=Wood093

Only the color/albedo information is used in the 2D browser game.

## Poly Haven material sources

Poly Haven states that all textures and other assets on its site are CC0 and may be used for commercial work without attribution: https://polyhaven.com/license

The implementation workflow downloads the source color maps, downsizes them to 512×512, and encodes local WebP derivatives for the game:

- **Fabric Pattern 07**, author Rob Tuytel, `Col 1` map → `assets/textures/fabric-market.webp`
  - Asset: https://polyhaven.com/a/fabric_pattern_07
  - Source map: https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/fabric_pattern_07/fabric_pattern_07_col_1_1k.jpg
  - Used for Masquerade Keep / market cloth, awnings, and woven accents.
- **Cobblestone Color**, author Rob Tuytel, `Diffuse` map → `assets/textures/cobblestone.webp`
  - Asset: https://polyhaven.com/a/cobblestone_color
  - Source map: https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/cobblestone_color/cobblestone_color_diff_1k.jpg
  - Used for Lodestone Caverns, stone blocks, and weathered route surfaces.
- **Book Pattern**, author Rob Tuytel, `Col1` map → `assets/textures/bookcloth.webp`
  - Asset: https://polyhaven.com/a/book_pattern
  - Source map: https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/book_pattern/book_pattern_col1_1k.jpg
  - Used for old Waykeeper records, quiet woven surfaces, and Aurora Crown material variation.
- **Metal Plate**, author Rob Tuytel, `Diffuse` map → `assets/textures/metal-plate.webp`
  - Asset: https://polyhaven.com/a/metal_plate
  - Source map: https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/metal_plate/metal_plate_diff_1k.jpg
  - Used for anchors, Copperline Junction, Stormswitch Foundry, rails, switches, and door hardware.

## Custom artwork

All chapter vignettes, route-line ornaments, baskets, lanterns, parcels, anchors, crystals, market props, flowers, telescopes, rails, maps, compasses, gears, signals, homes, and aurora symbols used by `story-theme400.js` are original inline SVG/CSS artwork created specifically for Latchlings. They are not third-party assets.
