const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');const h=fs.readFileSync('standalone/Hoopland League Studio.html','utf8');
const a=h.indexOf('function renderNumericControl'),b=h.indexOf('function renderOptimization',a);
let value;const node=(tag,cls,text)=>({tag,text,children:[],dataset:{},append(...xs){this.children.push(...xs)},setAttribute(){}});
const control=vm.runInNewContext(h.slice(a,b)+';renderNumericControl',{el:node,label:k=>k,get:()=>value,set:(p,v)=>value=v});
for(const [path,initial,step,max]of [[['sliders','layupAccuracy'],95,5,100],[['simulationSliders','layupAccuracy'],95,5,100],[['season','injuryProbability'],4,1,5],[['season','HOFbar'],10,1,Infinity]]){
 value=initial;const parent=node();assert.equal(control(parent,path[1],value,path),true);
 const row=parent.children[0].children[1],minus=row.children[0],plus=row.children[2];
 plus.onclick();assert.equal(value,initial+step);if(Number.isFinite(max)){plus.onclick();assert.equal(value,max)}
 minus.onclick();assert.equal(value,initial);
}
value=-5;const parent=node();control(parent,'simulationPace',value,['season','simulationPace']);parent.children[0].children[1].children[0].onclick();assert.equal(value,-5);
assert.ok(!h.includes('Other season data'));
const oa=h.indexOf('function orderedFields'),ob=h.indexOf('function renderObject',oa);
const order=vm.runInNewContext(h.slice(oa,ob)+';orderedFields');assert.equal(order({meta:{},awards:[],season:{}},[])[0][0],'season');
assert.ok(h.includes("key==='optimization')renderOptimization(parent)"));
console.log('Passed slider and stepper bounds, increments, section order, hidden extra season data and optimization placement.');
