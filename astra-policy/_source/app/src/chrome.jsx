import React from 'react';
import {LanguageSwitch,useCopy,useLanguage,reportTitle,reportShort} from './i18n.jsx';
import {domains} from './domains/index.jsx';
import {viewHref} from './site.js';

export function TopBar({view}){
 const c=useCopy(),{language}=useLanguage();
 return <nav className="topbar" aria-label={c('Report sections','报告章节')}>
  <div className="band">
   <a className="topbar-brand" href={viewHref('home',language)} aria-current={view==='home'?'page':undefined}>
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2.2" fill="currentColor"/></svg>
    <span>{c(reportShort.en,reportShort.zh)}</span>
   </a>
   <div className="topbar-links">
    {domains.map(item=><a key={item.id} href={viewHref(item.id,language)} aria-current={view===item.id?'page':undefined}>
     <small>{item.index}</small>{c(item.short.en,item.short.zh)}</a>)}
    <i className="topbar-sep" aria-hidden="true"/>
    <a href={viewHref('home',language)+'#insights'}>{c('Findings','核心发现')}</a>
    <a href={viewHref('gallery',language)} aria-current={view==='gallery'?'page':undefined}>{c('Videos','视频')}</a>
   </div>
   <LanguageSwitch/>
  </div>
 </nav>;
}

export function SiteFooter(){
 const c=useCopy(),{language}=useLanguage();
 return <footer className="footer band">
  <div>
   <span>{c(reportTitle.en,reportTitle.zh)}</span>
   <span>Galbot · {c('September 2026','2026 年 9 月')}</span>
  </div>
  <div>
   <a href={viewHref('home',language)}>{c('All results','全部结果')}</a>
   <a href={viewHref('gallery',language)}>{c('Rollout gallery','轨迹视频库')}</a>
   <a href="https://github.com/anonymous-report-421/GPT-as-Policy" target="_blank" rel="noreferrer">{c('Code','代码')} ↗</a>
   <a href="#top">{c('Back to top','返回顶部')} ↑</a>
  </div>
 </footer>;
}
