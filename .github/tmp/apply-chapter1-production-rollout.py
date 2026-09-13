from pathlib import Path

# Extend the accepted production slice through Chapter 1 without touching gameplay data.
game_path=Path('game400-a.js')
game=game_path.read_text()
old="""const VISUAL_SLICE_LEVELS={1:'sunpetal',366:'aurora-dense'};
let homeRewardFocus=null;
function visualSliceForLevel(level){return playMode==='campaign'?(VISUAL_SLICE_LEVELS[level]||''):''}
"""
new="""const VISUAL_CHAPTER_MODES={1:'sunpetal'};
const VISUAL_LEVEL_OVERRIDES={366:'aurora-dense'};
let homeRewardFocus=null;
function visualSliceForLevel(level){if(playMode!=='campaign')return '';const chapter=Math.ceil(level/50);return VISUAL_LEVEL_OVERRIDES[level]||VISUAL_CHAPTER_MODES[chapter]||''}
"""
if game.count(old)!=1:
    raise SystemExit('visual mode hook source did not match exactly once')
game=game.replace(old,new,1)
game_path.write_text(game)

css_path=Path('style400-production-slice.css')
css=css_path.read_text()
old_comment='/* Sunpetal proof, Level 1: matte moss/stone and morning scenery outside the rules layer. */'
new_comment='/* Sunpetal production chapter, Levels 1-50: matte meadow materials with scenery outside the rules layer. */'
if css.count(old_comment)!=1:
    raise SystemExit('Sunpetal proof comment did not match exactly once')
css=css.replace(old_comment,new_comment,1)
marker='/* Aurora proof, Level 366: quiet midnight floor, aurora in scenery, mechanics carry contrast. */'
if marker not in css:
    raise SystemExit('Aurora marker missing')
range_block="""
/* Chapter 1 waypoint progression: five quiet material shifts, never rule-like floor patterns. */
#game[data-visual-slice="sunpetal"] #board[data-board-range="1"]{background:linear-gradient(145deg,#dfe3bd,#c9d39e)!important;border-color:#89976a!important}
#game[data-visual-slice="sunpetal"] #board[data-board-range="1"] .cell{background:linear-gradient(145deg,#f1efd0,#dfe2bb)!important}
#game[data-visual-slice="sunpetal"] #board[data-board-range="2"]{background:linear-gradient(145deg,#d8dfae,#bdca8d)!important;border-color:#819064!important}
#game[data-visual-slice="sunpetal"] #board[data-board-range="2"] .cell{background:linear-gradient(145deg,#eef0cc,#d8dfa9)!important}
#game[data-visual-slice="sunpetal"] #board[data-board-range="3"]{background:linear-gradient(145deg,#ddd8aa,#c2c38e)!important;border-color:#8f8963!important}
#game[data-visual-slice="sunpetal"] #board[data-board-range="3"] .cell{background:linear-gradient(145deg,#efe7c1,#d9d6a2)!important}
#game[data-visual-slice="sunpetal"] #board[data-board-range="4"]{background:linear-gradient(145deg,#d4d9aa,#b8c28f)!important;border-color:#7d8965!important}
#game[data-visual-slice="sunpetal"] #board[data-board-range="4"] .cell{background:linear-gradient(145deg,#e5e7bd,#ced5a2)!important}
#game[data-visual-slice="sunpetal"] #board[data-board-range="5"]{background:linear-gradient(145deg,#d8d1a4,#b9bc87)!important;border-color:#877f5d!important}
#game[data-visual-slice="sunpetal"] #board[data-board-range="5"] .cell{background:linear-gradient(145deg,#e8dfb6,#cfd0a0)!important}

"""
if 'Chapter 1 waypoint progression:' in css:
    raise SystemExit('Chapter 1 waypoint block already present')
css=css.replace(marker,range_block+marker,1)
css_path.write_text(css)

index_path=Path('index.html')
html=index_path.read_text()
old_cache='style400-production-slice.css?v=20260912-slice1'
new_cache='style400-production-slice.css?v=20260912-ch1rollout1'
if html.count(old_cache)!=1:
    raise SystemExit('production slice cache key did not match exactly once')
html=html.replace(old_cache,new_cache,1)
index_path.write_text(html)
