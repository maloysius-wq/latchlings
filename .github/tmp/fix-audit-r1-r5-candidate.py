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
 'A Pattern at Breakfast':'Several morning routes are missing by nearly the same amount.',
 'The Route Desk':'Fresh drift keeps changing the temporary route.',
 'Markers in the Grass':'Old markers point to where the islands used to be.',
 'Build for Today':'Local crews are testing stops from today’s coordinates.',
 'The Drift Continues':'The repair works, but the islands keep moving.',
 'Almost Connected':'Lanternwood’s homes are close, but their crossings no longer meet.',
 'Travel Windows':'Neighbors coordinate where and when routes stay open.',
 'A Porch Worth Reaching':'The twin-lantern porch is slipping out of easy visiting range.',
 'The Missing Assumption':'Old routes only work when neighbors cooperate.',
 'Neighborhood Circuit':'Shared stops are becoming one neighborhood circuit.',
 'The Buried Stop':'An old anchor still answers beneath Lodestone.',
 'Made to Move':'Waykeeper marks show anchors approved in many positions.',
 'Everybody’s Job':'Old logs show ordinary crews once maintained the routes.',
 'When the Cavern Shifts':'A local shift breaks yesterday’s perfect route.',
 'Holding, Not Freezing':'The anchors create reliable moments while everything keeps moving.',
 'Market Anyway':'The market opens while its outer lanes drift out of line.',
 'The Right Stall':'Suit gates only help when the right route reaches them.',
 'Older Than the Market':'The suit marks predate today’s market stalls.',
 'Distant Stations':'Keep records link travel windows to distant stations.',
 'Market Saved':'The market works, and old route records are pouring in.',
 'The View Gets Wider':'From Prism’s high paths, nearby islands sit beyond their old markers.',
 'A Familiar Island, Farther Away':'A familiar island is farther from its old connection.',
 'The Porch Light':'Twin lanterns still mark a friend’s porch across the drift.',
 'Yesterday Will Not Fit':'Aligning one old region throws another out of place.',
 'New Coordinates':'The Waykeeper drafts a route the old map never had.',
 'The Instructions Disagree':'Copperline’s approved maps contradict one another.',
 'Look at the Dates':'Each approved map comes from a different year.',
 'They Were All Correct':'Every old map fit the islands of its own time.',
 'What Automation Hid':'Automation kept routes running while revisions faded.',
 'Off the Old Map':'The Waykeeper draws a route with no historical precedent.',
 'One Switch, Two Regions':'One switch changes route options across two regions.',
 'Same Travel Window':'Distant regions are sharing one timed travel window.',
 'Useful Failure':'A mistimed handoff gives every region better timing data.',
 'Faster Than Yesterday':'The network is adapting before drift becomes an emergency.',
 'Waykeepers Everywhere':'Every region now maintains part of the same living map.',
 'Old and New Together':'Aurora Crown joins historical lines with brand-new routes.',
 'Back on the Same Map':'Separated island groups are connected on one living map again.',
 'Visiting Without a Crisis Plan':'A visit no longer needs a rescue plan around a failing crossing.',
 'One Node Among Many':'Little Home is busy, but no longer controls every decision.',
 'Tomorrow’s Route':'Route lights keep adjusting while the islands drift.'
}
block = 'const MOVEMENT_RAIL_LINES={\n' + ''.join(f" {k!r}:{v!r},\n" for k,v in rail_lines.items()) + '};'
text, n = re.subn(r"const MOVEMENT_RAIL_LINES=\{.*?\};", block, text, count=1, flags=re.S)
if n != 1:
    raise SystemExit(f'expanded movement rail lines: expected 1 block, found {n}')
path.write_text(text, encoding='utf-8')
refresh(path)

manifest_path.write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print(json.dumps({k: manifest[k] for k in ['style400-story-rail-board.css','gameplay-story-rail400.js']}, indent=2))
