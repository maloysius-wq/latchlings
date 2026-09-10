from pathlib import Path

# Make waypoint/region crossings a clearly staged event: outgoing celebration -> clouded arrival -> cloud clear -> settle.
p=Path('game400-a.js')
s=p.read_text()
old="function runAtlasRewardCross(r,reduced=false){const map=document.getElementById('levelGrid'),source=map&&map.querySelector(`.atlas-node[data-level=\"${r.from}\"]`);if(source)source.classList.add('just-completed','waypoint-complete');atlasRewardBanner(r,false);if(reduced){atlasRewardTimer(()=>{r.phase='destination';chapterView=r.destChapter;rangeView=r.destRange;renderChapter();atlasRewardBanner(r,true);atlasRevealDestination(r)},150);atlasRewardTimer(()=>finishAtlasReward(r),620);return}const sourcePoints=atlasLayout(r.sourceChapter,r.sourceRange),sourceFirst=r.sourceChapter*50-49+r.sourceRange*10,a=sourcePoints[r.from-sourceFirst]||[50,24];atlasRewardTimer(()=>atlasTraveler(r.sourceChapter,a,[50,2],atlasRouteSpec(r.sourceChapter,r.sourceRange).curve,8,760),260);atlasRewardTimer(()=>{r.phase='destination';chapterView=r.destChapter;rangeView=r.destRange;renderChapter();atlasRewardBanner(r,true);const destPoints=atlasLayout(r.destChapter,r.destRange),destFirst=r.destChapter*50-49+r.destRange*10,b=destPoints[r.to-destFirst]||destPoints[0];atlasTraveler(r.destChapter,[50,103],b,atlasRouteSpec(r.destChapter,r.destRange).curve,0,900)},930);atlasRewardTimer(()=>atlasRevealDestination(r),1340);atlasRewardTimer(()=>finishAtlasReward(r),2260)}"
new="function runAtlasRewardCross(r,reduced=false){const map=document.getElementById('levelGrid'),source=map&&map.querySelector(`.atlas-node[data-level=\"${r.from}\"]`);if(source)source.classList.add('just-completed','waypoint-complete');atlasRewardBanner(r,false);if(reduced){atlasRewardTimer(()=>{r.phase='destination';chapterView=r.destChapter;rangeView=r.destRange;renderChapter();atlasRewardBanner(r,true)},120);atlasRewardTimer(()=>atlasRevealDestination(r),320);atlasRewardTimer(()=>finishAtlasReward(r),760);return}const sourcePoints=atlasLayout(r.sourceChapter,r.sourceRange),sourceFirst=r.sourceChapter*50-49+r.sourceRange*10,a=sourcePoints[r.from-sourceFirst]||[50,24];atlasRewardTimer(()=>atlasTraveler(r.sourceChapter,a,[50,2],atlasRouteSpec(r.sourceChapter,r.sourceRange).curve,8,720),220);atlasRewardTimer(()=>{r.phase='destination';chapterView=r.destChapter;rangeView=r.destRange;renderChapter();atlasRewardBanner(r,true)},850);atlasRewardTimer(()=>{const destPoints=atlasLayout(r.destChapter,r.destRange),destFirst=r.destChapter*50-49+r.destRange*10,b=destPoints[r.to-destFirst]||destPoints[0];atlasTraveler(r.destChapter,[50,103],b,atlasRouteSpec(r.destChapter,r.destRange).curve,0,940)},1120);atlasRewardTimer(()=>atlasRevealDestination(r),1750);atlasRewardTimer(()=>finishAtlasReward(r),2920)}"
if old not in s:
    raise SystemExit('cross reward function not found')
s=s.replace(old,new,1)
p.write_text(s)

# Add a stronger second layer to the 40 board identities. These rules intentionally affect the real cells.
p=Path('style400-board-surfaces.css')
s=p.read_text()
extra=r'''

/* Deep surface pass: each ten-level stretch should read from the board itself, not only its backdrop. */
.board[data-board-range] .cell:before,.board[data-board-range] .cell:after{content:"";position:absolute;pointer-events:none;z-index:0;opacity:.55}
.board[data-board-range] .cell>*{z-index:1}

/* Range 1: hand-laid / stitched starter paths. */
.board[data-board-range="1"] .cell{border-width:1px;border-color:color-mix(in srgb,var(--cellEdge) 72%,#8a744f);background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.17) 0 1px,transparent 1px 8px),linear-gradient(145deg,color-mix(in srgb,var(--cellA) 94%,#fff),var(--cellB))}
.board[data-board-range="1"] .cell:before{left:7%;right:7%;bottom:8%;height:1px;border-top:1px dashed color-mix(in srgb,var(--themeAccent) 31%,transparent)}

/* Range 2: angled routework, visibly more woven and directional. */
.board[data-board-range="2"] .cell{border-color:color-mix(in srgb,var(--themeAccent) 33%,var(--cellEdge));background-image:repeating-linear-gradient(135deg,color-mix(in srgb,var(--themeAccent) 18%,transparent) 0 2px,transparent 2px 9px),linear-gradient(145deg,color-mix(in srgb,var(--cellA) 86%,var(--themeAccent)),color-mix(in srgb,var(--cellB) 91%,var(--themeAccent)))}
.board[data-board-range="2"] .cell:before{width:28%;height:28%;right:7%;top:7%;border-top:2px solid color-mix(in srgb,var(--themeAccent) 34%,transparent);border-right:2px solid color-mix(in srgb,var(--themeAccent) 34%,transparent);border-radius:2px 7px 2px 2px}

/* Range 3: stamped civic/waypoint tiles. */
.board[data-board-range="3"] .cell{border-width:2px;border-color:color-mix(in srgb,var(--themeAccent) 24%,var(--cellEdge));background-image:radial-gradient(circle at 50% 50%,color-mix(in srgb,var(--themeAccent) 16%,transparent) 0 17%,transparent 18% 38%,rgba(255,255,255,.12) 39% 43%,transparent 44%),linear-gradient(145deg,color-mix(in srgb,var(--cellA) 91%,#dce9e5),color-mix(in srgb,var(--cellB) 92%,#b8c8c5))}
.board[data-board-range="3"] .cell:before{inset:15%;border:1px solid color-mix(in srgb,var(--themeAccent) 22%,transparent);border-radius:50%;opacity:.42}

/* Range 4: engineered intersections and harder-route grid plates. */
.board[data-board-range="4"] .cell{border-color:color-mix(in srgb,var(--themeAccent) 38%,var(--cellEdge));background-image:linear-gradient(90deg,transparent 0 45%,color-mix(in srgb,var(--themeAccent) 20%,transparent) 46% 52%,transparent 53%),linear-gradient(0deg,transparent 0 45%,rgba(255,255,255,.16) 46% 52%,transparent 53%),linear-gradient(145deg,color-mix(in srgb,var(--cellA) 74%,var(--cellB)),color-mix(in srgb,var(--cellB) 82%,#3d4850))}
.board[data-board-range="4"] .cell:before{left:5px;top:5px;width:4px;height:4px;border-radius:50%;background:color-mix(in srgb,var(--themeAccent) 48%,rgba(255,255,255,.5));box-shadow:calc(100% + 0px) 0 0 transparent}
.board[data-board-range="4"] .cell:after{right:5px;bottom:5px;width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.34)}

/* Range 5: landmark / finale surface, faceted and visibly luminous. */
.board[data-board-range="5"] .cell{border-width:2px;border-color:color-mix(in srgb,var(--themeAccent) 43%,var(--cellEdge));background-image:conic-gradient(from 45deg at 50% 50%,rgba(255,255,255,.24) 0 12.5%,transparent 12.5% 37.5%,color-mix(in srgb,var(--themeAccent) 20%,transparent) 37.5% 62.5%,transparent 62.5% 87.5%,rgba(255,255,255,.20) 87.5%),linear-gradient(145deg,color-mix(in srgb,var(--cellA) 83%,#fff),color-mix(in srgb,var(--cellB) 84%,var(--themeAccent)))}
.board[data-board-range="5"] .cell:before{inset:5%;border:1px solid color-mix(in srgb,var(--themeAccent) 28%,rgba(255,255,255,.4));clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}
.board[data-board-range="5"] .cell:after{left:50%;top:8%;width:3px;height:3px;translate:-50% 0;border-radius:50%;background:#fff;box-shadow:0 0 5px color-mix(in srgb,var(--themeAccent) 72%,#fff)}

/* Chapter-specific physical marks. The motif is intentionally tied to story location. */
#app.theme-ch1 .board[data-board-range] .cell:after{left:9%;top:9%;width:7px;height:7px;border-radius:60% 35% 60% 35%;background:color-mix(in srgb,var(--themeAccent) 28%,transparent);rotate:28deg;box-shadow:5px 2px 0 -2px rgba(238,170,76,.28)}
#app.theme-ch2 .board[data-board-range] .cell:after{right:8%;bottom:9%;width:9px;height:5px;border-radius:50%;border:1px solid rgba(83,65,40,.22);box-shadow:0 0 5px rgba(255,190,73,.16);background:rgba(255,205,91,.08)}
#app.theme-ch3 .board[data-board-range] .cell:after{right:5%;top:8%;width:13px;height:2px;background:rgba(105,210,231,.28);rotate:-42deg;box-shadow:-5px 5px 0 -1px rgba(141,111,214,.18)}
#app.theme-ch4 .board[data-board-range] .cell:after{right:7%;top:7%;width:8px;height:8px;border:1px solid rgba(128,89,127,.24);rotate:45deg;background:rgba(202,163,96,.08);border-radius:1px}
#app.theme-ch5 .board[data-board-range] .cell:after{left:8%;right:8%;top:13%;height:2px;background:linear-gradient(90deg,rgba(239,95,102,.18),rgba(246,183,55,.16),rgba(102,189,114,.16),rgba(76,143,244,.18),rgba(154,114,223,.18));rotate:-18deg;filter:blur(.2px)}
#app.theme-ch6 .board[data-board-range] .cell:after{left:6px;top:6px;width:4px;height:4px;border-radius:50%;background:rgba(82,48,29,.34);box-shadow:calc(100% + 0px) 0 0 rgba(82,48,29,.2),0 calc(100% + 0px) 0 rgba(82,48,29,.2)}
#app.theme-ch7 .board[data-board-range] .cell:after{left:9%;bottom:11%;width:45%;height:23%;border-left:2px solid rgba(92,191,232,.26);border-bottom:2px solid rgba(92,191,232,.26);border-radius:0 0 0 5px;box-shadow:-1px 1px 4px rgba(92,191,232,.12)}
#app.theme-ch8 .board[data-board-range] .cell:after{right:11%;top:10%;width:4px;height:4px;background:#eaffff;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);box-shadow:0 0 7px rgba(128,236,221,.5)}

/* Prevent decorative layers from affecting the real gameplay fixtures. */
.board[data-board-range] .cell .rock,.board[data-board-range] .cell .nest,.board[data-board-range] .cell .anchor,.board[data-board-range] .cell .gate,.board[data-board-range] .cell .rail,.board[data-board-range] .cell .turner,.board[data-board-range] .cell .switch-tile,.board[data-board-range] .cell .door-tile{z-index:2}
'''
if '/* Deep surface pass:' not in s:
    s += extra
p.write_text(s)
