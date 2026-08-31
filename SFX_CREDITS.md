# Latchlings Sound Effects — Sources and Licensing

All sound effects shipped in Latchlings are pre-recorded / pre-rendered audio assets. The game does **not** synthesize, procedurally generate, pitch-randomize, time-stretch, or create sound effects at runtime.

## License summary

The selected sound effects are from Kenney audio packs released under **Creative Commons CC0 1.0 Universal (Public Domain Dedication)**.

- License: Creative Commons CC0 1.0 Universal
- License URL: https://creativecommons.org/publicdomain/zero/1.0/
- Kenney support/licensing guidance: https://kenney.nl/support
- Attribution required: **No**
- Optional credit recommended by Kenney: `Kenney`

For provenance and future maintenance, the exact source asset for every shipping file is recorded below even though CC0 does not require attribution.

## Kenney — Interface Sounds

Official pack page: https://kenney.nl/assets/interface-sounds

The pack is published by Kenney under CC0. Source WAV copies were retrieved from the public `Calinou/kenney-interface-sounds` mirror of the Kenney pack, then copied/re-encoded only for consistent shipping format. No synthesized sound was introduced.

| Latchlings file | Original Kenney file | Purpose |
| --- | --- | --- |
| `assets/sfx/ui-tap.wav` | `click_001.wav` | Quiet ordinary button/menu tap |
| `assets/sfx/ui-back.wav` | `back_002.wav` | Back/close navigation |
| `assets/sfx/ui-open.wav` | `open_002.wav` | Opening settings/rules/pause-style UI |
| `assets/sfx/ui-confirm.wav` | `confirmation_001.wav` | Positive UI confirmation |
| `assets/sfx/hint.wav` | `question_002.wav` | Hint reveal |
| `assets/sfx/select-latchling.wav` | `select_004.wav` | Direct Latchling selection |
| `assets/sfx/cycle-latchling.wav` | `tick_001.wav` | Center D-pad Latchling cycling |
| `assets/sfx/invalid.wav` | `error_002.wav` | Invalid/no-movement input |
| `assets/sfx/switch.wav` | `switch_003.wav` | Board switch activation |
| `assets/sfx/turn.wav` | `tick_004.wav` | Subtle route-turner punctuation |
| `assets/sfx/capture.wav` | `confirmation_003.wav` | Successful nest capture |
| `assets/sfx/level-clear.wav` | `confirmation_002.wav` | Softer level-clear/results cue |
| `assets/sfx/next-level.wav` | `pluck_001.wav` | Soft cute Continue / Next Level cue |
| `assets/sfx/level-lose.wav` | `error_004.wav` | Out-of-moves result |
| `assets/sfx/campaign-complete.wav` | `bong_001.wav` | Campaign completion punctuation |

Transfer mirror used for the exact source files:
https://github.com/Calinou/kenney-interface-sounds

## Kenney — Impact Sounds

Official pack page: https://kenney.nl/assets/impact-sounds

The pack is published by Kenney under CC0. Source OGG copies were retrieved from the public `Boyquotes/kenney-impact-sounds-for-godot` mirror of the Kenney pack and transcoded to mono 44.1 kHz PCM WAV for predictable low-latency mobile-browser playback.

| Latchlings file | Original Kenney file | Purpose |
| --- | --- | --- |
| `assets/sfx/stop-soft.wav` | `impact_soft_medium_001.ogg` | All ordinary non-capture movement endpoints |
| `assets/sfx/stop-rock.wav` | `impact_mining_001.ogg` | Retained legacy source; inactive after unified-stop tuning |
| `assets/sfx/stop-anchor.wav` | `impact_metal_light_001.ogg` | Retained legacy source; inactive after unified-stop tuning |
| `assets/sfx/stop-blocked.wav` | `impact_generic_light_001.ogg` | Retained legacy source; inactive after unified-stop tuning |

Transfer mirror used for the exact source files:
https://github.com/Boyquotes/kenney-impact-sounds-for-godot

## Kenney — Foley Sounds / Woosh

Kenney's Foley Sounds pack is included in the Kenney game-asset collection and released under CC0. The selected pre-recorded wooshes were retrieved from the Gamesounds.xyz mirror of the Kenney Foley Sounds pack, then transcoded to mono 44.1 kHz PCM WAV.

Kenney collection reference:
https://kenney.nl/data/itch/preview/

Transfer mirror directory:
https://gamesounds.xyz/?dir=Kenney%27s%20Sound%20Pack/Foley%20Sounds/Woosh

| Latchlings file | Original Kenney file | Purpose |
| --- | --- | --- |
| `assets/sfx/move-short.wav` | `woosh2.ogg` | Short magnetic snap travel; 215 ms low-level lead-in trimmed |
| `assets/sfx/move-medium.wav` | `woosh5.ogg` | Medium magnetic snap travel; 107 ms low-level lead-in trimmed |
| `assets/sfx/move-long.wav` | `woosh8.ogg` | Long magnetic snap travel; 76 ms low-level lead-in trimmed |

## Runtime sound-design rules

- All audible SFX come from the source recordings listed above.
- The runtime may start, stop, pause, and set playback volume on those recordings. Those are ordinary playback controls, not sound generation.
- The runtime does **not** use oscillators or synthesized tones.
- The runtime does **not** modify `playbackRate` or pitch.
- The runtime does **not** randomly alter sounds.
- Magnetic movement is represented by one continuous recorded travel sound per snap, never a sound on each grid cell.
- The movement recordings have only their measured leading low-level padding trimmed; no playback speed, pitch, or time-stretch processing is used. Their strong attack now begins about 10 ms after playback starts.
- Every ordinary non-capture movement endpoint uses `stop-soft.wav`, regardless of whether the blocker is an edge, another Latchling, rock, anchor, door, gate, or rail.
- Ordinary traversal through a valid suit gate, color gate, or rail is intentionally silent to avoid clutter.
- Switches and turners may receive a restrained cue because they materially alter route/board behavior.

## Suggested voluntary credit

Although not legally required under CC0, a credits page may include:

`Sound effects by Kenney (kenney.nl), used under CC0.`
