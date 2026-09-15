const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const h=fs.readFileSync('standalone/Hoopland League Studio.html','utf8');
const start=h.indexOf('function applySettingPreset'),end=h.indexOf('function syncSettingFields',start);
const apply=vm.runInNewContext(h.slice(start,end)+';applySettingPreset');
const d={settings:{},difficulty:{defensiveAssistance:1,offensiveAssistance:0},rules:{blockingFouls:2,partialShotClock:true},sliders:{shootingFoulFrequency:50}};
for(const [i,values]of [[0,[0,0,0,0,0]],[1,[0,0,1,1,1]],[2,[1,1,2,2,1]]]){
 apply(d,['settings','difficulty'],i);
 assert.deepEqual(['shotSpeed','shotStyle','CPUShotTiming','CPUReactionTime','CPUPlayerSpeed'].map(k=>d.difficulty[k]),values);
}
const snapshot=JSON.stringify(d.difficulty);apply(d,['settings','difficulty'],3);assert.equal(JSON.stringify(d.difficulty),snapshot);
apply(d,['difficulty','shotSpeed'],0);assert.equal(d.settings.difficulty,3);
apply(d,['settings','gameStyle'],0);assert.equal(d.sliders.dunkAccuracy,60);assert.equal(d.sliders.fatigueStrength,100);
apply(d,['settings','gameStyle'],1);assert.equal(d.sliders.dunkAccuracy,100);assert.equal(d.sliders.fatigueStrength,0);
apply(d,['settings','rules'],1);assert.equal(d.rules.bonus,2);assert.equal(d.rules.foulOut,1);assert.equal(d.rules.oneAndOne,true);
assert.equal(d.difficulty.defensiveAssistance,1);assert.equal(d.rules.blockingFouls,2);assert.equal(d.rules.partialShotClock,true);assert.equal(d.sliders.shootingFoulFrequency,50);
const labelStart=h.indexOf('function entryLabel'),labelEnd=h.indexOf('function renderObject',labelStart);
const labeler=vm.runInNewContext(h.slice(labelStart,labelEnd)+';entryLabel',{label:k=>k});
assert.equal(labeler(['awards'],'2',{name:'Most Valuable Player'}),'Most Valuable Player');
console.log('Passed preset values, Custom preservation, manual override, hidden-value preservation, and award names.');
