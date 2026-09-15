const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const h=fs.readFileSync('standalone/Hoopland League Studio.html','utf8');
const start=h.indexOf('function applySettingPreset'),end=h.indexOf('function syncSettingFields',start);
const apply=vm.runInNewContext(h.slice(start,end)+';applySettingPreset');
const data={settings:{rules:2,difficulty:1},rules:{blockingFouls:2,partialShotClock:true},teams:[{name:'Preserved'}]};
for(const type of [1,0,1]){
 data.leagueType=type;assert.equal(apply(data,['leagueType'],type),true);
 assert.equal(data.settings.rules,type);
 assert.equal(data.rules.bonus,type===1?2:0);
 assert.equal(data.rules.oneAndOne,type===1);
 assert.equal(data.rules.foulOut,type===1?1:2);
 for(const key of ['shootingFouls','offFouls'])assert.equal(data.rules[key],2);
 for(const key of ['backcourt','defGoaltending','offGoaltending','offThreeSeconds'])assert.equal(data.rules[key],true);
 assert.equal(data.rules.blockingFouls,2);assert.equal(data.settings.difficulty,1);
}
apply(data,['rules','bonus'],1);assert.equal(data.settings.rules,2);
apply(data,['settings','rules'],0);assert.equal(data.rules.oneAndOne,false);
const saved=JSON.parse(JSON.stringify(data));assert.equal(saved.rules.foulOut,2);assert.equal(saved.teams[0].name,'Preserved');
console.log('Passed Pro/College switching, screenshot rule values, manual Custom override, and export preservation.');
