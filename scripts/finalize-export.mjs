import {readdir,readFile,writeFile,stat} from 'node:fs/promises';
import {join} from 'node:path';
// A shared root layout preserves in-memory form data across locale navigation.
// Set each exported document's initial lang before it reaches a browser.
async function walk(dir,locale){for(const name of await readdir(dir)){const path=join(dir,name);if((await stat(path)).isDirectory())await walk(path,locale);else if(name.endsWith('.html')){let html=await readFile(path,'utf8');html=html.replace(/<html([^>]*?) lang="[^"]*"/,`<html$1 lang="${locale}"`);await writeFile(path,html);}}}
for(const locale of ['en','cs','ru'])await walk(join('out',locale),locale);
const files=[];async function inventory(dir){for(const name of await readdir(dir)){const path=join(dir,name);const info=await stat(path);if(info.isDirectory())await inventory(path);else files.push({path,bytes:info.size});}}await inventory('out');
if(files.some(f=>f.bytes>25*1024*1024))throw new Error('A file exceeds the Cloudflare Pages 25 MiB per-file limit.');
if(files.length>1000)throw new Error('Direct Upload dashboard file count exceeds 1,000.');
console.log(`Static export ready: ${files.length} files, ${(files.reduce((n,f)=>n+f.bytes,0)/1024/1024).toFixed(1)} MiB. No runtime server needed.`);
