import React from 'react';
import galbot from '../assets/galbot-logo.png';
import {useCopy,useLanguage,reportTitle} from '../i18n.jsx';
import {domains} from '../domains/index.jsx';
import {LeadingResults} from './LeadingResults.jsx';
import {Insights} from './Insights.jsx';
import {Citation,References} from '../references.jsx';
import {useEntrance,useReveal} from '../motion.js';
import {MediaCard} from '../media.jsx';
import {viewHref} from '../site.js';
import roboDojoUsage from '../data/evidence/robodojo-token-usage.json';

function Hero(){
 const c=useCopy(),{language}=useLanguage();
 return <header className="hero band" id="top" ref={useEntrance()}>
  <span className="eyebrow hero-eyebrow">{c('Embodied policy · Research report · September 2026','具身策略 · 研究报告 · 2026 年 9 月')}</span>
  <h1>{c(reportTitle.en,reportTitle.zh)}</h1>
  <p className="hero-lead">{c('Evaluating GPT-6 Astra and its combinations with embodied policies across six robot domains: task performance, control limitations and computational cost.',
   '在六个机器人领域评测 GPT-6 Astra 及其与具身策略的组合，考察任务表现、控制能力边界与计算成本。')}</p>
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

function Abstract(){
 const c=useCopy();
 const meanTokens=method=>roboDojoUsage.methods[method].total_tokens/roboDojoUsage.methods[method].runs;
 const tokenMean=method=>c((meanTokens(method)/1e6).toFixed(2)+'M',Math.round(meanTokens(method)/1e4)+' 万');
 return <div className="verdict band" id="abstract" ref={useReveal()}>
  <p>{c('Without real-time task constraints, Astra or Astra + embodied policies achieves the highest success rate on the selected RoboDojo, RoboLab, RoboCasa365 and four navigation subsets among this report’s comparisons.',
   '在不考虑任务实时性的情况下，Astra 或 Astra + 具身策略在本报告所选 RoboDojo、RoboLab、RoboCasa365 及四个导航子集的对照中取得最高成功率。')}</p>
  <p>{c(`However, Astra still struggles to complete LAFAN1 motion tracking, in-hand manipulation and clutter traversal, while token consumption is substantial: Astra averages ${tokenMean('astra')} tokens per RoboDojo trajectory.`,
   `但 Astra 在 LAFAN1 运动追踪、手内操作和杂乱场景避障中仍难以完成任务，且 token 消耗巨大：在 RoboDojo 上，Astra 每条轨迹平均消耗约 ${tokenMean('astra')} tokens。`)}</p>
  <p className="verdict-note">{c('Note: The mean uses all 50 selected Astra runs, including failures and two incomplete runs. Counts sum input and output tokens; cached input and reasoning output are already included and are not added again. Earlier retries are excluded; token counts do not represent monetary charges. ',
   '注：按 Astra 的 50 个选定运行实例取平均，包含失败记录及 2 条未完成记录；统计输入与输出 tokens，缓存输入和推理输出已包含在内，不重复计数；不含此前重试，亦不代表实际账单金额。')}
   <a href={roboDojoUsage.source} target="_blank" rel="noreferrer">{c('Source ↗','统计来源 ↗')}</a>
  </p>
 </div>;
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
 const c=useCopy(),{language}=useLanguage(),href=viewHref(item.id,language);
 return <section className="brief band" id={item.id} ref={useReveal()}>
  <div className="brief-text">
   <span className="eyebrow is-accent">{item.index} · {c(item.kicker.en,item.kicker.zh)}</span>
   <h3><a href={href}>{c(item.name.en,item.name.zh)}</a></h3>
   <p className="brief-overview">{c(item.overview.en,item.overview.zh)}</p>
   <a className="arrow-link" href={href}>{c('Full results and rollouts','完整结果与回放')}<i aria-hidden="true">→</i></a>
  </div>
  <div className="brief-videos">{item.overviewClips.map(clip=><MediaCard key={clip.id} clip={clip} compact/>)}</div>
 </section>;
}

export function Landing(){
 const c=useCopy();
 return <>
  <Hero/>
  <Abstract/>
  <DomainStrip/>
  <LeadingResults/>
  <section className="briefs" id="domains">
   <header className="band-head band" ref={useReveal()}>
    <span className="eyebrow">{c('Domains','评测领域')}</span>
    <h2>{c('Evaluation Results Across Six Embodied Task Categories','六类具身任务的评测结果')}</h2>
    <p>{c('Capabilities, effects of policy composition and reported token usage, illustrated by successful and failed rollouts. Full protocols and task-level results are available on each domain page.',
     '概述各类任务的能力表现、策略组合效果与已记录的 token 消耗，并展示成功与失败轨迹；完整实验设置与逐任务结果见领域页面。')}</p>
   </header>
   {domains.map(item=><Brief key={item.id} item={item}/>)}
  </section>
  <Insights/>
  <div className="band landing-citation"><References/><Citation/></div>
 </>;
}
