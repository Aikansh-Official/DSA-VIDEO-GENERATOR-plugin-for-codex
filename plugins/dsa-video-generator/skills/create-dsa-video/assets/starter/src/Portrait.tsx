import React from 'react';
import {AbsoluteFill,useCurrentFrame,interpolate} from 'remotion';
export type VisualScene={title:string;chapter?:string;array?:(number|string)[];target?:number;activeIndices?:number[];seen?:[number,number][];success?:boolean;codeLines?:string[];highlight?:number[];equation?:string;note?:string;durationInFrames:number};
const blue='#7aa2ff',gold='#ffd36b',green='#60ddb0';
export const Portrait=({scene:s,title,codeLines}:{scene:VisualScene;title:string;codeLines:string[]})=>{
 const f=useCurrentFrame(),code=s.codeLines??codeLines;
 const start=Math.max(0,(s.highlight?.[0]??0)-4);
 return <AbsoluteFill style={{background:'#0c1017',color:'#f5f7ff',fontFamily:'Georgia, serif',padding:'58px 44px'}}>
  <div style={{fontSize:25,color:blue,textAlign:'center',fontWeight:700}}>{title}</div>
  <div style={{fontSize:17,color:'#9ba7bb',letterSpacing:2,marginTop:38}}>{s.chapter}</div>
  <h1 style={{fontSize:38,lineHeight:1.22,height:110,margin:'16px 0 20px'}}>{s.title}</h1>
  <div style={{height:510}}>
   {code.length>0 ? <div style={{height:480,padding:'20px 10px',border:`1px solid ${blue}`,borderRadius:16,background:'#121c2c'}}>{code.slice(start,start+12).map((line,i)=><div key={i} style={{fontFamily:'Consolas, monospace',fontSize:17,lineHeight:'36px',whiteSpace:'pre-wrap',overflowWrap:'anywhere',background:s.highlight?.includes(i+start)?'#443719':'transparent',color:s.highlight?.includes(i+start)?gold:'#eff4ff'}}>{line}</div>)}</div> : <>
    {s.target!==undefined&&<div style={{textAlign:'center',marginBottom:40}}><span style={{display:'inline-block',padding:'14px 28px',border:`2px solid ${gold}`,borderRadius:20,fontSize:33,color:gold}}>target = {s.target}</span></div>}
    {s.array&&<div style={{display:'flex',justifyContent:'center',gap:12,marginBottom:48}}>{s.array.map((v,i)=><div key={i} style={{textAlign:'center'}}><div style={{width:s.array!.length>4?82:100,height:100,display:'grid',placeItems:'center',fontSize:38,fontFamily:'Arial',fontWeight:700,border:`3px solid ${s.activeIndices?.includes(i)?s.success?green:gold:blue}`,borderRadius:16,background:'#152036',scale:s.activeIndices?.includes(i)?interpolate(f,[0,12],[.95,1],{extrapolateRight:'clamp'}):1}}>{v}</div><div style={{fontSize:23,color:'#9ba7bb',marginTop:10}}>{i}</div></div>)}</div>}
    {s.seen&&<div style={{border:`2px solid ${blue}`,borderRadius:18,padding:18,margin:'0 30px'}}><div style={{fontSize:25,color:blue}}>seen</div><div style={{display:'flex',justifyContent:'space-around',fontSize:22,color:'#9ba7bb',padding:10,borderBottom:'1px solid #485265'}}><span>number</span><span>index</span></div>{s.seen.length?s.seen.map(([v,i],row)=><div key={row} style={{display:'flex',justifyContent:'space-around',fontSize:27,padding:8,opacity:interpolate(f,[row*4,row*4+12],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}><span>{v}</span><span>{i}</span></div>):<div style={{textAlign:'center',padding:20,color:'#9ba7bb'}}>empty</div>}</div>}
    {!s.array&&!s.seen&&<div style={{fontSize:66,color:blue,textAlign:'center',paddingTop:110,lineHeight:1.3}}>{s.equation}</div>}
   </>}
  </div>
  {(s.array||s.seen||code.length>0)&&<div style={{padding:'22px 10px',marginTop:30,fontSize:29,lineHeight:1.5,textAlign:'center',color:s.success?green:gold,borderTop:'1px solid #334159',whiteSpace:'pre-line'}}>{s.equation}</div>}
  <div style={{fontSize:24,lineHeight:1.5,textAlign:'center',color:'#b7c1d2',marginTop:25}}>{s.note}</div>
  <div style={{position:'absolute',left:44,bottom:32,color:'#78869b',fontSize:15}}>DSA Video Generator · Aikansh Katiyar</div>
  <div style={{position:'absolute',bottom:0,left:0,height:4,background:blue,width:`${interpolate(f,[0,s.durationInFrames],[0,100],{extrapolateRight:'clamp'})}%`}}/>
 </AbsoluteFill>;
};
