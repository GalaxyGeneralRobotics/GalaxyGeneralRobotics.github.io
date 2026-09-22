import React from 'react';
import {Bars,ChartTitle} from '../ui.jsx';
import {useCopy} from '../i18n.jsx';
import results from '../data/results.json';
import {robodojoRows} from '../data/manipulation.js';
import {dexterousMeans,dexterousVideos} from '../data/dexterous.js';
import {navigation,navMethods,datasetNames,mobileClip} from '../data/mobile.js';
import {s0Clip} from '../data/s0.js';
import {humanoidBenchClip} from '../data/humanoidbench.js';
import {Manipulation,manipulationClips} from './Manipulation.jsx';
import {MobileManipulation} from './MobileManipulation.jsx';
import {DexterousManipulation} from './DexterousManipulation.jsx';
import {DexterousS0} from './DexterousS0.jsx';
import {VisualNavigation} from './VisualNavigation.jsx';
import {Humanoid} from './Humanoid.jsx';
import {MotionTracking} from './MotionTracking.jsx';
import {MotorControl} from './MotorControl.jsx';
import {Terrain} from './Terrain.jsx';
import {Obstacles} from './Obstacles.jsx';
import {ClutterInterfaces} from './ClutterInterfaces.jsx';

// ── Landing-page summary charts. Short labels here; the domain pages carry full method names.
const RoboDojoBars=()=><Bars rows={robodojoRows('sr')} decimals={1}/>;
const DexterousBars=()=><Bars unit="" decimals={1} rows={[
 {label:'Astra + π₀.₅',value:dexterousMeans.hybrid,method:'hybrid'},
 {label:'π₀.₅',value:dexterousMeans.pi05,method:'baseline'},
 {label:'Astra',value:dexterousMeans.direct,method:'gpt'}]}/>;
const NavigationBars=()=><div className="charts-2 is-tight">{Object.entries(datasetNames).map(([dataset,title])=>
 <div key={dataset}><ChartTitle>{title}</ChartTitle>
  <Bars compact decimals={0} rows={navMethods.map(([key,label])=>({label:label.replace(' · 3 RGB',''),
   value:navigation.find(r=>r.model===key&&r.dataset===dataset).sr_pct,method:key==='astra'?'gpt':'baseline'}))}/></div>)}</div>;
function HumanoidBars(){
 const maze=results.humanoid.find(r=>r.task==='Maze');
 return <Bars unit="" decimals={1} max={1500} threshold={1200} rows={[
  {label:'Astra + Humanoid-GPT · G1',value:maze.mean,method:'hybrid'},
  ...[['DreamerV3','dreamerv3_h1hand'],['TD-MPC2','tdmpc2_h1hand'],['SAC','sac_h1hand']]
   .map(([label,key])=>({label:label+' · H1',value:parseFloat(maze[key]),method:'proxy'}))]}/>;
}
function LocomotionBars(){
 const c=useCopy();
 const rows=terrain=>results.terrain.filter(r=>r.terrain===terrain).map(r=>({
  label:r.method==='baseline'?c('Learned policy','learned policy'):r.method==='adapted'?'Astra + policy.md':'Astra',
  value:r.successes,display:r.successes+'/6',method:r.method==='baseline'?'baseline':r.method==='adapted'?'hybrid':'gpt'}));
 return <div className="charts-2 is-tight">
  <div><ChartTitle>{c('Stairs · successes','楼梯 · 成功数')}</ChartTitle><Bars compact max={6} unit="" rows={rows('stairs')}/></div>
  <div><ChartTitle>{c('Gaps · successes','沟隙 · 成功数')}</ChartTitle><Bars compact max={6} unit="" rows={rows('gaps')}/></div>
 </div>;
}
function ObstacleBars(){
 const c=useCopy();
 const best=results.clutter.filter(r=>r.method!=='Passage').reduce((a,b)=>b.progress_m>a.progress_m?b:a);
 const passage=results.clutter.find(r=>r.method==='Passage');
 return <Bars unit=" m" decimals={3} max={9.2} rows={[
  {label:'Passage + ScaleBFM',value:passage.progress_m,method:'baseline'},
  {label:c('Astra + ScaleBFM · best of 5','Astra + ScaleBFM · 五次最佳'),value:best.progress_m,method:'gpt'}]}/>;
}

// ── The six domains: landing copy, headline number, summary chart, featured clip and page sections.
export const domains=[
 {id:'manipulation',index:'01',
  name:{en:'Manipulation',zh:'操作'},short:{en:'Manipulation',zh:'操作'},
  kicker:{en:'RoboDojo · RoboLab · RoboCasa365',zh:'RoboDojo · RoboLab · RoboCasa365'},
  lead:{en:'35 tabletop and kitchen tasks. Astra acts directly, or reviews and corrects π\u2080.\u2085 step by step.',
   zh:'35 项桌面与厨房任务。Astra 直接执行，或逐步审核并修正 π\u2080.\u2085 的动作。'},
  stat:{value:'48.0%',caption:{en:'RoboDojo success for Astra + π\u2080.\u2085. Best published VLA: 30.9%.',zh:'Astra + π\u2080.\u2085 的 RoboDojo 成功率。最强公开 VLA 为 30.9%。'}},
  figure:RoboDojoBars,figureTitle:{en:'RoboDojo · success rate',zh:'RoboDojo · 成功率'},
  clip:()=>manipulationClips[0],
  sections:[Manipulation,MobileManipulation]},

 {id:'dexterous',index:'02',
  name:{en:'Dexterous Hands',zh:'灵巧手'},short:{en:'Dexterous',zh:'灵巧手'},
  kicker:{en:'10 dexterous tasks · Sharpa & Allegro',zh:'10 项灵巧操作任务 · Sharpa 与 Allegro'},
  lead:{en:'One hand, two levels: scene-level correction of a dexterous policy, and direct finger control against RL.',
   zh:'同一只手的两个层级：对灵巧策略的场景级修正，以及与 RL 对比的直接手指控制。'},
  stat:{value:'61.8',caption:{en:'Mean Score, +17.6 over π\u2080.\u2085. In-hand, RL still holds 76.90% against 0.51%.',zh:'平均 Score，较 π\u2080.\u2085 高 17.6。但手内控制中 RL 为 76.90%，Astra 仅 0.51%。'}},
  figure:DexterousBars,figureTitle:{en:'Dexterous manipulation · mean Score',zh:'灵巧操作 · 平均 Score'},
  clip:()=>dexterousVideos[2],
  sections:[DexterousManipulation,DexterousS0]},

 {id:'navigation',index:'03',
  name:{en:'Visual Navigation',zh:'视觉导航'},short:{en:'Navigation',zh:'导航'},
  kicker:{en:'VLN-CE R2R / RxR · ObjectNav MP3D / HM3D v2',zh:'VLN-CE R2R / RxR · ObjectNav MP3D / HM3D v2'},
  lead:{en:'One RGB view and an instruction. 50 fixed episodes per dataset, against three navigation policies.',
   zh:'仅有单目 RGB 与一句指令。每个数据集 50 个固定 episode，对比三种导航策略。'},
  stat:{value:'4 / 4',caption:{en:'Datasets where Astra leads on both success rate and SPL. RxR peaks at 92%.',zh:'Astra 在成功率与 SPL 上同时领先的数据集数。RxR 最高达 92%。'}},
  figure:NavigationBars,figureTitle:{en:'Success rate · %',zh:'成功率 · %'},
  clip:()=>mobileClip('rxr-2682'),
  sections:[VisualNavigation]},

 {id:'humanoid',index:'04',
  name:{en:'Humanoid Control',zh:'人形控制'},short:{en:'Humanoid',zh:'人形'},
  kicker:{en:'HumanoidBench · Unitree G1 · 30 tasks',zh:'HumanoidBench · Unitree G1 · 30 项任务'},
  lead:{en:'Task-level commands over frozen humanoid skills, on all 30 executable HumanoidBench tasks with a Unitree G1.',
   zh:'在冻结的人形技能之上下达任务级指令，以 Unitree G1 覆盖 HumanoidBench 全部 30 项可运行任务。'},
  stat:{value:'13 / 30',caption:{en:'Tasks where Astra + Humanoid-GPT exceeds every published H1 baseline; six task means clear their native thresholds.',zh:'Astra + Humanoid-GPT 超过全部公开 H1 基线的任务数；6 项任务均值达到原生阈值。'}},
  figure:HumanoidBars,figureTitle:{en:'HumanoidBench Maze · mean return',zh:'HumanoidBench Maze · 平均回报'},
  clip:()=>humanoidBenchClip('push'),
  sections:[Humanoid]},

 {id:'locomotion',index:'05',
  name:{en:'Locomotion & Terrain',zh:'运动与地形'},short:{en:'Locomotion',zh:'运动'},
  kicker:{en:'LAFAN1 tracking · Isaac Sim · stairs & gaps',zh:'LAFAN1 追踪 · Isaac Sim · 楼梯与沟隙'},
  lead:{en:'The bottom of the stack: joint targets every control interval, then footholds over stairs and gaps.',
   zh:'控制体系的最底层：每个控制周期写出关节目标，再规划跨越楼梯与沟隙的落足点。'},
  stat:{value:'0 → 4 / 6',caption:{en:'Stair traversals from a rewritten policy.md, no weight update. The learned policy does 6/6.',zh:'仅靠重写 policy.md、不更新权重获得的楼梯通过数。learned policy 为 6/6。'}},
  figure:LocomotionBars,figureTitle:{en:'Terrain traversal · six scenes each',zh:'地形通过 · 每类六个场景'},
  clip:()=>s0Clip('s0-t3'),
  sections:[MotionTracking,MotorControl,Terrain]},

 {id:'obstacles',index:'06',
  name:{en:'Obstacle Avoidance',zh:'避障'},short:{en:'Obstacles',zh:'避障'},
  kicker:{en:'Open clutter · five-point & 14-point',zh:'开阔杂乱场景 · 五点与 14-point'},
  lead:{en:'Same scene, same tracker. Only the source of the motion reference changes.',
   zh:'相同场景、相同 tracker，只改变运动参考的来源。'},
  stat:{value:'8.62 m',caption:{en:'Goal progress for Passage, which arrives. Astra\u2019s best of five stops 6.52 m short.',zh:'Passage 的目标进展并成功到达。Astra 五次尝试中最好的一次距目标仍差 6.52 m。'}},
  figure:ObstacleBars,figureTitle:{en:'Goal progress · m',zh:'目标进展 · m'},
  clip:()=>results.videos.find(r=>r.id==='clutter-gpt5'),
  sections:[Obstacles,ClutterInterfaces]}
];
export const domainById=new Map(domains.map(r=>[r.id,r]));
