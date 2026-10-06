'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {prepareChapter,patchFor}=require('../tools/campaign/prepare.cjs');
const root=path.resolve(__dirname,'..'),{levels,simulateState}=require('../tools/campaign/runtime.cjs').loadCampaign(root);
const baseline=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/baseline.json')));
assert.throws(()=>prepareChapter(levels.slice(50,99),{},baseline,simulateState),/50/,'partial chapter must not produce an export');
assert.throws(()=>prepareChapter(levels.slice(50,100),{},baseline,simulateState),/intention/,'author review cannot be inferred from solver success');
const pending=Object.fromEntries(levels.slice(50,100).map(l=>[l.id,'PENDING dependency review']));
assert.throws(()=>prepareChapter(levels.slice(50,100),pending,baseline,simulateState),/intention/,'pending notes must not silently become accepted records');
console.log('PASS preparation refuses partial chapters, absent author intentions and pending review');
assert.equal(typeof patchFor,'function','preparation must produce a reviewable patch, not write files itself');
const patch=patchFor([{path:'/repo/new.json',old:null,content:'[]\n'},{path:'/repo/existing.json',old:'a\r\nb\r\nc\r\n',content:'a\nx\nc\n'}]);
assert(patch.includes('*** Add File: /repo/new.json\n+[]'));
assert(patch.includes(' a\n-b\n+x\n c'),'patch preserves unchanged context and normalizes CRLF');
assert.equal(patchFor([{path:'/repo/same',old:'a\r\n',content:'a\n'}]),'*** Begin Patch\n*** End Patch');
if(process.argv.includes('--chapter-2')){
 const authored=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/authoring/chapter-2.json'))),notes=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/lanternwood-intentions.json')));
 const result=prepareChapter(authored,notes,baseline,simulateState,{previous:levels.slice(0,50),visualEvidence:{status:'test replay of the recorded author review'}});
 assert.equal(result.manifest.records.length,50);
 assert.deepEqual(result.authoring,levels.slice(50,100));
 assert.equal(result.exported,fs.readFileSync(path.join(root,'campaign400-2.js'),'utf8').replace(/\r\n/g,'\n'));
 console.log('PASS complete reviewed Lanternwood input regenerates the exact static chapter export');
}
if(process.argv.includes('--chapter-3')){
 const authored=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/authoring/chapter-3.json'))),notes=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/lodestone-intentions.json')));
 const records=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/acceptance.json'))).records;
 const result=prepareChapter(authored,notes,baseline,simulateState,{previous:levels.slice(0,100),visualEvidence:{status:'test replay of the recorded author review'}});
 assert.equal(result.manifest.records.length,50);
 assert.deepEqual(result.authoring,levels.slice(100,150));
 assert.equal(result.exported,fs.readFileSync(path.join(root,'campaign400-3.js'),'utf8').replace(/\r\n/g,'\n'));
 for(const record of result.manifest.records)assert.equal(record.decision,records.find(r=>r.id===record.id).decision,'retention decisions must round-trip, not silently become replacements');
 console.log('PASS complete reviewed Lodestone input regenerates the exact static chapter and retention decisions');
}
if(process.argv.includes('--chapter-4')){
 const authored=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/authoring/chapter-4.json'))),notes=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/masquerade-intentions.json')));
 const records=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/acceptance.json'))).records;
 const result=prepareChapter(authored,notes,baseline,simulateState,{previous:levels.slice(0,150),visualEvidence:{status:'test replay of the recorded author review'}});
 assert.equal(result.manifest.records.length,50);
 assert.deepEqual(result.authoring,levels.slice(150,200));
 assert.equal(result.exported,fs.readFileSync(path.join(root,'campaign400-4.js'),'utf8').replace(/\r\n/g,'\n'));
 for(const record of result.manifest.records)assert.equal(record.decision,records.find(r=>r.id===record.id).decision,'retention decisions must round-trip');
 console.log('PASS complete reviewed Masquerade input regenerates the exact static chapter and retention decisions');
}
if(process.argv.includes('--chapter-5')){
 const authored=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/authoring/chapter-5.json'))),notes=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/prism-intentions.json')));
 const records=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/acceptance.json'))).records;
 const result=prepareChapter(authored,notes,baseline,simulateState,{previous:levels.slice(0,200),visualEvidence:{status:'test replay of the recorded author review'}});
 assert.equal(result.manifest.records.length,50);
 assert.deepEqual(result.authoring,levels.slice(200,250));
 assert.equal(result.exported,fs.readFileSync(path.join(root,'campaign400-5.js'),'utf8').replace(/\r\n/g,'\n'));
 for(const record of result.manifest.records)assert.equal(record.decision,records.find(r=>r.id===record.id).decision,'retention decisions must round-trip');
 console.log('PASS complete reviewed Prism input regenerates the exact static chapter and retention decisions');
}
if(process.argv.includes('--chapter-6')){
 const authored=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/authoring/chapter-6.json'))),notes=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/copperline-intentions.json')));
 const records=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/acceptance.json'))).records;
 const result=prepareChapter(authored,notes,baseline,simulateState,{previous:levels.slice(0,250),visualEvidence:{status:'test replay of the recorded author review'}});
 assert.equal(result.manifest.records.length,50);assert.deepEqual(result.authoring,levels.slice(250,300));
 assert.equal(result.exported,fs.readFileSync(path.join(root,'campaign400-6.js'),'utf8').replace(/\r\n/g,'\n'));
 for(const record of result.manifest.records){assert.equal(record.decision,records.find(r=>r.id===record.id).decision,'retention decisions must round-trip');assert(record.comparisons.routing,'actual routing evidence must survive preparation');}
 console.log('PASS complete reviewed Copperline input regenerates exact export, routing evidence and retention decisions');
}
if(process.argv.includes('--chapter-7')){
 const authored=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/authoring/chapter-7.json'))),notes=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/stormswitch-intentions.json')));
 const records=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/acceptance.json'))).records;
 const result=prepareChapter(authored,notes,baseline,simulateState,{previous:levels.slice(0,300),visualEvidence:{status:'test replay of the recorded author review'}});
 assert.equal(result.manifest.records.length,50);assert.deepEqual(result.authoring,levels.slice(300,350));
 assert.equal(result.exported,fs.readFileSync(path.join(root,'campaign400-7.js'),'utf8').replace(/\r\n/g,'\n'));
 for(const record of result.manifest.records){assert.equal(record.decision,records.find(r=>r.id===record.id).decision,'retention decisions must round-trip');assert(record.comparisons.linked,'reachable state evidence must survive preparation');}
 console.log('PASS complete reviewed Stormswitch input regenerates exact export, reachable state evidence and retention decisions');
}
