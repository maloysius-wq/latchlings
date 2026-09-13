'use strict';
/*
 * Chapter 6 Pass 3 production layer: Copperline Junction / Old Ways.
 * Loaded after the stable shared game runtime. It extends the mutable chapter
 * visual-mode map, upgrades only the Level 300 presentation, and applies a
 * same-origin focus treatment to the canonical stage-6 Waykeeper compass.
 */
(function(){
  if(typeof VISUAL_CHAPTER_MODES!=='object'||!VISUAL_CHAPTER_MODES) return;
  VISUAL_CHAPTER_MODES[6]='copperline';

  const COMPASS_STYLE_ID='chapter6-copperline-compass-focus-style';
  function ensureCompassFocusStyle(doc){
    if(!doc||doc.getElementById(COMPASS_STYLE_ID)) return;
    const style=doc.createElement('style');
    style.id=COMPASS_STYLE_ID;
    style.textContent=`
      #c2 .phone.story-focus-compass .story-relic{
        display:block;z-index:25;
        filter:drop-shadow(0 0 7px rgba(237,171,92,.92)) drop-shadow(0 0 13px rgba(98,137,168,.44));
        box-shadow:0 0 0 5px rgba(224,145,77,.22),0 0 18px rgba(229,153,78,.64),0 3px 5px rgba(63,46,28,.18);
        animation:compassRewardFocus 1700ms cubic-bezier(.2,.8,.2,1) both
      }
      @keyframes compassRewardFocus{
        0%{opacity:.28;transform:translateY(-5px) rotate(-8deg) scale(.72)}
        30%{opacity:1;transform:translateY(1px) rotate(7deg) scale(1.55)}
        58%{transform:translateY(-1px) rotate(-2deg) scale(1.18)}
        100%{opacity:1;transform:rotate(0deg) scale(1.28)}
      }
      @media(prefers-reduced-motion:reduce){
        #c2 .phone.story-focus-compass .story-relic{
          animation:none!important;
          transform:scale(1.28)!important;
          filter:drop-shadow(0 0 7px rgba(237,171,92,.92)) drop-shadow(0 0 13px rgba(98,137,168,.44))
        }
      }`;
    doc.head.appendChild(style);
  }

  function applyCompassFocus(attempt=0){
    const frame=document.getElementById('homeTitleFrame');
    let doc=null;
    try{doc=frame&&frame.contentDocument}catch(_){}
    const phone=doc&&doc.querySelector('#c2 .phone');
    const compass=doc&&doc.querySelector('#c2 .story-relic');
    if(!phone||!compass){
      if(attempt<10)setTimeout(()=>applyCompassFocus(attempt+1),80);
      return;
    }
    ensureCompassFocusStyle(doc);
    phone.classList.remove('story-focus-compass');
    void phone.offsetWidth;
    phone.classList.add('story-focus-compass');
    setTimeout(()=>phone.classList.remove('story-focus-compass'),2200);
  }

  function focusChapterSixCompass(){
    homeRewardFocus='relic';
    screen('home');
    setTimeout(()=>applyCompassFocus(),40);
  }

  function showChapterSixReward(stars,starRow,moveWord,lev){
    modal(`<section class="chapter-reward-card chapter-six-reward" aria-label="Copperline reconnected with a new route"><div class="chapter-reward-kicker">A new line approved</div><h2>Little Home has a Waykeeper compass</h2><div class="chapter-reward-postcard copperline-reward-postcard" role="img" aria-label="Three approved route maps from different years sit beside a newly drawn Copperline line, a station signal, and an old Waykeeper compass"><i class="copper-reward-kiosk"></i><i class="copper-reward-map m1"></i><i class="copper-reward-map m2"></i><i class="copper-reward-map m3"></i><i class="copper-reward-track"></i><i class="copper-reward-newline"></i><i class="copper-reward-signal"></i><i class="copper-reward-compass"></i></div><p class="chapter-reward-result">Copperline is connected again. The old maps were not competing instructions; each was a record of what worked in its own moment. Today gets a new line of its own.</p><div class="win-stars chapter-reward-stars" aria-label="${stars} stars earned">${starRow}</div><div class="chapter-reward-score">${moveWord(movesUsed)} · Perfect route: ${moveWord(lev.optimal)}</div><div class="modal-actions"><button class="primary-small" id="chapterSixRewardHome">Visit Little Home</button><button class="secondary-small" id="chapterSixRewardContinue">Continue to Stormswitch</button></div></section>`);
    document.getElementById('chapterSixRewardHome').onclick=()=>{closeModal();cancelAtlasReward();focusChapterSixCompass()};
    document.getElementById('chapterSixRewardContinue').onclick=()=>{closeModal();if(atlasRewardState&&atlasRewardState.from===300)playQueuedAtlasReward(true);else startLevel(301)};
  }

  const baseWinLevel=winLevel;
  winLevel=function(){
    const chapterSixClear=playMode==='campaign'&&currentLevel===300;
    if(!chapterSixClear)return baseWinLevel();
    const lev=LEVELS[currentLevel-1];
    const stars=starsFor(lev);
    const starRow=[1,2,3].map((n,i)=>starSvg(n<=stars,`s${i+1}`)).join('');
    const moveWord=n=>`${n} move${n===1?'':'s'}`;
    baseWinLevel();
    showChapterSixReward(stars,starRow,moveWord,lev);
  };

  window.LatchlingsChapterSixPass3={
    version:'20260913-ch6pass3-modular-1',
    focusCompass:focusChapterSixCompass,
    showReward:showChapterSixReward
  };
})();
