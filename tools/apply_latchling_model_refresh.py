from pathlib import Path

GAME_MARKER = "/* Refined spherical Latchling model — selected makeover #4 */"
GAME_CSS = r'''

/* Refined spherical Latchling model — selected makeover #4 */
.latchling{padding:0;appearance:none;-webkit-appearance:none;border-radius:50%;background:radial-gradient(circle at 34% 23%,rgba(255,255,255,.42) 0 6%,transparent 7%),linear-gradient(180deg,var(--light) 0%,var(--piece-color) 56%,var(--dark) 100%);border:2px solid rgba(39,68,98,.42);box-shadow:0 5px 9px rgba(22,39,58,.24),inset 0 -4px 7px rgba(30,32,40,.10),inset 0 1px 0 rgba(255,255,255,.25);overflow:hidden}
.latchling.selected{box-shadow:0 0 0 4px rgba(255,255,255,.95),0 0 0 7px rgba(66,150,233,.65),0 7px 12px rgba(22,39,58,.28);filter:saturate(1.06)}
.latchling .suit-mark{top:7%;width:25%;height:25%;z-index:3}.latchling .suit-mark svg{fill:#27496f;filter:drop-shadow(0 1px rgba(255,255,255,.18))}
.latchling .face{position:absolute;left:13%;right:13%;top:29%;height:58%;display:block;z-index:2;animation:refinedFaceFloat 2.8s ease-in-out infinite;animation-delay:var(--idle-delay,0s)}
.latchling .eyes{position:absolute;left:0;right:0;top:6%;height:34%;display:flex;justify-content:center;gap:23%;align-items:center;transform-origin:center;animation:refinedBlink var(--blink-duration,4.8s) infinite;animation-delay:var(--blink-delay,0s)}
.latchling .eye{width:22%;height:100%;background:#17253a;border-radius:50%;position:relative;box-shadow:inset 0 -1px 0 rgba(5,16,29,.16)}
.latchling .eye:before{content:"";position:absolute;width:29%;height:29%;border-radius:50%;background:#fff;left:18%;top:14%;z-index:2}
.latchling .eye:after{content:"";position:absolute;width:12%;height:12%;border-radius:50%;background:rgba(255,255,255,.72);right:18%;bottom:20%}
.latchling .face:before,.latchling .face:after{content:"";position:absolute;top:39%;width:22%;height:14%;border-radius:50%;background:rgba(244,160,174,.62);filter:blur(.15px);pointer-events:none}.latchling .face:before{left:2%}.latchling .face:after{right:2%}
.latchling .mouth{position:absolute;left:50%;top:44%;translate:-50% 0;width:29%;height:19%;margin:0;animation:none}
.latchling.expr-happy .mouth{border:0;border-bottom:2px solid #28415f;border-radius:0 0 52% 52%;background:transparent}
.latchling.expr-surprised .mouth{width:18%;height:22%;border:1.5px solid #17253a;border-radius:50%;background:#29415f}
.latchling.expr-angry .mouth{width:29%;border:0;border-top:2px solid #28415f;border-radius:52% 52% 0 0;background:transparent}
.latchling.expr-smug .mouth{width:28%;border:0;border-bottom:2px solid #28415f;border-radius:0 0 80% 20%;rotate:-7deg;background:transparent}
.latchling.expr-sleepy .eye{height:10%;background:transparent;border:0;border-top:2px solid #28415f;border-radius:50%;box-shadow:none}.latchling.expr-sleepy .eye:before,.latchling.expr-sleepy .eye:after{display:none}.latchling.expr-sleepy .mouth{width:19%;border:0;border-bottom:2px solid #28415f;border-radius:50%;background:transparent}
.latchling.expr-angry .eyes:before,.latchling.expr-angry .eyes:after{content:"";position:absolute;width:29%;height:2px;background:#28415f;top:-8%}.latchling.expr-angry .eyes:before{left:16%;rotate:15deg}.latchling.expr-angry .eyes:after{right:16%;rotate:-15deg}
.latchling.expr-curious .eyes{transform:translateY(-1%)}.latchling.expr-curious .eye:first-child{scale:.88}.latchling.expr-curious .eye:last-child{scale:1.08}.latchling.expr-curious .mouth{width:19%;border:0;border-bottom:2px solid #28415f;border-radius:50%;rotate:8deg;background:transparent}
.latchling.expr-determined .eyes:before,.latchling.expr-determined .eyes:after{content:"";position:absolute;width:30%;height:2px;background:#28415f;top:-9%}.latchling.expr-determined .eyes:before{left:15%;rotate:-13deg}.latchling.expr-determined .eyes:after{right:15%;rotate:13deg}.latchling.expr-determined .mouth{width:29%;border:0;border-top:2px solid #28415f;background:transparent}
@keyframes refinedBlink{0%,42%,47%,100%{scale:1 1}44.5%{scale:1 .07}}
@keyframes refinedFaceFloat{0%,100%{translate:0 0}50%{translate:0 1px}}
@media(prefers-reduced-motion:reduce){.latchling .face,.latchling .eyes{animation:none!important}}
'''

TITLE_CSS = GAME_CSS.replace("\n/* Refined spherical Latchling model — selected makeover #4 */\n", "\n/* Refined spherical Latchling model — selected makeover #4 */\n", 1)

STORY_MARKER = "/* Refined spherical Latchling portraits — selected makeover #4 */"
STORY_CSS = r'''

/* Refined spherical Latchling portraits — selected makeover #4 */
.story-char-body,.story-character-avatar{border-radius:50%;background:radial-gradient(circle at 34% 23%,rgba(255,255,255,.42) 0 6%,transparent 7%),linear-gradient(180deg,var(--charLight) 0%,var(--charColor) 56%,var(--charDark) 100%);border:2px solid rgba(39,68,98,.42);box-shadow:0 5px 9px rgba(22,39,58,.24),inset 0 -4px 7px rgba(30,32,40,.10),inset 0 1px 0 rgba(255,255,255,.25);overflow:hidden}
.story-char-body .suit-mark{top:7%;width:25%;height:25%;z-index:3}.story-char-body .suit-mark svg,.story-character-avatar-suit svg{fill:#27496f}
.story-char-body .face{position:absolute;left:13%;right:13%;top:29%;height:58%;display:block;z-index:2}.story-char-body .eyes{position:absolute;left:0;right:0;top:6%;height:34%;display:flex;justify-content:center;gap:23%;align-items:center;animation:refinedStoryBlink var(--blink-duration,4.8s) infinite;animation-delay:var(--blink-delay,0s);transform-origin:center}.story-char-body .eye{width:22%;height:100%;background:#17253a;border-radius:50%;position:relative;box-shadow:inset 0 -1px rgba(5,16,29,.16)}.story-char-body .eye:before{content:"";position:absolute;width:29%;height:29%;border-radius:50%;background:#fff;left:18%;top:14%}.story-char-body .eye:after{content:"";position:absolute;width:12%;height:12%;border-radius:50%;background:rgba(255,255,255,.72);right:18%;bottom:20%}.story-char-body .face:before,.story-char-body .face:after{content:"";position:absolute;top:39%;width:22%;height:14%;border-radius:50%;background:rgba(244,160,174,.62)}.story-char-body .face:before{left:2%}.story-char-body .face:after{right:2%}.story-char-body .mouth{position:absolute;left:50%;top:44%;translate:-50% 0;width:29%;height:19%;margin:0;animation:none}
.story-char-body.expr-happy .mouth{border:0;border-bottom:2px solid #28415f;border-radius:0 0 52% 52%}.story-char-body.expr-surprised .mouth{width:18%;height:22%;border:1.5px solid #17253a;border-radius:50%;background:#29415f}.story-char-body.expr-smug .mouth{width:28%;border:0;border-bottom:2px solid #28415f;border-radius:0 0 80% 20%;rotate:-7deg}.story-char-body.expr-curious .eyes{transform:translateY(-1%)}.story-char-body.expr-curious .eye:first-child{scale:.88}.story-char-body.expr-curious .eye:last-child{scale:1.08}.story-char-body.expr-curious .mouth{width:19%;border:0;border-bottom:2px solid #28415f;border-radius:50%;rotate:8deg}.story-char-body.expr-determined .eyes:before,.story-char-body.expr-determined .eyes:after{content:"";position:absolute;width:30%;height:2px;background:#28415f;top:-9%}.story-char-body.expr-determined .eyes:before{left:15%;rotate:-13deg}.story-char-body.expr-determined .eyes:after{right:15%;rotate:13deg}.story-char-body.expr-determined .mouth{width:29%;border:0;border-top:2px solid #28415f}
.story-character-avatar-suit{position:absolute;left:50%;top:7%;translate:-50% 0;width:25%;height:25%;z-index:3}.story-character-avatar-face{position:absolute;left:13%;right:13%;top:29%;height:58%;display:block;z-index:2}.story-character-avatar-eyes{position:absolute;left:0;right:0;top:6%;height:34%;display:flex;justify-content:center;gap:23%;align-items:center;animation:refinedAvatarBlink var(--avatar-blink-duration,4.8s) infinite;animation-delay:var(--avatar-blink-delay,-1.4s);transform-origin:center}.story-character-avatar-eyes i{width:22%;height:100%;border-radius:50%;background:#17253a;position:relative}.story-character-avatar-eyes i:before{content:"";position:absolute;width:29%;height:29%;border-radius:50%;background:#fff;left:18%;top:14%}.story-character-avatar-eyes i:after{content:"";position:absolute;width:12%;height:12%;border-radius:50%;background:rgba(255,255,255,.72);right:18%;bottom:20%}.story-character-avatar-face:before,.story-character-avatar-face:after{content:"";position:absolute;top:39%;width:22%;height:14%;border-radius:50%;background:rgba(244,160,174,.62)}.story-character-avatar-face:before{left:2%}.story-character-avatar-face:after{right:2%}.story-character-avatar-mouth{position:absolute;left:50%;top:44%;translate:-50% 0;width:29%;height:19%}.story-character-avatar.expr-happy .story-character-avatar-mouth{border-bottom:1.5px solid #28415f;border-radius:0 0 52% 52%}.story-character-avatar.expr-surprised .story-character-avatar-mouth{width:18%;height:22%;border:1px solid #17253a;border-radius:50%;background:#29415f}.story-character-avatar.expr-smug .story-character-avatar-mouth{width:28%;border-bottom:1.5px solid #28415f;border-radius:0 0 80% 20%;rotate:-7deg}.story-character-avatar.expr-curious .story-character-avatar-eyes{transform:translateY(-1%)}.story-character-avatar.expr-curious .story-character-avatar-eyes i:first-child{scale:.88}.story-character-avatar.expr-curious .story-character-avatar-eyes i:last-child{scale:1.08}.story-character-avatar.expr-curious .story-character-avatar-mouth{width:19%;border-bottom:1.5px solid #28415f;border-radius:50%;rotate:8deg}.story-character-avatar.expr-determined .story-character-avatar-eyes:before,.story-character-avatar.expr-determined .story-character-avatar-eyes:after{content:"";position:absolute;width:30%;height:1.5px;background:#28415f;top:-9%}.story-character-avatar.expr-determined .story-character-avatar-eyes:before{left:15%;rotate:-13deg}.story-character-avatar.expr-determined .story-character-avatar-eyes:after{right:15%;rotate:13deg}.story-character-avatar.expr-determined .story-character-avatar-mouth{width:29%;border-top:1.5px solid #28415f}
@keyframes refinedStoryBlink{0%,42%,47%,100%{scale:1 1}44.5%{scale:1 .07}}@keyframes refinedAvatarBlink{0%,42%,47%,100%{scale:1 1}44.5%{scale:1 .07}}
@media(prefers-reduced-motion:reduce){.story-char-body .eyes,.story-character-avatar-eyes{animation:none!important}}
'''

def append_once(path, marker, css):
    p=Path(path); t=p.read_text()
    if marker not in t: p.write_text(t+css)

def insert_title_once():
    p=Path('title-island-concepts/index.html'); t=p.read_text()
    if GAME_MARKER in t: return
    i=t.rfind('</style>')
    if i < 0: raise SystemExit('title </style> missing')
    p.write_text(t[:i]+TITLE_CSS+t[i:])

append_once('style400-game.css', GAME_MARKER, GAME_CSS)
insert_title_once()

p=Path('story-theme400.js'); t=p.read_text()
anchor="const CHAR_EXPR={Pippa:'curious',Bramble:'smug',Rowan:'happy',Pip:'determined',Tansy:'surprised'};"
if 'const CHAR_BLINK=' not in t:
    if anchor not in t: raise SystemExit('CHAR_EXPR anchor missing')
    t=t.replace(anchor,anchor+"\nconst CHAR_BLINK={Pippa:['4.55s','-1.15s'],Bramble:['5.10s','-2.70s'],Rowan:['4.80s','-3.35s'],Pip:['5.35s','-1.85s'],Tansy:['4.25s','-2.25s']};",1)
old="function characterVars(c){const color=CHAR_COLORS[c.color]||CHAR_COLORS.blue;return `--charColor:${color};--charLight:${CHAR_LIGHT[c.color]||color};--charDark:${CHAR_DARK[c.color]||color}`}"
new="function characterVars(c){const color=CHAR_COLORS[c.color]||CHAR_COLORS.blue,b=CHAR_BLINK[c.name]||['4.8s','-1.4s'];return `--charColor:${color};--charLight:${CHAR_LIGHT[c.color]||color};--charDark:${CHAR_DARK[c.color]||color};--avatar-blink-duration:${b[0]};--avatar-blink-delay:${b[1]}`}"
if old in t:t=t.replace(old,new,1)
elif 'avatar-blink-duration' not in t: raise SystemExit('characterVars anchor missing')
old="function characterAvatar(c){return `<span class=\"story-character-avatar\" data-character=\"${escapeHtml(c.name)}\" data-color=\"${escapeHtml(c.color)}\" data-suit=\"${escapeHtml(c.suit)}\" style=\"${characterVars(c)}\"><span class=\"story-character-avatar-suit\">${charSuitSvg(c.suit)}</span><span class=\"story-character-avatar-eyes\"><i></i><i></i></span></span>`}"
new="function characterAvatar(c){const expr=CHAR_EXPR[c.name]||'happy';return `<span class=\"story-character-avatar expr-${expr}\" data-character=\"${escapeHtml(c.name)}\" data-color=\"${escapeHtml(c.color)}\" data-suit=\"${escapeHtml(c.suit)}\" style=\"${characterVars(c)}\"><span class=\"story-character-avatar-suit\">${charSuitSvg(c.suit)}</span><span class=\"story-character-avatar-face\"><span class=\"story-character-avatar-eyes\"><i></i><i></i></span><i class=\"story-character-avatar-mouth\"></i></span></span>`}"
if old in t:t=t.replace(old,new,1)
elif 'story-character-avatar-mouth' not in t: raise SystemExit('characterAvatar anchor missing')
p.write_text(t)
append_once('style400-story-theme.css', STORY_MARKER, STORY_CSS)
print('GLOBAL_LATCHLING_MODEL_REFRESH_APPLIED')
