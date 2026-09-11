from pathlib import Path


def replace_all(path, replacements):
    p=Path(path)
    text=p.read_text()
    old_text=text
    for old,new in replacements:
        if old not in text:
            raise SystemExit(f'missing marker in {path}: {old}')
        text=text.replace(old,new)
    if text==old_text:
        raise SystemExit(f'no change in {path}')
    p.write_text(text)

replace_all('style400-cinematics-dialogue.css',[
    ('.cin-opening-dialogue-row .dialogue-portrait', '.cin-opening-dialogue-row .opening-dialogue-portrait'),
    ('.cin-opening-cast-chip .dialogue-portrait', '.cin-opening-cast-chip .opening-cast-portrait'),
])

p=Path('style400-story-rail-board.css')
text=p.read_text()
marker='/* Expanded story text must fully wrap instead of retaining the compact ellipsis rules. */'
if marker in text:
    raise SystemExit('rail visual correction already present')
text += '''\n\n/* Expanded story text must fully wrap instead of retaining the compact ellipsis rules. */\n.story-level-rail.is-expanded .story-rail-quote,.story-level-rail.is-expanded .story-rail-thread{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;overflow-wrap:anywhere}\n'''
p.write_text(text)
print('STORY_PRESENTATION_VISUAL_CORRECTION_APPLIED')
