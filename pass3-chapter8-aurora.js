'use strict';
/*
 * Chapter 8 Pass 3 production layer: Aurora Crown / Homeward.
 * Loaded after accepted Chapters 1-7 runtime. Extends only Chapter 8 visual mode,
 * upgrades the Level 400 presentation, and focuses the canonical stage-8 distant islands.
 */
(function(){
  if(typeof VISUAL_CHAPTER_MODES!=='object'||!VISUAL_CHAPTER_MODES) return;
  VISUAL_CHAPTER_MODES[8]='aurora';

  const HOME_STYLE_ID='chapter8-aurora-home-focus-style';
  function ensureHomeFocusStyle(doc){
    if(!doc||doc.getElementById(HOME_STYLE_ID)) return;
    const style=doc.createElement('style');
    style.id=HOME_STYLE_ID;
    style.textContent=`
      #c2 .phone.story-focus-living-skyway .story-distant-islands{display:block!important;z-index:2;filter:drop-shadow(0 0 8px rgba(118,222,236,.42))}
      #c2 .phone.story-focus-living-skyway .story-distant-islands:before,
      #c2 .phone.story-focus-living-skyway .story-distant-islands:after{
        content:"";position:absolute;left:57px;top:101px;width:250px;height:2px;border-radius:999px;transform-origin:50% 50%;pointer-events:none;
        background:linear-gradient(90deg,rgba(122,231,216,0),rgba(122,231,216,.82) 24%,rgba(230,249,255,.96) 51%,rgba(145,172,246,.82) 76%,rgba(145,172,246,0));
        box-shadow:0 0 9px rgba(145,225,238,.62)
      }
      #c2 .phone.story-focus-living-skyway .story-distant-islands:before{transform:rotate(13deg);animation:livingRouteGlow 1900ms ease-in-out both}
      #c2 .phone.story-focus-living-skyway .story-distant-islands:after{top:126px;transform:rotate(-16deg);animation:livingRouteGlow 1900ms ease-in-out 120ms both}
      #c2 .phone.story-focus-living-skyway .story-distant-islands i{opacity:.96;filter:drop-shadow(0 0 7px rgba(220,252,255,.62));animation:livingIslandWake 1600ms cubic-bezier(.2,.8,.2,1) both}
      #c2 .phone.story-focus-living-skyway .story-distant-islands .d2{animation-delay:100ms}
      #c2 .phone.story-focus-living-skyway .story-distant-islands .d3{animation-delay:190ms}
      @keyframes livingRouteGlow{0%{opacity:.12;scale:.72 1}38%{opacity:1;scale:1.03 1}100%{opacity:.86;scale:1 1}}
      @keyframes livingIslandWake{0%{opacity:.2;translate:0 7px}45%{opacity:1;translate:0 -2px}100%{opacity:.96;translate:0 0}}
      @media(prefers-reduced-motion:reduce){
        #c2 .phone.story-focus-living-skyway .story-distant-islands:before,
        #c2 .phone.story-focus-living-skyway .story-distant-islands:after,
        #c2 .phone.story-focus-living-skyway .story-distant-islands i{animation:none!important;opacity:.96!important;scale:1 1!important;translate:0 0!important}
      }`;
    doc.head.appendChild(style);
  }

  function applyLivingSkywayFocus(attempt=0){
    const frame=document.getElementById('homeTitleFrame');
    let doc=null;
    try{doc=frame&&frame.contentDocument}catch(_){}
    const phone=doc&&doc.querySelector('#c2 .phone');
    const distant=doc&&doc.querySelector('#c2 .story-distant-islands');
    if(!phone||!distant){
      if(attempt<12)setTimeout(()=>applyLivingSkywayFocus(attempt+1),80);
      return;
    }
    ensureHomeFocusStyle(doc);
    phone.classList.remove('story-focus-living-skyway');
    void phone.offsetWidth;
    phone.classList.add('story-focus-living-skyway');
    setTimeout(()=>phone.classList.remove('story-focus-living-skyway'),2800);
  }

  function focusLivingSkyway(){
    homeRewardFocus='living-skyway';
    screen('home');
    setTimeout(()=>applyLivingSkywayFocus(),40);
  }

  function finishCampaignFromAurora(){
    closeModal();
    if(window.LatchlingsSFX)window.LatchlingsSFX.campaignComplete();
    screen('complete');
  }

  function showChapterEightReward(stars,starRow,moveWord,lev){
    modal(`<section class="chapter-reward-card chapter-eight-reward" aria-label="Aurora Crown joins the living Skyway"><div class="chapter-reward-kicker">Tomorrow's route is already moving</div><h2>Skyway Restored</h2><div class="chapter-reward-postcard aurora-reward-postcard" role="img" aria-label="Old and new route lights meet at Aurora Crown, continue outward to several communities, and leave no single route or master switch at the center"><i class="aurora-reward-crown"></i><i class="aurora-reward-beacon"></i><i class="aurora-reward-route r1"></i><i class="aurora-reward-route r2"></i><i class="aurora-reward-route r3"></i><i class="aurora-reward-route r4"></i><i class="aurora-reward-island i1"></i><i class="aurora-reward-island i2"></i><i class="aurora-reward-island i3"></i><i class="aurora-reward-island i4"></i></div><p class="chapter-reward-result">Old and new routes meet at Aurora Crown and keep going. The living Skyway is ready for tomorrow’s drift.</p><div class="win-stars chapter-reward-stars" aria-label="${stars} stars earned">${starRow}</div><div class="chapter-reward-score">${moveWord(movesUsed)} · Perfect route: ${moveWord(lev.optimal)}</div><div class="modal-actions"><button class="primary-small" id="chapterEightRewardHome">Visit Little Home</button><button class="secondary-small" id="chapterEightRewardFinish">Finish the journey</button></div></section>`);
    document.getElementById('chapterEightRewardHome').onclick=()=>{closeModal();cancelAtlasReward();focusLivingSkyway()};
    document.getElementById('chapterEightRewardFinish').onclick=finishCampaignFromAurora;
  }

  const baseWinLevel=winLevel;
  winLevel=function(){
    const chapterEightClear=playMode==='campaign'&&currentLevel===400;
    if(!chapterEightClear)return baseWinLevel();
    const lev=LEVELS[currentLevel-1];
    const stars=starsFor(lev);
    const starRow=[1,2,3].map((n,i)=>starSvg(n<=stars,`s${i+1}`)).join('');
    const moveWord=n=>`${n} move${n===1?'':'s'}`;
    baseWinLevel();
    showChapterEightReward(stars,starRow,moveWord,lev);
  };

  window.LatchlingsChapterEightPass3={
    version:'20260913-ch8pass3-modular-1',
    focusLivingSkyway,
    showReward:showChapterEightReward,
    finishCampaign:finishCampaignFromAurora
  };
})();