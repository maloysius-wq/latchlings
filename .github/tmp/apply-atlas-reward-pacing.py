from pathlib import Path

def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f'missing expected source for {label}')
    if text.count(old) != 1:
        raise SystemExit(f'expected one match for {label}, found {text.count(old)}')
    return text.replace(old, new, 1)

p=Path('game400-a.js')
s=p.read_text()
s=replace_once(s,
"let atlasRewardState=null,atlasRewardTimers=[];",
"let atlasRewardState=null,atlasRewardTimers=[];\nconst ATLAS_REWARD_TIME_SCALE=1.7;\nfunction atlasRewardMs(ms){return Math.round(ms*ATLAS_REWARD_TIME_SCALE)}",
'atlas scale')
s=replace_once(s,
"function cancelAtlasReward(){clearAtlasRewardTimers();atlasRewardState=null;const levels=document.getElementById('levels');if(levels)levels.classList.remove('atlas-reward-mode')}",
"function cancelAtlasReward(){clearAtlasRewardTimers();atlasRewardState=null;const levels=document.getElementById('levels');if(levels)levels.classList.remove('atlas-reward-mode','atlas-music-hold')}",
'cancel reward classes')
s=replace_once(s,
"function finishAtlasReward(r){clearAtlasRewardTimers();const auto=!!r.autoAdvance,to=r.to;atlasRewardState=null;chapterView=r.destChapter;rangeView=r.destRange;renderChapter();const levels=document.getElementById('levels');if(levels)levels.classList.remove('atlas-reward-mode');if(auto)atlasRewardTimer(()=>startLevel(to),260)}",
"function finishAtlasReward(r){clearAtlasRewardTimers();const auto=!!r.autoAdvance,to=r.to;atlasRewardState=null;chapterView=r.destChapter;rangeView=r.destRange;renderChapter();const levels=document.getElementById('levels');if(levels){levels.classList.remove('atlas-reward-mode');levels.classList.toggle('atlas-music-hold',auto)}if(auto)atlasRewardTimer(()=>{if(levels)levels.classList.remove('atlas-music-hold');startLevel(to)},260)}",
'finish reward music hold')
s=replace_once(s,
"function runAtlasRewardSame(r,reduced=false){const map=document.getElementById('levelGrid'),source=map&&map.querySelector(`.atlas-node[data-level=\"${r.from}\"]`),dest=map&&map.querySelector(`.atlas-node[data-level=\"${r.to}\"]`);if(source)source.classList.add('just-completed');atlasRewardBanner(r,false);if(reduced){atlasRevealDestination(r);atlasRewardTimer(()=>finishAtlasReward(r),420);return}const first=r.sourceChapter*50-49+r.sourceRange*10,points=atlasLayout(r.sourceChapter,r.sourceRange),a=points[r.from-first],b=points[r.to-first],routeIndex=Math.max(0,r.from-first),route=map&&map.querySelector(`.atlas-route[data-target=\"${r.to}\"]`);atlasRewardTimer(()=>{if(route)route.classList.add('reward-restoring')},280);atlasRewardTimer(()=>atlasTraveler(r.sourceChapter,a,b,atlasRouteSpec(r.sourceChapter,r.sourceRange).curve,routeIndex,1180),430);atlasRewardTimer(()=>atlasRevealDestination(r),900);atlasRewardTimer(()=>{if(dest)dest.classList.add('reward-landed')},1580);atlasRewardTimer(()=>finishAtlasReward(r),2080)}",
"function runAtlasRewardSame(r,reduced=false){const map=document.getElementById('levelGrid'),source=map&&map.querySelector(`.atlas-node[data-level=\"${r.from}\"]`),dest=map&&map.querySelector(`.atlas-node[data-level=\"${r.to}\"]`);if(source)source.classList.add('just-completed');atlasRewardBanner(r,false);if(reduced){atlasRevealDestination(r);atlasRewardTimer(()=>finishAtlasReward(r),420);return}const first=r.sourceChapter*50-49+r.sourceRange*10,points=atlasLayout(r.sourceChapter,r.sourceRange),a=points[r.from-first],b=points[r.to-first],routeIndex=Math.max(0,r.from-first),route=map&&map.querySelector(`.atlas-route[data-target=\"${r.to}\"]`);atlasRewardTimer(()=>{if(route)route.classList.add('reward-restoring')},atlasRewardMs(280));atlasRewardTimer(()=>atlasTraveler(r.sourceChapter,a,b,atlasRouteSpec(r.sourceChapter,r.sourceRange).curve,routeIndex,atlasRewardMs(1180)),atlasRewardMs(430));atlasRewardTimer(()=>atlasRevealDestination(r),atlasRewardMs(900));atlasRewardTimer(()=>{if(dest)dest.classList.add('reward-landed')},atlasRewardMs(1580));atlasRewardTimer(()=>finishAtlasReward(r),atlasRewardMs(2080))}",
'same reward timing')
s=replace_once(s,
"function runAtlasRewardCross(r,reduced=false){const map=document.getElementById('levelGrid'),source=map&&map.querySelector(`.atlas-node[data-level=\"${r.from}\"]`);if(source)source.classList.add('just-completed','waypoint-complete');atlasRewardBanner(r,false);if(reduced){atlasRewardTimer(()=>{r.phase='destination';chapterView=r.destChapter;rangeView=r.destRange;renderChapter();atlasRewardBanner(r,true)},120);atlasRewardTimer(()=>atlasRevealDestination(r),320);atlasRewardTimer(()=>finishAtlasReward(r),760);return}const sourcePoints=atlasLayout(r.sourceChapter,r.sourceRange),sourceFirst=r.sourceChapter*50-49+r.sourceRange*10,a=sourcePoints[r.from-sourceFirst]||[50,24];atlasRewardTimer(()=>atlasTraveler(r.sourceChapter,a,[50,2],atlasRouteSpec(r.sourceChapter,r.sourceRange).curve,8,720),220);atlasRewardTimer(()=>{r.phase='destination';chapterView=r.destChapter;rangeView=r.destRange;renderChapter();atlasRewardBanner(r,true)},850);atlasRewardTimer(()=>{const destPoints=atlasLayout(r.destChapter,r.destRange),destFirst=r.destChapter*50-49+r.destRange*10,b=destPoints[r.to-destFirst]||destPoints[0];atlasTraveler(r.destChapter,[50,103],b,atlasRouteSpec(r.destChapter,r.destRange).curve,0,940)},1120);atlasRewardTimer(()=>atlasRevealDestination(r),1750);atlasRewardTimer(()=>finishAtlasReward(r),2920)}",
"function runAtlasRewardCross(r,reduced=false){const map=document.getElementById('levelGrid'),source=map&&map.querySelector(`.atlas-node[data-level=\"${r.from}\"]`);if(source)source.classList.add('just-completed','waypoint-complete');atlasRewardBanner(r,false);if(reduced){atlasRewardTimer(()=>{r.phase='destination';chapterView=r.destChapter;rangeView=r.destRange;renderChapter();atlasRewardBanner(r,true)},120);atlasRewardTimer(()=>atlasRevealDestination(r),320);atlasRewardTimer(()=>finishAtlasReward(r),760);return}const sourcePoints=atlasLayout(r.sourceChapter,r.sourceRange),sourceFirst=r.sourceChapter*50-49+r.sourceRange*10,a=sourcePoints[r.from-sourceFirst]||[50,24];atlasRewardTimer(()=>atlasTraveler(r.sourceChapter,a,[50,2],atlasRouteSpec(r.sourceChapter,r.sourceRange).curve,8,atlasRewardMs(720)),atlasRewardMs(220));atlasRewardTimer(()=>{r.phase='destination';chapterView=r.destChapter;rangeView=r.destRange;renderChapter();atlasRewardBanner(r,true)},atlasRewardMs(850));atlasRewardTimer(()=>{const destPoints=atlasLayout(r.destChapter,r.destRange),destFirst=r.destChapter*50-49+r.destRange*10,b=destPoints[r.to-destFirst]||destPoints[0];atlasTraveler(r.destChapter,[50,103],b,atlasRouteSpec(r.destChapter,r.destRange).curve,0,atlasRewardMs(940))},atlasRewardMs(1120));atlasRewardTimer(()=>atlasRevealDestination(r),atlasRewardMs(1750));atlasRewardTimer(()=>finishAtlasReward(r),atlasRewardMs(2920))}",
'cross reward timing')
s=replace_once(s,
"function playQueuedAtlasReward(autoAdvance=false){if(!atlasRewardState){",
"function playQueuedAtlasReward(autoAdvance=false){const levels=document.getElementById('levels');if(levels)levels.classList.remove('atlas-music-hold');if(!atlasRewardState){",
'clear music hold before reward')
p.write_text(s)

p=Path('music400.js')
s=p.read_text()
s=replace_once(s,
"  const FADE_MS = 360;",
"  const FADE_MS = 360;\n  const ATLAS_FADE_MS = Math.round(FADE_MS * 1.7);",
'atlas fade duration')
s=replace_once(s,
"  function displayedLevel() {",
"  function atlasRewardScreenActive() {\n    const levels = document.getElementById('levels');\n    return activeScreenId() === 'levels' && !!(levels && (levels.classList.contains('atlas-reward-mode') || levels.classList.contains('atlas-music-hold')));\n  }\n\n  function atlasChapterKey() {\n    const app = document.getElementById('app');\n    const cls = app && Array.from(app.classList).find(name => /^theme-ch[1-8]$/.test(name));\n    return cls ? cls.slice(8) : null;\n  }\n\n  function displayedLevel() {",
'atlas music helpers')
s=replace_once(s,
"  function desiredTrackKey() {\n    if (activeScreenId() !== 'game') return 'title';\n    return String(Math.max(1, Math.min(8, Math.ceil(displayedLevel() / 50))));\n  }",
"  function desiredTrackKey() {\n    if (atlasRewardScreenActive()) return atlasChapterKey() || (/^[1-8]$/.test(requestedKey) ? requestedKey : '1');\n    if (activeScreenId() !== 'game') return 'title';\n    return String(Math.max(1, Math.min(8, Math.ceil(displayedLevel() / 50))));\n  }",
'desired atlas track')
s=replace_once(s,
"  async function beginCurrentTrack(token) {",
"  async function beginCurrentTrack(token, fadeMs = FADE_MS) {",
'begin fade parameter')
s=replace_once(s,
"      await fadeTo(TARGET_VOLUME, FADE_MS, token);",
"      await fadeTo(TARGET_VOLUME, fadeMs, token);",
'fade in duration')
s=replace_once(s,
"  async function switchTrack(key, immediate = false) {\n    requestedKey = key;\n    if (!TRACKS[key] || !enabled || !unlocked) return;\n    if (currentKey === key && audio.src) {\n      if (audio.paused) beginCurrentTrack(transitionToken);\n      return;\n    }\n\n    const token = ++transitionToken;\n    if (!immediate && currentKey && !audio.paused) await fadeTo(0, FADE_MS, token);",
"  async function switchTrack(key, immediate = false) {\n    requestedKey = key;\n    const fadeMs = atlasRewardScreenActive() ? ATLAS_FADE_MS : FADE_MS;\n    if (!TRACKS[key] || !enabled || !unlocked) return;\n    if (currentKey === key && audio.src) {\n      if (audio.paused) beginCurrentTrack(transitionToken, fadeMs);\n      return;\n    }\n\n    const token = ++transitionToken;\n    if (!immediate && currentKey && !audio.paused) await fadeTo(0, fadeMs, token);",
'switch fade context')
s=replace_once(s,
"    await beginCurrentTrack(token);",
"    await beginCurrentTrack(token, fadeMs);",
'begin switched track')
s=replace_once(s,
"    requested: () => requestedKey\n  };",
"    requested: () => requestedKey,\n    fadeDuration: () => atlasRewardScreenActive() ? ATLAS_FADE_MS : FADE_MS,\n    atlasRewardActive: atlasRewardScreenActive\n  };",
'music debug surface')
p.write_text(s)

p=Path('index.html')
s=p.read_text()
s=replace_once(s,'<script src="game400-a.js"></script>','<script src="game400-a.js?v=20260911-atlaspace1"></script>','game cache bust')
s=replace_once(s,'<script src="music400.js"></script>','<script src="music400.js?v=20260911-atlaspace1"></script>','music cache bust')
p.write_text(s)
