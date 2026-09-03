from pathlib import Path
p=Path('music400.js')
t=p.read_text()
old="""  function cancelFade() {\n    if (fadeFrame) cancelAnimationFrame(fadeFrame);\n    fadeFrame = 0;\n  }\n\n  function fadeTo(target, duration = FADE_MS, token = transitionToken) {\n"""
new="""  function cancelFade() {\n    if (fadeFrame) cancelAnimationFrame(fadeFrame);\n    fadeFrame = 0;\n  }\n\n  function clampVolume(value) {\n    return Math.max(0, Math.min(1, value));\n  }\n\n  function fadeTo(target, duration = FADE_MS, token = transitionToken) {\n"""
if old in t:
    t=t.replace(old,new,1)
elif 'function clampVolume(value)' not in t:
    raise SystemExit('cancelFade/fadeTo anchor missing')
old2="""    const clamped = Math.max(0, Math.min(1, target));\n    return new Promise(resolve => {\n      function step(now) {\n        if (token !== transitionToken) { resolve(false); return; }\n        const t = Math.min(1, (now - start) / Math.max(1, duration));\n        audio.volume = from + (clamped - from) * t;\n"""
new2="""    const clamped = clampVolume(target);\n    return new Promise(resolve => {\n      function step(now) {\n        if (token !== transitionToken) { resolve(false); return; }\n        const t = Math.max(0, Math.min(1, (now - start) / Math.max(1, duration)));\n        audio.volume = clampVolume(from + (clamped - from) * t);\n"""
if old2 in t:
    t=t.replace(old2,new2,1)
elif 'const t = Math.max(0, Math.min(1,' not in t or 'audio.volume = clampVolume(' not in t:
    raise SystemExit('fade interpolation anchor missing')
p.write_text(t)
print('MUSIC_VOLUME_CLAMP_APPLIED')
