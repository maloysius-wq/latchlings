'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),fixture=fs.mkdtempSync(path.join(os.tmpdir(),'latchlings-campaign-eol-'));
const git=args=>execFileSync('git',['-c','core.autocrlf=true','-c','core.safecrlf=false',...args],{cwd:fixture,stdio:'pipe'});
const chapters=[1,...new Set(require('../docs/campaign/acceptance.json').records.map(r=>r.chapter))];
const {levels}=require('../tools/campaign/runtime.cjs').loadCampaign(root),{exportChapter}=require('../tools/campaign/export.cjs');
try{
 git(['init','--quiet']);
 for(const chapter of chapters)fs.copyFileSync(path.join(root,'campaign400-'+chapter+'.js'),path.join(fixture,'campaign400-'+chapter+'.js'));
 if(fs.existsSync(path.join(root,'.gitattributes')))fs.copyFileSync(path.join(root,'.gitattributes'),path.join(fixture,'.gitattributes'));
 git(['add','.']);
 // Rebuild from the index, rather than retaining the already-LF copied file.
 for(const chapter of chapters)fs.unlinkSync(path.join(fixture,'campaign400-'+chapter+'.js'));
 git(['checkout-index','--all','--force']);
 const actual=crypto.createHash('sha256').update(fs.readFileSync(path.join(fixture,'campaign400-1.js'))).digest('hex').toUpperCase();
 assert.equal(actual,require('../docs/campaign/baseline.json').chapter1Sha256,'a fresh Windows-style checkout must preserve the frozen Chapter1 bytes used by deterministic export acceptance');
 const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
 for(const chapter of chapters.filter(c=>c>1))assert.equal(hash(fs.readFileSync(path.join(fixture,'campaign400-'+chapter+'.js'))),hash(exportChapter(levels.filter(l=>l.chapter===chapter),chapter)),'Chapter'+chapter+' checkout must preserve deterministic re-export bytes');
 console.log('PASS frozen and rebuilt campaign export bytes survive Windows-style Git checkout');
}finally{
 const absolute=path.resolve(fixture),temp=path.resolve(os.tmpdir())+path.sep;
 if(!absolute.startsWith(temp)||!path.basename(absolute).startsWith('latchlings-campaign-eol-'))throw Error('Refusing cleanup outside the owned EOL test fixture');
 fs.rmSync(absolute,{recursive:true,force:true});
}
