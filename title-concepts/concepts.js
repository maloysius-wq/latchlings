'use strict';

(() => {
  const root = document.getElementById('conceptRoot');
  const params = new URLSearchParams(location.search);
  const concept = Math.max(1, Math.min(10, Number(params.get('c')) || 1));
  if (params.get('clean') === '1') document.documentElement.classList.add('clean-preview');

  const suits = {
    heart: '<svg class="suit" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 55C24 47 8 37 8 22c0-8 5-13 13-13 5 0 9 3 11 7 3-4 7-7 12-7 8 0 13 5 13 13 0 15-16 25-25 33Z"/></svg>',
    diamond: '<svg class="suit" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 6 55 32 32 58 9 32Z"/></svg>',
    club: '<svg class="suit" viewBox="0 0 64 64" aria-hidden="true"><path d="M33 28c-6 0-11-5-11-11S27 6 33 6s11 5 11 11c0 2-.5 4-1.5 5.5A11 11 0 1 1 38 42v8h8v8H20v-8h8v-8a11 11 0 1 1-4.5-19.5A11 11 0 0 1 33 28Z"/></svg>',
    spade: '<svg class="suit" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 6c4 8 22 18 22 33 0 8-5 13-12 13-4 0-7-2-10-5v5h8v6H24v-6h8v-5c-3 3-6 5-10 5-7 0-12-5-12-13C10 24 28 14 32 6Z"/></svg>',
    star: '<svg class="suit" viewBox="0 0 64 64" aria-hidden="true"><path d="m32 5 8 17 19 2-14 13 4 19-17-9-17 9 4-19L5 24l19-2Z"/></svg>'
  };

  const icon = {
    gear: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z"/><path d="M19.1 13.3c.1-.4.1-.9 0-1.3l2-1.5-2-3.5-2.5 1a8 8 0 0 0-1.2-.7L15 4.6h-4l-.4 2.7c-.4.2-.8.4-1.2.7L7 7 5 10.5 7 12a7 7 0 0 0 0 1.3l-2 1.5 2 3.5 2.4-1c.4.3.8.5 1.2.7l.4 2.7h4l.4-2.7c.4-.2.8-.4 1.2-.7l2.5 1 2-3.5-2-1.5Z"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.7 2.7 5.6 6.2.9-4.5 4.4 1.1 6.2-5.5-2.9-5.5 2.9 1.1-6.2-4.5-4.4 6.2-.9Z"/></svg>',
    arrow: '<svg class="button-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>',
    calendar: '<svg viewBox="0 0 48 48"><path d="M10 13h28v27H10zM15 7v10M33 7v10M10 20h28"/><path d="M18 28h5v5h-5z"/></svg>',
    map: '<svg viewBox="0 0 48 48"><path d="m7 12 11-5 12 5 11-5v29l-11 5-12-5-11 5Z"/><path d="M18 7v29M30 12v29"/><circle cx="25" cy="22" r="3"/></svg>'
  };

  function topMini(stars='148') {
    return `<div class="top-mini"><div class="star-pill">${icon.star}<span>${stars}</span></div><button class="round-tool" aria-label="Settings">${icon.gear}</button></div>`;
  }

  function logo(sub='A magnetic puzzle adventure') {
    return `<div class="title-logo">Latchlings<span class="logo-sub">${sub}</span><div class="logo-flourish"><i></i></div></div>`;
  }

  function latchling({color='coral',suit='heart',face='happy',pose='',cls='',size='',blink='5.1',idle='3.2',delay='-1.1'}={}) {
    const style = `${size ? `--size:${size};` : ''}--blink:${blink}s;--idle:${idle}s;--delay:${delay}s;`;
    return `<div class="latchling ${color} face-${face} ${pose} ${cls}" style="${style}" aria-hidden="true">${suits[suit]}<span class="wing left"></span><span class="wing right"></span><div class="face"><div class="eyes"><span class="eye left"><i class="pupil"></i></span><span class="eye right"><i class="pupil"></i></span></div><span class="blush left"></span><span class="blush right"></span><span class="mouth"></span></div><span class="foot left"></span><span class="foot right"></span></div>`;
  }

  function actions(playLabel='Play', dailySub='Practice board', levelSub='400 puzzle boards') {
    return `<div class="home-actions"><button class="primary-cta">${playLabel}${icon.arrow}</button><div class="quick-grid"><button class="quick-card"><strong>Daily Puzzle</strong><small>${dailySub}</small><span class="mini-icon">${icon.calendar}</span></button><button class="quick-card"><strong>Level Select</strong><small>${levelSub}</small><span class="mini-icon">${icon.map}</span></button></div></div>`;
  }

  const asset = name => `assets/kenney/${name}`;

  const concepts = {
    1: () => `<main class="concept-screen c1">${topMini()}${logo('Plan the route. Find every nest.')}<section class="hero-scene" aria-label="Animated Latchlings on a floating island"><img class="cc0-cloud a floating" src="${asset('cloud1.png')}" alt=""><img class="cc0-cloud b floating" src="${asset('cloud4.png')}" alt=""><div class="island-top"></div><img class="cc0-castle" src="${asset('castleSmallAlt.png')}" alt=""><img class="cc0-tree" src="${asset('tree.png')}" alt=""><img class="cc0-bush" src="${asset('bush3.png')}" alt="">${latchling({color:'coral',suit:'heart',face:'happy',pose:'pose-wave',cls:'l1',blink:'4.7',delay:'-.5'})}${latchling({color:'mint',suit:'club',face:'curious',pose:'pose-tilt',cls:'l2',blink:'6.1',delay:'-2.3'})}${latchling({color:'blue',suit:'spade',face:'smug',pose:'pose-bob',cls:'l3',blink:'5.4',delay:'-3.2'})}${latchling({color:'lav',suit:'star',face:'bashful',pose:'pose-peek',cls:'l4',blink:'7.2',delay:'-1.6'})}<i class="spark" style="left:22%;top:32%"></i><i class="spark" style="right:20%;top:23%;animation-delay:-1s"></i></section>${actions()}</main>`,

    2: () => `<main class="concept-screen c2">${topMini()}<section class="nursery-sign">${logo('The nests are waking up')}</section><section class="nursery-tree" aria-label="Latchlings peeking from nests in a giant tree"><div class="trunk"></div><i class="branch b1"></i><i class="branch b2"></i><i class="branch b3"></i><i class="leaf-ball lb1"></i><i class="leaf-ball lb2"></i><i class="leaf-ball lb3"></i><i class="leaf-ball lb4"></i><div class="nest n1">${latchling({color:'coral',suit:'heart',face:'curious',pose:'pose-peek',blink:'5.8',delay:'-1.2'})}</div><div class="nest n2">${latchling({color:'gold',suit:'diamond',face:'happy',pose:'pose-wave',blink:'4.3',delay:'-2.4'})}</div><div class="nest n3">${latchling({color:'lav',suit:'club',face:'sleepy',pose:'pose-peek',blink:'7.4',delay:'-3.4'})}</div><div class="nest n4">${latchling({color:'blue',suit:'spade',face:'bashful',pose:'pose-tilt',blink:'5.2',delay:'-.9'})}</div></section>${actions('Wake the Skyway','A fresh route every day','Choose your next nest')}</main>`,

    3: () => `<main class="concept-screen c3"><section class="journal">${topMini()}${logo('Field notes from the floating paths')}<div class="map-paper"><i class="tape"></i><i class="map-island mi1"></i><i class="map-island mi2"></i><i class="map-island mi3"></i>${latchling({color:'coral',suit:'heart',face:'happy',pose:'pose-hop',cls:'l1',blink:'4.6',delay:'-.7'})}${latchling({color:'blue',suit:'spade',face:'curious',pose:'pose-tilt',cls:'l2',blink:'5.7',delay:'-2.1'})}${latchling({color:'mint',suit:'club',face:'smug',pose:'pose-wave',cls:'l3',blink:'6.4',delay:'-3.1'})}<span class="stamp">Route<br>Ready</span></div>${actions('Continue the Journey','Today\'s field note','Browse all 400 routes')}<i class="paper-bit" style="right:25px;bottom:115px;transform:rotate(5deg)"></i></section></main>`,

    4: () => `<main class="concept-screen c4">${topMini()}${logo('A tiny world of clever stops')}<section class="toy-stage" aria-label="Toybox diorama with animated Latchlings"><div class="toy-platform"></div><div class="toy-house"></div><i class="block b1"></i><i class="block b2"></i><i class="block b3"></i>${latchling({color:'mint',suit:'club',face:'curious',pose:'pose-tilt',cls:'l1',blink:'5.9',delay:'-.8'})}${latchling({color:'gold',suit:'diamond',face:'happy',pose:'pose-hop',cls:'l2',blink:'4.4',delay:'-1.8'})}${latchling({color:'coral',suit:'heart',face:'bashful',pose:'pose-wave',cls:'l3',blink:'6.3',delay:'-2.8'})}${latchling({color:'blue',suit:'spade',face:'smug',pose:'pose-bob',cls:'l4',blink:'5.1',delay:'-3.7'})}</section>${actions('Set the Pieces in Motion','One tiny challenge','Open the puzzle shelf')}</main>`,

    5: () => `<main class="concept-screen c5">${topMini()}${logo('Every path circles back home')}<section class="carousel" aria-label="Cloud carousel of animated Latchlings"><div class="ring"></div><div class="center-nest">${latchling({color:'coral',suit:'heart',face:'happy',pose:'pose-bob',blink:'4.8',delay:'-.8'})}</div><div class="orbit-latch o1">${latchling({color:'mint',suit:'club',face:'curious',pose:'pose-tilt',blink:'6.2',delay:'-1.8'})}</div><div class="orbit-latch o2">${latchling({color:'gold',suit:'diamond',face:'bashful',pose:'pose-wave',blink:'5.3',delay:'-2.9'})}</div><div class="orbit-latch o3">${latchling({color:'blue',suit:'spade',face:'smug',pose:'pose-bob',blink:'7.1',delay:'-3.5'})}</div><div class="orbit-latch o4">${latchling({color:'lav',suit:'star',face:'sleepy',pose:'pose-peek',blink:'6.6',delay:'-4.2'})}</div><i class="cloud-dot cd1"></i><i class="cloud-dot cd2"></i></section>${actions('Take a Spin','Today\'s little orbit','Pick a route')}</main>`,

    6: () => `<main class="concept-screen c6"><div class="room-top">${topMini()}</div><section class="window" aria-label="Cozy cottage window with Latchlings on the sill">${logo('A little window into the skyway')}<i class="curtain left"></i><i class="curtain right"></i><img class="cc0-cloud a floating" src="${asset('cloud1.png')}" alt=""><img class="cc0-cloud b floating" src="${asset('cloud4.png')}" alt=""><div class="outside-island"></div><img class="cc0-castle" src="${asset('castleSmallAlt.png')}" alt=""><img class="cc0-tree" src="${asset('tree.png')}" alt=""><div class="window-sill"></div>${latchling({color:'coral',suit:'heart',face:'curious',pose:'pose-tilt',cls:'l1',blink:'5.7',delay:'-.9'})}${latchling({color:'mint',suit:'club',face:'happy',pose:'pose-wave',cls:'l2',blink:'4.5',delay:'-2.2'})}${latchling({color:'blue',suit:'spade',face:'sleepy',pose:'pose-bob',cls:'l3',blink:'7.4',delay:'-3.1'})}</section>${actions('Open the Window','A morning puzzle','Choose where to fly')}</main>`,

    7: () => `<main class="concept-screen c7">${topMini()}${logo('The garden path knows the way')}<section class="garden-scene" aria-label="Flower garden gate with animated Latchlings"><div class="gate"></div><div class="hedge left"></div><div class="hedge right"></div><div class="path"></div><i class="flower f1"></i><i class="flower f2"></i><i class="flower f3"></i><img class="cc0-bush b1" src="${asset('bush3.png')}" alt=""><img class="cc0-bush b2" src="${asset('bush3.png')}" alt="">${latchling({color:'coral',suit:'heart',face:'bashful',pose:'pose-peek',cls:'l1',blink:'6.2',delay:'-1.2'})}${latchling({color:'gold',suit:'diamond',face:'curious',pose:'pose-tilt',cls:'l2',blink:'5.1',delay:'-2.7'})}${latchling({color:'mint',suit:'club',face:'happy',pose:'pose-hop',cls:'l3',blink:'4.6',delay:'-3.4'})}${latchling({color:'lav',suit:'star',face:'smug',pose:'pose-wave',cls:'l4',blink:'7',delay:'-.5'})}</section>${actions('Step Through','A new bloom today','Walk the whole garden')}</main>`,

    8: () => `<main class="concept-screen c8">${topMini()}${logo('Quiet skies. Clever paths.')}<section class="night-scene" aria-label="Soft twilight constellation scene with glowing nests"><div class="moon"></div><i class="const-line cl1"></i><i class="const-line cl2"></i><i class="const-line cl3"></i><div class="lantern-nest nn1">${latchling({color:'lav',suit:'star',face:'sleepy',pose:'pose-peek',blink:'7.6',delay:'-1.5'})}</div><div class="lantern-nest nn2">${latchling({color:'blue',suit:'spade',face:'curious',pose:'pose-tilt',blink:'5.8',delay:'-3.1'})}</div><div class="lantern-nest nn3">${latchling({color:'gold',suit:'diamond',face:'happy',pose:'pose-wave',blink:'4.9',delay:'-2.3'})}</div><i class="spark" style="left:22%;top:44%"></i><i class="spark" style="right:19%;top:31%;animation-delay:-1.8s"></i><i class="spark" style="left:56%;top:22%;animation-delay:-.9s"></i></section>${actions('Follow the Lights','Tonight\'s route','Trace every constellation')}</main>`,

    9: () => `<main class="concept-screen c9"><section class="cloth-page">${topMini()}${logo('A soft little puzzle story')}<section class="felt-scene" aria-label="Patchwork felt island with animated Latchlings"><i class="felt-cloud fc1"></i><i class="felt-cloud fc2"></i><div class="felt-island"></div><div class="felt-house"></div>${latchling({color:'coral',suit:'heart',face:'happy',pose:'pose-wave',cls:'l1',blink:'5',delay:'-.6'})}${latchling({color:'mint',suit:'club',face:'curious',pose:'pose-tilt',cls:'l2',blink:'6.5',delay:'-2.3'})}${latchling({color:'blue',suit:'spade',face:'bashful',pose:'pose-bob',cls:'l3',blink:'5.6',delay:'-3.7'})}${latchling({color:'gold',suit:'diamond',face:'sleepy',pose:'pose-peek',cls:'l4',blink:'7.3',delay:'-1.7'})}</section>${actions('Turn the Page','A tiny stitched puzzle','Pick a chapter')}</section></main>`,

    10: () => `<main class="concept-screen c10">${topMini()}${logo('Wind it up. Watch them fly.')}<section class="music-scene" aria-label="Tiny music-box stage with animated Latchlings"><div class="box-shell"><i class="gear g1"></i><i class="gear g2"></i></div><div class="music-stage"></div><div class="slot s1">${latchling({color:'lav',suit:'star',face:'bashful',pose:'pose-peek',blink:'6.8',delay:'-1.1'})}</div><div class="slot s2">${latchling({color:'blue',suit:'spade',face:'smug',pose:'pose-peek',blink:'5.4',delay:'-2.7'})}</div>${latchling({color:'gold',suit:'diamond',face:'happy',pose:'pose-hop',cls:'l1',blink:'4.6',delay:'-3.4'})}${latchling({color:'coral',suit:'heart',face:'curious',pose:'pose-wave',cls:'l4',blink:'5.9',delay:'-.7'})}<i class="spark s1"></i><i class="spark s2"></i></section>${actions('Start the Music Box','A fresh little tune','Choose a mechanism')}</main>`
  };

  root.innerHTML = concepts[concept]();
  document.title = `Latchlings Title Concept ${String(concept).padStart(2,'0')}`;
  document.getElementById('conceptCounter').textContent = `${concept} / 10`;
  document.getElementById('prevConcept').addEventListener('click', () => go(concept === 1 ? 10 : concept - 1));
  document.getElementById('nextConcept').addEventListener('click', () => go(concept === 10 ? 1 : concept + 1));
  document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') go(concept === 1 ? 10 : concept - 1);
    if (event.key === 'ArrowRight') go(concept === 10 ? 1 : concept + 1);
  });

  root.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button.closest('.preview-dock')) return;
    button.animate([
      {transform:'translateY(0) scale(1)'},
      {transform:'translateY(2px) scale(.985)'},
      {transform:'translateY(0) scale(1)'}
    ], {duration:180,easing:'ease-out'});
  });

  function go(next) {
    const q = new URLSearchParams(location.search);
    q.set('c', String(next));
    location.search = q.toString();
  }
})();
