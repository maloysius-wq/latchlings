from pathlib import Path
p=Path('.github/scripts/validate_story_title_production.mjs')
t=p.read_text()
old_click="const frame3=await homeFrame(page);await frame3.click('#c2 .settings');"
old_dispatch="const frame3=await homeFrame(page);await frame3.locator('#c2 .settings').dispatchEvent('click');"
old_frame_eval="const frame3=await homeFrame(page);await frame3.evaluate(()=>{const b=document.querySelector('#c2 .settings');if(!b)throw new Error('Embedded Settings button missing');b.click()});"
new="await homeFrame(page);await page.evaluate(()=>{const f=document.getElementById('homeTitleFrame'),b=f?.contentDocument?.querySelector('#c2 .settings');if(!b)throw new Error('Embedded Settings button missing');b.click()});"
for old in (old_click,old_dispatch,old_frame_eval):
    if old in t:
        t=t.replace(old,new,1)
        break
else:
    if new not in t: raise SystemExit('Settings validation click anchor not found')
anchor="const page=await context.newPage();watch(page,errors);"
if anchor in t and "page.setDefaultTimeout(7000);" not in t:
    t=t.replace(anchor,anchor+"page.setDefaultTimeout(7000);page.setDefaultNavigationTimeout(15000);",1)
p.write_text(t)
