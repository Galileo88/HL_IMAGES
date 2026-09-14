import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const file='standalone/Hoopland League Studio.html',html=fs.readFileSync(file,'utf8');
const start=html.indexOf('function loadImage(src){'),end=html.indexOf('\n',start);assert.ok(start>0&&end>start);
const replacement=String.raw`function pickerImageSources(src){
 const normalized=archiveURL(src,assets),known=assets.find(a=>a.url===normalized);
 if(known)return [known.local];
 try{const url=new URL(normalized);if(['www.dropbox.com','dropbox.com'].includes(url.hostname)&&/^\/(s|scl\/fi)\//.test(url.pathname)){url.hostname='dl.dropboxusercontent.com';url.searchParams.delete('dl');url.searchParams.set('raw','1');return [...new Set([url.href,normalized])]}}catch{}
 return [normalized];
}
let pickerLoadRevision=0;
function loadImage(src){
 const revision=++pickerLoadRevision,candidates=pickerImageSources(src),canvas=$('#canvas');imageReady=false;
 canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);$('#palette').replaceChildren();$('#zoom').getContext('2d').clearRect(0,0,100,100);
 $('#pickHelp').textContent='Loading image…';let index=0;
 const attempt=()=>{if(revision!==pickerLoadRevision)return;const source=candidates[index++];if(!source){$('#pickHelp').textContent='Could not read this image. Check that the Dropbox link is shared, or download it and use Upload image.';return}
  const img=new Image();let finished=false;const timer=setTimeout(()=>fail(),15000);
  const fail=()=>{if(finished)return;finished=true;clearTimeout(timer);if(revision===pickerLoadRevision)attempt()};
  if(/^https?:/i.test(source))img.crossOrigin='anonymous';img.referrerPolicy='no-referrer';
  img.onload=()=>{if(finished)return;finished=true;clearTimeout(timer);if(revision!==pickerLoadRevision)return;
   try{canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.imageSmoothingEnabled=false;ctx.drawImage(img,0,0);
    const data=ctx.getImageData(0,0,canvas.width,canvas.height).data,bins=new Map();for(let i=0;i<data.length;i+=4){if(data[i+3]<200)continue;const hex=Array.from(data.slice(i,i+3)).map(v=>v.toString(16).padStart(2,'0')).join('');bins.set(hex,(bins.get(hex)||0)+1)}
    const palette=$('#palette');palette.replaceChildren();for(const [hex]of [...bins].sort((a,b)=>b[1]-a[1]).slice(0,10)){const b=el('button');b.style.background='#'+hex;b.title=hex;b.setAttribute('aria-label','Select '+hex);b.onclick=()=>sampled(hex);palette.append(b)}
    imageReady=true;$('#pickHelp').textContent='Click a pixel to select it. Transparent pixels are ignored.';
   }catch{canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);attempt()}
  };img.onerror=fail;img.src=source;
 };attempt();
}`;
const code=replacement;
new vm.Script(code);
const updated=html.slice(0,start)+code+html.slice(end);
new vm.Script(updated.match(/<script>([\s\S]*)<\/script>/)[1]);
fs.writeFileSync(file,updated);
console.log('Updated only the picker loader in the authoritative standalone HTML.');
