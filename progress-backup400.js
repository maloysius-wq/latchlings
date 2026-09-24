'use strict';
(function(){
 const FORMAT='latchlings-progress',VERSION=1;
 const KNOWN_FILMS=()=>Object.keys(window.LatchlingsCinematics?.CINEMATICS||{});
 const isRecord=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
 function exactKeys(value,keys,label){
  if(!isRecord(value))throw new Error(`${label} must be an object`);
  const actual=Object.keys(value);
  if(actual.length!==keys.length||actual.some(key=>!keys.includes(key)))throw new Error(`${label} has unsupported fields`);
 }
 function normalizeProgress(value){
  exactKeys(value,['unlocked','stars'],'Campaign progress');
  if(!Number.isInteger(value.unlocked)||value.unlocked<1||value.unlocked>400)throw new Error('Unlocked level must be between 1 and 400');
  if(!isRecord(value.stars))throw new Error('Campaign stars must be an object');
  const stars={};
  for(const [key,count] of Object.entries(value.stars)){
   if(!/^(?:[1-9]|[1-9]\d|[1-3]\d\d|400)$/.test(key))throw new Error(`Invalid star level: ${key}`);
   const level=Number(key);
   if(level>value.unlocked)throw new Error(`Stars cannot be recorded beyond unlocked Level ${value.unlocked}`);
   if(!Number.isInteger(count)||count<1||count>3)throw new Error(`Level ${level} must have between 1 and 3 stars`);
   stars[String(level)]=count;
  }
  return {unlocked:value.unlocked,stars};
 }
 function normalizeSeen(value){
  if(!Array.isArray(value))throw new Error('Cinematics must be a list');
  const known=new Set(KNOWN_FILMS());
  const seen=[];
  for(const id of value){
   if(typeof id!=='string'||!known.has(id))throw new Error(`Unknown cinematic: ${String(id)}`);
   if(seen.includes(id))throw new Error(`Duplicate cinematic: ${id}`);
   seen.push(id);
  }
  return seen.sort();
 }
 function normalizeBackup(value){
  exactKeys(value,['format','version','campaign','cinematics'],'Backup');
  if(value.format!==FORMAT)throw new Error('This is not a Latchlings progress backup');
  if(value.version!==VERSION)throw new Error(`Unsupported backup version: ${String(value.version)}`);
  return {format:FORMAT,version:VERSION,campaign:normalizeProgress(value.campaign),cinematics:normalizeSeen(value.cinematics)};
 }
 function create(progress,seen){
  return normalizeBackup({format:FORMAT,version:VERSION,campaign:progress,cinematics:seen});
 }
 function parse(jsonText){
  if(typeof jsonText!=='string')throw new Error('Backup contents must be text');
  let value;
  try{value=JSON.parse(jsonText)}catch(_){throw new Error('Backup is not valid JSON')}
  const backup=normalizeBackup(value);
  return {progress:backup.campaign,seen:backup.cinematics};
 }
 window.LatchlingsProgressBackup={create,parse};
})();
