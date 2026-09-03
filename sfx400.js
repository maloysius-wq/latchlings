'use strict';

(() => {
  const SFX_KEY = 'latchlings_sfx_enabled_v1';
  const BASE = 'assets/sfx/';
  const DEFINITIONS = {
    uiTap: ['ui-tap.wav', 0.22, 3],
    uiBack: ['ui-back.wav', 0.24, 2],
    uiOpen: ['ui-open.wav', 0.22, 2],
    uiConfirm: ['ui-confirm.wav', 0.28, 2],
    screenSwipe: ['screen-swipe.wav', 0.18, 2],
    nextLevel: ['next-level.wav', 0.16, 2],
    hint: ['hint.wav', 0.30, 2],
    selectLatchling: ['select-latchling.wav', 0.30, 3],
    cycleLatchling: ['cycle-latchling.wav', 0.26, 3],
    invalid: ['invalid.wav', 0.28, 2],
    boardSwitch: ['switch.wav', 0.27, 2],
    turn: ['turn.wav', 0.20, 2],
    capture: ['capture.wav', 0.34, 3],
    levelClear: ['level-clear.wav', 0.24, 2],
    levelLose: ['level-lose.wav', 0.30, 2],
    campaignComplete: ['campaign-complete.wav', 0.42, 2],
    stopSoft: ['stop-soft.wav', 0.26, 3]
  };
  const MOVE_DEFS = {
    short: ['move-short.wav', 0.17],
    medium: ['move-medium.wav', 0.17],
    long: ['move-long.wav', 0.17]
  };

  let enabled = loadEnabled();
  const pools = new Map();
  const poolIndices = new Map();
  const routeTimers = new Set();
  let activeMove = null;

  function loadEnabled() {
    try {
      const saved = localStorage.getItem(SFX_KEY);
      return saved === null ? true : saved === 'true';
    } catch (_) {
      return true;
    }
  }

  function saveEnabled() {
    try { localStorage.setItem(SFX_KEY, String(enabled)); } catch (_) {}
  }

  function makeAudio(file, volume) {
    const audio = new Audio(BASE + file);
    audio.preload = 'auto';
    audio.volume = volume;
    return audio;
  }

  function getPool(key) {
    if (pools.has(key)) return pools.get(key);
    const def = DEFINITIONS[key];
    if (!def) return [];
    const [file, volume, count] = def;
    const pool = Array.from({length: count}, () => makeAudio(file, volume));
    pools.set(key, pool);
    poolIndices.set(key, 0);
    return pool;
  }

  function play(key, delay = 0) {
    if (!enabled) return;
    if (delay > 0) {
      const timer = setTimeout(() => {
        routeTimers.delete(timer);
        play(key, 0);
      }, delay);
      routeTimers.add(timer);
      return;
    }
    const pool = getPool(key);
    if (!pool.length) return;
    const index = poolIndices.get(key) || 0;
    const audio = pool[index % pool.length];
    poolIndices.set(key, (index + 1) % pool.length);
    try {
      audio.pause();
      audio.currentTime = 0;
      const promise = audio.play();
      if (promise && typeof promise.catch === 'function') promise.catch(() => {});
    } catch (_) {}
  }

  function clearRouteTimers() {
    routeTimers.forEach(timer => clearTimeout(timer));
    routeTimers.clear();
  }

  function moveKind(pathLength) {
    if (pathLength <= 2) return 'short';
    if (pathLength <= 4) return 'medium';
    return 'long';
  }

  function startMove(pathLength) {
    if (!enabled) return;
    clearRouteTimers();
    stopMove(false);
    const [file, volume] = MOVE_DEFS[moveKind(pathLength)];
    const audio = makeAudio(file, volume);
    activeMove = audio;
    try {
      const promise = audio.play();
      if (promise && typeof promise.catch === 'function') promise.catch(() => {});
    } catch (_) {}
  }

  function stopMove(reset = true) {
    if (!activeMove) return;
    try {
      activeMove.pause();
      if (reset) activeMove.currentTime = 0;
    } catch (_) {}
    activeMove = null;
  }

  function scheduleRouteEvents(events, pathLength) {
    if (!enabled || !Array.isArray(events) || !events.length || !pathLength) return;
    const duration = Math.min(300, 145 + pathLength * 16);
    events.forEach(event => {
      if (!event || !event.step) return;
      const fraction = Math.max(0, Math.min(1, event.step / pathLength));
      const delay = Math.max(20, Math.round(duration * fraction) - 12);
      if (event.type === 'switch') play('boardSwitch', delay);
      if (event.type === 'turn') play('turn', delay);
    });
  }

  function endMove(reason, capture) {
    stopMove();
    clearRouteTimers();
    if (!enabled) return;
    if (capture || reason === 'nest') {
      play('capture');
      return;
    }
    play('stopSoft');
  }

  function stopEverything() {
    stopMove();
    clearRouteTimers();
    pools.forEach(pool => pool.forEach(audio => {
      try { audio.pause(); audio.currentTime = 0; } catch (_) {}
    }));
  }

  function setEnabled(next) {
    enabled = !!next;
    saveEnabled();
    if (!enabled) stopEverything();
    updateSettingsButton();
  }

  function updateSettingsButton() {
    const button = document.getElementById('sfxToggleBtn');
    if (!button) return;
    button.textContent = `Sound Effects: ${enabled ? 'On' : 'Off'}`;
    button.setAttribute('aria-pressed', enabled ? 'true' : 'false');
  }

  function augmentSettingsModal() {
    const modal = document.getElementById('modal');
    if (!modal) return;
    const heading = modal.querySelector('h2');
    if (!heading || heading.textContent.trim() !== 'Settings') return;
    if (document.getElementById('sfxToggleBtn')) {
      updateSettingsButton();
      return;
    }
    const actions = modal.querySelector('.modal-actions');
    if (!actions) return;
    const button = document.createElement('button');
    button.id = 'sfxToggleBtn';
    button.className = 'secondary-small';
    button.type = 'button';
    button.onclick = () => setEnabled(!enabled);
    actions.insertBefore(button, actions.firstChild);
    updateSettingsButton();
  }

  function classifyButton(button) {
    if (!button || button.disabled) return null;
    if (button.matches('.dpad-hit, .latchling, #cycleLatchlingBtn, #hintBtn, #loseHintBtn')) return null;
    const id = button.id || '';
    if (['levelsBack', 'rulesClose', 'settingsClose', 'cancelReset', 'resumeBtn'].includes(id)) return 'uiBack';
    if (['settingsBtn', 'pauseBtn'].includes(id) || button.dataset.nav === 'about') return 'uiOpen';
    if (id === 'nextLevelBtn' && button.textContent.trim() === 'Finish') return null;
    if (id === 'nextLevelBtn') return 'nextLevel';
    if (id === 'confirmReset') return 'uiConfirm';
    return 'uiTap';
  }

  document.addEventListener('click', event => {
    const button = event.target && event.target.closest ? event.target.closest('button') : null;
    const sound = classifyButton(button);
    if (sound) play(sound);
  });

  const modalNode = document.getElementById('modal');
  if (modalNode) {
    const observer = new MutationObserver(() => queueMicrotask(augmentSettingsModal));
    observer.observe(modalNode, {childList: true, subtree: true});
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopMove();
  });

  window.LatchlingsSFX = {
    uiTap: () => play('uiTap'),
    uiBack: () => play('uiBack'),
    uiOpen: () => play('uiOpen'),
    uiConfirm: () => play('uiConfirm'),
    screenSwipe: () => play('screenSwipe'),
    hint: () => play('hint'),
    selectLatchling: () => play('selectLatchling'),
    cycleLatchling: () => play('cycleLatchling'),
    invalidMove: () => play('invalid'),
    startMove,
    scheduleRouteEvents,
    endMove,
    levelClear: () => play('levelClear', 115),
    levelLose: () => play('levelLose', 115),
    campaignComplete: () => play('campaignComplete'),
    isEnabled: () => enabled,
    setEnabled,
    stopAll: stopEverything
  };
})();
