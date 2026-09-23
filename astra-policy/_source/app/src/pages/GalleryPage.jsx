import React,{useEffect,useMemo,useRef,useState} from 'react';
import {useCopy,useLanguage} from '../i18n.jsx';
import {MediaCard} from '../media.jsx';
import {Note} from '../ui.jsx';
import {useEntrance} from '../motion.js';
import {viewHref} from '../site.js';
import {galleryVideos,settings,levels,methods,defaultFilters,parseGalleryFilters,galleryURL,matchesGallery,galleryClip} from '../data/gallery.js';

const PAGE=18;

function FilterRow({label,name,options,value,onChange}){
 const c=useCopy();
 return <div className="filter-row"><span className="eyebrow" id={'gallery-'+name}>{label}</span>
  <div className="chips" role="group" aria-labelledby={'gallery-'+name}>
   {options.map(([id,en,zh])=><button key={id} type="button" aria-pressed={value===id} onClick={()=>onChange(id)}>{c(en,zh)}</button>)}
  </div>
 </div>;
}

export function GalleryPage(){
 const c=useCopy(),{language}=useLanguage();
 const [filters,setFilters]=useState(()=>parseGalleryFilters(window.location.search));
 const [count,setCount]=useState(PAGE),[tasksOpen,setTasksOpen]=useState(false);
 const resultsRef=useRef(null);
 useEffect(()=>{
  const back=()=>{setFilters(parseGalleryFilters(window.location.search));setCount(PAGE);};
  window.addEventListener('popstate',back);return ()=>window.removeEventListener('popstate',back);
 },[]);
 const update=(patch,{replace=false}={})=>{
  const next={...filters,...patch};setFilters(next);setCount(PAGE);
  window.history[replace?'replaceState':'pushState'](null,'',galleryURL(next,language));
 };
 const changeSetting=setting=>{update({...defaultFilters,setting});setTasksOpen(false);};
 const changeLevel=level=>update({level,method:'all',task:'all'});
 const changeMethod=method=>{
  const next={...filters,method};
  if(!galleryVideos.some(r=>matchesGallery(r,next,{ignoreText:true})))next.task='all';
  update(next);
 };
 const filtered=useMemo(()=>galleryVideos.filter(r=>matchesGallery(r,filters)),[filters]);
 const comparisons=useMemo(()=>{
  if(!filtered.length||filters.method!=='all'||filters.outcome!=='all'||filtered.some(r=>r.collection!=='dex-s1-0920'))return null;
  const groups=new Map();
  for(const clip of filtered){
   if(!groups.has(clip.paired))groups.set(clip.paired,[]);
   groups.get(clip.paired).push(clip);
  }
  return [...groups.values()].every(group=>group.length===3)?[...groups.values()]:null;
 },[filtered,filters.method,filters.outcome]);
 const scoped=useMemo(()=>galleryVideos.filter(r=>matchesGallery(r,filters,{ignoreTask:true,ignoreText:true})),[filters]);
 const availableMethods=useMemo(()=>{
  const pool=galleryVideos.filter(r=>(filters.setting==='all'||r.setting===filters.setting)&&(filters.level==='all'||r.level===filters.level));
  return methods.filter(m=>m[0]==='all'||pool.some(r=>r.methodIds.includes(m[0])));
 },[filters.setting,filters.level]);
 const tasks=useMemo(()=>{
  const groups=new Map();
  for(const clip of scoped){
   if(!groups.has(clip.task.group))groups.set(clip.task.group,new Map());
   const group=groups.get(clip.task.group);
   if(!group.has(clip.task.id))group.set(clip.task.id,{...clip.task,count:0});
   if(matchesGallery(clip,filters,{ignoreTask:true}))group.get(clip.task.id).count++;
  }
  return [...groups].sort(([a],[b])=>a.localeCompare(b)).map(([name,rows])=>[name,[...rows.values()].sort((a,b)=>a.label[language].localeCompare(b.label[language],language==='zh'?'zh-CN':'en'))]);
 },[scoped,filters,language]);
 const taskCount=tasks.reduce((n,[,rows])=>n+rows.length,0),allTaskCases=tasks.reduce((n,[,rows])=>n+rows.reduce((sum,r)=>sum+r.count,0),0);
 const selectedTask=scoped.find(r=>r.task.id===filters.task)?.task.label[language];
 const chooseTask=task=>{
  update({task});setTasksOpen(false);
  if(window.matchMedia('(max-width: 800px)').matches)resultsRef.current?.scrollIntoView({behavior:'smooth',block:'start'});
 };
 const taskButton=(id,label,total)=><button key={id} type="button" aria-pressed={filters.task===id} disabled={id!=='all'&&total===0&&filters.task!==id} onClick={()=>chooseTask(id)}><span>{label}</span><span className="task-count" aria-hidden="true">{total}</span></button>;
 const isFiltered=Object.keys(defaultFilters).some(key=>filters[key]!==defaultFilters[key]);

 return <>
  <header className="gallery-hero band" id="top" ref={useEntrance()}>
   <a className="back-link" href={viewHref('home',language)}>← {c('Back to the report','返回报告')}</a>
   <span className="eyebrow is-accent">{c('Media · Rollout gallery','媒体 · 轨迹视频库')}</span>
   <h1>{c('Embodied Policy Rollouts','具身策略轨迹视频库')}</h1>
   <p className="hero-lead">{c(galleryVideos.length+' recorded cases across every evaluated setting — successes, failures and diagnostic demonstrations, with matched comparisons where they exist.',
    '覆盖全部评测场景的 '+galleryVideos.length+' 个记录案例——成功、失败与诊断演示，并在存在时提供配对对照。')}</p>
  </header>

  <div className="band" id="rollouts">
   <div className="filters">
    <FilterRow name="setting" label={c('Domain','评测领域')} options={settings} value={filters.setting} onChange={changeSetting}/>
    <FilterRow name="level" label={c('Control level','控制层级')} options={levels} value={filters.level} onChange={changeLevel}/>
    <FilterRow name="method" label={c('Method / baseline','方法 / 基线')} options={availableMethods} value={filters.method} onChange={changeMethod}/>
   </div>
   <div className="gallery-layout">
    <aside className={'task-sidebar'+(tasksOpen?' is-open':'')} aria-label={c('Choose a task','选择任务')}>
     <div className="task-heading"><span className="eyebrow">{c('Tasks','任务')}</span><span className="task-count">{taskCount}</span></div>
     <button className="task-toggle" type="button" aria-expanded={tasksOpen} aria-controls="gallery-task-list" onClick={()=>setTasksOpen(!tasksOpen)}>{selectedTask||c('All tasks','全部任务')}<span aria-hidden="true">{tasksOpen?'−':'+'}</span></button>
     <div className="task-list" id="gallery-task-list">
      {taskButton('all',c('All tasks','全部任务'),allTaskCases)}
      {tasks.map(([group,rows])=><div className="task-group" key={group}><h4>{group}</h4>{rows.map(t=>taskButton(t.id,t.label[language],t.count))}</div>)}
     </div>
    </aside>
    <div className="gallery-results" ref={resultsRef}>
     <div className="gallery-search">
      <label><span className="eyebrow">{c('Search videos','搜索视频')}</span><input type="search" placeholder={c('Task, scene, method…','任务、场景、方法…')} value={filters.query} onChange={e=>update({query:e.target.value},{replace:true})}/></label>
      <label><span className="eyebrow">{c('Outcome','结果')}</span><select value={filters.outcome} onChange={e=>update({outcome:e.target.value})}>
       <option value="all">{c('All outcomes','全部结果')}</option><option value="success">{c('Success / arrival','成功 / 到达')}</option><option value="failure">{c('Failure','失败')}</option><option value="demo">{c('Demonstrations / comparisons','演示 / 对照')}</option></select></label>
     </div>
     <div className="gallery-count-row"><p className="gallery-count" aria-live="polite">{c('Showing '+Math.min(count,filtered.length)+' of '+filtered.length+' cases','显示 '+Math.min(count,filtered.length)+' / '+filtered.length+' 个案例')}{selectedTask&&<span> · {selectedTask}</span>}</p>
      {isFiltered&&<button className="text-button" type="button" onClick={()=>{update({...defaultFilters});setTasksOpen(false);}}>{c('Reset filters','重置筛选')}</button>}</div>
     {comparisons?<div className="gallery-comparisons">{comparisons.slice(0,count/3).map(group=><section className="gallery-comparison" key={group[0].paired}>
      <h3>{group[0].task.label[language]} <span>Seed {group[0].seed}</span></h3>
      <div className="gallery-grid gallery-comparison-grid">{group.map(clip=><div key={clip.id} className="gallery-card">
       <MediaCard clip={clip} previewTitle={methods.find(m=>m[0]===clip.methodIds[0])[language==='zh'?2:1]}/>
      </div>)}</div>
     </section>)}</div>:<div className="gallery-grid">{filtered.slice(0,count).map(clip=><div key={clip.id} className="gallery-card">
      <div className="gallery-card-meta"><span>{clip.level?.toUpperCase()||c('Demo','演示')} · {clip.benchmark||clip.task.group}</span><span>{clip.methodIds.map(id=>{const m=methods.find(m=>m[0]===id);return c(m[1],m[2]);}).join(' / ')}{clip.methodIds.length>1?c(' · comparison',' · 对照'):''}</span></div>
      <MediaCard clip={galleryClip(clip,filters.method)}/>
     </div>)}</div>}
     {filtered.length===0&&<p className="empty">{c('No videos match these filters. Change the task or reset the filters.','没有符合条件的视频，请切换任务或重置筛选。')}</p>}
     {count<filtered.length&&<div className="gallery-more"><button className="button" type="button" onClick={()=>setCount(n=>n+PAGE)}>{c('Show more videos','显示更多视频')} ↓</button></div>}
    </div>
   </div>
   <Note>{c('Control levels follow the evaluated action interface; S1 includes hybrid review of an action policy. Comparison videos appear under each included method. For RoboCasa and fixed-goal in-hand tasks, selecting a method filters by its own outcome. In the combined translation-and-rotation task, RL outcomes refer to the 15 s endpoint. Each caption describes the recorded task and outcome. RoboDojo captions retain native Score on a 0–1 scale; the article charts multiply it by 100.','控制层级按被评测的动作接口划分；S1 包含对动作策略的混合审核。对照视频可从其中任一方法找到；对于 RoboCasa 和固定目标手内任务，结果筛选对应所选方法；平移与旋转联合任务中的 RL 结果指 15 秒终点。各视频说明对应的任务与运行结果。RoboDojo 视频说明保留 0–1 的原生 Score，正文图表将其乘以 100 展示。')}</Note>
  </div>
 </>;
}
