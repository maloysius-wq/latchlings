# Phone-sized browser viewport

User request: make the site phone-screen-sized for eventual Android packaging. This is a bounded presentation change, not an Android build or a change to gameplay. The existing standing authorization includes merging verified changes, publishing to GitHub Pages and checking the live site.

## Implementation

Large top-level windows (at least600×600 CSS pixels) open `phone-preview.html`, a centered same-origin game iframe. It chooses a complete phone profile that fits with at least16px outer margins:390×844 for windows at least876px tall;360×800 at832–875px;320×568 below832px. The neutral surround is outside the game. Narrow phone windows and short landscape windows keep their existing full available viewport; a preview resized narrow also becomes edge-to-edge without reloading its game. Complete profiles deliberately leave extra space around short-window previews rather than reduce game fonts, controls or board clearance.

`phone-viewport400.js` is loaded early by the normal entry page and reused by the preview host. The child game never redirects again. Query strings and fragment identifiers are preserved. No duplicate game instance runs in the host; the actual app, viewport units, media queries, dialogs, nested canonical Home and cinematic geometry all belong to the phone browsing context. Storage stays on the same origin and uses the existing keys/database. Audio/fullscreen permissions are retained on the iframe. No save reset, new wallet, level change, economy change or puzzle-control restyle is introduced.

## Verification

- New regression observed RED against the original desktop-wide game (`0 !== 1` phone frames), then GREEN with the real implementation.
- Four desktop sizes:1440×1000,1366×768,1024×600,1280×840. Four unchanged native layouts:320×568,390×844,430×932,844×390. Each desktop includes Large Text Level1/366 board-to-Route-Tip clearance >=2px and original >=44px D-pad targets.
- Tested actual internal viewport dimensions, centering/no outer overflow, no recursion, preserved URL query/hash, contained wallet and Opening controls, actual resident/D-pad Level1 clears, energy20→19 and coins0→30, reload persistence and desktop-to-phone resizing without a second debit or lost coins.
- Desktop Opening/clear screenshots are under `test-artifacts/phone-viewport/`. Initial1366px Opening and1024px clear were visually inspected; final profile captures replace initial sizing evidence and are checked again at closeout.
- Two older tests relied on an implicit desktop viewport while reading top-level game globals. Their observed failures were corrected by explicitly requesting390×844, without changing their5000ms readiness deadline, held-background-fetch assertion or VM/rendered simulation parity assertions. The full run that exposed the second fixture failure is retained and is not claimed as a passing run.
- `npm test` retains its existing44 suites and runs the new viewport suite through the standard npm `posttest` lifecycle,45 suites total. Final full local and source CI results are recorded at closeout; do not infer them from isolated passes.

One focused independent read-only review found an Important issue in the initial shell:390×568 Large Text overlapped the board/Route Tip by23px at Level1 and7px at366. The author reproduced an overlap in the new regression, then changed only shell sizing to the complete phone profiles above. A continuously interpolated width also exposed an unsupported340×736 Large Text layout, so it was rejected rather than patching puzzle CSS. Settled measurements wait for actual fonts/render frames, not for a passing gap. The targeted Large Text rerun passed every desktop and native configuration; the same assertions are now part of the normal new suite. The superseded local full run and CI on60676f9 were deliberately stopped when sizing changed, preserving logs; neither is counted as final acceptance. No additional reviewer or broad redesign was requested.

Review boundaries: whole-game/economy semantics are preserved and covered by the existing regression rather than re-audited here; physical Android packaging, real screen-reader/audio use and subjective presentation remain external. Native-to-desktop resizing is handled by the early entry script, while the measured regression covers desktop-to-native resize. An unmeasured in-flight native-to-desktop transition is not claimed certified.

Source/tests: `index.html`, `phone-preview.html`, `phone-viewport400.js`, `tests/phone-viewport.browser.cjs`, explicit phone fixtures in `tests/campaign-tools.cjs` and `tests/game-readiness.browser.cjs`, and `package.json`.

## Limits

The site is still a web game, not an APK or Android WebView package. Actual Android safe-area, back-button, keyboard, audio and lifecycle testing must be done when packaging. Browser emulation is not physical-device testing. The phone preview does not fabricate a device notch or Android system controls.
