'use strict';
// Wait for the application's prerequisites, not an unrelated network-idle event.
async function openGame(page,url,{timeout=30000}={}){
 await page.goto(url,{waitUntil:'domcontentloaded',timeout});
 await page.waitForFunction(()=>document.body.dataset.screen==='home'&&typeof LEVELS!=='undefined'&&LEVELS.length===400&&typeof startLevel==='function'&&typeof screen==='function'&&typeof LatchlingsPrefs!=='undefined',undefined,{timeout});
 await page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))});
}
module.exports={openGame};
