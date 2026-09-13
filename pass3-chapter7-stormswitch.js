'use strict';
/*
 * Chapter 7 Pass 3 production layer: Stormswitch Foundry / Coming Together.
 * Loaded after accepted Chapter 1-6 runtime. Extends only Chapter 7 visual mode,
 * upgrades the Level 350 presentation, and focuses the canonical stage-7 dock.
 */
(function(){
  if(typeof VISUAL_CHAPTER_MODES!=='object'||!VISUAL_CHAPTER_MODES) return;
  VISUAL_CHAPTER_MODES[7]='stormswitch';

  const DOCK_STYLE_ID='chapter7-stormswitch-dock-focus-style';
  function ensureDockFocusStyle(doc){
    if(!doc||doc.getElementById(DOCK_STYLE_ID)) return;
    const style=doc.createElement('style');
    style.id=DOCK_STYLE_ID;
    style.textContent=`
      #c2 .phone.story-focus-dock .story-dock{
        display:block;z-index:25;
        filter:drop-shadow(0 0 7px rgba(111,216,245,.88)) drop-shadow(0 0 13px rgba(95,195,220,.42));
        box-shadow:0 0 0 5px rgba(108,212,238,.17),0 0 19px rgba(101,205,233,.56),0 5px 6px rgba(54,43,32,.18);
        animation:dockRewardFocus 1700ms cubic-bezier(.2,.8,.2,1) both
      }
      #c2 .phone.story-focus-dock .story-dock:before{
        content:"";position:absolute;left:16px;top:-45px;width:20px;height:47px;border-radius:50% 50% 4px 4px;
        background:linear-gradient(180deg,rgba(209,251,255,.16),rgba(118,222,244,.78) 62%,rgba(112,214,237,.14));
        box-shadow:0 0 13px rgba(105,218,242,.56);pointer-events:none
      }
      @keyframes dockRewardFocus{
        0%{opacity:.28;transform:translateY(6px) rotate(-4deg) scale(.76)}
        30%{opacity:1;transform:translateY(-1px) rotate(2deg) scale(1.30)}
        58%{transform:translateY(0) rotate(-1deg) scale(1.10)}
        100%{opacity:1;transform:rotate(-4deg) scale(1.15)}
      }
      @media(prefers-reduced-motion:reduce){
        #c2 .phone.story-focus-dock .story-dock{animation:none!important;transform:rotate(-4deg) scale(1.15)!important}
      }`;
    doc.head.appendChild(style);
  }

  function applyDockFocus(attempt=0){
    const frame=document.getElementById('homeTitleFrame');
    let doc=null;
    try{doc=frame&&frame.contentDocument}catch(_){}
    const phone=doc&&doc.querySelector('#c2 .phone');
    const dock=doc&&doc.querySelector('#c2 .story-dock');
    if(!phone||!dock){
      if(attempt<10)setTimeout(()=>applyDockFocus(attempt+1),80);
      return;
    }
    ensureDockFocusStyle(doc);
    phone.classList.remove('story-focus-dock');
    void phone.offsetWidth;
    phone.classList.add('story-focus-dock');
    setTimeout(()=>phone.classList.remove('story-focus-dock'),2200);
  }

  function focusChapterSevenDock(){
    homeRewardFocus='dock';
    screen('home');
    setTimeout(()=>applyDockFocus(),40);
  }

  function showChapterSevenReward(stars,starRow,moveWord,lev){
    modal(`<section class="chapter-reward-card chapter-seven-reward" aria-label="Stormswitch living network online"><div class="chapter-reward-kicker">Signals in sync</div><h2>Little Home has an arrival platform</h2><div class="chapter-reward-postcard stormswitch-reward-postcard" role="img" aria-label="Regional relay lamps share one synchronized travel window and send a restored route toward Little Home's new arrival platform"><i class="storm-reward-relay"></i><i class="storm-reward-dial"></i><i class="storm-reward-lamp l1"></i><i class="storm-reward-lamp l2"></i><i class="storm-reward-lamp l3"></i><i class="storm-reward-lamp l4"></i><i class="storm-reward-network"></i><i class="storm-reward-dock"></i><i class="storm-reward-beam"></i></div><p class="chapter-reward-result">Stormswitch is no longer one control room trying to run everything. Communities are watching their own routes, sharing signals, correcting timing together, and keeping the living map ahead of yesterday's drift.</p><div class="win-stars chapter-reward-stars" aria-label="${stars} stars earned">${starRow}</div><div class="chapter-reward-score">${moveWord(movesUsed)} · Perfect route: ${moveWord(lev.optimal)}</div><div class="modal-actions"><button class="primary-small" id="chapterSevenRewardHome">Visit Little Home</button><button class="secondary-small" id="chapterSevenRewardContinue">Begin Homeward</button></div></section>`);
    document.getElementById('chapterSevenRewardHome').onclick=()=>{closeModal();cancelAtlasReward();focusChapterSevenDock()};
    document.getElementById('chapterSevenRewardContinue').onclick=()=>{closeModal();if(atlasRewardState&&atlasRewardState.from===350)playQueuedAtlasReward(true);else startLevel(351)};
  }

  const baseWinLevel=winLevel;
  winLevel=function(){
    const chapterSevenClear=playMode==='campaign'&&currentLevel===350;
    if(!chapterSevenClear)return baseWinLevel();
    const lev=LEVELS[currentLevel-1];
    const stars=starsFor(lev);
    const starRow=[1,2,3].map((n,i)=>starSvg(n<=stars,`s${i+1}`)).join('');
    const moveWord=n=>`${n} move${n===1?'':'s'}`;
    baseWinLevel();
    showChapterSevenReward(stars,starRow,moveWord,lev);
  };

  window.LatchlingsChapterSevenPass3={
    version:'20260913-ch7pass3-modular-1',
    focusDock:focusChapterSevenDock,
    showReward:showChapterSevenReward
  };
})();
