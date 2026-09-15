import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html=fs.readFileSync('standalone/Hoopland League Studio.html','utf8');
const script=html.match(/<script>([\s\S]*)<\/script>/)?.[1];assert.ok(script);
class Element{constructor(tag){this.tag=tag;this.children=[];this.dataset={};this.style={setProperty(){}};this.classList={add(){},remove(){},toggle(){}};this.value=''}append(...xs){this.children.push(...xs)}replaceChildren(...xs){this.children=xs}setAttribute(){}addEventListener(){}querySelectorAll(){return []}remove(){}}
const nodes=new Map();const get=s=>{if(s==='.invalid')return null;if(!nodes.has(s))nodes.set(s,new Element());return nodes.get(s)};
await vm.runInNewContext(script,{document:{createElement:tag=>new Element(tag),querySelector:get,querySelectorAll:()=>[],getElementById:id=>get('#'+id)},window:{addEventListener(){}},navigator:{},URL,Blob,structuredClone,setTimeout,clearTimeout,fetch:()=>{throw Error('Unexpected network request during startup')},console});
await new Promise(r=>setTimeout(r,0));
assert.equal(get('#title').textContent,'Hoop League');assert.equal(get('#teams').children.filter(n=>n.tag==='button').length,32);assert.equal(get('#assetCount').textContent,129);
assert.equal(get('#teams').children.filter(n=>n.tag==='h3').length,3);
assert.equal(get('#teams').children.filter(n=>n.tag==='h4').length,6);
assert.equal(get('#status').textContent,'Ready to edit');
assert.ok(get('#pickArchive').children.every(option=>option.value.startsWith('data:image/png;base64,')));
console.log('Standalone smoke check passed: exported HTML starts with no fetches, 32 team entries and 129 embedded images.');
