'use strict';
const {replay}=require('./review.cjs');
const COLORS=['blue','coral','mint','lavender'],SUITS=['spade','heart','club','star'];
/** Offline only: reproducible candidate geometry, not campaign certification. */
function candidate(profile,seed,id){
 let state=seed>>>0;const random=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296;};
 const shuffle=items=>{for(let i=items.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[items[i],items[j]]=[items[j],items[i]];}return items;};
 const n=profile.size,cells=shuffle(Array.from({length:n*n},(_,i)=>[Math.floor(i/n),i%n])),pieces=cells.splice(0,profile.pieces).map((pos,i)=>({color:COLORS[i],suit:SUITS[i],pos,expression:'determined'})),nests=cells.splice(0,profile.pieces);
 // Different obstacle distributions create useful lanes, corner approaches or central crossings.
 const ranked=cells.map(pos=>({pos,rank:random()+(profile.geometry==='corners'?(pos[0]===0||pos[1]===0||pos[0]===n-1||pos[1]===n-1?-.6:.2):profile.geometry==='lanes'?(pos[0]%2?-.35:.35):profile.geometry==='crossing'?(Math.abs(pos[0]-(n-1)/2)+Math.abs(pos[1]-(n-1)/2))*.08:0)})).sort((a,b)=>a.rank-b.rank);
 return {size:n,pieces,nests,rocks:ranked.slice(0,profile.rocks).map(x=>x.pos),anchors:ranked.slice(profile.rocks,profile.rocks+(profile.anchors||0)).map(x=>x.pos),suitGates:[],colorGates:[],rails:[],turners:[],switches:[],doors:[],id,chapter:Math.ceil(id/50),solution:[],optimal:0,moveLimit:0,difficultyScore:0};
}
function cooperation(level,simulateState){
 const travel=replay(level,simulateState),vectors={U:[-1,0],D:[1,0],L:[0,-1],R:[0,1]},stops=[],captures=[];
 for(const step of travel.steps){
  if(step.result.capture)captures.push(step.prefix);
  if(step.result.reason!=='piece')continue;
  const [dr,dc]=vectors[step.move[1]],at=[step.result.r+dr,step.result.c+dc],helper=step.state.positions.findIndex((p,i)=>i!==step.move[0]&&p&&p[0]===at[0]&&p[1]===at[1]);
  if(helper<0)continue;
  const initial=level.pieces[helper].pos,relocated=initial[0]!==at[0]||initial[1]!==at[1];
  stops.push({...step,traveler:step.move[0],helper,helperPosition:at,relocated});
 }
 const roles=new Set(stops.map(s=>s.traveler)),edges=new Set(stops.map(s=>s.traveler+'>'+s.helper));
 const captureOrder=travel.steps.filter(s=>s.result.capture).map(s=>s.move[0]);
 const motif=stops.map((s,i)=>{const axis=s.move[1]==='U'||s.move[1]==='D'?'vertical':'horizontal',previous=i?(stops[i-1].move[1]==='U'||stops[i-1].move[1]==='D'?'vertical':'horizontal'):axis;return `${captureOrder.indexOf(s.traveler)}>${captureOrder.indexOf(s.helper)}:${s.relocated?'relocated':'initial'}:${axis===previous?'same-axis':'cross-axis'}:after-${captures.filter(p=>p<s.prefix).length}-captures`;}).join('/');
 return {stops,captures,motif,captureOrder,participants:new Set(stops.flatMap(s=>[s.traveler,s.helper])).size,relocations:stops.filter(s=>s.relocated).length,travelers:roles.size,roleSwap:[...edges].some(e=>{const[a,b]=e.split('>');return edges.has(b+'>'+a);}),beforeFirstCapture:stops.filter(s=>s.prefix<(captures[0]??Infinity)).length,signature:stops.map(s=>`${s.traveler}>${s.helper}${s.relocated?'m':'s'}`).join('/'),solved:travel.solved};
}
function fitsCooperation(deps,profile){
 return deps.solved&&deps.stops.length>=(profile.minStops||0)&&deps.travelers>=(profile.minTravelers||0)&&deps.relocations>=(profile.minRelocations||0)&&deps.beforeFirstCapture>=(profile.minBeforeCapture||0)&&(!profile.roleSwap||deps.roleSwap);
}
function cooperationFailures(level,simulateState,capstoneMotifs=new Set()){
 const local=(level.id-1)%50+1,deps=cooperation(level,simulateState),errors=[];
 const stage=local<=5?'intro':local<=15?'practice':local<=30?'combine':local<=45?'planning':'capstone';
 const profile={minStops:{intro:1,practice:2,combine:3,planning:4,capstone:5}[stage],minTravelers:local>=16?2:1,minRelocations:local<=5?0:local<=15?1:2,minBeforeCapture:local<=5?1:local<=30?2:3,roleSwap:local>=11&&local<=15};
 if(local>=2&&local<=5)profile.minRelocations=1;
 if(local===4){profile.roleSwap=true;profile.minStops=2;profile.minBeforeCapture=2;}
 if(local===5){profile.minStops=2;profile.minRelocations=2;profile.minBeforeCapture=2;}
 if(!fitsCooperation(deps,profile))errors.push(`Incomplete ${stage} cooperation chain`);
 if(local>=16&&deps.participants!==level.pieces.length)errors.push('Disconnected solo errand in combined cooperation board');
 if(local>=46&&capstoneMotifs.has(deps.motif))errors.push('Repeated capstone dependency motif');
 return errors;
}
module.exports={candidate,cooperation,fitsCooperation,cooperationFailures};
