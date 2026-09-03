from pathlib import Path

p=Path('title-island-concepts/index.html')
t=p.read_text()

anchor='''#c2 .toy-logo span:nth-child(odd){transform:translateY(-2px) rotate(-2deg)}
#c2 .toy-logo span:nth-child(even){transform:translateY(2px) rotate(2deg)}
#c2 .toy-tagline{display:inline-block;margin:14px 0 0;padding:7px 14px;border-radius:999px;background:rgba(245,222,172,.94);box-shadow:0 3px 0 rgba(187,147,76,.28),0 8px 18px rgba(60,77,88,.08);color:var(--navy);font-family:Inter,ui-rounded,"Avenir Next",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:10px;font-weight:900;line-height:1;letter-spacing:.05em;text-transform:none;white-space:nowrap}
'''
replacement='''#c2 .toy-logo span:nth-child(odd){--toy-rest-y:-2px;--toy-rest-rot:-2deg;--toy-entry-rot:-9deg;transform:translateY(var(--toy-rest-y)) rotate(var(--toy-rest-rot))}
#c2 .toy-logo span:nth-child(even){--toy-rest-y:2px;--toy-rest-rot:2deg;--toy-entry-rot:9deg;transform:translateY(var(--toy-rest-y)) rotate(var(--toy-rest-rot))}
#c2 .toy-logo span:nth-child(1){--drop-delay:0ms}#c2 .toy-logo span:nth-child(2){--drop-delay:65ms}#c2 .toy-logo span:nth-child(3){--drop-delay:130ms}#c2 .toy-logo span:nth-child(4){--drop-delay:195ms}#c2 .toy-logo span:nth-child(5){--drop-delay:260ms}#c2 .toy-logo span:nth-child(6){--drop-delay:325ms}#c2 .toy-logo span:nth-child(7){--drop-delay:390ms}#c2 .toy-logo span:nth-child(8){--drop-delay:455ms}#c2 .toy-logo span:nth-child(9){--drop-delay:520ms}#c2 .toy-logo span:nth-child(10){--drop-delay:585ms}
#c2 .toy-logo.title-drop-run span{opacity:1;will-change:translate,rotate,opacity;animation:littleHomeTitleDrop 780ms linear var(--drop-delay) 1 both}
@keyframes littleHomeTitleDrop{0%{opacity:0;translate:0 -104px;rotate:var(--toy-entry-rot)}18%{opacity:1}56%{opacity:1;translate:0 11px;rotate:.7deg}75%{translate:0 -6px;rotate:-.4deg}89%{translate:0 2px;rotate:0deg}100%{opacity:1;translate:0 0;rotate:0deg}}
#c2 .toy-tagline{display:inline-block;margin:14px 0 0;padding:7px 14px;border-radius:999px;background:rgba(245,222,172,.94);box-shadow:0 3px 0 rgba(187,147,76,.28),0 8px 18px rgba(60,77,88,.08);color:var(--navy);font-family:Inter,ui-rounded,"Avenir Next",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:10px;font-weight:900;line-height:1;letter-spacing:.05em;text-transform:none;white-space:nowrap}
@media (prefers-reduced-motion:reduce){#c2 .toy-logo.title-drop-run span{animation:none!important;opacity:1;will-change:auto;translate:0 0!important;rotate:0deg!important}}
'''
if 'littleHomeTitleDrop' not in t:
    if anchor not in t:
        raise SystemExit('Wobbly logo CSS anchor not found')
    t=t.replace(anchor,replacement,1)

js_anchor="const buttons=[...document.querySelectorAll('.switcher button')],concepts=[...document.querySelectorAll('.concept')];function show(id,push=false){concepts.forEach(c=>c.classList.toggle('active',c.id===id));buttons.forEach(b=>b.setAttribute('aria-selected',String(b.dataset.target===id)));if(push)history.replaceState(null,'',`?c=${id.slice(1)}`)}"
js_replacement="function restartLittleHomeTitle(){const logo=document.querySelector('#c2 .toy-logo');if(!logo||matchMedia('(prefers-reduced-motion: reduce)').matches)return;logo.classList.remove('title-drop-run');void logo.offsetWidth;logo.classList.add('title-drop-run')}\nconst buttons=[...document.querySelectorAll('.switcher button')],concepts=[...document.querySelectorAll('.concept')];function show(id,push=false){concepts.forEach(c=>c.classList.toggle('active',c.id===id));buttons.forEach(b=>b.setAttribute('aria-selected',String(b.dataset.target===id)));if(id==='c2')restartLittleHomeTitle();if(push)history.replaceState(null,'',`?c=${id.slice(1)}`)}"
if 'function restartLittleHomeTitle()' not in t:
    if js_anchor not in t:
        raise SystemExit('Concept switcher JS anchor not found')
    t=t.replace(js_anchor,js_replacement,1)

p.write_text(t)
