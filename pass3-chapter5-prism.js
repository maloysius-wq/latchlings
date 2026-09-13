'use strict';
/*
 * Chapter 5 Pass 3 production layer: Prism Gardens / The Long Drift.
 * Loaded after the stable shared game runtime. It extends the mutable chapter
 * visual-mode map, upgrades only the Level 250 presentation, and applies a
 * same-origin focus treatment to the canonical stage-5 Little Home telescope.
 */
(function(){
  if(typeof VISUAL_CHAPTER_MODES!=='object'||!VISUAL_CHAPTER_MODES) return;
  VISUAL_CHAPTER_MODES[5]='prism';

  const TELESCOPE_STYLE_ID='chapter5-prism-telescope-focus-style';
  function ensureTelescopeFocusStyle(doc){
    if(!doc||doc.getElementById(TELESCOPE_STYLE_ID)) return;
    const style=doc.createElement('style');
    style.id=TELESCOPE_STYLE_ID;
    style.textContent=`
      #c2 .phone.story-focus-telescope .story-telescope{
        display:block;z-index:25;
        filter:drop-shadow(0 0 7px rgba(98,202,210,.90)) drop-shadow(0 0 13px rgba(244,195,105,.48));
        box-shadow:0 0 0 5px rgba(103,218,221,.23),0 0 17px rgba(92,198,207,.62),0 3px 4px rgba(46,56,60,.15);
        animation:telescopeRewardFocus 1800ms cubic-bezier(.2,.8,.2,1) both
      }
      @keyframes telescopeRewardFocus{
        0%{opacity:.25;transform:rotate(-16deg) translateY(-6px) scale(.78)}
        28%{opacity:1;transform:rotate(-16deg) translateY(1px) scale(1.18)}
        55%{transform:rotate(-16deg) translateY(-1px) scale(1.01)}
        100%{opacity:1;transform:rotate(-16deg) scale(1)}
      }
      @media(prefers-reduced-motion:reduce){
        #c2 .phone.story-focus-telescope .story-telescope{
          animation:none!important;
          filter:drop-shadow(0 0 7px rgba(98,202,210,.90)) drop-shadow(0 0 13px rgba(244,195,105,.48))
        }
      }`;
    doc.head.appendChild(style);
  }

  function applyTelescopeFocus(attempt=0){
    const frame=document.getElementById('homeTitleFrame');
    let doc=null;
    try{doc=frame&&frame.contentDocument}catch(_){}
    const phone=doc&&doc.querySelector('#c2 .phone');
    const telescope=doc&&doc.querySelector('#c2 .story-telescope');
    if(!phone||!telescope){
      if(attempt<10)setTimeout(()=>applyTelescopeFocus(attempt+1),80);
      return;
    }
    ensureTelescopeFocusStyle(doc);
    phone.classList.remove('story-focus-telescope');
    void phone.offsetWidth;
    phone.classList.add('story-focus-telescope');
    setTimeout(()=>phone.classList.remove('story-focus-telescope'),2200);
  }

  function focusChapterFiveTelescope(){
    homeRewardFocus='telescope';
    screen('home');
    setTimeout(()=>applyTelescopeFocus(),40);
  }

  function showChapterFiveReward(stars,starRow,moveWord,lev){
    modal(`<section class="chapter-reward-card chapter-five-reward" aria-label="Prism Gardens reconnected on new coordinates"><div class="chapter-reward-kicker">New coordinates connected</div><h2>Little Home has a telescope</h2><div class="chapter-reward-postcard prism-reward-postcard" role="img" aria-label="A Prism Gardens glasshouse lookout and telescope trace a newly adjusted Skyway route toward two familiar amber porch lights"><i class="prism-reward-glasshouse"></i><i class="prism-reward-planter"></i><i class="prism-reward-petal p1"></i><i class="prism-reward-petal p2"></i><i class="prism-reward-petal p3"></i><i class="prism-reward-route"></i><i class="prism-reward-scope"></i><i class="prism-reward-lights"></i></div><p class="chapter-reward-result">Prism is connected again, not by forcing yesterday's map to fit, but by drawing the route around where the islands are now.</p><div class="win-stars chapter-reward-stars" aria-label="${stars} stars earned">${starRow}</div><div class="chapter-reward-score">${moveWord(movesUsed)} · Perfect route: ${moveWord(lev.optimal)}</div><div class="modal-actions"><button class="primary-small" id="chapterFiveRewardHome">Visit Little Home</button><button class="secondary-small" id="chapterFiveRewardContinue">Continue to Copperline</button></div></section>`);
    document.getElementById('chapterFiveRewardHome').onclick=()=>{closeModal();cancelAtlasReward();focusChapterFiveTelescope()};
    document.getElementById('chapterFiveRewardContinue').onclick=()=>{closeModal();if(atlasRewardState&&atlasRewardState.from===250)playQueuedAtlasReward(true);else startLevel(251)};
  }

  const baseWinLevel=winLevel;
  winLevel=function(){
    const chapterFiveClear=playMode==='campaign'&&currentLevel===250;
    if(!chapterFiveClear)return baseWinLevel();
    const lev=LEVELS[currentLevel-1];
    const stars=starsFor(lev);
    const starRow=[1,2,3].map((n,i)=>starSvg(n<=stars,`s${i+1}`)).join('');
    const moveWord=n=>`${n} move${n===1?'':'s'}`;
    baseWinLevel();
    showChapterFiveReward(stars,starRow,moveWord,lev);
  };

  window.LatchlingsChapterFivePass3={
    version:'20260912-ch5pass3-modular-1',
    focusTelescope:focusChapterFiveTelescope,
    showReward:showChapterFiveReward
  };
})();
