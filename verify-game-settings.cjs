const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const h=fs.readFileSync('standalone/Hoopland League Studio.html','utf8');
const start=h.indexOf('function difficultyOptions'),end=h.indexOf('function attachImagePreview',start);
let stored;
const node=(tag,cls,text)=>({tag,text,children:[],dataset:{},append(...xs){this.children.push(...xs)},setAttribute(){}});
const api=vm.runInNewContext(h.slice(start,end)+';({field,difficultyOptions})',{el:node,label:k=>k,set:(p,v)=>stored=v});
const expected={gameLength:['4','6','8','10','12','16','20','24','32','40','48'],totalPeriods:['2 Halves','4 Quarters'],shotClock:['14','24','30'],difficulty:['Rookie','Pro','All-Star','Custom'],rules:['Pro','College','Custom'],gameStyle:['Simulation','Arcade','Custom']};
for(const [key,options] of Object.entries(expected)){
 const parent=node();api.field(parent,key,0,['settings',key]);const select=parent.children[0].children[1];
 assert.equal(select.tag,'select');assert.deepEqual(Array.from(select.children,o=>o.text),options);
 for(let i=0;i<options.length;i++){assert.equal(select.children[i].value,String(i));select.value=String(i);select.onchange();assert.equal(stored,i)}
}
assert.equal(api.difficultyOptions(['other','shotClock']),null);
console.log('Passed: all six game setup dropdowns, ordered labels, numeric export values, path scoping.');
