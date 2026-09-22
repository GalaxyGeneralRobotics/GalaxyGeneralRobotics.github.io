import React from 'react';
import galbot from '../assets/galbot-logo.png';
import {useCopy,useLanguage,reportTitle} from '../i18n.jsx';
import {domains} from '../domains/index.jsx';
import {LeadingResults} from './LeadingResults.jsx';
import {Insights} from './Insights.jsx';
import {Citation,References} from '../references.jsx';
import {useEntrance,useReveal} from '../motion.js';
import {viewHref} from '../site.js';

function Hero(){
 const c=useCopy(),{language}=useLanguage();
 return <header className="hero band" id="top" ref={useEntrance()}>
  <span className="eyebrow hero-eyebrow">{c('Embodied policy · Research report · September 2026','具身策略 · 研究报告 · 2026 年 9 月')}</span>
  <h1>{c(reportTitle.en,reportTitle.zh)}</h1>
  <p className="hero-lead">{c('GPT-6 Astra in the control loop of six robot domains — from writing joint targets to commanding frozen skills.',
   'GPT-6 Astra 进入六个机器人领域的控制闭环——从直接写出关节目标，到调度冻结的运动技能。')}</p>
  <div className="hero-meta">
   <img src={galbot} width="1412" height="446" alt="Galbot"/>
   <span className="hero-meta-links">
    <a href="https://github.com/anonymous-report-421/GPT-as-Policy" target="_blank" rel="noreferrer">{c('Code','代码')} ↗</a>
    <a href={viewHref('gallery',language)}>{c('Rollout gallery','轨迹视频库')} ↗</a>
    <a href="#leading">{c('Results','结果')} ↓</a>
   </span>
  </div>
 </header>;
}

function Verdict(){
 const c=useCopy();
 return <p className="verdict band" ref={useReveal()}>
  <strong>{c('Astra leads every compared method on ten results','Astra 在十项结果上领先全部对比方法')}</strong>
  {c(' — manipulation, dexterous hands, navigation and humanoid control. ','——覆盖操作、灵巧手、导航与人形控制。')}
  <em>{c('Where contact and balance decide the outcome, learned controllers still win.','而在接触与平衡决定成败的场景，learned controller 仍然更强。')}</em>
 </p>;
}

function DomainStrip(){
 const c=useCopy(),{language}=useLanguage();
 return <div className="domain-strip band" ref={useReveal()}>{domains.map(item=>{
  const clip=item.clip(),name=c(item.name.en,item.name.zh),short=c(item.short.en,item.short.zh);
  return <a key={item.id} href={viewHref(item.id,language)}>
   <span className="domain-strip-media"><img src={clip.poster} alt={c(name+' evaluation scene',name+'评测场景')} width="480" height="300" loading="lazy"/></span>
   <span className="domain-strip-label"><small>{item.index}</small>{short}<i aria-hidden="true">→</i></span>
  </a>;
 })}</div>;
}

function Brief({item}){
 const c=useCopy(),{language}=useLanguage(),Figure=item.figure,href=viewHref(item.id,language);
 return <section className="brief band" id={item.id} ref={useReveal('bars')}>
  <div className="brief-text">
   <span className="eyebrow is-accent">{item.index} · {c(item.kicker.en,item.kicker.zh)}</span>
   <h3><a href={href}>{c(item.name.en,item.name.zh)}</a></h3>
   <p>{c(item.lead.en,item.lead.zh)}</p>
   <p className="stat"><strong>{item.stat.value}</strong><span>{c(item.stat.caption.en,item.stat.caption.zh)}</span></p>
   <a className="arrow-link" href={href}>{c('Full results and rollouts','完整结果与回放')}<i aria-hidden="true">→</i></a>
  </div>
  <div className="brief-chart"><span className="eyebrow">{c(item.figureTitle.en,item.figureTitle.zh)}</span><Figure/></div>
 </section>;
}

export function Landing(){
 const c=useCopy();
 return <>
  <Hero/>
  <Verdict/>
  <DomainStrip/>
  <LeadingResults/>
  <section className="briefs" id="domains">
   <header className="band-head band" ref={useReveal()}>
    <span className="eyebrow">{c('Domains','评测领域')}</span>
    <h2>{c('Six domains, one question each','六个领域，各回答一个问题')}</h2>
    <p>{c('The headline measurement for each. Protocols, every task and the failure cases are on the domain pages.',
     '此处只给出各领域最关键的测量结果；实验设置、全部任务与失败案例见领域页面。')}</p>
   </header>
   {domains.map(item=><Brief key={item.id} item={item}/>)}
  </section>
  <Insights/>
  <div className="band landing-citation"><References/><Citation/></div>
 </>;
}
