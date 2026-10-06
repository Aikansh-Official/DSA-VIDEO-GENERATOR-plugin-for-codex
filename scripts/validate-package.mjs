import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {resolve,relative,join} from 'node:path';
import {spawnSync} from 'node:child_process';
const root=resolve(import.meta.dirname,'..');
const plugin=join(root,'plugins/dsa-video-generator');
const manifest=JSON.parse(readFileSync(join(plugin,'plugin.json'),'utf8'));
assert.equal(manifest.name,'dsa-video-generator');
assert.match(manifest.version,/^\d+\.\d+\.\d+$/);
const meta=manifest.extensions['com.openai'].interface;
assert(meta.displayName.length<=30&&meta.shortDescription.length<=30&&meta.longDescription.length<=4000);
for(const p of [meta.logo,meta.composerIcon,...meta.screenshots,manifest.extensions['com.openai'].onboardingSkill]){
 const absolute=resolve(plugin,p);assert(!relative(plugin,absolute).startsWith('..'));assert(existsSync(absolute),p);
}
const market=JSON.parse(readFileSync(join(root,'.agents/plugins/marketplace.json'),'utf8'));
assert.equal(resolve(root,market.plugins[0].source.path),plugin);
function inspect(dir){for(const file of readdirSync(dir,{withFileTypes:true})){const p=join(dir,file.name);if(file.isDirectory()){assert(!['node_modules','.git','.venv','out'].includes(file.name),p);inspect(p);}else {assert(!/\.(wav|mp4|onnx)$|^\.env/.test(file.name),p);if(/\.(md|json|ts|tsx|mjs|ps1|py)$/.test(file.name))assert(!/[CD]:\\Users\\|D:\\dsa video/.test(readFileSync(p,'utf8')),'Machine-specific path: '+p);}}}
inspect(plugin);
const skill=readFileSync(join(plugin,'skills/create-dsa-video/SKILL.md'),'utf8');
assert.match(skill,/^---\r?\nname: create-dsa-video\r?\ndescription:/);
const refusal=spawnSync(process.execPath,[join(plugin,'skills/create-dsa-video/scripts/setup.mjs'),'--target',root,'--skip-install'],{encoding:'utf8'});
assert.notEqual(refusal.status,0);assert.match(refusal.stderr,/Refusing to overwrite/);
console.log('PASS: manifest, assets, marketplace path, portable bundle, skill frontmatter and nonempty-directory protection');
