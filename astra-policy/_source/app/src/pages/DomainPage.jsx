import React from 'react';
import {useCopy,useLanguage} from '../i18n.jsx';
import {domains,domainById} from '../domains/index.jsx';
import {useOpenMedia} from '../media.jsx';
import {References} from '../references.jsx';
import {useEntrance,useActiveSection} from '../motion.js';
import {viewHref} from '../site.js';

function Hero({item}){
 const c=useCopy(),{language}=useLanguage(),open=useOpenMedia(),text=v=>c(v.en,v.zh);
 const clip=item.clip();
 return <header className="domain-hero band" id="top" ref={useEntrance()}>
  <a className="back-link" href={viewHref('home',language)}>← {c('All results','全部结果')}</a>
  <div className="domain-hero-grid">
   <div className="domain-hero-text">
    <span className="eyebrow is-accent">{c('Domain','领域')} {item.index} · {text(item.kicker)}</span>
    <h1>{text(item.name)}</h1>
    <p className="hero-lead">{text(item.lead)}</p>
    <p className="stat"><strong>{item.stat.value}</strong><span>{text(item.stat.caption)}</span></p>
   </div>
   <button type="button" className="domain-hero-media" onClick={()=>open(clip)} aria-label={c('Play: ','播放：')+text(clip.title)}>
    <img src={clip.poster} alt="" width={clip.width||960} height={clip.height||540}/>
    <span className="video-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5v14l11-7Z" fill="currentColor"/></svg></span>
    <span className="domain-hero-media-caption"><span className="eyebrow">{c('Featured rollout','精选回放')}</span>{text(clip.title)}</span>
   </button>
  </div>
 </header>;
}

function SectionNav({sections}){
 const c=useCopy(),active=useActiveSection(sections.map(s=>s.meta.id));
 return <nav className="section-nav band" aria-label={c('On this page','本页内容')}>
  <span className="eyebrow">{c('On this page','本页内容')}</span>
  <ol>{sections.map((Body,i)=><li key={Body.meta.id}><a href={'#'+Body.meta.id} aria-current={active===Body.meta.id?'location':undefined}>
   <small>{String(i+1).padStart(2,'0')}</small>{c(Body.meta.title.en,Body.meta.title.zh)}</a></li>)}</ol>
 </nav>;
}

function Pager({item}){
 const c=useCopy(),{language}=useLanguage();
 const at=domains.indexOf(item),previous=domains[at-1],next=domains[at+1];
 return <nav className="pager band" aria-label={c('Other domains','其他领域')}>
  {previous
   ?<a href={viewHref(previous.id,language)} rel="prev"><span className="eyebrow">← {c('Previous','上一领域')}</span><strong>{c(previous.name.en,previous.name.zh)}</strong></a>
   :<a href={viewHref('home',language)}><span className="eyebrow">← {c('Back','返回')}</span><strong>{c('All results','全部结果')}</strong></a>}
  {next
   ?<a className="is-next" href={viewHref(next.id,language)} rel="next"><span className="eyebrow">{c('Next','下一领域')} →</span><strong>{c(next.name.en,next.name.zh)}</strong></a>
   :<a className="is-next" href={viewHref('home',language)+'#insights'}><span className="eyebrow">{c('Next','下一节')} →</span><strong>{c('Findings','核心发现')}</strong></a>}
 </nav>;
}

export function DomainPage({view}){
 const item=domainById.get(view);
 return <>
  <Hero item={item}/>
  <SectionNav sections={item.sections}/>
  <div className="report band" id="results">{item.sections.map(Body=><Body key={Body.meta.id}/>)}<References/></div>
  <Pager item={item}/>
 </>;
}
