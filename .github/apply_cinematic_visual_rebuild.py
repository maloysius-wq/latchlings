from pathlib import Path
import re

# Runtime visual markup only. Narrative data and progression stay untouched.
p=Path('cinematics400.js'); s=p.read_text()
old="function islandsHtml(cls=''){return `<div class=\"cin-islands ${cls}\"><i class=\"cin-island i1\"></i><i class=\"cin-island i2\"></i><i class=\"cin-island i3\"></i><i class=\"cin-island i4\"></i><i class=\"cin-island i5\"></i><span class=\"cin-route r1\"></span><span class=\"cin-route r2\"></span><span class=\"cin-route r3\"></span><span class=\"cin-route r4\"></span></div>`}"
new="function islandMarkup(i,extra=''){const prop=['tree','cottage','rock','tree','cottage'][i-1]||'tree';return `<div class=\"cin-island i${i} ${extra}\"><span class=\"cin-island-side\"></span><span class=\"cin-island-rim\"></span><span class=\"cin-island-top\"></span><i class=\"cin-island-prop prop-${prop}\"></i></div>`}\nfunction islandsHtml(cls=''){return `<div class=\"cin-islands ${cls}\">${[1,2,3,4,5].map(i=>islandMarkup(i)).join('')}<span class=\"cin-route r1\"></span><span class=\"cin-route r2\"></span><span class=\"cin-route r3\"></span><span class=\"cin-route r4\"></span></div>`}"
if s.count(old)!=1: raise SystemExit('islandsHtml anchor mismatch')
s=s.replace(old,new)
old="function homeHtml(withCast=true){return `<div class=\"cin-home-scene\"><div class=\"cin-home-cloud c1\"></div><div class=\"cin-home-cloud c2\"></div><div class=\"cin-home-island\"><div class=\"cin-home-grass\"></div><div class=\"cin-cottage\"><i class=\"roof\"></i><i class=\"door\"></i></div><i class=\"cin-tree\"></i>${withCast?`<div class=\"cin-home-cast\">${character('Pippa','pippa')}${character('Bramble','bramble')}${character('Rowan','rowan')}${character('Pip','pip')}${character('Tansy','tansy')}</div>`:''}</div></div>`}"
new="function homeHtml(mode=''){return `<div class=\"cin-home-reference-wrap ${mode}\"><iframe class=\"cin-home-reference\" src=\"title-island-concepts/?c=2&embed=1&cinematic=1\" title=\"Little Home\" tabindex=\"-1\" aria-hidden=\"true\"></iframe></div>`}"
if s.count(old)!=1: raise SystemExit('homeHtml anchor mismatch')
s=s.replace(old,new)
old="function networkHtml(mode=''){return `<div class=\"cin-network ${mode}\"><i class=\"node n1\"><span>MEADOWS</span></i><i class=\"node n2\"><span>LANTERN</span></i><i class=\"node n3\"><span>LODESTONE</span></i><i class=\"node n4\"><span>KEEP</span></i><i class=\"node n5\"><span>PRISM</span></i><i class=\"node n6\"><span>COPPERLINE</span></i><i class=\"node n7\"><span>STORMSWITCH</span></i><i class=\"node n8\"><span>CROWN</span></i><span class=\"wire w1\"></span><span class=\"wire w2\"></span><span class=\"wire w3\"></span><span class=\"wire w4\"></span><span class=\"wire w5\"></span><span class=\"wire w6\"></span><span class=\"wire w7\"></span></div>`}"
new="function networkNode(n,label,type){return `<div class=\"node n${n} type-${type}\"><i class=\"node-side\"></i><i class=\"node-rim\"></i><i class=\"node-top\"></i><i class=\"node-landmark\"></i><span>${label}</span></div>`}\nfunction networkHtml(mode=''){const nodes=[['MEADOWS','meadow'],['LANTERN','lantern'],['LODESTONE','lodestone'],['KEEP','keep'],['PRISM','prism'],['COPPERLINE','copper'],['STORMSWITCH','storm'],['CROWN','crown']];return `<div class=\"cin-network ${mode}\">${nodes.map((x,i)=>networkNode(i+1,x[0],x[1])).join('')}<span class=\"wire w1\"></span><span class=\"wire w2\"></span><span class=\"wire w3\"></span><span class=\"wire w4\"></span><span class=\"wire w5\"></span><span class=\"wire w6\"></span><span class=\"wire w7\"></span></div>`}\nfunction lookoutHtml(){return `<div class=\"cin-lookout-scene\"><div class=\"cin-lookout-island\"><i class=\"near-side\"></i><i class=\"near-top\"></i><i class=\"near-crystal\"></i></div><div class=\"cin-telescope\"><i class=\"tube\"></i><i class=\"lens\"></i></div>${character('Tansy','lookout-tansy')}<div class=\"cin-distant-home\"><i class=\"d-side\"></i><i class=\"d-top\"></i><i class=\"d-house\"></i><i class=\"d-light\"></i></div><i class=\"cin-sightline\"></i></div>`}\nfunction keepsakeHtml(){const items=[['mail','MEADOWS'],['flag','LANTERN'],['anchor','LODESTONE'],['mask','KEEP'],['prism','PRISM'],['compass','COPPERLINE'],['switch','STORMSWITCH']];return `<div class=\"cin-keepsake-board\">${items.map(([c,l])=>`<i class=\"cin-keepsake-token ${c}\"><b></b><small>${l}</small></i>`).join('')}</div>`}\nfunction automationHtml(){return `<div class=\"cin-automation\"><div class=\"hand-map\">${mapSheets('tiny')}</div><div class=\"machine\"><i class=\"gear g1\"></i><i class=\"gear g2\"></i><span class=\"fixed-line\"></span></div></div>`}\nfunction routeDraftingHtml(label='LIVE ROUTE'){return `<div class=\"cin-route-drafting\"><i></i><b>${label}</b></div>`}"
if s.count(old)!=1: raise SystemExit('networkHtml anchor mismatch')
s=s.replace(old,new)
pattern=r"function visualHtml\(type\)\{.*?\n return islandsHtml\(\);\n\}"
new_visual="""function visualHtml(type){
 if(type==='archipelago')return islandsHtml('wide');
 if(type==='little-home')return homeHtml('little-home');
 if(type==='skyway')return `${islandsHtml('bright')}<div class=\"cin-route-cargo\"><i>✉</i><i>✿</i><i>⌂</i></div>`;
 if(type==='waykeeper')return `${islandsHtml('waykeeper-map')}<div class=\"cin-compass\"><i></i><b>WAYKEEPER</b></div>`;
 if(type==='helper-crew')return `<div class=\"cin-helper-story\"><div class=\"story-side\">${character('Pippa','portrait')}<b>STORY</b></div><div class=\"helper-arrow\">→</div><div class=\"crew-side\">${helper('#4c8ff4','#79aff9','#2e69c8','spade')}${helper('#f6b737','#ffd06a','#d18c16','diamond')}${helper('#66bd72','#94dc98','#469852','club')}<b>ROUTE CREW</b></div></div>`;
 if(type==='snap-demo')return routeDemoHtml();
 if(type==='morning')return `${homeHtml('morning')}<div class=\"cin-breakfast-route\"><span class=\"old-line\"></span><i class=\"basket\"></i><i class=\"miss\">×</i></div>`;
 if(type==='prism-view')return `${islandsHtml('prism')}<div class=\"cin-prism-beam p1\"></div><div class=\"cin-prism-beam p2\"></div><div class=\"cin-prism-beam p3\"></div>`;
 if(type==='porch')return lookoutHtml();
 if(type==='network-miss')return `${islandsHtml('misaligned')}<div class=\"cin-ghost-map\"><span></span><span></span><span></span></div>`;
 if(type==='map-mismatch')return `<div class=\"cin-overlay-map\"><div class=\"old\"><b>OLD MAP</b>${islandsHtml('map-old')}</div><div class=\"now\"><b>NOW</b>${islandsHtml('map-now')}</div></div>`;
 if(type==='new-route')return `${islandsHtml('new')}${routeDraftingHtml('NEW COORDINATES')}`;
 if(type==='map-drawer')return `<div class=\"cin-drawer\"><i></i>${mapSheets('stacked')}</div>${character('Bramble','map-bramble')}`;
 if(type==='dated-maps')return mapSheets('spread');
 if(type==='map-sequence')return mapSheets('sequence');
 if(type==='automation')return automationHtml();
 if(type==='frozen-network')return `${islandsHtml('frozen')}<div class=\"cin-frozen-lines\"><i></i><i></i><i></i></div>`;
 if(type==='brand-new-route')return `${islandsHtml('brand-new')}<div class=\"cin-compass small\"><i></i></div>${routeDraftingHtml('LIVING ROUTE')}`;
 if(type==='signals')return networkHtml('signals');
 if(type==='keepsakes')return keepsakeHtml();
 if(type==='living-network')return networkHtml('living');
 if(type==='many-routes')return `${islandsHtml('many')}<div class=\"cin-route-options\"><i></i><i></i><i></i></div>`;
 if(type==='aurora-crown')return `${networkHtml('crown')}<div class=\"cin-aurora\"><i></i><i></i><i></i></div>`;
 if(type==='homeward-network')return `<div class=\"cin-homeward-wrap\">${networkHtml('mini')}${homeHtml('homeward')}</div>`;
 return islandsHtml();
}"""
s2,n=re.subn(pattern,new_visual,s,flags=re.S)
if n!=1: raise SystemExit(f'visualHtml replacement count {n}')
p.write_text(s2)

# Reuse the real title-page Little Home in a scene-only mode. Normal title behavior is unchanged.
p=Path('title-island-concepts/index.html'); s=p.read_text()
marker='/* Cinematic scene-only reuse of the production Little Home */'
css="""\n/* Cinematic scene-only reuse of the production Little Home */
body.cinematic-mode{width:100vw;height:100vh;min-height:0!important;margin:0;background:transparent!important;overflow:hidden!important}
body.cinematic-mode .page,body.cinematic-mode .viewer,body.cinematic-mode #c2,body.cinematic-mode #c2 .phone{width:100%!important;height:100%!important;min-height:0!important;margin:0!important;padding:0!important}
body.cinematic-mode #c2 .phone{aspect-ratio:auto!important;background:transparent!important;overflow:hidden!important;border-radius:0!important;box-shadow:none!important}
body.cinematic-mode #c2 .topline,body.cinematic-mode #c2 .toy-brand,body.cinematic-mode #c2 .play,body.cinematic-mode #c2 .secondary,body.cinematic-mode #c2 .cloud,body.cinematic-mode #c2 .skywash{display:none!important}
body.cinematic-mode #c2 .scene{left:50%!important;right:auto!important;top:50%!important;width:350px!important;height:350px!important;transform:translate(-50%,-50%) scale(.76)!important;transform-origin:50% 50%!important;overflow:visible!important}
body.cinematic-mode #c2 .island-model{top:11px!important}
"""
if marker not in s: s=s.replace('</style>',css+'</style>',1)
old=" const params=new URLSearchParams(location.search);if(params.get('embed')!=='1')return;\n document.body.classList.add('embed-mode');show('c2');"
new=" const params=new URLSearchParams(location.search);if(params.get('embed')!=='1')return;\n const cinematic=params.get('cinematic')==='1';\n document.body.classList.add('embed-mode');if(cinematic)document.body.classList.add('cinematic-mode');show('c2');"
if s.count(old)!=1: raise SystemExit('title embed anchor mismatch')
s=s.replace(old,new)
p.write_text(s)

# Load the polish layer after the base cinematic stylesheet.
p=Path('index.html'); s=p.read_text()
link='<link rel="stylesheet" href="style400-cinematics-polish.css">'
if link not in s:
    anchor='<link rel="stylesheet" href="style400-cinematics.css">'
    if s.count(anchor)!=1: raise SystemExit('cinematic stylesheet loader anchor mismatch')
    s=s.replace(anchor,anchor+'\n'+link,1)
p.write_text(s)
