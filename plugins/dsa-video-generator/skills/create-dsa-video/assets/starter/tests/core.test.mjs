import test from 'node:test';
import assert from 'node:assert/strict';
import {validate,timeline,cacheKey,wavSeconds} from '../scripts/core.mjs';
import {knapsackExample} from '../scripts/build-example.mjs';
test('example enumerates exact DFS calls and returns the independently enumerated optimum',()=>{
 const l=validate(knapsackExample());let optimum=0;
 for(let mask=0;mask<8;mask++){let w=0,v=0;for(let i=0;i<3;i++)if(mask&(1<<i)){w+=l.items[i].weight;v+=l.items[i].value;}if(w<=4)optimum=Math.max(optimum,v);}
 assert.equal(l.result,optimum);assert.equal(optimum,18);
 assert.deepEqual(l.calls,[[2,4],[1,4],[0,4],[-1,4],[-1,3],[0,2],[-1,2],[-1,1],[1,1],[0,1],[-1,1],[-1,0]]);
});
test('timeline has no overlap and leaves room for speech plus pause',()=>{const t=timeline([{id:'a'},{id:'b'}],[4.01,2],1.2);assert.equal(t[0].from,0);assert.equal(t[1].from,t[0].durationInFrames);assert.ok(t[0].durationInFrames/24>=5.21);});
test('cache changes with speech and voice but not visuals',()=>{assert.equal(cacheKey('hi',{voice:'a'}),cacheKey('hi',{voice:'a'}));assert.notEqual(cacheKey('hi',{voice:'a'}),cacheKey('hi',{voice:'b'}));assert.notEqual(cacheKey('hi',{}),cacheKey('bye',{}));});
test('validator rejects foreign scope, duplicate scenes, invalid indices and edges',()=>{for(const mutate of [l=>l.domain='entertainment',l=>l.scenes.push(l.scenes[0]),l=>l.scenes[0].highlight=[99],l=>l.scenes[0].diagram={nodes:[],edges:[{from:'a',to:'b'}]}]){const l=knapsackExample();mutate(l);assert.throws(()=>validate(l));}});
test('WAV parser handles odd padding and detects truncation',()=>{const b=Buffer.alloc(48);b.write('RIFF');b.writeUInt32LE(40,4);b.write('WAVE',8);b.write('fmt ',12);b.writeUInt32LE(16,16);b.writeUInt32LE(4,28);b.write('data',36);b.writeUInt32LE(4,40);assert.equal(wavSeconds(b),1);assert.throws(()=>wavSeconds(b.subarray(0,46)));});
