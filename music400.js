'use strict';

(() => {
  const MUSIC_KEY = 'latchlings_music_enabled_v1';
  const TARGET_VOLUME = 0.24;
  const FADE_MS = 360;
  const TRACKS = {
    title: 'assets/music/title-happy-ukulele.mp3',
    1: 'assets/music/chapter-1-peaceful-days.mp3',
    2: 'assets/music/chapter-2-place-i-call-home.mp3',
    3: 'assets/music/chapter-3-pluto-music-box.mp3',
    4: 'assets/music/chapter-4-mystical-piano.mp3',
    5: 'assets/music/chapter-5-gem-popper.mp3',
    6: 'assets/music/chapter-6-cozy-puzzle.mp3',
    7: 'assets/music/chapter-7-electric-soft.mp3',
    8: 'assets/music/chapter-8-vaporware.mp3'
  };

  const audio = new Audio();
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0;

  let unlocked = false;
  let enabled = loadEnabled();
  let currentKey = null;
  let requestedKey = 'title';
  let transitionToken = 0;
  let fadeFrame = 0;

  function loadEnabled() {
    try {
      const saved = localStorage.getItem(MUSIC_KEY);
      return saved === null ? true : saved === 'true';
    } catch (_) {
      return true;
    }
  }

  function saveEnabled() {
    try { localStorage.setItem(MUSIC_KEY, String(enabled)); } catch (_) {}
  }

  function activeScreenId() {
    const active = document.querySelector('.screen.active');
    return active ? active.id : 'home';
  }

  function displayedLevel() {
    const label = document.getElementById('levelTitle');
    const match = label && label.textContent.match(/(\d+)/);
    return match ? Math.max(1, Math.min(400, Number(match[1]))) : 1;
  }

  function desiredTrackKey() {
    if (activeScreenId() !== 'game') return 'title';
    return String(Math.max(1, Math.min(8, Math.ceil(displayedLevel() / 50))));
  }

  function cancelFade() {
    if (fadeFrame) cancelAnimationFrame(fadeFrame);
    fadeFrame = 0;
  }

  function clampVolume(value) {
    return Math.max(0, Math.min(1, value));
  }

  function fadeTo(target, duration = FADE_MS, token = transitionToken) {
    cancelFade();
    const start = performance.now();
    const from = audio.volume;
    const clamped = clampVolume(target);
    return new Promise(resolve => {
      function step(now) {
        if (token !== transitionToken) { resolve(false); return; }
        const t = Math.max(0, Math.min(1, (now - start) / Math.max(1, duration)));
        audio.volume = clampVolume(from + (clamped - from) * t);
        if (t < 1) fadeFrame = requestAnimationFrame(step);
        else { fadeFrame = 0; resolve(true); }
      }
      fadeFrame = requestAnimationFrame(step);
    });
  }

  async function beginCurrentTrack(token) {
    if (token !== transitionToken || !enabled || !unlocked) return;
    try {
      await audio.play();
      if (token !== transitionToken) return;
      await fadeTo(TARGET_VOLUME, FADE_MS, token);
    } catch (_) {
      // Browsers may still block playback until a later user gesture.
      // The next pointer/key interaction retries through unlockAudio().
    }
  }

  async function switchTrack(key, immediate = false) {
    requestedKey = key;
    if (!TRACKS[key] || !enabled || !unlocked) return;
    if (currentKey === key && audio.src) {
      if (audio.paused) beginCurrentTrack(transitionToken);
      return;
    }

    const token = ++transitionToken;
    if (!immediate && currentKey && !audio.paused) await fadeTo(0, FADE_MS, token);
    if (token !== transitionToken) return;

    audio.pause();
    audio.src = TRACKS[key];
    audio.currentTime = 0;
    audio.volume = immediate ? TARGET_VOLUME : 0;
    currentKey = key;
    await beginCurrentTrack(token);
  }

  function syncMusic(immediate = false) {
    const key = desiredTrackKey();
    requestedKey = key;
    if (!enabled || !unlocked) return;
    switchTrack(key, immediate);
  }

  function unlockAudio() {
    if (unlocked) {
      if (enabled && audio.paused) syncMusic();
      return;
    }
    unlocked = true;

    // Prime this single media element inside the actual gesture. The screen
    // may change during the ensuing click, so sync again on the next task.
    audio.src = TRACKS.title;
    audio.loop = true;
    audio.volume = 0;
    const priming = audio.play();
    if (priming && typeof priming.then === 'function') {
      priming.then(() => {
        audio.pause();
        audio.currentTime = 0;
        currentKey = null;
        setTimeout(() => syncMusic(true), 0);
      }).catch(() => {
        currentKey = null;
      });
    } else {
      setTimeout(() => syncMusic(true), 0);
    }
  }

  function setEnabled(next) {
    enabled = !!next;
    saveEnabled();
    if (!enabled) {
      ++transitionToken;
      cancelFade();
      audio.pause();
      audio.volume = 0;
    } else if (unlocked) {
      currentKey = null;
      syncMusic(true);
    }
    updateSettingsButton();
  }

  function updateSettingsButton() {
    const button = document.getElementById('musicToggleBtn');
    if (!button) return;
    button.textContent = `Music: ${enabled ? 'On' : 'Off'}`;
    button.setAttribute('aria-pressed', enabled ? 'true' : 'false');
  }

  function augmentSettingsModal() {
    const modal = document.getElementById('modal');
    if (!modal) return;
    const heading = modal.querySelector('h2');
    if (!heading || heading.textContent.trim() !== 'Settings') return;
    if (document.getElementById('musicToggleBtn')) {
      updateSettingsButton();
      return;
    }
    const actions = modal.querySelector('.modal-actions');
    if (!actions) return;
    const button = document.createElement('button');
    button.id = 'musicToggleBtn';
    button.className = 'secondary-small';
    button.type = 'button';
    button.onclick = () => setEnabled(!enabled);
    actions.insertBefore(button, actions.firstChild);
    updateSettingsButton();
  }

  const app = document.getElementById('app');
  if (app) {
    const observer = new MutationObserver(mutations => {
      if (mutations.some(m => m.type === 'attributes' && m.attributeName === 'class')) {
        queueMicrotask(() => syncMusic());
      }
    });
    observer.observe(app, {subtree: true, attributes: true, attributeFilter: ['class']});
  }

  const levelTitle = document.getElementById('levelTitle');
  if (levelTitle) {
    const levelObserver = new MutationObserver(() => queueMicrotask(() => syncMusic()));
    levelObserver.observe(levelTitle, {childList: true, characterData: true, subtree: true});
  }

  const settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn) settingsBtn.addEventListener('click', () => setTimeout(augmentSettingsModal, 0));

  document.addEventListener('pointerdown', unlockAudio, {passive: true});
  document.addEventListener('keydown', unlockAudio, {passive: true});

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      audio.pause();
    } else if (enabled && unlocked) {
      syncMusic();
    }
  });

  // Expose a tiny debug surface without coupling the puzzle engine to audio.
  window.LatchlingsMusic = {
    sync: syncMusic,
    isEnabled: () => enabled,
    setEnabled,
    current: () => currentKey,
    requested: () => requestedKey
  };
})();
