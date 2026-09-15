const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const h=fs.readFileSync('standalone/Hoopland League Studio.html','utf8');const start=h.indexOf('function applySettingPreset'),end=h.indexOf('function syncSettingFields',start);
const apply=vm.runInNewContext(h.slice(start,end)+';applySettingPreset');
const data={optimization:{restrictImageSizes:true,playerStatsHistory:2},rules:{bonus:2}};
for(const value of [1,0]){
 assert.equal(apply(data,['season','optimization'],value),true);
 for(const key of ['teamLogos','courts','tableGraphics','disableBoxScores'])assert.equal(data.optimization[key],value===1);
 assert.equal(data.optimization.restrictImageSizes,true);assert.equal(data.optimization.playerStatsHistory,2);assert.equal(data.rules.bonus,2);
}
const optStart=h.indexOf('function difficultyOptions'),optEnd=h.indexOf('function field',optStart);
const options=vm.runInNewContext(h.slice(optStart,optEnd)+';difficultyOptions');
assert.deepEqual(Array.from(options(['season','optimization'])),['Low','High','Custom']);
console.log('Passed Low/High preset switching, option list and preservation of image restrictions and unrelated data.');

