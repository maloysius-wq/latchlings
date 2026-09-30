'use strict';
(function(){
const ACTIONS=[
 'establish-drifting-neighborhood','show-working-skyway','focus-little-home',
 'breakfast-route-travels','breakfast-misses-porch','watering-misses-garden',
 'shortcut-misses-rock','tansy-compares-target','pip-shows-yesterday-route',
 'rowan-measures-three-offsets','three-misses-pulse-together','widen-to-network-question',
 'waykeeper-call-ready','route-adapts-to-drift','call-leaves-little-home',
 'waykeeper-answer-arrives','neighbors-share-local-knowledge','route-becomes-puzzle',
 'sunpetal-route-focus','breakfast-start-focus','investigation-ready'
];
const MISS_OFFSET={x:-22,y:-12};
const RESIDENT_FOCUS={8:'Tansy',9:'Pip',10:'Rowan',12:'Pippa',13:'Pippa',17:'Bramble',19:'Rowan',20:'Pippa',21:'Pip'};

function boardHtml(suitSvg){
 const level=window.LEVELS&&window.LEVELS[0];if(!level)return'';
 const rocks=new Set(level.rocks.map(([r,c])=>r+':'+c)),nests=new Map(level.nests.map(([r,c],i)=>[r+':'+c,level.pieces[i]])),pieces=new Map(level.pieces.map(p=>[p.pos[0]+':'+p.pos[1],p]));
 let cells='';
 for(let r=0;r<level.size;r++)for(let c=0;c<level.size;c++){
  const key=r+':'+c,p=pieces.get(key),n=nests.get(key);
  cells+=`<span class="opening-board-cell ${rocks.has(key)?'is-rock':''}" data-row="${r}" data-col="${c}">${n?`<i class="opening-board-nest">${suitSvg(n.suit)}</i>`:''}${p?`<i class="opening-board-piece" style="--piece:${p.color}">${suitSvg(p.suit)}</i>`:''}</span>`;
 }
 return `<div class="opening-board-model" aria-hidden="true"><span class="opening-board-label" style="left:10px;right:auto;text-align:left">WAYKEEPER ROUTE MODEL</span><span class="opening-board-focus-label">SUNPETAL MORNING ROUTE</span><div class="opening-board-handoff"><span class="opening-board-handoff-point" data-route-handoff="origin"><small>ORIGIN</small><b>Bakery Perch</b></span><span class="opening-board-handoff-point" data-route-handoff="destination"><small>DESTINATION</small><b>Little Home Porch</b></span></div><div class="opening-board-grid" style="--opening-grid:${level.size}">${cells}</div><span class="opening-board-breakfast">BREAKFAST START</span><span class="opening-board-ready">ROUTE READY</span></div>`;
}

function create({suitSvg}){
 return `<div class="cin-opening-continuous" data-step="1" data-story-action="${ACTIONS[0]}" data-camera="wide">
  <div class="opening-world-camera">
   <span class="opening-cloud cloud-a"></span><span class="opening-cloud cloud-b"></span>
   <div class="opening-neighbor-island neighbor-bakery-island" data-neighbor="bakery"><i class="opening-earth island-side"></i><i class="opening-grass island-top"></i><i class="opening-wood neighbor-bakery"></i><span class="neighbor-label">Bakery Perch</span></div>
   <div class="opening-neighbor-island neighbor-tree-island" data-neighbor="tree"><i class="opening-earth island-side"></i><i class="opening-grass island-top"></i><i class="opening-wood neighbor-tree"></i><span class="neighbor-label">Garden Drift</span></div>
   <iframe class="opening-home-reference" src="title-island-concepts/?c=2&amp;embed=1&amp;cinematic=1&amp;opening=1" title="Little Home" tabindex="-1" aria-hidden="true"></iframe>
   <svg class="opening-route-map" aria-hidden="true" preserveAspectRatio="none">
    <path id="opening-route-working" class="opening-route route-working"/>
    <path id="opening-route-basket" class="opening-route route-basket" data-target=".opening-miss-marker[data-miss='basket']"/>
    <path id="opening-route-water" class="opening-route route-water" data-target=".opening-miss-marker[data-miss='water']"/>
    <path id="opening-route-play" class="opening-route route-play" data-target=".opening-miss-marker[data-miss='play']"/>
    <path id="opening-route-yesterday" class="opening-route route-yesterday"/>
    <path id="opening-route-adaptive" class="opening-route route-adaptive"/>
    <path id="opening-route-call" class="opening-route route-call"/>
    <path id="opening-route-answer" class="opening-route route-answer"/>
    <circle class="opening-target-marker" data-target="porch" r="9"/><circle class="opening-target-marker" data-target="garden" r="9"/><circle class="opening-target-marker" data-target="play-rock" r="9"/>
    <circle class="opening-miss-marker" data-miss="basket" r="8"/><circle class="opening-miss-marker" data-miss="water" r="8"/><circle class="opening-miss-marker" data-miss="play" r="8"/>
    <line class="opening-offset-vector" data-offset="basket"/><line class="opening-offset-vector" data-offset="water"/><line class="opening-offset-vector" data-offset="play"/>
   </svg>
   <div class="opening-errand-labels" aria-hidden="true"><span class="opening-errand-label is-source" data-errand-source></span><span class="opening-errand-label is-target" data-errand-target></span></div>
   <div class="opening-story-props" aria-hidden="true">
    <span class="opening-route-cargo">✉</span>
    <span class="opening-basket opening-wood" data-opening-mover="basket"><i></i></span>
    <span class="opening-water-cart opening-wood" data-opening-mover="water"><i></i></span>
    <span class="opening-play-token" data-opening-mover="play">♠</span>
    <span class="opening-miss-splash" data-splash="water"></span>
    <span class="opening-call-box opening-wood"><i class="opening-call-compass"></i></span>
    <span class="opening-player-compass opening-wood"><i></i></span>
    <span class="opening-signal signal-out">✦</span><span class="opening-signal signal-in">✦</span>
    <span class="opening-knowledge-token k-pippa" data-knowledge="Pippa">✿</span><span class="opening-knowledge-token k-bramble" data-knowledge="Bramble">✉</span><span class="opening-knowledge-token k-rowan" data-knowledge="Rowan">⌖</span><span class="opening-knowledge-token k-pip" data-knowledge="Pip">♠</span><span class="opening-knowledge-token k-tansy" data-knowledge="Tansy">♥</span>
    <span class="opening-network-question">?</span>
   </div>
  </div>
  ${boardHtml(suitSvg)}
 </div>`;
}

function rectJson(rect){return {x:rect.x,y:rect.y,width:rect.width,height:rect.height,left:rect.left,top:rect.top,right:rect.right,bottom:rect.bottom}}
function unionRects(rects){
 if(!rects.length)return null;
 const left=Math.min(...rects.map(r=>r.left)),top=Math.min(...rects.map(r=>r.top)),right=Math.max(...rects.map(r=>r.right)),bottom=Math.max(...rects.map(r=>r.bottom));
 return {x:left,y:top,left,top,right,bottom,width:right-left,height:bottom-top};
}
function installCanonicalHome(root){
 const frame=root.querySelector('.opening-home-reference');if(!frame||frame.dataset.bound==='true')return;
 frame.dataset.bound='true';
 const install=()=>{
  try{
   const win=frame.contentWindow,doc=frame.contentDocument;if(!win||!doc||!doc.body)return;
   doc.body.dataset.openingCinematic='true';doc.documentElement.dataset.openingCinematic='true';doc.documentElement.dataset.sceneActive='false';doc.documentElement.dataset.motion='reduced';
   win.LatchlingsHomeLife?.stopAdults?.();win.LatchlingsHomeLife?.stopChildren?.();
   let style=doc.getElementById('opening-cinematic-canonical-style');
   if(!style){style=doc.createElement('style');style.id='opening-cinematic-canonical-style';style.textContent=`#c2 .resident,#c2 .play-ball,#c2 .little-home-tree .foliage{animation:none!important;transition:none!important}#c2 [data-opening-focus="true"]{filter:drop-shadow(0 0 7px rgba(255,238,134,.98)) drop-shadow(0 0 2px #fff)!important}#c2 .phone{background:transparent!important}`;doc.head.appendChild(style)}
   const getRect=name=>{
    let el=null;
    if(['Pippa','Bramble','Rowan','Pip','Tansy'].includes(name))el=doc.querySelector(`#c2 [data-resident="${name}"]`);
    else if(name==='porch')el=doc.querySelector('#c2 .cottage .door');
    else if(name==='cottage')el=doc.querySelector('#c2 .cottage');
    else if(name==='home-tree')el=doc.querySelector('#c2 .little-home-tree');
    else if(name==='play-rock')el=doc.querySelector('#c2 .rock.r1');
    if(el)return rectJson(el.getBoundingClientRect());
    if(name==='garden')return unionRects([...doc.querySelectorAll('#c2 .flower.f1,#c2 .flower.f2,#c2 .flower.f3')].map(x=>x.getBoundingClientRect()));
    const top=doc.querySelector('#c2 .island-top')?.getBoundingClientRect();
    if(top&&name==='call'){const x=top.left+top.width*.80,y=top.top+top.height*.74;return {x:x-5,y:y-5,left:x-5,top:y-5,right:x+5,bottom:y+5,width:10,height:10}}
    if(top&&name==='home-center'){const x=top.left+top.width*.5,y=top.top+top.height*.5;return {x:x-2,y:y-2,left:x-2,top:y-2,right:x+2,bottom:y+2,width:4,height:4}}
    return null;
   };
   win.LatchlingsCinematicHome={
    getLandmark:getRect,
    focusResident(name){doc.querySelectorAll('#c2 [data-resident][data-opening-focus]').forEach(x=>x.removeAttribute('data-opening-focus'));const el=name&&doc.querySelector(`#c2 [data-resident="${name}"]`);if(el)el.dataset.openingFocus='true'},
    clearFocus(){doc.querySelectorAll('#c2 [data-resident][data-opening-focus]').forEach(x=>x.removeAttribute('data-opening-focus'))}
   };
   root.dataset.homeReady='true';
   requestAnimationFrame(()=>{syncGeometry(root);applyStep(root,Number(root.dataset.step||1),Number(root.dataset.step||1),true)});
  }catch(_){root.dataset.homeReady='error'}
 };
 frame.addEventListener('load',install,{passive:true});
 if(frame.contentDocument?.readyState==='complete')setTimeout(install,0);
}
function localLandmark(root,name){
 const frame=root.querySelector('.opening-home-reference'),api=frame?.contentWindow?.LatchlingsCinematicHome;if(!frame||!api?.getLandmark)return null;
 const r=api.getLandmark(name);if(!r)return null;
 const win=frame.contentWindow,sx=frame.clientWidth/Math.max(1,win.innerWidth),sy=frame.clientHeight/Math.max(1,win.innerHeight);
 return {x:frame.offsetLeft+(r.x+r.width/2)*sx,y:frame.offsetTop+(r.y+r.height/2)*sy,width:r.width*sx,height:r.height*sy};
}
function elementCenter(el){return el?{x:el.offsetLeft+el.offsetWidth/2,y:el.offsetTop+el.offsetHeight/2,width:el.offsetWidth,height:el.offsetHeight}:null}
function localElementCenter(root,selector){const el=root.querySelector(selector),camera=root.querySelector('.opening-world-camera');if(!el||!camera)return null;const r=el.getBoundingClientRect(),c=camera.getBoundingClientRect(),sx=camera.clientWidth/Math.max(1,c.width),sy=camera.clientHeight/Math.max(1,c.height);return{x:(r.left+r.width/2-c.left)*sx,y:(r.top+r.height/2-c.top)*sy,width:r.width*sx,height:r.height*sy}}
function setCircle(root,selector,p){const el=root.querySelector(selector);if(el&&p){el.setAttribute('cx',p.x.toFixed(2));el.setAttribute('cy',p.y.toFixed(2))}}
function setLine(root,selector,a,b){const el=root.querySelector(selector);if(el&&a&&b){el.setAttribute('x1',a.x.toFixed(2));el.setAttribute('y1',a.y.toFixed(2));el.setAttribute('x2',b.x.toFixed(2));el.setAttribute('y2',b.y.toFixed(2))}}
function curve(a,b,lift=0){if(!a||!b)return'';const cx=(a.x+b.x)/2,cy=(a.y+b.y)/2+lift;return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`}
function setPath(root,id,a,b,lift=0){const p=root.querySelector(id);if(p&&a&&b)p.setAttribute('d',curve(a,b,lift))}
function setPoint(el,p){if(!el||!p)return;el.getAnimations().forEach(a=>a.cancel());el.style.left=p.x+'px';el.style.top=p.y+'px'}
function pathPoint(root,selector,t){const path=root.querySelector(selector);if(!path||!path.getTotalLength())return null;return path.getPointAtLength(path.getTotalLength()*t)}
const STEP_TRAVEL={
 2:{selector:'.opening-route-cargo',path:'#opening-route-working',duration:1300},
 4:{selector:'[data-opening-mover="basket"]',path:'#opening-route-basket',duration:1250},
 6:{selector:'[data-opening-mover="water"]',path:'#opening-route-water',duration:1000},
 7:{selector:'[data-opening-mover="play"]',path:'#opening-route-play',duration:900},
 15:{selector:'.signal-out',path:'#opening-route-call',duration:1050},
 16:{selector:'.signal-in',path:'#opening-route-answer',duration:850}
};
function captureTravel(root,step){
 const spec=STEP_TRAVEL[step],el=spec&&root.querySelector(spec.selector),animation=el?.getAnimations().find(item=>item.playState==='running');
 if(!spec||!el||!animation)return null;
 const style=getComputedStyle(el),left=Number.parseFloat(style.left),top=Number.parseFloat(style.top);
 if(!Number.isFinite(left)||!Number.isFinite(top))return null;
 const duration=Number(animation.effect?.getTiming().duration)||spec.duration;
 return {el,spec,point:{x:left,y:top},remainingDuration:Math.max(16,duration-(Number(animation.currentTime)||0))};
}
function nearestPathProgress(root,selector,point){
 const path=root.querySelector(selector),length=path?.getTotalLength();if(!path||!length)return null;
 let nearestT=0,best=Infinity;
 for(let i=0;i<=240;i++){
  const t=i/240,p=path.getPointAtLength(length*t),distance=(p.x-point.x)**2+(p.y-point.y)**2;
  if(distance<best){best=distance;nearestT=t}
 }
 return nearestT;
}
function moverPoint(root,name){const map={basket:'basket',water:'water',play:'play'},el=root.querySelector(`.opening-miss-marker[data-miss="${map[name]}"]`);if(!el)return null;return {x:Number(el.getAttribute('cx')),y:Number(el.getAttribute('cy'))}}
function sourcePoint(root,name){if(name==='basket')return localElementCenter(root,'.neighbor-bakery');if(name==='water')return localLandmark(root,'Pippa');if(name==='play')return localLandmark(root,'Pip');return null}
const ERRAND_LABELS={
 basket:{source:'Bakery Perch',target:'Little Home Porch',sourcePoint:'bakery',targetPoint:'porch'},
 water:{source:"Pippa's Watering Can",target:'Little Home Garden',sourcePoint:'pippa',targetPoint:'garden'},
 play:{source:"Pip's Shortcut",target:'Garden Play Rock',sourcePoint:'pip',targetPoint:'rock'}
};
function labelBounds(point,width,height){return {left:point.x-width/2,top:point.y-height/2,right:point.x+width/2,bottom:point.y+height/2}}
function pointBounds(point){return point?labelBounds(point,point.width||10,point.height||10):null}
function boxesOverlap(a,b,gap=0){return a.left<b.right+gap&&a.right>b.left-gap&&a.top<b.bottom+gap&&a.bottom>b.top-gap}
function placeErrandLabel(label,point,camera,avoid,occupied,preferred){
 if(!label||!point)return null;
 label.hidden=false;
 const width=label.offsetWidth||104,height=label.offsetHeight||22,cameraRect={left:0,top:0,right:camera.clientWidth,bottom:camera.clientHeight},pad=5,stepX=Math.max(8,width*.22),stepY=Math.max(8,height*.35),candidates=[];
 for(let y=cameraRect.top+pad+height/2;y<=cameraRect.bottom-pad-height/2;y+=stepY)for(let x=cameraRect.left+pad+width/2;x<=cameraRect.right-pad-width/2;x+=stepX){
  const box=labelBounds({x,y},width,height);if(![...avoid,...occupied].some(other=>boxesOverlap(box,other,6))){const dx=x-point.x,dy=y-point.y,wrongSide=(preferred==='above'&&dy>0)||(preferred==='below'&&dy<0);candidates.push({x,y,box,score:Math.hypot(dx,dy)+(wrongSide?12:0)})}
 }
 candidates.sort((a,b)=>a.score-b.score);const best=candidates[0];
 if(best){label.style.left=best.x+'px';label.style.top=best.y+'px';return best.box}
 label.hidden=true;return null;
}
function syncErrandLabels(root,step){
 const name=step<=5&&step>=4?'basket':step===6?'water':step===7||step===8?'play':null;
 const source=root.querySelector('[data-errand-source]'),target=root.querySelector('[data-errand-target]');
 if(!name||!source||!target){if(source)source.hidden=true;if(target)target.hidden=true;return}
 const cue=ERRAND_LABELS[name],from=cue.sourcePoint==='bakery'?localElementCenter(root,'.neighbor-bakery'):localLandmark(root,cue.sourcePoint==='pippa'?'Pippa':'Pip'),to=localLandmark(root,cue.targetPoint==='rock'?'play-rock':cue.targetPoint),cottage=name==='basket'?localLandmark(root,'cottage'):null,camera=root.querySelector('.opening-world-camera');
 source.textContent=cue.source;target.textContent=cue.target;source.dataset.phase=target.dataset.phase=step===8?'echo':'active';
 const residents=['Pippa','Bramble','Rowan','Pip','Tansy'].map(n=>pointBounds(localLandmark(root,n))).filter(Boolean),landmarks=['cottage','home-tree'].map(n=>pointBounds(localLandmark(root,n))).filter(Boolean);
 const fromAvoid=[...residents,...landmarks,pointBounds(from)],toAvoid=[...residents,...landmarks,pointBounds(to)];
 const a=placeErrandLabel(source,from,camera,fromAvoid,[],'above');
 placeErrandLabel(target,to,camera,toAvoid,a?[a]:[],'below');
}
function effectiveReduced(){return matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.motion==='reduced'}
function travel(root,selector,pathSelector,duration,startAt=0){
 const el=root.querySelector(selector),path=root.querySelector(pathSelector);if(!el||!path||!path.getTotalLength())return;
 el.getAnimations().forEach(a=>a.cancel());
 if(effectiveReduced()){const p=path.getPointAtLength(path.getTotalLength());setPoint(el,p);return}
 const from=Math.max(0,Math.min(.995,startAt)),frames=[],length=path.getTotalLength(),count=Math.max(2,Math.ceil((1-from)*20));
 for(let i=0;i<=count;i++){const t=from+(1-from)*i/count,p=path.getPointAtLength(length*t);frames.push({left:p.x+'px',top:p.y+'px'})}
 if(from>0){const start=path.getPointAtLength(length*from);el.style.left=start.x+'px';el.style.top=start.y+'px'}
 el.animate(frames,{duration:Math.max(16,duration),easing:'cubic-bezier(.35,.05,.2,1)',fill:'forwards'});
}
function syncGeometry(root){
 const camera=root.querySelector('.opening-world-camera'),map=root.querySelector('.opening-route-map');if(!camera||!map||root.dataset.homeReady!=='true')return false;
 // Fit the canonical 350px miniature as a whole; never crop its crown/roof
 // to manufacture a close-up. Its local porch/resident geometry is unchanged.
 const frame=root.querySelector('.opening-home-reference'),scene=frame?.contentDocument?.querySelector('#c2 .scene');
 if(scene){const fit=Math.min(.76,Math.max(.1,(frame.clientWidth-12)/350),Math.max(.1,(frame.clientHeight-12)/350));scene.style.setProperty('transform',`translate(-50%,-50%) scale(${fit})`,'important')}
 const step=Number(root.dataset.step||1),flight=captureTravel(root,step);
 const w=camera.clientWidth,h=camera.clientHeight;map.setAttribute('viewBox',`0 0 ${w} ${h}`);
 const porch=localLandmark(root,'porch'),garden=localLandmark(root,'garden'),rock=localLandmark(root,'play-rock'),pippa=localLandmark(root,'Pippa'),pip=localLandmark(root,'Pip'),call=localLandmark(root,'call'),home=localLandmark(root,'home-center');
 if(!porch||!garden||!rock||!pippa||!pip||!call||!home)return false;
 const targets={basket:porch,water:garden,play:rock},misses={};
 for(const [name,target] of Object.entries(targets))misses[name]={x:target.x+MISS_OFFSET.x,y:target.y+MISS_OFFSET.y};
 setCircle(root,'.opening-target-marker[data-target="porch"]',porch);setCircle(root,'.opening-target-marker[data-target="garden"]',garden);setCircle(root,'.opening-target-marker[data-target="play-rock"]',rock);
 setCircle(root,'.opening-miss-marker[data-miss="basket"]',misses.basket);setCircle(root,'.opening-miss-marker[data-miss="water"]',misses.water);setCircle(root,'.opening-miss-marker[data-miss="play"]',misses.play);
 setLine(root,'.opening-offset-vector[data-offset="basket"]',porch,misses.basket);setLine(root,'.opening-offset-vector[data-offset="water"]',garden,misses.water);setLine(root,'.opening-offset-vector[data-offset="play"]',rock,misses.play);
 const bakery=localElementCenter(root,'.neighbor-bakery'),tree=elementCenter(root.querySelector('.neighbor-tree-island')),player={x:w*.12,y:h*.17};
 setPath(root,'#opening-route-working',tree,home,Math.min(22,h*.06));
 setPath(root,'#opening-route-basket',bakery,misses.basket,-Math.min(28,h*.08));
 setPath(root,'#opening-route-water',pippa,misses.water,Math.min(12,h*.035));
 setPath(root,'#opening-route-play',pip,misses.play,-Math.min(9,h*.025));
 setPath(root,'#opening-route-yesterday',misses.play,rock,-Math.min(8,h*.02));
 setPath(root,'#opening-route-adaptive',tree,porch,Math.min(42,h*.12));
 setPath(root,'#opening-route-call',call,player,-Math.min(35,h*.1));
 setPath(root,'#opening-route-answer',player,call,Math.min(22,h*.07));
 root.dataset.geometryReady='true';
 const callBox=root.querySelector('.opening-call-box'),answer=root.querySelector('.opening-player-compass');setPoint(callBox,call);setPoint(answer,{x:call.x+30,y:call.y-22});
 const signalOut=root.querySelector('.signal-out'),signalIn=root.querySelector('.signal-in');if(flight?.el!==signalOut)setPoint(signalOut,player);if(flight?.el!==signalIn)setPoint(signalIn,call);
 const splash=root.querySelector('.opening-miss-splash');setPoint(splash,misses.water);
 const cargo=root.querySelector('.opening-route-cargo'),cargoStart=pathPoint(root,'#opening-route-working',0);if(cargoStart&&Number(root.dataset.step||1)!==2)setPoint(cargo,cargoStart);
 for(const name of ['Pippa','Bramble','Rowan','Pip','Tansy']){const token=root.querySelector(`[data-knowledge="${name}"]`),p=localLandmark(root,name);if(token&&p)setPoint(token,{x:p.x,y:p.y-24})}
 syncErrandLabels(root,step);
 for(const name of ['basket','water','play']){
  const el=root.querySelector(`[data-opening-mover="${name}"]`),src=sourcePoint(root,name),miss=moverPoint(root,name);
  if((name==='basket'&&step===4)||(name==='water'&&step===6)||(name==='play'&&step===7))continue;
  if(step>={basket:5,water:6,play:7}[name])setPoint(el,miss);else setPoint(el,src);
 }
 if(flight){
  const progress=nearestPathProgress(root,flight.spec.path,flight.point);
  if(progress!==null){const point=pathPoint(root,flight.spec.path,progress);setPoint(flight.el,point);travel(root,flight.spec.selector,flight.spec.path,flight.remainingDuration,progress)}
 }
 return true;
}
function focusResident(root,name){const frame=root.querySelector('.opening-home-reference'),api=frame?.contentWindow?.LatchlingsCinematicHome;if(!api)return;api.clearFocus();if(name)api.focusResident(name)}
function applyStep(root,step,previous,fromReady=false){
 root.dataset.step=String(step);root.dataset.storyAction=ACTIONS[step-1]||ACTIONS[ACTIONS.length-1];
 root.dataset.camera=step<=2?'wide':step===12?'network':step>=18?'puzzle':'home';
 focusResident(root,RESIDENT_FOCUS[step]||'');
 if(!syncGeometry(root))return;
 const basket=root.querySelector('[data-opening-mover="basket"]'),water=root.querySelector('[data-opening-mover="water"]'),play=root.querySelector('[data-opening-mover="play"]');
 if(step===2&&((previous!==2)||fromReady))travel(root,'.opening-route-cargo','#opening-route-working',1300);
 if(step===4&&((previous!==4)||fromReady))travel(root,'[data-opening-mover="basket"]','#opening-route-basket',1250);else if(step>=5)setPoint(basket,moverPoint(root,'basket'));else setPoint(basket,sourcePoint(root,'basket'));
 if(step===6&&((previous!==6)||fromReady))travel(root,'[data-opening-mover="water"]','#opening-route-water',1000);else if(step>=6)setPoint(water,moverPoint(root,'water'));else setPoint(water,sourcePoint(root,'water'));
 if(step===7&&((previous!==7)||fromReady))travel(root,'[data-opening-mover="play"]','#opening-route-play',900);else if(step>=7)setPoint(play,moverPoint(root,'play'));else setPoint(play,sourcePoint(root,'play'));
 if(step===15&&((previous!==15)||fromReady))travel(root,'.signal-out','#opening-route-call',1050);
 if(step===16&&((previous!==16)||fromReady))travel(root,'.signal-in','#opening-route-answer',850);
}
function bindResize(root){if(root.dataset.resizeBound==='true')return;root.dataset.resizeBound='true';const ro=new ResizeObserver(()=>applyStep(root,Number(root.dataset.step||1),Number(root.dataset.step||1)));ro.observe(root);const frame=root.querySelector('.opening-home-reference');if(frame)ro.observe(frame)}
function sync(stage,step,helpers){
 let root=stage.querySelector('.cin-opening-continuous');
 if(!root){stage.innerHTML=create(helpers);root=stage.querySelector('.cin-opening-continuous');installCanonicalHome(root);bindResize(root)}
 const previous=Number(root.dataset.step||1);applyStep(root,step,previous);
 return root;
}
function buttonLabel(step){if(step===13)return'Send the Call';if(step===15)return'Answer';if(step===21)return'Help Little Home';return'Continue'}
window.LatchlingsOpeningScene={ACTIONS,create,sync,buttonLabel,syncGeometry};
})();
