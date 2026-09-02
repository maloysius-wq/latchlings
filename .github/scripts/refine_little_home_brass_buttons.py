from pathlib import Path

p = Path('title-island-concepts/index.html')
t = p.read_text()
marker = '/* Selected Little Home: brass toy plate controls */'
if marker in t:
    raise SystemExit('Brass control refinement already present')

css = r'''
/* Selected Little Home: brass toy plate controls */
#c2 .play{left:28px;right:28px;top:590px;height:60px;border:2px solid #775023;border-radius:0;clip-path:polygon(11px 0,calc(100% - 11px) 0,100% 11px,100% calc(100% - 11px),calc(100% - 11px) 100%,11px 100%,0 calc(100% - 11px),0 11px);background-image:radial-gradient(circle at 15px 14px,#604119 0 2px,#f6d77b 2.3px 4px,transparent 4.3px),radial-gradient(circle at calc(100% - 15px) 14px,#604119 0 2px,#f6d77b 2.3px 4px,transparent 4.3px),radial-gradient(circle at 15px calc(100% - 14px),#604119 0 2px,#e7bd62 2.3px 4px,transparent 4.3px),radial-gradient(circle at calc(100% - 15px) calc(100% - 14px),#604119 0 2px,#e7bd62 2.3px 4px,transparent 4.3px),repeating-linear-gradient(90deg,rgba(255,255,255,.055) 0 1px,rgba(116,78,29,.025) 1px 3px),linear-gradient(180deg,#fff0a1 0%,#e2bd62 47%,#c58b37 100%);box-shadow:inset 0 2px 0 rgba(255,255,255,.64),inset 0 -5px 0 rgba(91,56,17,.18),inset 0 0 0 5px rgba(255,239,166,.12);filter:drop-shadow(0 5px 0 #6b471f) drop-shadow(0 10px 10px rgba(72,55,30,.20));color:#543a18;font-size:23px;font-weight:950;letter-spacing:.018em;text-shadow:0 1px 0 rgba(255,247,202,.72);gap:9px;transition:translate .14s ease,filter .14s ease,brightness .14s ease}
#c2 .play:before{content:"";position:absolute;inset:6px;clip-path:polygon(7px 0,calc(100% - 7px) 0,100% 7px,100% calc(100% - 7px),calc(100% - 7px) 100%,7px 100%,0 calc(100% - 7px),0 7px);border:1px solid rgba(104,72,29,.50);box-shadow:inset 0 1px rgba(255,248,203,.52);pointer-events:none}
#c2 .play svg{width:27px;height:27px;padding:6px;border-radius:50%;fill:#5f431d;background:linear-gradient(180deg,rgba(255,246,191,.54),rgba(111,75,30,.10));box-shadow:inset 0 1px 2px rgba(93,61,23,.28),0 1px 0 rgba(255,245,187,.64)}
#c2 .secondary{left:28px;right:28px;top:663px;gap:9px}
#c2 .secondary button{height:78px;border:2px solid #795225;border-radius:0;clip-path:polygon(9px 0,calc(100% - 9px) 0,100% 9px,100% calc(100% - 9px),calc(100% - 9px) 100%,9px 100%,0 calc(100% - 9px),0 9px);padding:10px 11px 10px 14px;background-image:radial-gradient(circle at 12px 11px,#65451d 0 1.7px,#efce75 2px 3.5px,transparent 3.8px),radial-gradient(circle at calc(100% - 12px) 11px,#65451d 0 1.7px,#efce75 2px 3.5px,transparent 3.8px),radial-gradient(circle at 12px calc(100% - 11px),#65451d 0 1.7px,#deb459 2px 3.5px,transparent 3.8px),radial-gradient(circle at calc(100% - 12px) calc(100% - 11px),#65451d 0 1.7px,#deb459 2px 3.5px,transparent 3.8px),repeating-linear-gradient(90deg,rgba(255,255,255,.045) 0 1px,rgba(108,73,29,.025) 1px 3px),linear-gradient(180deg,#f9dea0 0%,#d8ad57 51%,#b97e31 100%);box-shadow:inset 0 2px 0 rgba(255,250,214,.56),inset 0 -4px 0 rgba(83,51,18,.17),inset 0 0 0 4px rgba(255,239,173,.10);filter:drop-shadow(0 4px 0 #6c481f) drop-shadow(0 8px 8px rgba(69,52,28,.17));color:#4f3718;text-shadow:0 1px 0 rgba(255,238,174,.62);grid-template-columns:1fr 34px;column-gap:7px;transition:translate .14s ease,filter .14s ease,brightness .14s ease}
#c2 .secondary button:before{content:"";position:absolute;inset:5px;clip-path:polygon(6px 0,calc(100% - 6px) 0,100% 6px,100% calc(100% - 6px),calc(100% - 6px) 100%,6px 100%,0 calc(100% - 6px),0 6px);border:1px solid rgba(103,69,27,.42);pointer-events:none}
#c2 .secondary button:first-child{background-image:radial-gradient(circle at 12px 11px,#65451d 0 1.7px,#f3d47e 2px 3.5px,transparent 3.8px),radial-gradient(circle at calc(100% - 12px) 11px,#65451d 0 1.7px,#f3d47e 2px 3.5px,transparent 3.8px),radial-gradient(circle at 12px calc(100% - 11px),#65451d 0 1.7px,#e1b75f 2px 3.5px,transparent 3.8px),radial-gradient(circle at calc(100% - 12px) calc(100% - 11px),#65451d 0 1.7px,#e1b75f 2px 3.5px,transparent 3.8px),repeating-linear-gradient(90deg,rgba(255,255,255,.045) 0 1px,rgba(108,73,29,.025) 1px 3px),linear-gradient(180deg,#ffe9ac 0%,#dfb95f 51%,#bd8333 100%)}
#c2 .secondary button:last-child{background-image:radial-gradient(circle at 12px 11px,#62411d 0 1.7px,#ecc56d 2px 3.5px,transparent 3.8px),radial-gradient(circle at calc(100% - 12px) 11px,#62411d 0 1.7px,#ecc56d 2px 3.5px,transparent 3.8px),radial-gradient(circle at 12px calc(100% - 11px),#62411d 0 1.7px,#d8aa51 2px 3.5px,transparent 3.8px),radial-gradient(circle at calc(100% - 12px) calc(100% - 11px),#62411d 0 1.7px,#d8aa51 2px 3.5px,transparent 3.8px),repeating-linear-gradient(90deg,rgba(255,255,255,.04) 0 1px,rgba(104,69,26,.025) 1px 3px),linear-gradient(180deg,#f2d28b 0%,#cfa34f 51%,#aa702b 100%)}
#c2 .secondary strong{font-size:15px;line-height:1;color:#4a3317;letter-spacing:.006em}
#c2 .secondary span{font-size:9.5px;line-height:1.16;color:#75562f;margin-top:5px;font-weight:800}
#c2 .secondary svg{width:31px;height:31px;padding:5px;border-radius:50%;stroke:#63471f;background:linear-gradient(180deg,rgba(255,245,187,.50),rgba(102,67,25,.09));box-shadow:inset 0 1px 2px rgba(87,57,21,.28),0 1px 0 rgba(255,239,171,.60);stroke-width:1.8}
#c2 .play:hover,#c2 .secondary button:hover{translate:0 -1px;filter:brightness(1.03) drop-shadow(0 5px 0 #6b471f) drop-shadow(0 10px 10px rgba(72,55,30,.20))}
#c2 .secondary button:hover{filter:brightness(1.03) drop-shadow(0 4px 0 #6c481f) drop-shadow(0 8px 8px rgba(69,52,28,.17))}
#c2 .play:active,#c2 .secondary button:active{translate:0 3px;filter:brightness(.98) drop-shadow(0 2px 0 #6b471f) drop-shadow(0 5px 5px rgba(72,55,30,.16))}
'''

insert_before = '.variant-note{'
if insert_before not in t:
    raise SystemExit('Could not find control CSS insertion point')
t = t.replace(insert_before, css + insert_before, 1)
p.write_text(t)
