'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');

/** Load static authored exports and the real pure gameplay transition. */
function loadCampaign(root,{revision}={}){
 const read=file=>revision?execFileSync('git',['show',`${revision}:${file}`],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024}):fs.readFileSync(path.join(root,file),'utf8');
 const context=vm.createContext({window:{}});
 for(let chapter=1;chapter<=8;chapter++)vm.runInContext(read(`campaign400-${chapter}.js`),context,{timeout:5000});
 const source=read('game400-b.js'),constants=read('game400-a.js');
 const vectors=constants.match(/const DIRV=.*?; const CW=.*?;/)?.[0];
 const findAt=constants.match(/function findAt\([^\n]+/)?.[0]||source.match(/function findAt\([^\n]+/)?.[0];
 const start=source.indexOf('function simulateState('),end=source.indexOf('function simulate(pi,',start);
 if(!vectors||!findAt||start<0||end<=start)throw new Error('Gameplay source boundaries changed; update and verify VM loader');
 vm.runInContext(vectors+'\n'+findAt+'\n'+source.slice(start,end),context,{timeout:5000});
 return {levels:JSON.parse(JSON.stringify(context.window.LEVELS)),simulateState:context.simulateState};
}
module.exports={loadCampaign};
