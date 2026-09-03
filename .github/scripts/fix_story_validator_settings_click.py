from pathlib import Path
p=Path('.github/scripts/validate_story_title_production.mjs')
t=p.read_text()
old_click="const frame3=await homeFrame(page);await frame3.click('#c2 .settings');"
old_dispatch="const frame3=await homeFrame(page);await frame3.locator('#c2 .settings').dispatchEvent('click');"
new="const frame3=await homeFrame(page);await frame3.evaluate(()=>{const b=document.querySelector('#c2 .settings');if(!b)throw new Error('Embedded Settings button missing');b.click()});"
if old_click in t:
    t=t.replace(old_click,new,1)
elif old_dispatch in t:
    t=t.replace(old_dispatch,new,1)
elif new not in t:
    raise SystemExit('Settings validation click anchor not found')
p.write_text(t)
