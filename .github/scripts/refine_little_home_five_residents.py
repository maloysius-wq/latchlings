from pathlib import Path

p = Path('title-island-concepts/index.html')
t = p.read_text()

# Remove the broad center/home adult only.
adult = '<div class="latchling resident adult life-home l4" data-role="adult" data-activity="home" data-color="gold" data-suit="star" data-expr="smug"></div>'
if adult not in t:
    raise SystemExit('Expected life-home adult markup not found')
t = t.replace(adult, '', 1)

# Remove now-unused Concept 2 placement/routine/prop styling for that resident.
for token in [
    '#c2 .l4{left:151px;top:143px}',
    '#c2 .life-home{animation:littleHomeCircuit 12.3s ease-in-out infinite}',
    '#c2 .life-home:after{content:"";position:absolute;right:-7px;bottom:-1px;width:3px;height:16px;border-radius:3px;background:#9a7249;transform:rotate(28deg);box-shadow:6px 7px 0 -1px #d7b67b}',
    '@keyframes littleHomeCircuit{0%,100%{transform:translate(0,0)}13%{transform:translate(13px,-7px)}27%{transform:translate(31px,-18px)}40%{transform:translate(47px,-22px)}54%{transform:translate(33px,-9px)}67%{transform:translate(8px,5px)}80%{transform:translate(-17px,3px)}91%{transform:translate(-8px,-4px)}}'
]:
    t = t.replace(token, '', 1)

# Add a third flower in the newly opened yard space.
old_flowers = '<div class="flower f1"></div><div class="flower f2"></div><div class="play-ball" aria-hidden="true"></div>'
new_flowers = '<div class="flower f1"></div><div class="flower f2"></div><div class="flower blue f3"></div><div class="play-ball" aria-hidden="true"></div>'
if old_flowers not in t:
    raise SystemExit('Expected Concept 2 flower/play-ball sequence not found')
t = t.replace(old_flowers, new_flowers, 1)

# Add Concept 2-only placement and blue petal treatment.
anchor = '#c2 .flower.f1{left:190px;top:104px}#c2 .flower.f2{left:78px;top:111px}'
replacement = anchor + '#c2 .flower.f3{left:148px;top:84px}#c2 .flower.blue:after{background:radial-gradient(circle,#f4d77a 0 19%,transparent 21%),radial-gradient(circle at 50% 4%,#72aef5 0 22%,transparent 24%),radial-gradient(circle at 96% 50%,#72aef5 0 22%,transparent 24%),radial-gradient(circle at 50% 96%,#72aef5 0 22%,transparent 24%),radial-gradient(circle at 4% 50%,#72aef5 0 22%,transparent 24%);filter:drop-shadow(0 1px 1px rgba(48,91,142,.18))}'
if anchor not in t:
    raise SystemExit('Expected Concept 2 flower placement CSS not found')
t = t.replace(anchor, replacement, 1)

# Keep preview copy truthful.
t = t.replace('A six-Latchling household lives here: four adults keep the island running while two smaller kids play through the yard.', 'A five-Latchling household lives here: three adults keep the island running while two smaller kids play through the yard.', 1)
t = t.replace('a tiny six-resident home in motion. Four adults tend the island and cottage while two smaller children chase and play through the shared yard.', 'a tiny five-resident home in motion. Three adults tend the island and cottage while two smaller children chase and play through the shared yard.', 1)

p.write_text(t)
