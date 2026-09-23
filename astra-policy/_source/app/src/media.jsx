import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
import {useCopy,useText,useLanguage} from './i18n.jsx';
import {viewHref} from './site.js';
import {Toggle,number} from './ui.jsx';

const MediaContext=createContext(()=>{});
export const useOpenMedia=()=>useContext(MediaContext);

// How each recording family was rendered; shown under the player.
const playbackNotes={
 'robodojo-excerpt':['Excerpt at simulation speed, 25 control steps per second; model waiting is omitted. The full trajectory is available through the paired-comparison link.','按仿真原速播放的轨迹节选，每秒 25 个控制步，省略模型等待；配对对照链接可查看完整轨迹。'],
 humanoidbench:['Simulation-time replay of a held-out evaluation episode; model waiting is omitted.','留出评测 episode 的仿真时间回放，省略模型等待。'],
 'ego-navigation':['Replay at simulation speed, with model waiting omitted.','按仿真原速回放，省略模型等待时间。'],
 's0-continuation':['Simulation-time replay; model waiting is omitted. The red-banner tail restores the terminal state and holds the last target with no new Astra calls. It is excluded from evaluation.','按仿真时间回放，省略模型等待。红条后段从终止状态保持最后目标续演，无新 Astra 调用，不计入评测。'],
 s0:['Simulation-time replay with inference waiting omitted. Native termination and any later diagnostic footage are identified in the caption.','按仿真时间回放，省略推理等待；原生终止时刻及之后的诊断片段见说明。'],
 'dex-s0':['Synchronized Astra / RL comparison in simulation time, with model waiting omitted. Each evaluated trajectory ends at its recorded termination; the comparison holds its last frame while the other continues.','按仿真时间同步展示 Astra／RL，省略模型等待。各评测轨迹截至各自记录的终止时刻；先结束的一组保持末帧，另一组继续播放。'],
 dexterous:['Simulation-time replay with model waiting omitted. Astra clips hold the final frame for 1.5 s.','按仿真时间回放，省略模型等待；Astra 录像末尾定格 1.5 秒。'],
 'dex-s1-rerender':['Re-rendering of a recorded evaluation trajectory from stored robot and object states.','根据已记录的机器人与物体状态重新渲染评测轨迹。'],
 'dex-s1-hybrid':['Recorded hybrid rollout with head and wrist views; the dashboard displays policy proposals and Astra interventions.','组合策略的头部与手腕视角回放；仪表盘展示策略提议与 Astra 干预。'],
 'nav-primitives':['Source playback: 10 recorded actions/s. Model waiting is omitted. Maps are evaluator-only.','源视频每秒播放 10 个记录动作，省略模型等待；地图仅用于评测后展示。'],
 robocasa:['Source playback: 4× simulator time; model waiting is omitted. Comparisons align simulator time and hold terminal frames. Auxiliary views may hold their last observation. File playback at 1× retains this source acceleration.','源视频为仿真时间 4 倍速，省略模型等待。对照按仿真时间对齐，结束后保持末帧；辅助视角可能保持最近观测。文件以 1× 播放时仍保留上述加速。']
 ,'qwen38-pi05':['Controller-generated debug rollout from the supplementary Qwen3.8-max + π₀.₅ batch. The exported file preserves the batch render and is provided for qualitative inspection.','补充 Qwen3.8-max + π₀.₅ 批次生成的控制器 debug 回放。导出文件保留该批次的渲染结果，用于定性检查。']
};
const modeName=mode=>mode==='pi05_only'?'π₀.₅':mode==='direct'?'Astra':'Astra + π₀.₅';
const sourceFor=(clip,view)=>view==='ego'?clip.ego:view==='comparison'?clip.comparison:clip.video;

function ClipCaption({value,className=''}){
 const c=useCopy();
 const [description,record,score]=value.split(' | ');
 if(!record)return <p className={className}>{value}</p>;
 const trial=record.match(/^Trial (\d+)$/);
 const hundredScale=score?.includes('0–100');
 return <div className={'clip-caption '+className}><p>{description}</p><dl className="clip-meta">
  {score&&<div><dt>{hundredScale?c('Score (0–100)','Score（0–100）'):c('Native Score (0–1)','原生 Score（0–1）')}</dt><dd>{score.split(/[:：]/).at(-1).trim()}</dd></div>}
  <div><dt>{trial?c('Trial','试次'):c('Run ID','运行 ID')}</dt><dd>{trial?trial[1]:record}</dd></div>
 </dl></div>;
}

export function MediaProvider({children}){
 const c=useCopy(),text=useText(),{language}=useLanguage();
 const [clip,setClip]=useState(null),[view,setView]=useState('observer'),[speed,setSpeed]=useState(1),[error,setError]=useState(false);
 const dialog=useRef(null),player=useRef(null),position=useRef(0),returnFocus=useRef(null);
 const open=video=>{returnFocus.current=document.activeElement;position.current=0;setView(video.initialView||'observer');setSpeed(1);setError(false);setClip(video);};
 useEffect(()=>{
  if(!clip)return;
  dialog.current.showModal();
  const previous=document.body.style.overflow;document.body.style.overflow='hidden';
  return ()=>{document.body.style.overflow=previous;};
 },[clip]);
 const close=()=>{player.current?.pause();dialog.current?.close();};
 const onClose=()=>{player.current?.pause();setClip(null);returnFocus.current?.focus?.();};
 const changeView=next=>{position.current=player.current?.currentTime||0;setError(false);setView(next);};
 const changeSpeed=value=>{setSpeed(value);if(player.current)player.current.playbackRate=value;};
 const source=clip&&sourceFor(clip,view);
 const note=clip?.playback&&playbackNotes[clip.playback];
 return <MediaContext.Provider value={open}>{children}
  <dialog ref={dialog} className="media-dialog" aria-labelledby="media-dialog-title" onClose={onClose} onClick={e=>{if(e.target===dialog.current)close();}}>
   {clip&&<div className="media-dialog-body">
    <header><div><span className="eyebrow">{clip.benchmark||c('Rollout video','轨迹视频')}</span><h2 id="media-dialog-title">{text(clip.title)}</h2></div>
     <button className="media-close" type="button" onClick={close} aria-label={c('Close video','关闭视频')}><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg></button></header>
    <div className="media-stage"><video ref={player} key={clip.id+'-'+view} src={source} controls autoPlay muted playsInline onError={()=>setError(true)}
     onLoadedMetadata={e=>{e.currentTarget.currentTime=Math.min(position.current,e.currentTarget.duration||0);e.currentTarget.playbackRate=speed;}}/></div>
    {error&&<p className="media-error" role="alert">{c('This video could not be played. Use the download link to open the original file.','此视频暂时无法播放，可通过下载链接打开原文件。')}</p>}
    <div className="media-tools">
     {clip.ego&&<Toggle label={c('Camera view','相机视角')} value={view} onChange={changeView} options={[['observer',c('Observer','第三人称')],['ego',c('Robot view','机器人视角')]]}/>}
     {clip.comparison&&<Toggle label={c('Comparison view','对照视图')} value={view} onChange={changeView} options={[['observer',clip.mode==='direct'?'Astra':'Astra + π₀.₅'],['comparison',c('Three-way comparison','三组对照')]]}/>}
     <div className="toggle" role="group" aria-label={c('File playback speed','文件播放速度')}>{[.5,1,2,4].map(x=><button type="button" key={x} aria-pressed={speed===x} onClick={()=>changeSpeed(x)}>{x}×</button>)}</div>
     <span className="media-tools-links"><a href={source} download>{c('Download','下载')} ↓</a>{clip.paired&&<a href={viewHref('gallery',language,{q:clip.paired})}>{c('Paired comparison','配对对照')} ↗</a>}</span>
    </div>
    <div className="media-text">
     <ClipCaption className="media-caption" value={text(clip.caption)}/>
     {clip.outcomes&&<div className="media-outcomes">{clip.outcomes.map(r=><div key={r.mode} className={r.mode===clip.selectedMode?'is-selected':undefined}><b>{modeName(r.mode)}</b><span>{r.success?c('Success','成功'):c('Failure','失败')} · {number(r.steps)} {c('steps','步')}</span></div>)}</div>}
     {note&&<p className="media-note">{c(...note)}</p>}
     {clip.instruction&&<details className="media-instruction"><summary>{c('Original task instruction','原始任务指令')}</summary><p>{clip.instruction}</p></details>}
    </div>
   </div>}
  </dialog>
 </MediaContext.Provider>;
}

export function MediaCard({clip,compact=false,previewTitle}){
 const c=useCopy(),text=useText(),open=useOpenMedia();
 if(!clip)return null;
 const comparison=clip.initialView==='comparison'&&clip.comparison;
 const duration=Math.round((comparison?clip.comparisonDuration:clip.duration)||clip.duration||0);
 const time=Math.floor(duration/60)+':'+String(duration%60).padStart(2,'0');
 const status=comparison?c('Three-way','三组对照'):clip.outcome==='success'?(clip.domain==='navigation'?c('Arrival','到达'):c('Success','成功')):clip.outcome==='failure'?c('Failure','失败'):c('Demonstration','演示');
 return <figure className={'video'+(compact?' is-compact':'')}>
  <button type="button" className="video-preview" onClick={()=>open(clip)} aria-label={c('Play: ','播放：')+text(clip.title)}>
   <img src={comparison&&clip.comparisonPoster?clip.comparisonPoster:clip.poster} alt="" loading="lazy" width={clip.width||960} height={clip.height||540}/>
   <span className="video-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5v14l11-7Z" fill="currentColor"/></svg></span>
   <span className="video-time">{time}</span>
   {(clip.ego||clip.comparison)&&<span className="video-views">{clip.comparison?c('3 conditions','三种条件'):c('2 views','双视角')}</span>}
  </button>
  <figcaption>
   <div className="video-title"><strong>{previewTitle||text(clip.title)}</strong><span className={'outcome is-'+(comparison?'comparison':clip.outcome)}>{clip.statusLabel?text(clip.statusLabel):status}</span></div>
   {!compact&&<ClipCaption value={text(clip.caption)}/>}
  </figcaption>
 </figure>;
}

export function ImageFigure({src,mobileSrc,alt,caption}){
 return <figure className="image">
  <a href={src} target="_blank" rel="noreferrer">
   {mobileSrc?<picture><source media="(max-width: 600px)" srcSet={mobileSrc}/><img src={src} alt={alt} loading="lazy"/></picture>:<img src={src} alt={alt} loading="lazy"/>}
  </a>
  {caption&&<figcaption>{caption}</figcaption>}
 </figure>;
}
