'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const {loadCampaign}=require('../tools/campaign/runtime.cjs'),{replay}=require('../tools/campaign/review.cjs'),{routingDependencies}=require('../tools/campaign/routing-review.cjs');
const {guideTurns,guideMatchingRails,guideRailBlockers}=require('../tools/campaign/guided-routing.cjs');
const {levels,simulateState}=loadCampaign(path.resolve(__dirname,'..'));
const base={...structuredClone(levels[0]),id:256,chapter:6,size:5,pieces:[{color:'blue',suit:'spade',pos:[2,0]},{color:'coral',suit:'heart',pos:[4,0]}],nests:[[0,4],[4,4]],rocks:[],anchors:[],suitGates:[],colorGates:[],rails:[],turners:[],switches:[],doors:[],solution:[[0,'R'],[0,'U'],[1,'R']]};
const original=JSON.stringify(base),turns=guideTurns(base,simulateState);
assert(turns.some(l=>l.turners.some(t=>t[0]===2&&t[1]===4&&t[2]==='CCW')),'convert a real right-then-up corner into a visible continuous bend');
for(const l of turns){assert(replay(l,simulateState).solved);assert.equal(l.solution.length,2);assert(routingDependencies(l,simulateState).bends.length);}
assert.equal(JSON.stringify(base),original,'guidance never mutates input');
const bent={...base,pieces:[base.pieces[0],{...base.pieces[1],pos:[4,2]}],nests:[[3,4],[4,4]],turners:[[2,2,'CW']],solution:[[0,'R'],[0,'R'],[1,'R']]};
const passages=guideMatchingRails(bent,simulateState);
assert(passages.some(l=>l.rails.some(r=>r[0]===3&&r[1]===2&&r[2]==='D')),'matching rail follows actual post-turn entry, not original R input');
for(const l of passages)assert(replay(l,simulateState).solved);
const blocked={...base,rocks:[[3,2]],pieces:[{color:'blue',suit:'spade',pos:[0,2]},base.pieces[1]],nests:[[2,4],[4,4]],solution:[[0,'D'],[0,'R'],[1,'R']]};
const blockers=guideRailBlockers(blocked,simulateState);
assert(blockers.length);for(const l of blockers){assert(replay(l,simulateState).solved);assert(routingDependencies(l,simulateState).railBlocked.some(w=>w.intended));assert(!l.rocks.some(r=>r[0]===3&&r[1]===2));}
assert.deepEqual(guideTurns({...base,solution:[]},simulateState),[]);
console.log('PASS offline visible-corner turns, post-turn matching rails and actual rock-stop rail suggestions');
