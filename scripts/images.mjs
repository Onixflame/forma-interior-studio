import {readFile,stat} from 'node:fs/promises';
import {join} from 'node:path';

const manifest=JSON.parse(await readFile('manifest.json','utf8'));
const widths=[480,768,1024,1536];
const force=process.env.REBUILD_IMAGES==='1';
let sharp;
let generated=0;
let reused=0;

for(const asset of manifest){
  const source=join('public',asset.src);
  const targets=widths.map(width=>({width,target:source.replace(/\.png$/,`-${width}.webp`)}));
  const missing=[];
  for(const item of targets){
    try{await stat(item.target);if(force)missing.push(item);}catch{missing.push(item);}
  }
  if(!missing.length){reused+=targets.length;continue;}
  sharp??=(await import('sharp')).default;
  for(const {width,target} of missing){
    await sharp(source).resize({width,withoutEnlargement:true}).webp({quality:82,effort:5}).toFile(target);
    generated++;
  }
  reused+=targets.length-missing.length;
}
console.log(`Responsive images ready: ${generated} generated, ${reused} reused. Original PNG files preserved.`);
