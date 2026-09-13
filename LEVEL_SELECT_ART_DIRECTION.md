# Skyway Atlas Art Direction

The Level Select screen is treated as a navigable place in the Latchlands, not as a dashboard. All third-party runtime textures are local CC0 derivatives. All shapes, landmarks, route geometry, clouds, residents, lighting, and interface ornament are original HTML/CSS/SVG constructions for Latchlings.

## Progression-map references

- **Two Dots saga maps / 2026 visual refresh**: environmental grouping, memorable travel through distinct regions, and a map that makes progression feel like a journey rather than a list. Reference: https://www.zynga.com/corporate/a-fresh-coat-of-joy-two-dots-reimagines-its-world-for-a-new-era/
- **Monument Valley chapter select**: chapter selection presented as part of the game's visual world rather than generic application chrome. Reference screenshot index: https://www.mobygames.com/game/69816/monument-valley/screenshots/
- **Level-select polishing case study**: emphasize the next destination, make unlocked/locked states part of the fiction, connect stages visually, and use unlock animation to explain progression. Reference: https://www.gamedeveloper.com/art/polishing-a-level-select-screen-process-and-implementation

These are interaction/composition references only. No third-party game art is copied or shipped.

## Chapter material and object references

### 1. Sunpetal Meadows
- Material: **Leafy Grass**, Poly Haven CC0, Charlotte Baglioni. https://polyhaven.com/a/leafy_grass
- Object vocabulary: low meadow islands, flower clumps, fence posts, garden gates, small field structures and warm morning light.
- Shape source: the existing Latchlings floating-island silhouette and Little Home pastoral language.

### 2. Lanternwood Grove
- Material: **Bark Brown 01**, Poly Haven CC0, Rob Tuytel. https://polyhaven.com/a/bark_brown_01
- Object vocabulary: rooted trunks, rounded tree crowns, hanging lanterns, dark woodland platforms and amber pools of light.
- Shape source: the canonical multi-crown Latchlings tree construction used in cinematic/Little Home work.

### 3. Lodestone Caverns
- Material: **Rock Surface**, Poly Haven CC0, Amal Kumar. https://polyhaven.com/a/rock_surface
- Object vocabulary: faceted stone shelves, crystal spires, anchor rings, cyan mineral glow and cavern silhouettes.
- Shape source: real fractured rock/crystal facets simplified into readable phone-scale polygons.
- Recurring landmark: an old Waykeeper marker slab with an offset cyan anchor-ring glyph and three pale chalk revision ticks; reuse this silhouette in Chapter 3 Atlas/reward surfaces so the maintenance evidence reads as one physical system.

### 4. Masquerade Keep
- Material: **Plaster Stone Wall 01**, Poly Haven CC0, Charlotte Baglioni. https://polyhaven.com/a/plaster_stone_wall_01
- Object vocabulary: gate arches, keep towers, market banners, stone parapets and moonlit civic architecture.
- Shape source: simple masonry arches, battlements and cloth pennants translated into the game's rounded storybook proportions.

### 5. Prism Gardens
- Material: **Marble 01**, Poly Haven CC0, Rob Tuytel. https://polyhaven.com/a/marble_01
- Object vocabulary: glasshouse ribs, translucent petals, crystal planters, prismatic highlights and soft botanical geometry.
- Shape source: greenhouse arches and radial flower forms, stylized rather than photo-real.

### 6. Copperline Junction
- Material: **Rusty Metal 02**, Poly Haven CC0, Rob Tuytel. https://polyhaven.com/a/rusty_metal_02
- Object vocabulary: rails, switch stands, station canopies, signal posts, turntables and riveted route hardware.
- Shape source: railway signaling/track geometry reduced to chunky toy-like silhouettes.

### 7. Stormswitch Foundry
- Material: **Blue Metal Plate**, Poly Haven CC0, Rob Tuytel. https://polyhaven.com/a/blue_metal_plate
- Object vocabulary: factory stacks, relay towers, switch banks, insulated conduits, lightning masts and storm-lit steel.
- Shape source: industrial electrical hardware abstracted into friendly readable machinery.

### 8. Aurora Crown
- Material: **Snow 02**, Poly Haven CC0, Rob Tuytel. https://polyhaven.com/a/snow_02
- Object vocabulary: pale crystalline ledges, crown-like beacons, star fields, aurora ribbons and luminous route bridges.
- Shape source: ice/crystal facets and atmospheric aurora bands translated into the established Latchlings celestial palette.

## State language

- **Restored route**: bright continuous Skyway light with small traveling glints.
- **Current route**: a warmer pulsing segment ending at the enlarged current island and NEXT STOP pennant.
- **Future route**: faint dashed/ghosted light disappearing into cloud cover.
- **Completed level**: full-color island plus earned star-lights around the island rim.
- **Current level**: larger island, guide resident, pennant and focused route glow.
- **Locked level**: desaturated island partially occluded by soft clouds, while its number remains legible enough to communicate future progression.
- **Milestone (10/20/30/40/50)**: physically larger island with a chapter-specific landmark, making each ten-level stretch a destination rather than an arbitrary page.

## Motion language

Ambient motion is intentionally restrained: islands bob asynchronously by a few pixels, clouds drift slowly, route glints travel only on restored lines, and the current route breathes gently. Motion reinforces a living drifting world and progression state; it is disabled under `prefers-reduced-motion: reduce`.
