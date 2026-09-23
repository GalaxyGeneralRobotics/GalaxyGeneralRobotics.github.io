import React,{useState} from 'react';
import {Cite} from '../references.jsx';
import {useCopy} from '../i18n.jsx';
import {FailureAnalysis} from '../FailureAnalysis.jsx';
import {navigationFailureIntro,navigationFailureCases} from '../data/navigation-mobile-failures.js';
import {Section,Figure,Bars,Toggle,DataTable,Note,Setup,Conclusion,number} from '../ui.jsx';
import {MediaCard,ImageFigure} from '../media.jsx';
import {navigation,datasetNames,navMethods,published,mobileRoot,mobileClip} from '../data/mobile.js';

const termination=[['r2r',39,11,0],['rxr',46,4,0],['mp3d',28,12,10],['hm3d',41,4,5]];
const paperNames={uninavid:'Uni-NaVid',navfom:'NavFoM',lightnav:'LightNav-0',qwen:'Qwen-RobotNav',omninav:'OmniNav',cognav:'CogNav'};
export function VisualNavigation(){
 const c=useCopy(),[metric,setMetric]=useState('sr_pct');
 const localRows=navMethods.map(([key,label])=>[label,key==='omninav'?'3 RGB':'1 RGB',...Object.keys(datasetNames).map(dataset=>{const r=navigation.find(r=>r.model===key&&r.dataset===dataset);return number(r.sr_pct,0)+' / '+number(r.spl_pct,2);})]);
 return <Section id="visual-navigation" index={c('VISUAL NAVIGATION','视觉导航')} title={c('Visual Navigation','视觉导航')} subtitle={c('VLN-CE · R2R / RxR | ObjectNav · MP3D / HM3D v2','VLN-CE · R2R / RxR | ObjectNav · MP3D / HM3D v2')}>
  <Setup methods={[
   ['Astra',c('Route instruction or object category + current RGB + history → Astra chooses navigation-tool actions → execution adapter → new RGB observation.','路线指令或物体类别 + 当前 RGB + 历史 → Astra 选择导航工具动作 → 执行适配器 → 新 RGB 观测。')],
   ['LightNav-0 / Uni-NaVid 7B',c('Task + one RGB view → released navigation policy → shared local execution interface.','任务 + 单个 RGB 视角 → 已发布的导航策略 → 共用本地执行接口。')],
   ['OmniNav Flow',c('Task + three RGB views → released visual Flow policy → local execution adapter.','任务 + 三个 RGB 视角 → 已发布视觉 Flow 策略 → 本地执行适配器。')]
  ]}>
   <p>{c('R2R and RxR evaluate following language instructions through indoor environments.','R2R 与 RxR 评测在室内按语言指令行走。')}<Cite ids={['vlnce','r2r','rxr']}/>{' '}{c('MP3D and HM3D v2 evaluate searching for an object category.','MP3D 与 HM3D v2 评测寻找指定类别的物体。')}<Cite ids={['mp3d','hm3d','hm3dsem','objectnav']}/>{' '}{c('We run four systems on the same 50 fixed episodes from each dataset, for 800 runs in total. R2R and RxR supply route instructions, with English guides for RxR. MP3D and HM3D v2 use closed-vocabulary object categories. Each episode permits at most 500 primitive actions. Success requires an explicit STOP within 3 m of the VLN goal or 1 m of an annotated ObjectNav goal viewpoint.','四种系统在每个数据集相同的 50 个固定 episode 上运行，共 800 次。R2R 与 RxR 提供路线指令，RxR 使用英文 guide 指令；MP3D 与 HM3D v2 使用闭词表物体类别。每次运行最多执行 500 个基础动作，需在 VLN 目标 3 m 内或标注的 ObjectNav 目标视点 1 m 内显式发出 STOP。')}</p>
   <p>{c('The main metrics are success rate (SR) and success weighted by path length (SPL): SPL discounts a successful trajectory when its traveled path exceeds the shortest path, and assigns zero to failed episodes. For route following, normalized dynamic time warping (nDTW) measures agreement with the reference route. Astra receives RGB images, the instruction and its history. Depth, GPS, compass readings, maps and evaluator distances are excluded from its inputs. The released navigation policies retain their own history and computation designs through local action adapters.','主要指标为成功率 SR 与按路径长度加权的成功率 SPL：成功轨迹的行走距离越偏离最短路径，SPL 越低，失败轨迹记为零。路线跟随另用归一化动态时间规整 nDTW 衡量与参考路线的一致性。Astra 的输入为 RGB 图像、指令及历史；深度、GPS、指南针、地图与评测距离不作为输入。其余已发布策略通过本地动作适配器运行，保留各自的历史信息与计算方式。')}<Cite ids={['spl','ndtw']}/></p>
   <ImageFigure src={mobileRoot+'assets/figures/navigation-open-models.png'} alt={c('Navigation observations, decision systems and execution adapters','导航观测、决策系统与执行适配器')} caption={c('Navigation systems and their local execution interfaces. OmniNav Flow receives three RGB views; Astra, LightNav-0 and Uni-NaVid receive one. The simulator executes each selected action before returning the next observation.','导航系统与本地执行接口示意。OmniNav Flow 使用三个 RGB 视角，Astra、LightNav-0 与 Uni-NaVid 使用一个。仿真器执行所选动作后返回下一次观测。')}/>
  </Setup>
  <Figure title={c('Navigation success and path efficiency','导航成功率与路径效率')} subtitle={c('Local evaluation and published benchmarks','本地评测与已发表基准结果')} caption={<>{c('All values are percentages. Local evaluation uses the same 50 episodes per dataset for each of four systems. Published rows use the validation splits, observations and execution protocols of the cited papers; their observation settings are shown beside the method names. HM3D results use the v2 closed-vocabulary setting.','数值均为百分比。本地评测中，四种系统在每数据集相同的 50 个 episode 上运行；论文结果采用各自的验证集、观测与执行协议，观测配置列在方法名旁。HM3D 使用 v2 闭词表设置。')}<span className="paper-links">{Object.entries(paperNames).map(([key,label])=><span key={key}><a href={published.sources[key].url} target="_blank" rel="noreferrer">{label} ↗</a><Cite ids={key}/></span>)}</span></>}>
   <div className="chart-controls"><Toggle label={c('Navigation metric','导航指标')} value={metric} onChange={setMetric} options={[[ 'sr_pct',c('Success rate','成功率')],['spl_pct','SPL']]}/><span>{c('Higher is better · %','越高越好 · %')}</span></div>
   <div className="charts-2 nav-results">{Object.entries(datasetNames).map(([dataset,label])=>{
    const key=dataset==='hm3d'?'hm3d_v2':dataset,metricKey=metric==='sr_pct'?'sr':'spl';
    const references=published.rows.filter(r=>r.metrics[key]?.[metricKey]!=null);
    return <div key={dataset}><div className="chart-title"><h4>{label}</h4><span>{dataset==='r2r'||dataset==='rxr'?'VLN-CE':'ObjectNav'}</span></div>
     <h5>{c('Local evaluation · 50 episodes','本地评测 · 50 个 episode')}</h5><Bars decimals={metric==='sr_pct'?0:2} rows={navMethods.map(([key,label,color])=>{const r=navigation.find(r=>r.model===key&&r.dataset===dataset);return {label,value:r[metric],color};})}/>
     <h5>{c('Published validation results','论文验证集结果')}</h5><Bars decimals={1} rows={references.map(r=>({label:r.model+' · '+r.observation,value:r.metrics[key][metricKey],method:'proxy'}))}/>
    </div>;
   })}</div>
  </Figure>
  <p>{c('Astra completes 39/50 R2R episodes and 46/50 RxR episodes. Its R2R nDTW is 72.20%, compared with 72.77% for LightNav-0. Object search shows a wider gap between success and path efficiency: MP3D reaches 56% SR and 22.43% SPL; HM3D v2 reaches 82% SR and 43.69% SPL.','Astra 在 R2R 与 RxR 上分别完成 39/50 和 46/50 次运行；R2R 的 nDTW 为 72.20%，LightNav-0 为 72.77%。物体搜索的成功率与路径效率差距更大：MP3D 为 56% SR、22.43% SPL，HM3D v2 为 82% SR、43.69% SPL。')}</p>
  <DataTable caption={c('Complete local results · SR / SPL (%)','完整本地结果 · SR / SPL（%）')} headers={[c('System','系统'),c('Input','输入'),'R2R','RxR','MP3D','HM3D v2']} rows={localRows}/>
  <Figure title={c('Episode termination','运行终止结果')} subtitle={c('Astra · 50 episodes per dataset','Astra · 每数据集 50 次运行')} caption={c('Episodes terminate after a successful STOP, a STOP outside the goal region, or exhaustion of the 500-action budget. ObjectNav success is evaluated relative to an annotated goal viewpoint.','运行分别因目标区域内 STOP、目标区域外 STOP，或耗尽 500 个动作预算而结束。ObjectNav 按标注目标视点判断成功。')}>
   <div className="legend"><span><i style={{background:'#5b7cff'}}/>{c('Successful STOP','STOP 成功')}</span><span><i style={{background:'#a9a6ea'}}/>{c('Unsuccessful STOP','STOP 未成功')}</span><span><i style={{background:'#3f4659'}}/>{c('Action budget exhausted','动作预算耗尽')}</span></div>
   <div className="stacked-rows">{termination.map(([key,...counts])=><div key={key}><strong>{datasetNames[key]}</strong><div className="stacked" role="img" aria-label={c('Successful STOP / unsuccessful STOP / action limit: ','STOP 成功 / STOP 未成功 / 动作上限：')+counts.join(' / ')}>{counts.map((n,i)=>n>0&&<span key={i} style={{width:n*2+'%',background:['#5b7cff','#a9a6ea','#3f4659'][i]}}>{n}</span>)}</div></div>)}</div>
  </Figure>
  <ImageFigure src={mobileRoot+'assets/figures/navigation-cases.png'} alt={c('Navigation observations and reconstructed trajectories','导航观测与重建轨迹')} caption={c('Route-following and object-search examples, including a search that exhausts the action budget. The maps reconstruct recorded trajectories after evaluation; Astra navigates from RGB observations.','路线跟随与物体搜索示例，包括一条耗尽动作预算的搜索轨迹。地图在评测后根据记录重建，Astra 使用 RGB 观测导航。')}/>
  <div className="media-grid">{['rxr-2682','r2r-802','mp3d-bb16cafc25611c30552523a2','hm3d-869e9dd3566a14d1c7ed6d3f'].map(id=><MediaCard key={id} clip={mobileClip(id)}/>)}</div>
  <Note>{c('Replays show recorded primitives at 10 actions/s, with model waiting time omitted. Habitat maps visualize the trajectories after evaluation.','回放按每秒 10 个基础动作播放，省略模型等待时间；Habitat 地图用于评测后的轨迹可视化。')}</Note>
  <FailureAnalysis id="navigation-failures" intro={navigationFailureIntro} cases={navigationFailureCases}/>
  <Conclusion paragraphs={c([
   'As an S2 navigator, Astra has higher SR and SPL than the three evaluated navigation policies on the four local subsets. It follows long instructions across multiple rooms and searches for object categories from a single RGB view. The 92% success rate on RxR is the strongest route-following result in this evaluation; this result reflects high-level navigation decisions rather than low-level motor control.',
   'The remaining errors involve both search efficiency and stopping. In MP3D, 12 of 50 runs stop outside the goal region and 10 exhaust the action budget. R2R route fidelity is slightly below LightNav-0 despite higher task success. Successful arrival, efficient movement and faithful instruction following therefore capture different aspects of navigation capability.'
  ],[
   '作为 S2 导航器，Astra 在四个本地子集上的 SR 和 SPL 均高于所测三种导航策略。它能基于单个 RGB 视角跨房间执行较长指令，并搜索指定类别物体；RxR 的成功率达到 92%，是本次路线跟随评测中最突出的表现。这一结果体现的是高层导航决策能力，不等同于底层运动控制能力。',
   '剩余问题同时涉及搜索效率与停止判断。MP3D 的 50 次运行中，12 次在目标区域外停止，10 次耗尽动作预算；R2R 虽有较高成功率，路线一致性仍略低于 LightNav-0。到达目标、缩短行走路径与准确遵循路线指令，反映了不同的导航能力。'
  ])}/>
  <div className="sec-links"><a href={mobileRoot+'data/navigation-episodes.csv'} download>{c('800 episode records · CSV ↓','800 条 episode 记录 · CSV ↓')}</a><a href={mobileRoot+'data/navigation-summary.csv'} download>{c('Summary · CSV ↓','汇总 · CSV ↓')}</a></div>
 </Section>;
}
VisualNavigation.meta={id:'visual-navigation',title:{en:'Visual Navigation',zh:'视觉导航'}};
