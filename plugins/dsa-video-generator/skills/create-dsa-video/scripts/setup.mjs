import {cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, isAbsolute, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const position = process.argv.indexOf('--target');
const input = position < 0 ? undefined : process.argv[position + 1];
if (!input || !isAbsolute(input)) throw new Error('Pass --target with an absolute path for a new video workspace.');
if (Number(process.versions.node.split('.')[0]) < 22) throw new Error('Node.js 22+ is required.');
const target = resolve(input); const marker = join(target, '.dsa-video-generator.json');
if (existsSync(target) && readdirSync(target).length) {
  if (!existsSync(marker) || JSON.parse(readFileSync(marker, 'utf8')).product !== 'dsa-video-generator') throw new Error('Refusing to overwrite a non-empty unrelated folder. Choose a new subfolder.');
  console.log(`Reusing workspace without replacing authored files: ${target}`);
} else {
  mkdirSync(target, {recursive: true});
  cpSync(resolve(dirname(fileURLToPath(import.meta.url)), '../assets/starter'), target, {recursive: true, errorOnExist: true, force: false});
  writeFileSync(marker, JSON.stringify({product: 'dsa-video-generator', version: '1.0.0'}, null, 2));
}
if (!process.argv.includes('--skip-install')) {
  const args = [existsSync(join(target, 'package-lock.json')) ? 'ci' : 'install', '--no-audit', '--no-fund'];
  // Only fixed npm arguments enter the Windows shell; user paths are passed as cwd.
  const result = spawnSync('npm', args, {cwd: target, stdio: 'inherit', shell: process.platform === 'win32'});
  if (result.error || result.status !== 0) throw new Error('npm setup failed. Check Node/npm and network access, then rerun setup for this workspace.');
}
console.log(`Ready: ${target}\nRun node scripts/lab.mjs doctor, then node scripts/lab.mjs render --lesson two-sum`);
