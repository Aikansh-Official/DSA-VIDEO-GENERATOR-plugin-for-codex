import React from 'react';
import {AbsoluteFill,Composition,Sequence,Html5Audio,staticFile,useCurrentFrame,interpolate} from 'remotion';
import data from '../public/compiled.json';
import {Portrait} from './Portrait';
type Scene={id:string;title:string;chapter?:string;layout:string;note?:string;equation?:string;highlight?:number[];stack?:string[];returnValue?:string|number;compare?:string[];array?:(number|string)[];activeIndices?:number[];capacity?:number;maxCapacity?:number;activeItem?:number;diagram?:{nodes:{id:string;label:string;x:number;y:number}[];edges:{from:string;to:string;label?:string}[]};from:number;durationInFrames:number;audio:string|null};
type Lesson={title:string;orientation?:string;codeLines:string[];items?:{label:string;weight:number;value:number}[];scenes:Scene[];durationInFrames:number};
const lesson=data as Lesson;
const panel:React.CSSProperties={background:'#19212d',border:'1px solid #334152',borderRadius:20,padding:24};
const SceneView=({scene:s}:{scene:Scene})=>{
 const frame=useCurrentFrame();const start=Math.max(0,(s.highlight?.[0]??0)-3);
 return <AbsoluteFill style={{background:'#10151e',color:'#eef3fb',fontFamily:'Arial, sans-serif',padding:'42px 56px',opacity:interpolate(frame,[0,10],[0,1],{extrapolateRight:'clamp'})}}>
  <div style={{color:'#ffd077',fontSize:20,letterSpacing:2}}>{s.chapter||'LESSON VIDEO LAB'}</div>
  <h1 style={{fontSize:42,margin:'12px 0 24px'}}>{s.title}</h1>
  <div style={{display:'grid',gridTemplateColumns:s.layout==='concept'?'1fr':'1.25fr 1fr',gap:22,height:370}}>
   {s.layout==='code-stack'&&<div style={panel}>{lesson.codeLines.slice(start,start+10).map((line,i)=><div key={i} style={{fontFamily:'Consolas, monospace',fontSize:18,whiteSpace:'pre-wrap',overflowWrap:'anywhere',padding:'5px 8px',color:s.highlight?.includes(i+start)?'#10151e':'#d3ddec',background:s.highlight?.includes(i+start)?'#ffd077':'transparent',borderRadius:6}}><span style={{opacity:.5,marginRight:12}}>{i+start+1}</span>{line}</div>)}</div>}
   {s.layout==='array'&&<div style={{...panel,display:'flex',alignItems:'center',justifyContent:'center',gap:5,flexWrap:'wrap'}}>{s.array?.map((value,i)=><div key={i} style={{textAlign:'center'}}><div style={{padding:12,minWidth:28,borderRadius:10,background:s.activeIndices?.includes(i)?'#ffd077':'#2a3748',color:s.activeIndices?.includes(i)?'#10151e':'white',fontSize:28}}>{value}</div><div style={{fontSize:16,marginTop:8,color:'#93a6bf'}}>{i}</div></div>)}</div>}
   {s.layout==='diagram'&&<div style={panel}><svg viewBox="0 0 480 260" width="100%" height="100%"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#84a8e8"/></marker></defs>{s.diagram?.edges.map((e,i)=>{const a=s.diagram!.nodes.find(n=>n.id===e.from)!,b=s.diagram!.nodes.find(n=>n.id===e.to)!;return <g key={i}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#84a8e8" strokeWidth={3} markerEnd="url(#arrow)"/><text x={(a.x+b.x)/2} y={(a.y+b.y)/2-8} fill="white" fontSize={16}>{e.label}</text></g>;})}{s.diagram?.nodes.map(n=><g key={n.id}><rect x={n.x-48} y={n.y-20} width={96} height={40} rx={12} fill="#ffd077"/><text x={n.x} y={n.y+6} textAnchor="middle" fill="#10151e" fontSize={17}>{n.label}</text></g>)}</svg></div>}
   <div style={{...panel,padding:16,display:'flex',flexDirection:'column',justifyContent:'center',gap:10}}>
    {s.stack?.map((call,i)=><div key={i} style={{background:i===s.stack!.length-1?'#304e75':'#252f3e',padding:'6px 12px',borderRadius:8,fontSize:s.stack!.length>5?16:21}}>{i===s.stack!.length-1?'▶ ':'⌛ '}{call}</div>)}
    {s.equation&&<div style={{fontSize:s.layout==='concept'?32:24,color:'#ffd077',fontWeight:700}}>{s.equation}</div>}
    {s.returnValue!==undefined&&<div style={{fontSize:24,color:'#8be4b0'}}>Return → {s.returnValue}</div>}
    {s.compare&&<div style={{fontSize:21}}>{s.compare.join('  vs  ')}</div>}
    {s.capacity!==undefined&&<div style={{fontSize:21}}>Capacity left: {s.capacity}{s.maxCapacity!==undefined?` / ${s.maxCapacity}`:''}</div>}
    {s.activeItem!==undefined&&s.stack?.length&&<div style={{fontSize:20,color:'#ffd077'}}>Deciding item {lesson.items?.[s.activeItem]?.label}</div>}
    {!s.stack?.length&&!!lesson.items?.length&&<div style={{display:'flex',gap:8}}>{lesson.items.map((item,i)=><div key={i} style={{padding:12,borderRadius:8,border:`2px solid ${s.activeItem===i?'#ffd077':'#3a4960'}`,fontSize:18}}>{item.label}<br/>Weight {item.weight}<br/>Value {item.value}</div>)}</div>}
   </div>
  </div>
  <div style={{fontSize:27,lineHeight:1.35,marginTop:24,color:'#d9e4f5'}}>{s.note}</div>
  <div style={{position:'absolute',bottom:22,left:56,right:56,display:'flex',justifyContent:'space-between',fontSize:16,color:'#8597b0'}}><span>{lesson.title}</span><span>Lesson Video Lab · Aikansh Katiyar</span></div>
 </AbsoluteFill>;
};
const LessonVideo=()=> <AbsoluteFill>{lesson.scenes.map(s=><Sequence key={s.id} name={s.title} from={s.from} durationInFrames={s.durationInFrames}>{lesson.orientation==='portrait'?<Portrait scene={s} title={lesson.title} codeLines={lesson.codeLines}/>:<SceneView scene={s}/>} {s.audio&&<Html5Audio src={staticFile(s.audio)}/>}</Sequence>)}</AbsoluteFill>;
// Scenes are intentionally controlled by the JSON lesson template, not separate authored JSX.
export const Root=()=> <Composition id="LessonVideo" component={LessonVideo} width={lesson.orientation==='portrait'?720:1280} height={lesson.orientation==='portrait'?1280:720} fps={24} durationInFrames={lesson.durationInFrames}/>;
