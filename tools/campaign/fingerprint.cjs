'use strict';
const FIELDS=['rocks','anchors','suitGates','colorGates','rails','turners','switches','doors'];
const VECTORS={U:[-1,0],D:[1,0],L:[0,-1],R:[0,1]};
const permutations=items=>items.length?items.flatMap((x,i)=>permutations(items.filter((_,j)=>j!==i)).map(rest=>[x,...rest])):[[]];

/** Compare geometry while preserving identities, nest association and linked state. */
function canonical(level,{terrainOnly=false}={}){
 const forms=[],n=level.size;
 for(let mirror=0;mirror<2;mirror++)for(let rotation=0;rotation<4;rotation++){
  const xy=(r,c)=>{if(mirror)c=n-1-c;for(let k=0;k<rotation;k++)[r,c]=[c,n-1-r];return[r,c];};
  const direction=d=>{let[r,c]=VECTORS[d];if(mirror)c=-c;for(let k=0;k<rotation;k++)[r,c]=[c,-r];return Object.keys(VECTORS).find(d=>VECTORS[d][0]===r&&VECTORS[d][1]===c);};
  for(const order of terrainOnly?[[]]:permutations(level.pieces.map((_,i)=>i))){
   const colors=new Map(),suits=new Map(),links=new Map(),rename=(map,value)=>{if(!map.has(value))map.set(value,map.size);return map.get(value);};
   const pieces=order.map(i=>{const p=level.pieces[i];return[xy(...p.pos),xy(...level.nests[i]),rename(colors,p.color),rename(suits,p.suit)];});
   const fields=FIELDS.map(field=>(level[field]||[]).map(v=>[...xy(v[0],v[1]),...v.slice(2)]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]).map(v=>{
    if(field==='colorGates')v[2]=rename(colors,v[2]);if(field==='suitGates')v[2]=rename(suits,v[2]);
    if(field==='rails')v[2]=direction(v[2]);if(field==='turners'&&mirror)v[2]=v[2]==='CW'?'CCW':'CW';
    if(field==='switches'||field==='doors')v[2]=rename(links,v[2]);return v;
   }));
   forms.push(JSON.stringify([n,...(terrainOnly?[]:[pieces]),fields]));
  }
 }
 return forms.sort()[0];
}
/** Flags require a design disposition; a low score is not quality certification. */
function nearClones(level,others){
 const terrain=canonical(level,{terrainOnly:true}),flags=[];
 for(const other of others){
  if(level.size!==other.size||level.pieces.length!==other.pieces.length)continue;
  if(canonical(other,{terrainOnly:true})===terrain){flags.push({id:other.id,reason:'same terrain; inspect changed start/goal decisions'});continue;}
  const special=FIELDS.filter(f=>f!=='rocks');if(special.some(f=>level[f].length!==other[f].length))continue;
  const target=new Set(level.rocks.map(p=>p.join(',')));let best=0;
  for(let mirror=0;mirror<2;mirror++)for(let rotation=0;rotation<4;rotation++){
   const transformed=new Set(other.rocks.map(([r,c])=>{if(mirror)c=level.size-1-c;for(let k=0;k<rotation;k++)[r,c]=[c,level.size-1-r];return r+','+c;}));
   const common=[...target].filter(v=>transformed.has(v)).length,union=target.size+transformed.size-common;if(union)best=Math.max(best,common/union);
  }
  if(best>=.85)flags.push({id:other.id,reason:'near-identical obstacle structure',similarity:best});
  else if(level.solution.length>=5&&level.solution.length===other.solution.length){
   const shape=route=>{const ids=new Map();return route.map(([pi,dir])=>{if(!ids.has(pi))ids.set(pi,ids.size);return ids.get(pi)+dir;}).join('/');};
   if(shape(level.solution)===shape(other.solution))flags.push({id:other.id,reason:'same supplied input/selection motif; inspect dependency differences'});
  }
 }
 return flags;
}
module.exports={canonical,nearClones,FIELDS};
