const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const html=fs.readFileSync('standalone/Hoopland League Studio.html','utf8');
const sample=JSON.parse(html.match(/const standaloneSample=([^\n]+);/)[1]);
const start=html.indexOf('const seasonGroups='),end=html.indexOf('function renderObject',start);
const calls=[];
const el=(tag,cls,text)=>({tag,text,children:[],attrs:{},append(...xs){this.children.push(...xs)},setAttribute(k,v){this.attrs[k]=v},focus(){}});
const render=vm.runInNewContext(html.slice(start,end)+';renderSeason',{el,league:sample,hiddenState:new Set(['news','draftWorkouts','schedule','tradeOffers','playoffs','posts','playerHistory']),protectedKeys:new Set(),canNavigate:()=>true,renderObject:(panel,obj,path,depth,subset)=>calls.push({obj,path:Array.from(path),subset})});
const p=el();const before=JSON.stringify(sample);render(p,sample.season);
const nav=p.children[0],panels=p.children[1].children;
assert.deepEqual(nav.children.map(n=>n.text),['General','Advanced','Game Setup','Draft','Playoffs']);
assert.equal(panels.filter(p=>!p.hidden).length,1);
nav.children[4].onclick();assert.equal(panels[4].hidden,false);assert.equal(panels[0].hidden,true);
for(const c of calls){assert.ok(['season','settings'].includes(c.path[0]));assert.equal(c.path.length,1);if(c.path[0]==='season')assert.equal(c.subset,true)}
const seasonKeys=calls.filter(c=>c.path[0]==='season').flatMap(c=>Object.keys(c.obj));assert.equal(new Set(seasonKeys).size,seasonKeys.length);
assert.equal(JSON.stringify(sample),before);
console.log('Passed five visible tabs, switching, original edit paths, unique field grouping and unchanged league data.');
