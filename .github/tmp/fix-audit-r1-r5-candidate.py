from pathlib import Path
import hashlib, json, re

root = Path('/tmp/r1r5-prepared')
manifest_path = root / 'manifest.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))

def refresh(path):
    data = path.read_bytes()
    manifest[str(path.relative_to(root))] = {'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data)}

# Finalize R1/R4 layout rules after candidate pressure testing.
path = root / 'style400-story-rail-board.css'
text = path.read_text(encoding='utf-8')
replacements = [
    ('.story-rail-main{min-height:0}', '.story-rail-main{min-height:0;overflow:visible}', 'inner story rail overflow'),
    ('html[data-text-size="large"] .story-rail-main p{font-size:16px;line-height:1.32}', 'html[data-text-size="large"] #game #storyRailSlot .story-level-rail .story-rail-main p{font-size:16px!important;line-height:1.32!important}', 'large story rail font override'),
    ('html[data-text-size="large"] .story-rail-main p{font-size:15px!important;line-height:1.3}', 'html[data-text-size="large"] #game #storyRailSlot .story-level-rail .story-rail-main p{font-size:15px!important;line-height:1.3!important}', 'short-screen large story rail font override'),
]
for old, new, label in replacements:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected 1 occurrence, found {count}')
    text = text.replace(old, new, 1)

text += '''\n\n/* Astra audit R1/R4 narrow-phone correction: preserve the current three-part rail in one row. */\n@media(max-width:430px){\n .story-level-rail{grid-template-columns:44px minmax(0,1fr) 50px;align-items:center}\n .story-rail-person,.story-rail-main{height:auto;min-height:0}\n}\n@media(max-height:720px){\n .story-level-rail{grid-template-columns:38px minmax(0,1fr) 46px;align-items:center}\n .story-rail-person,.story-rail-main{height:auto;min-height:0}\n}\n\n/* Large Text yields a little puzzle-surface width before sacrificing readable copy. */\nhtml[data-text-size="large"] #game .board{width:min(90vw,460px)}\n\n/* 320x568-class phones reclaim chrome space, not text size or touch-target safety. */\n@media(max-height:620px){\n #game.screen{padding:4px 8px}\n #game .topbar{min-height:48px;margin-bottom:3px;padding:1px 8px}\n #game .story-rail-slot{margin-bottom:1px}\n #game .story-level-rail{grid-template-columns:34px minmax(0,1fr) 44px;gap:4px;padding:3px 5px}\n #game .story-rail-person{height:auto}\n #game .rail-latchling{width:30px;height:30px}\n #game .rail-latchling.child{width:28px;height:28px}\n #game .story-rail-story-btn{min-width:44px;min-height:44px}\n html[data-text-size="large"] #game .board{width:min(72vw,228px)}\n #game .controls{grid-template-columns:68px minmax(0,1fr) 68px;gap:6px;padding-top:1px}\n #game .dpad{width:138px;height:138px}\n #game .side-action{min-height:54px}\n}\n'''
path.write_text(text, encoding='utf-8')
refresh(path)

# R1: the always-visible rail is a concise gameplay beat. Full setup/question/stakes remain in Story.
path = root / 'gameplay-story-rail400.js'
text = path.read_text(encoding='utf-8')
early = [
 ('Pippa','Breakfast basket missed a stop that worked yesterday.'),
 ('Rowan','The watering marker shifted a whole garden bed.'),
 ('Pip','My kite missed the same crossing. That makes two.'),
 ('Bramble','East Sunpetal bread missed by the same distance.'),
 ('Tansy','Neighbors report the same shifted crossings.'),
 ('Pippa','Today’s stops no longer line up with yesterday’s map.'),
 ('Rowan','The islands are fine. The routes fell behind.'),
 ('Bramble','More households sent the same route report.'),
 ('Pippa','Let’s build a temporary circuit from today’s positions.'),
 ('Tansy','The new circuit works. People arrive where they meant to.'),
 ('Rowan','The repair held, but fresh drift already changed things.'),
 ('Pippa','One repair is not enough. Routes must keep changing.'),
 ('Bramble','Send current coordinates and missed stops to Little Home.'),
 ('Pip','An old marker points to where this island used to be.'),
 ('Tansy','A vanished crossing cost a family their visiting hour.'),
 ('Rowan','Local crews are testing new stops around old markers.'),
 ('Pippa','The hardware works. Yesterday’s map is the problem.'),
 ('Bramble','Shared reports let us repair routes faster together.'),
 ('Pip','More old markers point to yesterday’s island positions.'),
 ('Tansy','Sunpetal works for today. Now we rebuild beyond it.')
]
early_block = 'const EARLY_STORY=[' + ','.join("{speaker:%r,line:%r}" % pair for pair in early) + '];'
text, n = re.subn(r"const EARLY_STORY=\[.*?\];", early_block, text, count=1, flags=re.S)
if n != 1:
    raise SystemExit(f'concise EARLY_STORY: expected 1 block, found {n}')

rail_lines = {
 'A Pattern at Breakfast':'Morning routes shifted together.',
 'The Route Desk':'Fresh drift changed the route.',
 'Markers in the Grass':'Old markers show past positions.',
 'Build for Today':'Crews test today’s stops.',
 'The Drift Continues':'The islands keep moving.',
 'Almost Connected':'Lanternwood crossings miss.',
 'Travel Windows':'Neighbors time shared routes.',
 'A Porch Worth Reaching':'The twin-lantern porch drifts.',
 'The Missing Assumption':'Old routes need cooperation.',
 'Neighborhood Circuit':'Shared stops form a circuit.',
 'The Buried Stop':'An old anchor still answers.',
 'Made to Move':'Anchors were built to move.',
 'Everybody’s Job':'Ordinary crews kept routes.',
 'When the Cavern Shifts':'A shift breaks yesterday’s route.',
 'Holding, Not Freezing':'Anchors create reliable moments.',
 'Market Anyway':'The market opens through drift.',
 'The Right Stall':'Suit gates need matching routes.',
 'Older Than the Market':'Suit marks predate the market.',
 'Distant Stations':'Records link distant stations.',
 'Market Saved':'The market works again.',
 'The View Gets Wider':'Nearby islands moved outward.',
 'A Familiar Island, Farther Away':'A familiar island drifted farther.',
 'The Porch Light':'Twin lanterns still mark home.',
 'Yesterday Will Not Fit':'One old map breaks another region.',
 'New Coordinates':'The Waykeeper draws a new route.',
 'The Instructions Disagree':'Approved maps contradict.',
 'Look at the Dates':'The maps come from different years.',
 'They Were All Correct':'Each old map once fit.',
 'What Automation Hid':'Automation hid route revisions.',
 'Off the Old Map':'A route leaves the old map.',
 'One Switch, Two Regions':'One switch changes two regions.',
 'Same Travel Window':'Regions share one travel window.',
 'Useful Failure':'Bad timing improves the network.',
 'Faster Than Yesterday':'The network adapts faster.',
 'Waykeepers Everywhere':'Every region keeps the map.',
 'Old and New Together':'Old and new routes connect.',
 'Back on the Same Map':'Island groups reconnect.',
 'Visiting Without a Crisis Plan':'Visits no longer need rescue plans.',
 'One Node Among Many':'Little Home is one busy node.',
 'Tomorrow’s Route':'Route lights keep adjusting.'
}
block = 'const MOVEMENT_RAIL_LINES={\n' + ''.join(f" {k!r}:{v!r},\n" for k,v in rail_lines.items()) + '};'
text, n = re.subn(r"const MOVEMENT_RAIL_LINES=\{.*?\};", block, text, count=1, flags=re.S)
if n != 1:
    raise SystemExit(f'expanded movement rail lines: expected 1 block, found {n}')
path.write_text(text, encoding='utf-8')
refresh(path)

# R1/R4: keep route teaching distinct but brief enough to remain visible with Large Text on short phones.
path = root / 'game400-a.js'
text = path.read_text(encoding='utf-8')
route_block = "const ROUTE_TIPS=['Use edges and rocks for stops.','Park helpers as stopping walls.','Anchors make exact stops.','Suit gates read black suit marks.','Color gates read body color.','Rails limit entry; turners bend.','Switches toggle doors.','Plan several board states ahead.'];\nfunction chapterNote(L){const k=(L-1)%50+1,ch=Math.ceil(L/50),tip=ROUTE_TIPS[ch-1];if(k>=46)return 'Expert route: plan blockers.';return tip}"
text, n = re.subn(r"const ROUTE_TIPS=\[.*?\];\nfunction chapterNote\(L\)\{.*?\}", route_block, text, count=1, flags=re.S)
if n != 1:
    raise SystemExit(f'compact route tips: expected 1 block, found {n}')
path.write_text(text, encoding='utf-8')
refresh(path)

manifest_path.write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print(json.dumps({k: manifest[k] for k in ['style400-story-rail-board.css','gameplay-story-rail400.js','game400-a.js']}, indent=2))
