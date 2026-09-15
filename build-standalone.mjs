// Refresh embedded assets while preserving the authoritative standalone application.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=path.dirname(fileURLToPath(import.meta.url));
const file=path.join(root,'standalone','Hoopland League Studio.html');
let html=fs.readFileSync(file,'utf8');
const declaration=/const standaloneAssets=([^\n]+);/;
const previous=JSON.parse(html.match(declaration)[1]);
function walk(dir){return fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(`${dir}/${e.name}`):e.name.toLowerCase().endsWith('.png')?[`${dir}/${e.name}`]:[])}
const paths=['UBA','NCSA','ads'].flatMap(walk),moved=[],used=new Set();
// Tournament artwork was retired from the standalone archive.
const retained=previous.filter(asset=>!asset.path.startsWith('NCSA/tournament/'));
const assets=retained.map(asset=>{
 let current=paths.includes(asset.path)?asset.path:null;
 if(!current){
  const candidates=paths.filter(p=>path.posix.basename(p)===path.posix.basename(asset.path)&&p.split('/')[0]===asset.path.split('/')[0]);
  assert.equal(candidates.length,1,`Cannot unambiguously relocate ${asset.path}`);
  current=candidates[0];moved.push([asset.path,current]);
 }
 assert.ok(!used.has(current),`Duplicate asset ${current}`);used.add(current);
 const bytes=fs.readFileSync(path.join(root,current));
 assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a',`Not PNG: ${current}`);
 return {...asset,path:current,url:'https://raw.githubusercontent.com/Galileo88/HL_IMAGES/main/'+current,
 era:current.includes('/classic/')?'Classic':current.includes('/modern/')?'Modern':asset.era,
 aliases:[...new Set([...(asset.aliases||[]),...(current!==asset.path?[asset.path]:[])])],
 width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),local:'data:image/png;base64,'+bytes.toString('base64')};
});
assert.equal(used.size,paths.length,'New images need archive metadata before packaging');
assets.sort((a,b)=>a.name.localeCompare(b.name)||a.path.localeCompare(b.path));
html=html.replace(declaration,()=> 'const standaloneAssets='+JSON.stringify(assets).replace(/</g,'\\u003c')+';');
html=html.replaceAll('assets.find(a=>a.path===p)','assets.find(a=>a.path===p||a.aliases?.includes(p))');
new vm.Script(html.match(/<script>([\s\S]*)<\/script>/)[1]);
fs.writeFileSync(file,html);
console.log(JSON.stringify({embeddedImages:assets.length,removed:previous.length-retained.length,moved,syntax:'passed'},null,2));
