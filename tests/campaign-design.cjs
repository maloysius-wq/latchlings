'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const {acceptCampaign}=require('../tools/campaign/accept.cjs');
const chapterArg=process.argv.indexOf('--chapter'),chapter=chapterArg>=0?Number(process.argv[chapterArg+1]):null;
const result=acceptCampaign(path.resolve(__dirname,'..'),{chapter});
assert.deepEqual(result.failures,[],`Campaign design acceptance failed: ${JSON.stringify(result.failures.slice(0,12))}`);
assert.equal(result.reviewed,chapter?50:350);
console.log(`PASS campaign design acceptance: ${result.reviewed} reviewed boards, ${result.proven} proven optima, zero canonical duplicates`);
