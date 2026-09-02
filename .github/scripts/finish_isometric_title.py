from pathlib import Path
import re

root = Path(__file__).resolve().parents[2]
p = root / 'title-island-concepts/index.html'
t = p.read_text()

css = r'''
/* Coherent isometric island system */
.island.iso{left:50%;top:25px;width:360px;height:345px;transform:translateX(-50%);filter:drop-shadow(0 20px 22px rgba(42,60,75,.18))}
.island.iso .asset{position:absolute;display:block;object-fit:contain;user-select:none;pointer-events:none}
.iso-base{z-index:2;left:50%;transform:translateX(-50%);width:315px;top:72px}
.iso-prop{z-index:7;filter:drop-shadow(0 7px 8px rgba(48,59,70,.10))}.iso-back{z-index:5}.iso-front{z-index:11}
.iso-home{position:absolute;left:190px;top:42px;width:116px;height:138px;z-index:8}
.iso-home .wall-door{position:absolute;width:73px;left:0;top:47px;z-index:2}.iso-home .wall-window{position:absolute;width:69px;left:45px;top:48px;z-index:1}.iso-home .roof{position:absolute;width:120px;left:-5px;top:0;z-index:4}
#c1 .iso-base{top:72px;width:316px}#c1 .hay{width:58px;left:72px;top:139px}#c1 .sacks{width:62px;left:239px;top:135px}#c1 .fenceiso{width:72px;left:213px;top:190px}
#c1 .l1{left:126px;top:119px}#c1 .l2{left:232px;top:105px}#c1 .l3{left:57px;top:159px}#c1 .l4{left:202px;top:172px}#c1 .l5{left:112px;top:208px}#c1 .l6{left:267px;top:194px}
#c2 .iso-base{top:70px;width:318px}#c2 .planks{width:72px;left:66px;top:185px}#c2 .fenceiso{width:72px;left:238px;top:191px}#c2 .ladderiso{width:48px;left:247px;top:224px}
#c2 .l1{left:137px;top:130px}#c2 .l2{left:240px;top:117px}#c2 .l3{left:62px;top:128px}#c2 .l4{left:91px;top:181px}#c2 .l5{left:242px;top:176px}#c2 .l6{left:168px;top:214px}
#c3 .iso-base{top:75px;width:320px}#c3 .corn{width:55px;left:224px;top:114px}#c3 .bales{width:65px;left:57px;top:154px}#c3 .planks{width:73px;left:141px;top:187px}#c3 .fenceiso{width:68px;left:247px;top:192px}#c3 .ladderiso{width:45px;left:59px;top:218px}
#c3 .l1{left:50px;top:116px}#c3 .l2{left:130px;top:92px}#c3 .l3{left:218px;top:105px}#c3 .l4{left:270px;top:154px}#c3 .l5{left:145px;top:171px}#c3 .l6{left:75px;top:205px}#c3 .l7{left:235px;top:211px}
'''
if '/* Coherent isometric island system */' not in t:
    t = t.replace('@media(max-width:430px)', css + '@media(max-width:430px)', 1)

replacements = {
    'c1': '<img class="asset iso-base" src="assets/isometric/base_grass_high_detail_S.png" alt=""><img class="asset iso-prop iso-back hay" src="assets/isometric/hay_S.png" alt=""><img class="asset iso-prop iso-front sacks" src="assets/isometric/sacksCrate_S.png" alt=""><img class="asset iso-prop iso-front fenceiso" src="assets/isometric/fenceLow_S.png" alt="">',
    'c2': '<img class="asset iso-base" src="assets/isometric/base_grass_high_S.png" alt=""><div class="iso-home"><img class="wall-door" src="assets/isometric/woodWallDoorClosed_S.png" alt=""><img class="wall-window" src="assets/isometric/woodWallWindow_S.png" alt=""><img class="roof" src="assets/isometric/roofSingle_S.png" alt=""></div><img class="asset iso-prop iso-front planks" src="assets/isometric/planks_S.png" alt=""><img class="asset iso-prop iso-front fenceiso" src="assets/isometric/fenceLow_S.png" alt=""><img class="asset iso-prop iso-front ladderiso" src="assets/isometric/ladderStand_S.png" alt="">',
    'c3': '<img class="asset iso-base" src="assets/isometric/base_grass_detail_S.png" alt=""><img class="asset iso-prop iso-back corn" src="assets/isometric/cornYoungDouble_S.png" alt=""><img class="asset iso-prop iso-back bales" src="assets/isometric/hayBales_S.png" alt=""><img class="asset iso-prop iso-front planks" src="assets/isometric/planks_S.png" alt=""><img class="asset iso-prop iso-front fenceiso" src="assets/isometric/fenceLow_S.png" alt=""><img class="asset iso-prop iso-front ladderiso" src="assets/isometric/ladderStand_S.png" alt="">',
}
for cid, markup in replacements.items():
    id_pos = t.index(f'id="{cid}"')
    sec_start = t.rfind('<section', 0, id_pos)
    island_start = t.index('<div class="island">', sec_start)
    first_latch = t.index('<div class="latchling', island_start)
    t = t[:island_start] + '<div class="island iso">\n          ' + markup + '\n          ' + t[first_latch:]

t = t.replace('The calmest version. A simple home nook, one tree, a path, and quiet little routines.', 'The calmest version. A grassy little islet with a rest nook, supplies, and quiet routines.')
t = t.replace('Same calm composition, with a tiny home, fence, ladder, sign, and slightly richer daily routines.', 'Same calm composition, now with a tiny assembled cottage, fence, ladder, and slightly richer daily routines.')
t = t.replace('one Latchling naps on the log nook, one peeks around the tree, one studies the sign, one bounces along the island, one lingers near the path, and one gently levitates at the edge.', 'one Latchling rests by the hay nook, one peeks around the supply stack, two wander the grass, one lingers by the fence, and one gently levitates at the edge.')
t = t.replace('the home is more explicit here. One rests at the log nook, one peeks from home, one hangs near the tree, one checks the sign, one bounces by the fence, and another drifts near the ladder edge.', 'the home is explicit here. One rests near the cottage, one peeks from the doorway, one hangs around the yard, one checks the planks, one bounces by the fence, and another drifts near the ladder edge.')
t = t.replace('one balances near the rope, one levitates above the hill, two bounce along different parts of the island, one peeks from the tree line, one watches the others, and one has had enough and quietly rests by the bush.', 'one explores the ladder, one levitates over the crops, two bounce along different parts of the island, one peeks by the hay bales, one watches the others, and one quietly rests near the fence.')
p.write_text(t)

credits = root / 'title-island-concepts/ASSET_CREDITS.md'
c = credits.read_text()
credit_note = '''\n\n## Isometric island revision\n\nThe focused three-concept gallery now uses individually exported pieces from **Kenney Isometric Miniature Bases** and **Kenney Isometric Miniature Farm** for the island bases, cottage parts, fence, ladder, crops, hay, planks, and supply props. These Kenney packs are released under **CC0 1.0 Universal**. The Latchlings themselves remain custom live HTML/CSS/SVG artwork.\n'''
if '## Isometric island revision' not in c:
    credits.write_text(c.rstrip() + credit_note)

text = p.read_text(); low = text.lower()
if text.count('data-concept=') != 3:
    raise SystemExit('Expected exactly 3 concepts')
for word in ['beak', 'feather', 'tail', 'wing']:
    if re.search(r'\b' + word + r'\b', low):
        raise SystemExit(f'Bird-anatomy term found: {word}')
emoji = re.compile('[\U0001F000-\U0001FAFF\U00002600-\U000027BF]')
if emoji.search(text):
    raise SystemExit('Emoji/symbol-pictograph found')
refs = re.findall(r'src="([^"]+)"', text)
for ref in refs:
    if ref.startswith(('http:', 'https:', 'data:')):
        raise SystemExit(f'External image: {ref}')
    if not (root / 'title-island-concepts' / ref).exists():
        raise SystemExit(f'Missing image: {ref}')
iso = [r for r in refs if r.startswith('assets/isometric/')]
if len(iso) < 15:
    raise SystemExit(f'Expected coherent isometric assets throughout, found {len(iso)} refs')
for old in ['grassCliffLeft.png', 'grassCenter_rounded.png', 'grassMid.png', 'home.png', 'tree.png', 'bridgeLogs.png']:
    if f'src="assets/{old}"' in text:
        raise SystemExit(f'Old mismatched island asset still active: {old}')
print(f'STATIC_OK refs={len(refs)} isometric={len(iso)}')
