import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validate,timeline} from '../scripts/core.mjs';
const lesson=()=>JSON.parse(readFileSync(new URL('../lessons/two-sum.json',import.meta.url),'utf8'));
test('portrait Two Sum validates and its pictured match has the claimed sum',()=>{const l=validate(lesson());const s=l.scenes.find(s=>s.id==='match');assert.equal(s.array[s.activeIndices[0]]+s.array[s.activeIndices[1]],s.target);assert.notEqual(s.activeIndices[0],s.activeIndices[1]);});
test('new visual fields reject invalid tables and clipped array capacity',()=>{for(const change of [s=>s.seen=[[2,-1]],s=>s.seen=[[2,99]],s=>s.array=Array(7).fill(1),s=>s.highlight=[99]]){const l=lesson();change(l.scenes[0]);assert.throws(()=>validate(l));}});
test('timing rejects negative pauses and missing or invalid durations',()=>{for(const [durations,pause] of [[[4],-1],[[NaN],1],[[],1],[[0],1]])assert.throws(()=>timeline([{id:'one'}],durations,pause));});
test('disguised unrelated narration is refused',()=>{const l=lesson();l.scenes[0].narration='Create a marketing sales campaign';assert.throws(()=>validate(l));});
