// Optional personal discovery registration. Run only when you want this source in all local projects.
import {homedir} from 'node:os';
import {mkdirSync,readFileSync,writeFileSync,existsSync,copyFileSync} from 'node:fs';
import {join} from 'node:path';
const folder=join(homedir(),'.agents/plugins');
const file=join(folder,'marketplace.json');
mkdirSync(folder,{recursive:true});
const prior=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{name:'personal',interface:{displayName:'Personal plugins'},plugins:[]};
if(!Array.isArray(prior.plugins))throw new Error('Existing marketplace is not a supported catalog; no changes made');
if(prior.plugins.some(p=>p.name==='dsa-video-generator'))throw new Error('DSA Video Generator already has an entry; review that entry before changing it');
if(existsSync(file))copyFileSync(file,file+'.backup-'+Date.now());
prior.plugins.push({name:'dsa-video-generator',source:{source:'git-subdir',url:'https://github.com/Aikansh-Official/DSA-VIDEO-GENERATOR-plugin-for-codex.git',path:'./plugins/dsa-video-generator',ref:'v1.0.0'},policy:{installation:'AVAILABLE',authentication:'ON_INSTALL'},category:'Developer Tools'});
writeFileSync(file,JSON.stringify(prior,null,2)+'\n');
console.log('Registered personal marketplace entry. Restart the desktop app, then install DSA Video Generator from your personal plugin source. '+file);
