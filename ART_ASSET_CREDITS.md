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

## OpenGameArt sound source

- **Swishes Sound Pack**, author **artisticdude**, OpenGameArt, released under **CC0**.
  - Asset page: https://opengameart.org/content/swishes-sound-pack
  - Pack download: https://opengameart.org/sites/default/files/swishes.zip
  - License: https://creativecommons.org/publicdomain/zero/1.0/
  - Selected source file: `swish-1.wav`, one of the pack's four lighter swishes.
  - Local derivative: `assets/sfx/screen-swipe.wav`.
  - Source inspection measured 0.1260 s duration with approximately 0.0221 s of leading silence at a -45 dB threshold. The implementation workflow trims that leading 22.1 ms, applies a 3 ms attack fade, an 11 ms tail fade, and -4 dB gain before writing 44.1 kHz 16-bit stereo PCM WAV. Runtime playback is further reduced to 0.18 volume by `sfx400.js` so the transition cue remains subtle.
  - Used only for genuine cross-screen swipe transitions. It is not played for level-to-level changes while already on the Game screen.



## Skyway Atlas chapter materials

The redesigned Level Select uses eight additional Poly Haven **CC0** color maps, each downsampled to a 512×512 local WebP. They are used as restrained surface grain inside original Latchlings CSS/SVG island and landmark constructions, not as photographic backgrounds.

- **Leafy Grass**, Charlotte Baglioni → `assets/level-select/sunpetal.webp`
  - Asset: https://polyhaven.com/a/leafy_grass
  - Source: https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/leafy_grass/leafy_grass_diff_1k.jpg
- **Bark Brown 01**, Rob Tuytel → `assets/level-select/lanternwood.webp`
  - Asset: https://polyhaven.com/a/bark_brown_01
  - Source: https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/bark_brown_01/bark_brown_01_diff_1k.jpg
- **Rock Surface**, Amal Kumar → `assets/level-select/lodestone.webp`
  - Asset: https://polyhaven.com/a/rock_surface
  - Source: https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/rock_surface/rock_surface_diff_1k.jpg
- **Plaster Stone Wall 01**, Charlotte Baglioni → `assets/level-select/masquerade.webp`
  - Asset: https://polyhaven.com/a/plaster_stone_wall_01
  - Source: https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/plaster_stone_wall_01/plaster_stone_wall_01_diff_1k.jpg
- **Marble 01**, Rob Tuytel → `assets/level-select/prism.webp`
  - Asset: https://polyhaven.com/a/marble_01
  - Source: https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/marble_01/marble_01_diff_1k.jpg
- **Rusty Metal 02**, Rob Tuytel → `assets/level-select/copperline.webp`
  - Asset: https://polyhaven.com/a/rusty_metal_02
  - Source: https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/rusty_metal_02/rusty_metal_02_diff_1k.jpg
- **Blue Metal Plate**, Rob Tuytel → `assets/level-select/stormswitch.webp`
  - Asset: https://polyhaven.com/a/blue_metal_plate
  - Source: https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/blue_metal_plate/blue_metal_plate_diff_1k.jpg
- **Snow 02**, Rob Tuytel → `assets/level-select/aurora.webp`
  - Asset: https://polyhaven.com/a/snow_02
  - Source: https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/snow_02/snow_02_diff_1k.jpg

Poly Haven license: https://polyhaven.com/license
