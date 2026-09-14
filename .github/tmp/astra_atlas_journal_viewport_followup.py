from pathlib import Path

p=Path('style400-story-theme.css')
s=p.read_text(encoding='utf-8')
marker='/* Astra journal viewport containment */'
assert marker not in s
s += r'''

/* Astra journal viewport containment */
#story.story-screen.active{display:flex!important;flex-direction:column;height:100dvh;min-height:0;overflow:hidden;box-sizing:border-box}
#story.story-screen.active .story-topbar{flex:0 0 auto}
#story.story-screen.active .story-journal-shell{flex:1 1 auto;height:auto;min-height:0;max-height:none;overflow:hidden;margin-bottom:0;box-sizing:border-box}
#story.story-screen.active .story-section-panels{flex:1 1 auto;min-height:0;overflow:hidden}
#story.story-screen.active .story-section-panel{height:100%;max-height:100%;overflow:auto;overscroll-behavior:contain}
'''
p.write_text(s,encoding='utf-8')
print('Journal viewport containment follow-up applied.')
