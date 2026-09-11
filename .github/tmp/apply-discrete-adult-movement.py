from pathlib import Path

p=Path('title-island-concepts/index.html')
s=p.read_text()

old_css='''#c2 .resident{transform-origin:50% 100%;will-change:transform;animation-iteration-count:infinite;animation-fill-mode:both}
#c2 .life-garden.adult-outing{animation:littleHomeGarden var(--adult-move-duration,5.2s) ease-in-out 1 both}
#c2 .life-parcel.adult-outing{animation:littleHomeParcel var(--adult-move-duration,5.4s) ease-in-out 1 both}
#c2 .life-tree.adult-outing{animation:littleHomeTree var(--adult-move-duration,5.6s) ease-in-out 1 both}'''
new_css='#c2 .resident{transform-origin:50% 100%;will-change:transform}'
if old_css not in s:
    raise SystemExit('old adult outing CSS block missing')
s=s.replace(old_css,new_css,1)

for rule in [
    '@keyframes littleHomeGarden{0%,100%{transform:translate(0,0)}14%{transform:translate(13px,-7px)}28%{transform:translate(20px,-4px) rotate(3deg)}43%{transform:translate(13px,3px)}58%{transform:translate(-3px,7px)}73%{transform:translate(-9px,2px) rotate(-3deg)}87%{transform:translate(4px,-3px)}}\n',
    '@keyframes littleHomeParcel{0%,100%{transform:translate(0,0)}16%{transform:translate(14px,-6px)}32%{transform:translate(30px,-14px)}45%{transform:translate(43px,-18px)}58%{transform:translate(29px,-9px)}73%{transform:translate(7px,4px)}86%{transform:translate(-8px,1px)}}\n',
    '@keyframes littleHomeTree{0%,100%{transform:translate(0,0)}14%{transform:translate(-8px,-8px)}30%{transform:translate(4px,-13px)}45%{transform:translate(14px,-5px)}61%{transform:translate(11px,6px)}76%{transform:translate(-3px,8px)}89%{transform:translate(-10px,2px)}}\n'
]:
    if rule not in s:
        raise SystemExit('old adult keyframe rule missing')
    s=s.replace(rule,'',1)

start=s.index('/* Little Home adults use one-shot outings with randomized rest periods. */')
end=s.index('\nfunction restartLittleHomeTitle()',start)
new_js='''/* Little Home adults make one discrete route step at a time. */
const LITTLE_HOME_ADULT_GAP_MIN=4000;
const LITTLE_HOME_ADULT_GAP_MAX=10000;
const LITTLE_HOME_ADULT_STEP_MIN=750;
const LITTLE_HOME_ADULT_STEP_MAX=1150;
const littleHomeRandom=(min,max)=>min+Math.random()*(max-min);
const littleHomeAdultRoutes={
  garden:[{x:0,y:0,r:0},{x:13,y:-7,r:0},{x:20,y:-4,r:3},{x:13,y:3,r:0},{x:-3,y:7,r:0},{x:-9,y:2,r:-3},{x:4,y:-3,r:0}],
  parcel:[{x:0,y:0,r:0},{x:14,y:-6,r:0},{x:30,y:-14,r:0},{x:43,y:-18,r:0},{x:29,y:-9,r:0},{x:7,y:4,r:0},{x:-8,y:1,r:0}],
  tree:[{x:0,y:0,r:0},{x:-8,y:-8,r:0},{x:4,y:-13,r:0},{x:14,y:-5,r:0},{x:11,y:6,r:0},{x:-3,y:8,r:0},{x:-10,y:2,r:0}]
};
const littleHomeAdults=[...document.querySelectorAll('#c2 .resident.adult')];
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const littleHomeRoot=document.querySelector('#c2');
const littleHomeStepTransform=step=>`translate(${step.x}px,${step.y}px) rotate(${step.r||0}deg)`;
let littleHomeAdultTimer=0;
let littleHomeAdultTurn=0;
const scheduleNextLittleHomeAdultMove=()=>{
  if(reducedMotion||!littleHomeAdults.length)return;
  const wait=littleHomeRandom(LITTLE_HOME_ADULT_GAP_MIN,LITTLE_HOME_ADULT_GAP_MAX);
  if(littleHomeRoot)littleHomeRoot.dataset.nextAdultMoveMs=String(Math.round(wait));
  clearTimeout(littleHomeAdultTimer);
  littleHomeAdultTimer=setTimeout(runLittleHomeAdultMove,wait);
};
const runLittleHomeAdultMove=async()=>{
  if(reducedMotion||!littleHomeAdults.length)return;
  const adult=littleHomeAdults[littleHomeAdultTurn%littleHomeAdults.length];
  littleHomeAdultTurn=(littleHomeAdultTurn+1)%littleHomeAdults.length;
  const route=littleHomeAdultRoutes[adult.dataset.activity]||littleHomeAdultRoutes.garden;
  const current=Number(adult.dataset.routeIndex||0)%route.length;
  const next=(current+1)%route.length;
  const duration=littleHomeRandom(LITTLE_HOME_ADULT_STEP_MIN,LITTLE_HOME_ADULT_STEP_MAX);
  adult.dataset.motionState='moving';
  adult.dataset.moveCount=String(Number(adult.dataset.moveCount||0)+1);
  adult.dataset.routeIndex=String(next);
  adult.dataset.stepDurationMs=String(Math.round(duration));
  if(littleHomeRoot)littleHomeRoot.dataset.activeAdult=adult.dataset.activity||'';
  const animation=adult.animate([
    {transform:littleHomeStepTransform(route[current])},
    {transform:littleHomeStepTransform(route[next])}
  ],{duration,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
  try{await animation.finished}catch{}
  adult.style.transform=littleHomeStepTransform(route[next]);
  animation.cancel();
  adult.dataset.motionState='idle';
  if(littleHomeRoot)littleHomeRoot.dataset.activeAdult='';
  scheduleNextLittleHomeAdultMove();
};
littleHomeAdults.forEach(adult=>{
  adult.dataset.motionState='idle';
  adult.dataset.moveCount='0';
  adult.dataset.routeIndex='0';
  adult.style.transform=littleHomeStepTransform((littleHomeAdultRoutes[adult.dataset.activity]||littleHomeAdultRoutes.garden)[0]);
});
scheduleNextLittleHomeAdultMove();
'''
s=s[:start]+new_js+s[end:]
p.write_text(s)

index=Path('index.html')
i=index.read_text()
old='src="title-island-concepts/?c=2&amp;embed=1&amp;v=20260911-calmprops4"'
new='src="title-island-concepts/?c=2&amp;embed=1&amp;v=20260911-discretesteps5"'
if old not in i:
    raise SystemExit('current home iframe cache-bust missing')
index.write_text(i.replace(old,new,1))
