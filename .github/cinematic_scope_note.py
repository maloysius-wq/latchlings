from pathlib import Path
p=Path('DEVELOPMENT_HANDOFF.md')
s=p.read_text()
title='### 2026-09-04 — Professional visual QA and title-parity cinematic rebuild'
start=s.index(title); end=s.index('\n---\n',start)
entry=s[start:end]
anchor='**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, `cinematics400.js`, `style400-cinematics.css`, and possibly `CINEMATICS_SCRIPT.md` only for visual-direction notes. The title source and its texture files are references and should remain unchanged unless an actual defect in the title model is discovered. `game400-a.js`, `game400-b.js`, campaign definitions, solver data, Story Card canon, title navigation, audio, and Level 400 ending are out of scope unless validation exposes a strictly necessary integration regression. Temporary self-removing GitHub Actions workflows and audit artifacts are expected.'
note='''\n\n**Scope refinement after baseline comparison:** The baseline all-beat gallery shows that duplicating Little Home as separate cinematic CSS is itself the parity defect. The implementation will therefore add a **non-default scene-only cinematic mode** to `title-island-concepts/index.html` and embed that canonical `#c2` scene inside cinematic Little Home beats. Normal title/embed behavior must remain pixel-identical outside the new query mode. This makes the title source a deliberately shared production component while continuing to use the same local CC0 textures. `title-island-concepts/index.html` is now an expected file for this task; its existing island geometry/materials/resident choreography are not to be redesigned.\n'''
if note.strip() not in entry:
    entry=entry.replace(anchor,anchor+note)
s=s[:start]+entry+s[end:]
p.write_text(s)
