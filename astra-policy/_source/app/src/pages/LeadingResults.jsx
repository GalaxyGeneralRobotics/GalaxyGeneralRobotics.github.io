import React from 'react';
import {number} from '../ui.jsx';
import {useCopy} from '../i18n.jsx';
import {useReveal} from '../motion.js';
import results from '../data/results.json';
import {robodojoRows,robolabRows} from '../data/manipulation.js';
import {dexterousMeans} from '../data/dexterous.js';
import {navigation,groups} from '../data/mobile.js';

const pick=(rows,label)=>rows.find(r=>r.label===label).value;
// "Best" always means the strongest method that is not an Astra configuration.
const bestOther=rows=>rows.filter(r=>!r.label.startsWith('Astra')).reduce((a,b)=>b.value>a.value?b:a);
const nav=(model,dataset)=>navigation.find(r=>r.model===model&&r.dataset===dataset).sr_pct;
const bestNav=dataset=>navigation.filter(r=>r.model!=='astra'&&r.dataset===dataset).reduce((a,b)=>b.sr_pct>a.sr_pct?b:a);
const navName={lightnav:'LightNav-0',uninavid:'Uni-NaVid 7B',omninav:'OmniNav Flow'};
const humanoid=task=>results.humanoid.find(r=>r.task===task);

// Every row is a setting in which Astra — alone or over a learned component — leads every
// method it was compared against. Scales are per row; the caption states the protocols.
function leadingRows(c){
 const dojo=robodojoRows('sr'),dojoBest=bestOther(dojo),lab=bestOther(robolabRows);
 const all=groups.find(r=>r.group==='all');
 const maze=humanoid('Maze'),reach=humanoid('Reach');
 const navRow=(dataset,name)=>{
  const other=bestNav(dataset);
  return {benchmark:name,metric:c('Success rate · %','成功率 · %'),max:100,unit:'%',decimals:0,
   ours:{label:'Astra',value:nav('astra',dataset)},best:{label:navName[other.model],value:other.sr_pct}};
 };
 return [
  {benchmark:'RoboDojo',metric:c('10 bimanual tasks · success · %','10 项双臂任务 · 成功率 · %'),max:100,unit:'%',decimals:1,
   ours:{label:'Astra + π₀.₅',value:pick(dojo,'Astra + π₀.₅')},best:{label:dojoBest.label,value:dojoBest.value}},
  {benchmark:'RoboLab',metric:c('10 single-arm tasks · success · %','10 项单臂任务 · 成功率 · %'),max:100,unit:'%',decimals:0,
   ours:{label:'Astra',value:pick(robolabRows,'Astra')},best:{label:lab.label,value:lab.value}},
  {benchmark:'RoboCasa365',metric:c('15 kitchen tasks · success · %','15 项厨房任务 · 成功率 · %'),max:100,unit:'%',decimals:1,
   ours:{label:'Astra + π₀.₅',value:100*all.pi05_skill/all.n},best:{label:'π₀.₅',value:100*all.pi05_only/all.n}},
  {benchmark:c('Dexterous manipulation','灵巧操作'),metric:c('10 tasks · mean Score','10 项任务 · 平均 Score'),max:100,unit:'',decimals:1,
   ours:{label:'Astra + π₀.₅',value:dexterousMeans.hybrid},best:{label:'π₀.₅',value:dexterousMeans.pi05}},
  navRow('r2r','VLN-CE R2R'),navRow('rxr','VLN-CE RxR'),
  navRow('mp3d','ObjectNav MP3D'),navRow('hm3d','ObjectNav HM3D v2'),
  {benchmark:'HumanoidBench Maze',metric:c('Mean return','平均回报'),max:1500,unit:'',decimals:1,
   ours:{label:'Astra + Humanoid-GPT',value:maze.mean},best:{label:'DreamerV3 ‡',value:parseFloat(maze.dreamerv3_h1hand)}},
  {benchmark:'HumanoidBench Reach',metric:c('Mean return','平均回报'),max:12000,unit:'',decimals:1,
   ours:{label:'Astra + Humanoid-GPT',value:reach.mean},best:{label:'DreamerV3 ‡',value:parseFloat(reach.dreamerv3_h1hand)}}
 ];
}

function Row({row,index}){
 const width=value=>Math.max(1.5,Math.min(100,value/row.max*100))+'%';
 const show=value=>number(value,row.decimals)+row.unit;
 return <div className="lead-row">
  <div className="lead-name"><small>{String(index+1).padStart(2,'0')}</small><strong>{row.benchmark}</strong><span>{row.metric}</span></div>
  <div className="lead-pair">
   <div className="lead-bar is-ours"><span className="lead-key">{row.ours.label}</span><div className="lead-track"><i style={{width:width(row.ours.value)}}/></div><b>{show(row.ours.value)}</b></div>
   <div className="lead-bar"><span className="lead-key">{row.best.label}</span><div className="lead-track"><i style={{width:width(row.best.value)}}/></div><b>{show(row.best.value)}</b></div>
  </div>
 </div>;
}

export function LeadingResults(){
 const c=useCopy(),rows=leadingRows(c);
 return <figure className="lead-figure band" id="leading" ref={useReveal('bars')}>
  <header className="lead-head">
   <div><span className="eyebrow">FIG. 00 · {c('Ten leading results','十项领先结果')}</span>
    <h2>{c('Where Astra is ahead of every method it was compared against','Astra 全面领先所有对比方法的评测')}</h2></div>
   <dl className="lead-legend">
    <div><dt className="is-ours"/><dd>Astra</dd></div>
    <div><dt/><dd>{c('Strongest compared method','最强对比方法')}</dd></div>
   </dl>
  </header>
  <div className="lead-rows">{rows.map((row,i)=><Row key={row.benchmark} row={row} index={i}/>)}</div>
  <figcaption>
   {c('Each row uses its own metric and scale. RoboDojo and RoboLab: 10 tasks × 5 trials per policy. RoboCasa365: 15 tasks × 5 seeds. Dexterous Score is mean subgoal completion over 10 tasks. Navigation: 50 fixed episodes per system per dataset. † Published RoboDojo references are reweighted to the ten selected tasks. ‡ HumanoidBench baselines are published H1 results under their own robot and training protocols; Astra runs on G1 over frozen Humanoid-GPT skills, clears the Maze threshold of 1200 and stays below the Reach threshold of 12000. Settings where learned controllers remain ahead are reported in full on their domain pages.',
    '各行使用各自的指标与尺度。RoboDojo 与 RoboLab：每策略 10 个任务 × 5 次。RoboCasa365：15 个任务 × 5 个 seed。灵巧 Score 为 10 项任务的平均子目标完成度。导航：每系统、每数据集 50 个固定 episode。† RoboDojo 公开参考按所选十项任务重加权。‡ HumanoidBench 基线为公开 H1 结果，沿用各自的机器人与训练协议；Astra 在 G1 上通过冻结的 Humanoid-GPT 技能执行，超过 Maze 的 1200 阈值，低于 Reach 的 12000 阈值。learned controller 仍然领先的场景在各自领域页面完整报告。')}
  </figcaption>
 </figure>;
}
