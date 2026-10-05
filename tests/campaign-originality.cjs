'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),vm=require('node:vm');
const {loadCampaign}=require('../tools/campaign/runtime.cjs');
const {canonical,nearClones}=require('../tools/campaign/fingerprint.cjs');
const {encodeLevel,exportChapter}=require('../tools/campaign/export.cjs');
const {reviewLevel,validateRecord,mechanicClasses}=require('../tools/campaign/review.cjs');
const {levels,simulateState}=loadCampaign(path.resolve(__dirname,'..'));
const baselineLevels=loadCampaign(path.resolve(__dirname,'..'),{revision:'c79f39f'}).levels;
const clone=x=>JSON.parse(JSON.stringify(x));
const base=clone(levels[365]);
function reflectsDirectionsAndHandedness(){
 const lev=clone(base);lev.turners=[[2,1,'CW']];lev.rails=[[3,2,'R']];lev.switches=[[1,2,0],[4,1,1]];lev.doors=[[4,4,0],[2,4,1]];
 const reflect=clone(lev),mirror=p=>[p[0],lev.size-1-p[1]];
 reflect.pieces=lev.pieces.map(p=>({...p,pos:mirror(p.pos)}));reflect.nests=lev.nests.map(mirror);
 for(const field of ['rocks','anchors','suitGates','colorGates','rails','turners','switches','doors'])reflect[field]=lev[field].map(v=>[...mirror(v),...v.slice(2)]);
 reflect.rails=reflect.rails.map(v=>[v[0],v[1],({L:'R',R:'L',U:'U',D:'D'})[v[2]]]);
 reflect.turners=reflect.turners.map(v=>[v[0],v[1],v[2]==='CW'?'CCW':'CW']);
 for(const field of ['switches','doors'])reflect[field]=reflect[field].map(v=>[v[0],v[1],v[2]===0?4:2]);
 const renameColor={coral:'mint',mint:'coral',blue:'gold',gold:'blue',lavender:'lavender'};
 reflect.pieces=reflect.pieces.map(p=>({...p,color:renameColor[p.color]}));reflect.colorGates=reflect.colorGates.map(v=>[v[0],v[1],renameColor[v[2]]]);
 assert.equal(canonical(lev),canonical(reflect));
 reflect.turners[0][2]='CW';assert.notEqual(canonical(lev),canonical(reflect),'reflection must invert turner handedness');
 const wrongNest=clone(lev);wrongNest.nests.reverse();assert.notEqual(canonical(lev),canonical(wrongNest),'piece-to-nest associations matter');
}
function exportsRoundTrip(){
 const chapter=levels.filter(l=>l.chapter===2),context=vm.createContext({window:{}});
 const fs=require('node:fs');vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../campaign400-1.js'),'utf8'),context);
 const bytes=exportChapter(chapter,2);assert.equal(bytes,exportChapter(chapter,2));vm.runInContext(bytes,context);
 assert.deepEqual(JSON.parse(JSON.stringify(context.window.LEVELS.slice(50))),chapter);
 assert.equal(encodeLevel(chapter[0])[15],51);
 assert.throws(()=>exportChapter(chapter.slice(1),2),/50|slot|ID/i);
}
function catchesBaselineRepeats(){
 const keys=new Set();let repeats=0;for(const lev of baselineLevels){const key=canonical(lev);if(keys.has(key))repeats++;keys.add(key);}assert.equal(repeats,130);
}
function flagsCloseTerrainWithoutCallingItCertified(){
 assert.equal(typeof nearClones,'function','missing separate near-clone review');
 const flags=nearClones(baselineLevels[52],[baselineLevels[53],baselineLevels[54],baselineLevels[0]]);
 assert(flags.some(f=>f.id===54));assert(flags.some(f=>f.id===55));assert(!flags.some(f=>f.id===1));
}
function refusesUnprovenOrEmptyRecords(){
 const lev=levels[50],baseline={margins:levels.map(l=>l.moveLimit-l.optimal)};
 assert(validateRecord(lev,null,baseline,[]).some(s=>/record/i.test(s)));
 const review=reviewLevel(lev,simulateState,{maxStates:1,maxMs:1000});assert.equal(review.proof.status,'unproven');
 const record={id:51,chapter:2,local:1,stage:'intro',intention:'A meaningful helper setup',focus:['helpers'],prerequisites:['edges'],decision:'retain',baselineMargin:2,canonical:canonical(lev),proof:review.proof,witnesses:[],comparisons:{similarityReviewed:true},rationale:'',contrastWith:[],visualEvidence:{status:'pending'}};
 const errors=validateRecord(lev,record,baseline,[]);assert(errors.some(s=>/proof/i.test(s)));assert(errors.some(s=>/witness/i.test(s)));
 const changed=clone(lev);changed.moveLimit++;assert(validateRecord(changed,record,baseline,[]).some(s=>/margin/i.test(s)));
 assert(validateRecord(lev,record,baseline,[lev]).some(s=>/duplicate/i.test(s)));
}
function countsLinkedStateAsOneMechanic(){
 assert.equal(typeof mechanicClasses,'function','finale must count mechanic classes, not switch and door tiles separately');
 assert.equal(mechanicClasses([{mechanic:'helpers'},{mechanic:'switches'},{mechanic:'doors'}]).size,2);
 assert.equal(mechanicClasses([{mechanic:'helpers'},{mechanic:'anchors'},{mechanic:'switches'},{mechanic:'doors'}]).size,3);
}
for(const test of [reflectsDirectionsAndHandedness,exportsRoundTrip,catchesBaselineRepeats,flagsCloseTerrainWithoutCallingItCertified,refusesUnprovenOrEmptyRecords,countsLinkedStateAsOneMechanic]){test();console.log(`PASS ${test.name}`);}
