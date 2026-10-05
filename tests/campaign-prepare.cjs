'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {prepareChapter}=require('../tools/campaign/prepare.cjs');
const root=path.resolve(__dirname,'..'),{levels,simulateState}=require('../tools/campaign/runtime.cjs').loadCampaign(root);
const baseline=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/baseline.json')));
assert.throws(()=>prepareChapter(levels.slice(50,99),{},baseline,simulateState),/50/,'partial chapter must not produce an export');
assert.throws(()=>prepareChapter(levels.slice(50,100),{},baseline,simulateState),/intention/,'author review cannot be inferred from solver success');
const pending=Object.fromEntries(levels.slice(50,100).map(l=>[l.id,'PENDING dependency review']));
assert.throws(()=>prepareChapter(levels.slice(50,100),pending,baseline,simulateState),/intention/,'pending notes must not silently become accepted records');
console.log('PASS preparation refuses partial chapters, absent author intentions and pending review');
if(process.argv.includes('--chapter-2')){
 const authored=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/authoring/chapter-2.json'))),notes=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/lanternwood-intentions.json')));
 const result=prepareChapter(authored,notes,baseline,simulateState,{previous:levels.slice(0,50),visualEvidence:{status:'test replay of the recorded author review'}});
 assert.equal(result.manifest.records.length,50);
 assert.deepEqual(result.authoring,levels.slice(50,100));
 assert.equal(result.exported,fs.readFileSync(path.join(root,'campaign400-2.js'),'utf8').replace(/\r\n/g,'\n'));
 console.log('PASS complete reviewed Lanternwood input regenerates the exact static chapter export');
}
