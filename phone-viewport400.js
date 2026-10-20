'use strict';
(function () {
  if (document.documentElement.dataset.phoneViewport === 'host') {
    const game = new URL('index.html', location.href);
    game.search = location.search;
    game.hash = location.hash;
    document.getElementById('phoneGameFrame').src = game.href;
    return;
  }

  // A real child browsing context keeps vw/vh, media queries, fixed dialogs,
  // and cinematic measurements phone-sized. Same origin preserves all saves.
  if (window.self !== window.top) return;
  const desktop = matchMedia('(min-width: 600px) and (min-height: 600px)');
  function fitPhone() {
    if (!desktop.matches) return;
    const preview = new URL('phone-preview.html', location.href);
    preview.search = location.search;
    preview.hash = location.hash;
    location.replace(preview.href);
  }
  fitPhone();
  desktop.addEventListener('change', fitPhone);
})();
