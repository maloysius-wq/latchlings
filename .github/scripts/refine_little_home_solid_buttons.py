from pathlib import Path

p=Path('title-island-concepts/index.html')
t=p.read_text()
start=t.index('/* Selected Little Home: sage-striped toy controls */')
end=t.index('.variant-note{', start)
solid='''/* Selected Little Home: solid warm-cream toy controls */
#c2 .play{left:28px;right:28px;top:590px;height:60px;border:2px solid #c8a76a;border-radius:22px;clip-path:none;background:#F5DEAC;box-shadow:inset 0 2px 0 rgba(255,255,255,.62),inset 0 -3px 0 rgba(139,104,53,.12),0 5px 0 #b98e4e,0 11px 18px rgba(99,76,40,.14);filter:none;color:#29445c;font-size:23px;font-weight:950;letter-spacing:.018em;text-shadow:0 1px 0 rgba(255,250,235,.70);gap:9px;transition:translate .14s ease,box-shadow .14s ease,filter .14s ease;overflow:hidden}
#c2 .play:before{content:"";position:absolute;inset:5px;border:1px solid rgba(145,110,60,.30);border-radius:16px;box-shadow:inset 0 1px rgba(255,255,255,.46);pointer-events:none}
#c2 .play svg{width:27px;height:27px;padding:6px;border-radius:50%;fill:#29445c;background:rgba(255,255,255,.36);box-shadow:inset 0 1px 2px rgba(133,98,48,.13),0 1px 0 rgba(255,255,255,.56)}
#c2 .secondary{left:28px;right:28px;top:663px;gap:9px}
#c2 .secondary button{height:78px;border:2px solid #c8a76a;border-radius:20px;clip-path:none;padding:10px 11px 10px 14px;background:#F5DEAC;box-shadow:inset 0 2px 0 rgba(255,255,255,.58),inset 0 -3px 0 rgba(139,104,53,.11),0 4px 0 #b98e4e,0 9px 14px rgba(99,76,40,.13);filter:none;color:#29445c;text-shadow:0 1px 0 rgba(255,250,235,.68);grid-template-columns:1fr 34px;column-gap:7px;transition:translate .14s ease,box-shadow .14s ease,filter .14s ease;position:relative;overflow:hidden}
#c2 .secondary button:before{content:"";position:absolute;inset:5px;border:1px solid rgba(145,110,60,.27);border-radius:14px;box-shadow:inset 0 1px rgba(255,255,255,.42);pointer-events:none}
#c2 .secondary strong{font-size:15px;line-height:1;color:#29445c;letter-spacing:.006em}
#c2 .secondary span{font-size:9.5px;line-height:1.16;color:#705f45;margin-top:5px;font-weight:800}
#c2 .secondary svg{width:31px;height:31px;padding:5px;border-radius:50%;stroke:#29445c;background:rgba(255,255,255,.34);box-shadow:inset 0 1px 2px rgba(133,98,48,.12),0 1px 0 rgba(255,255,255,.54);stroke-width:1.8}
#c2 .play:hover,#c2 .secondary button:hover{translate:0 -1px;filter:brightness(1.015);box-shadow:inset 0 2px 0 rgba(255,255,255,.64),inset 0 -3px 0 rgba(139,104,53,.12),0 6px 0 #b98e4e,0 12px 18px rgba(99,76,40,.15)}
#c2 .secondary button:hover{box-shadow:inset 0 2px 0 rgba(255,255,255,.60),inset 0 -3px 0 rgba(139,104,53,.11),0 5px 0 #b98e4e,0 10px 14px rgba(99,76,40,.14)}
#c2 .play:active,#c2 .secondary button:active{translate:0 3px;filter:brightness(.99);box-shadow:inset 0 2px 0 rgba(255,255,255,.52),inset 0 -2px 0 rgba(139,104,53,.12),0 2px 0 #b98e4e,0 5px 8px rgba(99,76,40,.12)}
'''
t=t[:start]+solid+t[end:]
p.write_text(t)
