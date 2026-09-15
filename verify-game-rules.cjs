const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const h=fs.readFileSync('standalone/Hoopland League Studio.html','utf8');let stored;
const node=(tag,cls,text)=>({tag,text,children:[],dataset:{},append(...xs){this.children.push(...xs)},setAttribute(){}});
const start=h.indexOf('function difficultyOptions'),end=h.indexOf('function attachImagePreview',start);
const field=vm.runInNewContext(h.slice(start,end)+';field',{el:node,label:k=>k,set:(p,v)=>stored=v});
const options={shootingFouls:['Off','Low','Med','High'],offFouls:['Off','Low','Med','High'],bonus:['5','6','7'],foulOut:['Off','5','6','10'],oneAndOne:['Off','On'],backcourt:['Off','On'],defGoaltending:['Off','On'],offGoaltending:['Off','On'],offThreeSeconds:['Off','On']};
for(const [key,labels]of Object.entries(options)){
 for(const initial of labels.length===2?[false,true,0,1]:[0]){
  const p=node();field(p,key,initial,['rules',key]);const input=p.children[0].children[1];
  assert.deepEqual(input.children.map(n=>n.text),labels);assert.equal(input.value,String(Number(initial)));
  for(let i=0;i<labels.length;i++){input.value=String(i);input.onchange();assert.equal(stored,typeof initial==='boolean'?Boolean(i):i)}
 }
}
console.log('Passed all nine rule dropdowns, option ordering, and boolean/numeric type preservation.');
