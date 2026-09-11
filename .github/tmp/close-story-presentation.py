from pathlib import Path

p = Path('DEVELOPMENT_HANDOFF.md')
text = p.read_text()
heading = '### 2026-09-11 — Unblock opening dialogue and make level story beats self-explanatory'
next_heading = '### 2026-09-11 — Campaign-wide narrative clarity overhaul'
start = text.index(heading)
end = text.index(next_heading, start)
section = text[start:end]
section = section.replace('**Status: IN PROGRESS**', '**Status: COMPLETED**', 1)
if '#### Completion summary' not in section:
    section += '''#### Completion summary

- **Result:** COMPLETED. The opening cinematic no longer places character speech on top of the scenic stage. Opening dialogue now lives in a dedicated readable dock below the artwork, keeping full spoken text, speaker portraits/names/roles, narrator copy, and the beat-2 five-resident identity key while leaving the scene itself unobstructed.
- **Gameplay story rail:** The existing approximately 94 px compact rail remains the default so the board does not lose permanent space. It now has an explicit `Read all` control. Expanded state reveals the complete current quote and movement question with normal wrapping and no ellipsis, provides `Open full level story`, and routes that action to the same existing level Story card. The top-right book control now visibly says `Story`, making the relationship between the compact beat and deeper lore explicit.
- **Changed product files:** `cinematic-dialogue400.js`, `gameplay-story-rail400.js`, `style400-cinematics-dialogue.css`, `style400-story-rail-board.css`, and `index.html`.
- **Product commits:** `41706a349630aa4b06a190b4a014cf6edb4da904` (`Clarify story dialogue and level beats`) implemented the structural change. Manual review of its first audit exposed two presentation flaws that the original assertions had missed, so it was not accepted as the final visual result. `62ed9660f66b03617022f26c9d001f61ff4ba636` (`Finish story presentation layout`) corrected opening portrait flow/full-width dialogue rows and removed residual compact ellipsis styling from expanded story text.
- **Validation:** Initial run `34645378104`, job `103414783207`, passed the first machine gate and produced artifact `story-presentation-audit` ID `10281482218`, SHA-256 `8f5679d9d29c096f0641e7f7fd8f56e47afb1f408bb6f42e71aa1678b1b0e819`; manual screenshot review then rejected that result as final because opening portraits were out of flow and expanded rail text still visually ellipsized. The validator was strengthened to assert in-flow portraits, speech-bubble width, and removal of nowrap/ellipsis styles. Final accepted run `34645774043`, job `103416073796`, printed `STORY_PRESENTATION_ACCEPTED opening=16 rails=5` and produced `story-presentation-audit-v2`, artifact ID `10281608606`, SHA-256 `d34d97955a64446e8ae6b3d5c2231d6459b9c7fc12f331511c5ca5ea5fd47d4d`.
- **Coverage:** All eight opening beats passed at DPR 1 and DPR 3 with no stage dialogue layer, dock/stage physical separation, complete unclipped text, no horizontal overflow, usable Continue/Skip controls, and the beat-2 five-resident key. A reduced-motion pass covered all eight beats. Gameplay rails passed at Levels 1, 17, 111, 241, and 351: compact height remained board-friendly, `Read all` expanded correctly, full quote/question text wrapped without clipping or ellipsis, `Open full level story` opened the matching existing Story card, the top-right control visibly read `Story`, and no horizontal overflow or browser/page errors were reported.
- **Manual visual acceptance:** The final v2 captures were inspected after the automated pass. Opening beats 2, 3, 5, and 8 retain clear scenic focal art with readable dialogue underneath; the final beat still exposes `Begin Level 1`. Level 17's compact capture clearly exposes `Read all`; its expanded capture shows the complete quote/question plus `Open full level story` and the visible `Story` label at top-right.
- **Validation cleanup / hygiene:** Temporary patch, visual-correction, browser-validator, and validation-workflow files were removed in cleanup commits `266b45c3578e815ef3008333dc633473911f285b`, `f18655af911703105e655d77a032ec5a1107bd8d`, `3469461cbfdd5302fce11d7ccb71d39476e1cf2c`, and `1ff57345b4e1cc6a71ff26ba2c338ceb99d42bd5`. `.github/workflows` was verified to contain only permanent `validate-repository-access-guard.yml` before this closeout helper was added.
- **Deployment:** GitHub Pages run `34646072547` (run 938) completed successfully on the clean accepted product state `1ff57345b4e1cc6a71ff26ba2c338ceb99d42bd5` before this journal closeout.
- **Remaining risk / next action:** No known functional regression remains. The only remaining check is subjective real-device density/scroll feel, especially on unusually short screens. If that feels too dense in hand, tune spacing/font scale without returning dialogue to the scenic stage or hiding the full expanded story text.


'''
text = text[:start] + section + text[end:]
p.write_text(text)
print('STORY_PRESENTATION_HANDOFF_CLOSED')
