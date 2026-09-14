import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const source=path.join(root,'league-editor','dist');
const output=path.join(root,'standalone');fs.mkdirSync(output,{recursive:true});
const sample=JSON.parse(fs.readFileSync(path.join(source,'sample.txt'),'utf8'));
const assets=JSON.parse(fs.readFileSync(path.join(source,'assets.json'),'utf8'));
for(const asset of assets){const bytes=fs.readFileSync(path.join(source,asset.local));asset.local='data:image/png;base64,'+bytes.toString('base64');}
const json=value=>JSON.stringify(value).replace(/</g,'\\u003c');
let app=fs.readFileSync(path.join(source,'app.js'),'utf8').replace(/^import .*;\r?\n/,'');
const startup="Promise.all([fetch('sample.txt').then(r=>{if(!r.ok)throw Error('Sample failed to load');return r.json()}),fetch('assets.json').then(r=>r.json())])";
assert.ok(app.includes(startup),'Expected current startup loader');
app=app.replace(startup,'Promise.resolve([standaloneSample,standaloneAssets])');
const helpers=fs.readFileSync(path.join(source,'image-metadata.js'),'utf8').replace(/^export /gm,'');
const script=`(async()=>{\nconst standaloneSample=${json(sample)};\nconst standaloneAssets=${json(assets)};\n${helpers}\n${app}\n})().catch(error=>{document.getElementById('content').textContent=error.message;});`;
new vm.Script(script,{filename:'standalone-app.js'});
let html=fs.readFileSync(path.join(source,'index.html'),'utf8');
html=html.replace('<title>Hoopland League Studio</title>','<title>Hoopland League Studio — Standalone</title>')
 .replace('href="./"','href="#"')
 .replace('<link rel="stylesheet" href="style.css">','<style>'+fs.readFileSync(path.join(source,'style.css'),'utf8')+'</style>')
 .replace(/<script type="module" src="app\.js\?v=\d+"><\/script>/,'<script>'+script.replace(/<\/script/gi,'<\\/script')+'</script>');
assert.ok(!html.includes('src="app.js')&&!html.includes('href="style.css"'));
assert.ok(!script.includes("fetch('sample.txt')")&&!script.includes("fetch('assets.json')"));
assert.equal(assets.length,119);assert.ok(assets.every(a=>a.local.startsWith('data:image/png;base64,')));
const file=path.join(output,'Hoopland League Studio.html');fs.writeFileSync(file,html);
fs.writeFileSync(path.join(output,'READ ME.txt'),`HOOPLAND LEAGUE STUDIO — STANDALONE\n\n1. Extract the ZIP, if you downloaded it.\n2. Double-click Hoopland League Studio.html. It opens in your browser.\n3. Import a Hoopland league .txt, make your edits, and choose Export .txt.\n\nNo installation, ChatGPT account, Node.js, or server is required.\nThe sample league, styling, code, and all 119 archive images are inside the HTML file. You can move it anywhere or copy it to another computer.\n\nEditing, the bundled archive, and sampling bundled/uploaded images work offline. Checking externally hosted logos, courts, and announcer-table images during export requires an internet connection. Remote color sampling also depends on the image host allowing it; upload a copy if necessary.\n\nUse Chrome or Edge. If Copy URL is unavailable, select the URL field and press Ctrl+C.\nExport your league before closing or refreshing. Edits are held in memory, not saved automatically.\n\nThis is a standalone browser application, not a native Windows .exe. This copy does not auto-update when the hosted version changes.\n`);
console.log(JSON.stringify({file,megabytes:Math.round(Buffer.byteLength(html)/1024/1024),embeddedImages:assets.length,syntax:'passed',externalStartupDependencies:0}));
