import {existsSync,mkdirSync,readFileSync,writeFileSync,statSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {spawnSync,spawn} from 'node:child_process';
import {validate,cacheKey,wavSeconds,timeline} from './core.mjs';
const root=resolve(import.meta.dirname,'..');process.chdir(root);
const [command='doctor',...args]=process.argv.slice(2);
const flag=(name,fallback)=>{const i=args.indexOf('--'+name);return i<0?fallback:args[i+1];};
const run=(bin,argv,env=process.env)=>{const r=spawnSync(bin,argv,{encoding:'utf8',windowsHide:true,env});if(r.error||r.status!==0) throw Error(`${bin} failed: ${r.error?.message||r.stderr||r.stdout}`);return r.stdout.trim();};
const defaults={backend:process.platform==='win32'?'windows':process.platform==='darwin'?'mac':'espeak',voice:'',rate:0,volume:100,pause:1.2};
const settings={...defaults,...(existsSync('settings.json')?JSON.parse(readFileSync('settings.json','utf8')):{})};
const ps=join(root,'scripts/windows-voice.ps1');
// Execute fixed source as a command; never change machine execution policy.
const windowsVoice=(request)=>run('powershell.exe',['-NoProfile','-Command',`& { ${readFileSync(ps,'utf8')} } ${request?'-Request $env:LESSON_VOICE_REQUEST':'-List'}`],{...process.env,LESSON_VOICE_REQUEST:request||''});
function voices(){
 if(settings.backend==='silent') return ['silent (explicitly selected)'];
 if(settings.backend==='piper') return [settings.model||'Configure a local ONNX model'];
 if(process.platform==='win32') return JSON.parse(windowsVoice());
 if(process.platform==='darwin') return run('say',['-v','?']).split('\n');
 return run('espeak',['--voices']).split('\n');
}
function synthesize(segments){
 if(!segments.length||settings.backend==='silent')return;
 const request=join(root,'out/voice-request.json');writeFileSync(request,JSON.stringify({...settings,segments}));
 if(settings.backend==='windows'&&process.platform==='win32') windowsVoice(request);
 else if(settings.backend==='piper') {if(!settings.python||!existsSync(settings.model||'')||!existsSync(settings.model+'.json'))throw Error('Piper requires --python and --model with adjacent JSON');run(settings.python,[join(root,'scripts/piper_batch.py'),request]);}
 else if(settings.backend==='mac'&&process.platform==='darwin') for(const s of segments)run('say',[...(settings.voice?['-v',settings.voice]:[]),'-r',String(175+settings.rate*15),'--file-format=WAVE','--data-format=LEI16@22050','-o',s.output,s.text]);
 else if(settings.backend==='espeak') for(const s of segments)run('espeak',[...(settings.voice?['-v',settings.voice]:[]),'-s',String(175+settings.rate*15),'-a',String(settings.volume),'-w',s.output,'--',s.text]);
 else throw Error('Requested voice backend is unavailable on this platform');
}
function loadLesson(){const id=flag('lesson','knapsack-recursion');if(!/^[a-z0-9-]+$/.test(id))throw Error('Invalid lesson id');const l=validate(JSON.parse(readFileSync(join(root,'lessons',id+'.json'),'utf8')));if(l.id!==id)throw Error('Filename/id mismatch');return l;}
function prepare(){
 const lesson=loadLesson();const limit=flag('limit');if(limit){if(!/^\d+$/.test(limit)||Number(limit)<1)throw Error('Positive scene limit required');lesson.scenes=lesson.scenes.slice(0,Number(limit));}
 mkdirSync('public/narration',{recursive:true});mkdirSync('out',{recursive:true});
 const voiceSettings=Object.fromEntries(['backend','voice','rate','volume','python','model'].map(k=>[k,settings[k]]));
 if(settings.model&&existsSync(settings.model))voiceSettings.modelModified=statSync(settings.model).mtimeMs;
 const clips=lesson.scenes.map(s=>({text:s.narration,output:join(root,'public/narration',cacheKey(s.narration,voiceSettings)+'.wav')}));
 const pending=clips.filter(c=>!existsSync(c.output));synthesize(pending);
 const durations=clips.map(c=>settings.backend==='silent'?Math.max(3,c.text.split(/\s+/).length/2.4):wavSeconds(readFileSync(c.output)));
 const scenes=timeline(lesson.scenes,durations,settings.pause).map((s,i)=>({...s,audio:settings.backend==='silent'?null:'narration/'+clips[i].output.split(/[\\/]/).pop()}));
 const compiled={...lesson,fps:24,scenes,durationInFrames:scenes.at(-1).from+scenes.at(-1).durationInFrames};
 writeFileSync('public/compiled.json',JSON.stringify(compiled,null,2));
 writeFileSync(`out/${lesson.id}-transcript.md`,`# ${lesson.title}\n\n`+scenes.map(s=>`## ${s.title}\n\n${s.narration}\n`).join('\n'));
 writeFileSync(`out/${lesson.id}-chapters.json`,JSON.stringify(scenes.map(s=>({title:s.title,seconds:s.from/24})),null,2));
 console.log(`Prepared ${scenes.length} scenes, ${(compiled.durationInFrames/24).toFixed(1)} seconds, ${pending.length} uncached clips.`);return compiled;
}
try {
 if(command==='doctor') {console.log(`Node ${process.version}; platform ${process.platform}; backend ${settings.backend}`);console.log('Voices:',voices());console.log('Renderer:',existsSync('node_modules/remotion')?'installed':'missing: rerun setup');}
 else if(command==='voices') console.log(voices());
 else if(command==='configure') {for(const key of ['backend','voice','python','model'])if(flag(key)!==undefined)settings[key]=flag(key);for(const key of ['rate','volume','pause'])if(flag(key)!==undefined)settings[key]=Number(flag(key));if(!['windows','mac','espeak','piper','silent'].includes(settings.backend)||!Number.isFinite(settings.rate)||settings.rate< -5||settings.rate>5||!Number.isInteger(settings.rate)||!Number.isFinite(settings.volume)||settings.volume<0||settings.volume>100||!Number.isFinite(settings.pause)||settings.pause<0||settings.pause>4)throw Error('Invalid voice settings');writeFileSync('settings.json',JSON.stringify(settings,null,2));console.log(settings);}
 else if(command==='voice-sample') {mkdirSync('out',{recursive:true});if(settings.backend==='silent')throw Error('Silent mode has no voice sample');synthesize([{text:'One item. Two choices. Skip it, or take it if it fits. Each call returns the best reward.',output:join(root,'out/voice-sample.wav')}]);console.log(join(root,'out/voice-sample.wav'));}
 else if(command==='validate') {console.log(`Valid: ${loadLesson().id}`);}
 else if(command==='prepare')prepare();
 else if(['render','still','preview'].includes(command)) {
  if(command!=='preview')prepare();
  const cli=join(root,'node_modules/@remotion/cli/remotion-cli.js');
  const compiled=JSON.parse(readFileSync('public/compiled.json','utf8'));
  const output=join(root,'out',`${compiled.id||'lesson'}${flag('limit')?'-sample':''}.${command==='still'?'png':'mp4'}`);
  const quality=flag('quality','720');if(!['720','1080'].includes(quality))throw Error('Quality must be 720 or 1080');
  const port=flag('port','3021');if(!/^\d+$/.test(port)||Number(port)<1024||Number(port)>65535)throw Error('Invalid port');
  const frame=flag('frame','80');if(!/^\d+$/.test(frame)||Number(frame)>=compiled.durationInFrames)throw Error('Frame outside timeline');
  const argv=command==='preview'?['studio','src/index.ts','--no-open','--port',port]:[command,'src/index.ts','LessonVideo',output,...(command==='still'?['--frame',frame]:['--codec','h264','--pixel-format','yuv420p','--concurrency','2']),...(quality==='1080'?['--scale','1.5']:[])];
  const child=spawn(process.execPath,[cli,...argv],{stdio:'inherit',windowsHide:true});child.on('error',e=>{console.error(e);process.exitCode=1;});child.on('exit',code=>{process.exitCode=code??1;if(code===0&&command!=='preview')console.log(`Created ${output} (${statSync(output).size} bytes)`);});
 } else throw Error('Use doctor, voices, configure, voice-sample, validate, prepare, preview, still, or render');
}catch(e){console.error(e.message);process.exitCode=1;}
