from pathlib import Path

p=Path('title-island-concepts/index.html')
s=p.read_text()
needle='''/* Chapter-two payoff focus: the canonical Little Home visitor pennant gets the same readable, non-blocking reward treatment. */\n#c2 .phone.story-focus-pennant .story-pennant{display:block;z-index:25;animation:pennantRewardFocus 1800ms cubic-bezier(.2,.8,.2,1) both}'''
replacement='''/* Chapter-two payoff focus: keep the canonical visitor pennant visually separate from the cottage, then give it a readable non-blocking reveal. */\n#c2 .story-pennant{left:238px;top:146px;width:4px;height:39px;background:#765338;filter:drop-shadow(0 3px 3px rgba(52,42,30,.18))}\n#c2 .story-pennant:after{left:4px;top:2px;width:25px;height:14px;background:linear-gradient(90deg,#e3b653,#bd8741);box-shadow:0 2px 3px rgba(61,45,28,.18);clip-path:polygon(0 0,100% 16%,72% 100%,0 72%)}\n#c2 .phone.story-focus-pennant .story-pennant{display:block;z-index:25;animation:pennantRewardFocus 1800ms cubic-bezier(.2,.8,.2,1) both}'''
if s.count(needle)!=1:
    raise SystemExit(f'expected one Chapter 2 pennant focus block, found {s.count(needle)}')
p.write_text(s.replace(needle,replacement,1))
print('CHAPTER2_PENNANT_PAYOFF_REFINED')
