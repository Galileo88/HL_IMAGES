import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html=fs.readFileSync('standalone/Hoopland League Studio.html','utf8');
const assets=JSON.parse(html.match(/const standaloneAssets=([^\n]+);/)[1]);
assert.equal(assets.length,129);
assert.ok(assets.every(asset=>!asset.path.startsWith('NCSA/tournament/')));
const helper=html.slice(html.indexOf('function archiveURL('),html.indexOf('function imageDimensions('));
const resolve=vm.runInNewContext(helper+';archiveURL',{URL});
const base='https://raw.githubusercontent.com/Galileo88/HL_IMAGES/';
let aliases=0;
for(const asset of assets){
 const bytes=fs.readFileSync(asset.path);
 assert.ok(bytes.equals(Buffer.from(asset.local.split(',')[1],'base64')),asset.path);
 assert.equal(asset.width,bytes.readUInt32BE(16));assert.equal(asset.height,bytes.readUInt32BE(20));
 assert.equal(asset.url,base+'main/'+asset.path);
 for(const p of [asset.path,...asset.aliases]){
  assert.equal(resolve(base+'main/'+p,assets),asset.url);
  assert.equal(resolve(base+'refs/heads/main/'+p+'?token=old',assets),asset.url);
 }
 if(asset.path.includes('/modern/'))assert.equal(asset.era,'Modern');
 if(asset.path.includes('/classic/'))assert.equal(asset.era,'Classic');
 aliases+=asset.aliases.length;
}
assert.equal(resolve(base+'main/UBA/modern/atlanta.png',assets),base+'main/UBA/courts/modern/atlanta.png');
assert.equal(resolve('https://example.com/logo.png',assets),'https://example.com/logo.png');
console.log(`Passed: ${assets.length} embedded images match disk, dimensions/categories/current URLs, ${aliases} moved-path aliases, legacy court aliases, unrelated URLs.`);
