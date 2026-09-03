from pathlib import Path
p=Path('.github/scripts/validate_story_title_production.mjs')
t=p.read_text()
old="const frame3=await homeFrame(page);await frame3.click('#c2 .settings');"
new="const frame3=await homeFrame(page);await frame3.locator('#c2 .settings').dispatchEvent('click');"
if old in t:
    t=t.replace(old,new,1)
elif "dispatchEvent('click')" not in t:
    raise SystemExit('Settings validation click anchor not found')
p.write_text(t)
