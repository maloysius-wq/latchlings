from pathlib import Path

p=Path('title-island-concepts/index.html')
t=p.read_text()

repls={
"#c2 .life-garden{animation:littleHomeGarden 9.2s ease-in-out infinite}":"#c2 .life-garden.adult-outing{animation:littleHomeGarden var(--adult-move-duration,5.2s) ease-in-out 1 both}",
"#c2 .life-parcel{animation:littleHomeParcel 10.4s ease-in-out infinite}":"#c2 .life-parcel.adult-outing{animation:littleHomeParcel var(--adult-move-duration,5.4s) ease-in-out 1 both}",
"#c2 .life-tree{animation:littleHomeTree 11.1s ease-in-out infinite}":"#c2 .life-tree.adult-outing{animation:littleHomeTree var(--adult-move-duration,5.6s) ease-in-out 1 both}",
}
for old,new in repls.items():
    if old not in t and new not in t:
        raise SystemExit(f'Missing expected adult animation rule: {old}')
    t=t.replace(old,new,1)

scheduler=r'''
/* Little Home adults use one-shot outings with randomized rest periods. */
const LITTLE_HOME_ADULT_IDLE_MIN=4200;
const LITTLE_HOME_ADULT_IDLE_MAX=8800;
const LITTLE_HOME_ADULT_LONG_IDLE_MIN=9000;
const LITTLE_HOME_ADULT_LONG_IDLE_MAX=13000;
const LITTLE_HOME_ADULT_MOVE_MIN=4400;
const LITTLE_HOME_ADULT_MOVE_MAX=6000;
const littleHomeRandom=(min,max)=>min+Math.random()*(max-min);
const littleHomeAdults=[...document.querySelectorAll('#c2 .resident.adult')];
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
littleHomeAdults.forEach((adult,index)=>{
  adult.dataset.motionState='idle';
  adult.dataset.moveCount='0';
  if(reducedMotion)return;
  let timer=0;
  const scheduleIdle=(initial=false)=>{
    adult.classList.remove('adult-outing');
    adult.dataset.motionState='idle';
    const longRest=!initial&&Math.random()<.20;
    const wait=initial
      ? 900+index*750+littleHomeRandom(0,1700)
      : longRest
        ? littleHomeRandom(LITTLE_HOME_ADULT_LONG_IDLE_MIN,LITTLE_HOME_ADULT_LONG_IDLE_MAX)
        : littleHomeRandom(LITTLE_HOME_ADULT_IDLE_MIN,LITTLE_HOME_ADULT_IDLE_MAX);
    adult.dataset.nextMoveMs=String(Math.round(wait));
    clearTimeout(timer);
    timer=setTimeout(startMove,wait);
  };
  const startMove=()=>{
    const duration=littleHomeRandom(LITTLE_HOME_ADULT_MOVE_MIN,LITTLE_HOME_ADULT_MOVE_MAX);
    adult.style.setProperty('--adult-move-duration',`${Math.round(duration)}ms`);
    adult.dataset.motionState='moving';
    adult.dataset.moveCount=String(Number(adult.dataset.moveCount||0)+1);
    adult.classList.add('adult-outing');
  };
  adult.addEventListener('animationend',event=>{
    if(!adult.classList.contains('adult-outing'))return;
    if(!event.animationName.startsWith('littleHome'))return;
    scheduleIdle(false);
  });
  scheduleIdle(true);
});
'''
marker="const buttons=[...document.querySelectorAll('.switcher button')]"
if 'LITTLE_HOME_ADULT_IDLE_MIN' not in t:
    if marker not in t:
        raise SystemExit('Could not locate script insertion marker')
    t=t.replace(marker,scheduler+'\n'+marker,1)

p.write_text(t)
