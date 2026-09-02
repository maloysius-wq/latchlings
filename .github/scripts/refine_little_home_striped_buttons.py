from pathlib import Path

p = Path('title-island-concepts/index.html')
t = p.read_text()
start_marker = '/* Selected Little Home: brass toy plate controls */'
end_marker = '.variant-note{margin:10px 3px 0;font-size:12px;line-height:1.4;color:var(--muted)}'
start = t.find(start_marker)
end = t.find(end_marker)
if start < 0 or end < 0 or end <= start:
    raise SystemExit('Could not locate current Concept 2 brass control block')

striped = r'''/* Selected Little Home: sage-striped toy controls */
#c2 .play{left:28px;right:28px;top:590px;height:60px;border:2px solid #71865d;border-radius:22px;clip-path:none;background-image:linear-gradient(180deg,rgba(255,255,255,.24),rgba(70,91,59,.08)),repeating-linear-gradient(135deg,#fff6d8 0 13px,#b9cf9c 13px 26px,#f1d99c 26px 39px,#8fae76 39px 52px);background-size:auto,74px 74px;box-shadow:inset 0 2px 0 rgba(255,255,255,.70),inset 0 -3px 0 rgba(63,88,50,.15),0 5px 0 #6f865d,0 11px 18px rgba(59,77,54,.16);filter:none;color:#29445c;font-size:23px;font-weight:950;letter-spacing:.018em;text-shadow:0 1px 0 rgba(255,252,231,.72);gap:9px;transition:translate .14s ease,box-shadow .14s ease,filter .14s ease;overflow:hidden}
#c2 .play:before{content:"";position:absolute;inset:5px;border:1px solid rgba(78,105,62,.38);border-radius:16px;box-shadow:inset 0 1px rgba(255,255,255,.48);pointer-events:none}
#c2 .play svg{width:27px;height:27px;padding:6px;border-radius:50%;fill:#29445c;background:rgba(255,250,226,.58);box-shadow:inset 0 1px 2px rgba(65,86,53,.17),0 1px 0 rgba(255,255,255,.62)}
#c2 .secondary{left:28px;right:28px;top:663px;gap:9px}
#c2 .secondary button{height:78px;border:2px solid #71865d;border-radius:20px;clip-path:none;padding:10px 11px 10px 14px;background-image:linear-gradient(180deg,rgba(255,255,255,.18),rgba(65,88,52,.08)),repeating-linear-gradient(135deg,#fff7df 0 11px,#c4d6aa 11px 22px,#f2dda8 22px 33px,#96b27b 33px 44px);background-size:auto,62px 62px;box-shadow:inset 0 2px 0 rgba(255,255,255,.64),inset 0 -3px 0 rgba(63,88,50,.13),0 4px 0 #6f865d,0 9px 14px rgba(59,77,54,.14);filter:none;color:#29445c;text-shadow:0 1px 0 rgba(255,252,231,.70);grid-template-columns:1fr 34px;column-gap:7px;transition:translate .14s ease,box-shadow .14s ease,filter .14s ease;position:relative;overflow:hidden}
#c2 .secondary button:before{content:"";position:absolute;inset:5px;border:1px solid rgba(78,105,62,.32);border-radius:14px;box-shadow:inset 0 1px rgba(255,255,255,.42);pointer-events:none}
#c2 .secondary button:nth-child(2){background-image:linear-gradient(180deg,rgba(255,255,255,.18),rgba(65,88,52,.08)),repeating-linear-gradient(135deg,#fff8e4 0 11px,#b4c99a 11px 22px,#efd7a0 22px 33px,#88a66f 33px 44px)}
#c2 .secondary strong{font-size:15px;line-height:1;color:#29445c;letter-spacing:.006em}
#c2 .secondary span{font-size:9.5px;line-height:1.16;color:#5f7356;margin-top:5px;font-weight:800}
#c2 .secondary svg{width:31px;height:31px;padding:5px;border-radius:50%;stroke:#29445c;background:rgba(255,250,226,.56);box-shadow:inset 0 1px 2px rgba(65,86,53,.15),0 1px 0 rgba(255,255,255,.58);stroke-width:1.8}
#c2 .play:hover,#c2 .secondary button:hover{translate:0 -1px;filter:saturate(1.04) brightness(1.02);box-shadow:inset 0 2px 0 rgba(255,255,255,.70),inset 0 -3px 0 rgba(63,88,50,.14),0 6px 0 #6f865d,0 12px 18px rgba(59,77,54,.17)}
#c2 .secondary button:hover{box-shadow:inset 0 2px 0 rgba(255,255,255,.64),inset 0 -3px 0 rgba(63,88,50,.13),0 5px 0 #6f865d,0 10px 14px rgba(59,77,54,.15)}
#c2 .play:active,#c2 .secondary button:active{translate:0 3px;filter:brightness(.98);box-shadow:inset 0 2px 0 rgba(255,255,255,.56),inset 0 -2px 0 rgba(63,88,50,.14),0 2px 0 #6f865d,0 5px 8px rgba(59,77,54,.13)}
'''

t = t[:start] + striped + t[end:]
p.write_text(t)
