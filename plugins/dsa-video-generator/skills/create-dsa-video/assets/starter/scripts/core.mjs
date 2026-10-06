import {createHash} from 'node:crypto';
export function validate(lesson) {
  if (lesson.version !== 1 || !/^[a-z0-9-]+$/.test(lesson.id)) throw Error('Invalid version or lesson id');
  if (!['dsa','algorithms','computer-science','mathematics','physics'].includes(lesson.domain)) throw Error('Unsupported educational domain');
  if (lesson.orientation!==undefined && !['portrait','landscape'].includes(lesson.orientation)) throw Error('Invalid orientation');
  if (/(marketing|political campaign|medical advice|financial advice|casino|entertainment)/i.test([lesson.title,lesson.topic,...(lesson.scenes??[]).map(s=>s.narration)].join(' '))) throw Error('Out-of-scope lesson content');
  if (!lesson.title || !Array.isArray(lesson.codeLines) || !lesson.codeLines.every(x=>typeof x==='string') || !Array.isArray(lesson.scenes) || !lesson.scenes.length) throw Error('Missing title, codeLines, or scenes');
  const ids = new Set();
  for (const s of lesson.scenes) {
    if (typeof s.id!=='string' || !/^[a-z0-9-]+$/.test(s.id) || ids.has(s.id)) throw Error('Scene IDs must be unique safe identifiers'); ids.add(s.id);
    if (!['code-stack','concept','array','diagram','visual'].includes(s.layout) || !s.title || typeof s.narration!=='string' || !s.narration.trim()) throw Error('Invalid scene layout/title/narration');
    if(s.layout==='visual' && lesson.orientation!=='portrait') throw Error('Visual layout requires portrait orientation');
    if(s.codeLines && (!Array.isArray(s.codeLines)||s.codeLines.some(x=>typeof x!=='string'))) throw Error('Invalid scene code');
    if (s.highlight?.some(x=>!Number.isInteger(x)||x<0||x>=(s.codeLines??lesson.codeLines).length)) throw Error('Highlight outside code');
    if (s.seen && (!Array.isArray(s.seen)||s.seen.length>4||s.seen.some(row=>!Array.isArray(row)||row.length!==2||!Number.isFinite(row[0])||!Number.isInteger(row[1])||row[1]<0||(s.array&&row[1]>=s.array.length)))) throw Error('Invalid seen table');
    if (lesson.orientation==='portrait' && s.array?.length>6) throw Error('Portrait supports up to six cells');
    if (s.stack && (!Array.isArray(s.stack)||s.stack.length>8)) throw Error('Stack must contain at most eight frames');
    if (s.array && (!Array.isArray(s.array)||s.array.length>12)) throw Error('Array display supports at most twelve cells');
    if (s.activeIndices?.some(x=>!Number.isInteger(x)||x<0||x>=(s.array?.length??0))) throw Error('Array index outside bounds');
    if (s.diagram) {
      const {nodes,edges}=s.diagram; if (!Array.isArray(nodes)||!Array.isArray(edges)||nodes.length>12||edges.length>20) throw Error('Invalid diagram');
      const nodeIds=new Set(nodes.map(n=>n.id));
      if(nodeIds.size!==nodes.length||nodes.some(n=>!n.label||!Number.isFinite(n.x)||!Number.isFinite(n.y)||n.x<55||n.x>425||n.y<25||n.y>235)||edges.some(e=>!nodeIds.has(e.from)||!nodeIds.has(e.to))) throw Error('Invalid diagram coordinates/connections');
    }
  }
  if ((lesson.items?.length??0)>5) throw Error('Item display supports at most five items');
  return lesson;
}
export function cacheKey(text,settings) {return createHash('sha256').update(JSON.stringify({text,settings,platform:process.platform})).digest('hex');}
export function wavSeconds(buffer) {
  if(buffer.toString('ascii',0,4)!=='RIFF'||buffer.toString('ascii',8,12)!=='WAVE') throw Error('Expected RIFF WAV');
  let rate=0,size=0;
  for(let i=12;i+8<=buffer.length;) {const kind=buffer.toString('ascii',i,i+4),n=buffer.readUInt32LE(i+4);if(i+8+n>buffer.length) throw Error('Truncated WAV');if(kind==='fmt ') rate=buffer.readUInt32LE(i+16);if(kind==='data') size+=n;i+=8+n+(n%2);}
  if(!rate||!size) throw Error('Empty WAV');return size/rate;
}
export function timeline(scenes,durations,pause,fps=24) {
  if(scenes.length!==durations.length||!Number.isFinite(pause)||pause<0||!Number.isFinite(fps)||fps<=0||durations.some(d=>!Number.isFinite(d)||d<=0)) throw Error('Invalid narration timing');
  let cursor=0;return scenes.map((s,i)=>{const durationInFrames=Math.max(fps*3,Math.ceil((durations[i]+pause)*fps));const result={...s,from:cursor,durationInFrames};cursor+=durationInFrames;return result;});
}
