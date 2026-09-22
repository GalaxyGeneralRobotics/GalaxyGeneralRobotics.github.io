import React,{useState} from 'react';
import results from '../data/results.json';
import {useCopy} from '../i18n.jsx';
import {Section,Figure,Bars,Note,Details,DataTable,Toggle,Setup,Conclusion,number} from '../ui.jsx';
import {MediaCard} from '../media.jsx';

export function Terrain(){
  const c=useCopy(),[terrain,setTerrain]=useState('stairs'),get=id=>results.videos.find(v=>v.id===id);
  const labels={adapted:'Astra + ScaleTrack + policy.md',unadapted:'Astra + ScaleTrack',baseline:'Learned policy'};
  const rows=results.terrain.filter(r=>r.terrain===terrain);
  return <Section id="terrain" index={c('S1 / TERRAIN & LOCOMOTION','S1 / 地形与运动')} title={c('Terrain & Locomotion','地形与运动')} subtitle={c('Astra five-point planning + ScaleTrack · six scenes per terrain','Astra 五点规划 + ScaleTrack · 每种地形六个场景')}>
    <Setup methods={[
     ['Astra + ScaleTrack',c('Astra generates motion references for the pelvis, both wrists and both ankles. A frozen ScaleTrack policy converts these five-point references into executable body motion.','Astra 生成骨盆、双腕与双踝的运动参考，冻结的 ScaleTrack policy 将五点参考转换为机器人可执行的全身动作。')],
     ['Astra + ScaleTrack + policy.md',c('The same model and tracker additionally receive a text document developed through earlier rollouts and model reflection. Astra reads this accumulated control guidance when planning the next reference.','在相同模型与 tracker 上，额外提供一份通过先前 rollout 和模型复盘逐步修订的文本控制指南。Astra 在规划参考轨迹时读取其中积累的经验。')],
     ['Learned policy',c('A trained locomotion policy executes stair climbing and gap traversal.','训练后的 locomotion policy 执行上楼与跨沟动作。')]
    ]}>
     <p>{c('We evaluate two terrain tasks: ascending a staircase and crossing a gap while maintaining balance. Each configuration is tested on six scenes of each terrain. The main metric is the number of successful traversals out of six. We also report executed simulation time, elapsed wall-clock time and model token use. The stair scenes vary in dimensions and step counts, and their geometries are held out from policy-document adaptation.','评测包含两类地形任务：保持平衡向上爬楼梯，以及跨越沟隙。每种配置在每类地形的六个场景中测试，主指标为六个场景中的成功通过数；另记录仿真运动时间、实际耗时与模型 token 用量。测试楼梯的尺寸和阶数各不相同，其几何在策略文档适应阶段未出现。')}</p>
     <p>{c('Here, policy.md is a text document rather than a set of model weights. During adaptation, Astra executes a rollout, reviews the resulting behavior and revises the document for the next attempt; the gap study uses 12 such rounds. Evaluation compares the same Astra model and ScaleTrack tracker with and without this accumulated document. Both Astra configurations use high reasoning, with model and tracker weights frozen throughout. Physics pauses during model inference.','这里的 policy.md 是文本形式的控制指南。适应阶段通过运行 rollout、由 Astra 复盘执行表现，再修订文档供下一次尝试使用；沟隙实验进行了 12 轮这样的迭代。测试时，比较相同 Astra 模型和 ScaleTrack tracker 使用或不使用这份经验文档的表现。两种配置均采用 high 推理，模型与 tracker 权重始终冻结，模型推理期间仿真暂停。')}</p>
    </Setup>
    <Figure title={c('Traversal success','地形通过结果')} subtitle={c('Successes / 6 test scenes','成功数 / 6 个测试场景')} caption={c('Each terrain contains six test scenes per configuration. The two Astra configurations share the model and ScaleTrack tracker; policy.md supplies the control guidance accumulated during rollout and reflection. The learned-policy baseline completes all six scenes of each terrain.','每种配置在每类地形上均测试六个场景。两种 Astra 配置使用相同模型与 ScaleTrack tracker，policy.md 提供 rollout 和复盘中积累的控制经验。Learned policy 在两类地形上均完成六个场景。')}>
      <div className="charts-2">{['stairs','gaps'].map(t=><div key={t}><div className="chart-title"><h4>{t==='stairs'?c('Stairs','楼梯'):c('Gaps','沟隙')}</h4></div><Bars max={6} unit="" rows={results.terrain.filter(r=>r.terrain===t).map(r=>({label:labels[r.method],method:r.method,value:r.successes,display:r.successes+'/6'}))}/></div>)}</div>
    </Figure>
    <div className="toolbar"><h3>{c('Traversal rollouts','地形通过回放')}</h3><Toggle label={c('Terrain videos and data','地形视频与数据')} value={terrain} onChange={setTerrain} options={[[ 'stairs',c('Stairs','楼梯')],['gaps',c('Gaps','沟隙')]]}/></div>
    <div className={'media-grid'+(terrain==='stairs'?'':' is-three')}>{(terrain==='stairs'?['stairs-unadapted','stairs-baseline']:['gaps-unadapted-success','gaps-adapted-success','gaps-baseline-1']).map(id=><MediaCard key={id} clip={get(id)}/>)}</div>
    <Note>{terrain==='stairs'?c('Colored trajectories show planned motion; white trajectories show the robot’s actual five-point motion.','彩色轨迹表示规划运动；白色轨迹表示机器人实际五点运动。'):c('The gap videos above are successful examples. Failed adapted and unadapted runs are also available in the rollout gallery.','上方沟隙视频为成功示例；gallery 同时收录加载与未加载文档时的失败轨迹。')}</Note>
    <Figure title={c('Simulation time and wall-clock time','仿真时间与实际耗时')} subtitle={terrain==='stairs'?c('Stair climbing · mean over all six scenes','楼梯攀爬 · 全部六个场景的均值'):c('Gap traversal','沟隙通过')} caption={c('Physics pauses during GPT inference. Simulation time measures executed motion; wall time includes inference and the evaluation pipeline. Stair times average all six scenes; gap times average successful episodes. Tokens per scene average all six test scenes in both tasks.','GPT 推理时物理暂停。仿真时间统计实际执行的运动；实际耗时包含推理与评测流程。楼梯时间取全部六个场景均值，沟隙时间取成功 episode 均值；两类任务的每场景 token 均值都覆盖全部六个测试场景。')}>
      <DataTable headers={[c('Method','方法'),c('Simulation (s)','仿真（秒）'),c('Wall clock (s)','实际耗时（秒）'),c('Tokens / scene','每场景 tokens')]} rows={rows.map(r=>[labels[r.method],number(r.sim_s,2),number(r.wall_s,2),number(r.tokens_per_scene)])}/>
    </Figure>
    <Details title={c('Adaptation and token accounting','文档适应与 token 统计')}>
      <DataTable headers={[c('Metric','指标'),c('Stairs · with notes','楼梯 · 加载文档'),c('Stairs · without','楼梯 · 未加载'),c('Gaps · with notes','沟隙 · 加载文档'),c('Gaps · without','沟隙 · 未加载')]} rows={[
        [c('Test calls','测试调用数'),'465','14','99','60'],[c('Adaptation tokens','文档适应 tokens'),'34,871,202','—','4,294,705','—'],
        [c('Test tokens / scene','测试 tokens / 场景'),'9,820,852','495,959','767,654','286,246'],
        [c('Gap test tokens · total','沟隙测试 tokens · 总计'),'—','—','4,605,926','1,717,473']
      ]}/><p>{c('Token means include failed test episodes and count input plus output, including cached input. Stair tokens per call are 126,720 with notes and 35,425 without. Gap document adaptation spans 12 rounds.','token 均值包含失败测试 episode，统计输入与输出并包含缓存输入。楼梯每次调用分别为 126,720（加载文档）与 35,425（未加载）。沟隙文档适应共 12 轮。')}</p>
    </Details>
    <Conclusion paragraphs={c([
 'Supplying the control document raises stair success from 0/6 to 4/6 and gap success from 1/6 to 3/6 with the same Astra model and frozen tracker. This improvement comes from accumulated textual guidance used during planning; the learned-policy baseline completes all six scenes in both tasks.',
 'Traversal also requires substantially more elapsed time with Astra. Averaged over all six stair scenes, the document-guided configuration uses 33.51 s of simulation and 1707.87 s of wall-clock time, compared with 6.24 s and 0.79 s for the learned policy. The results show progress from rollout-based adaptation, together with a continuing gap in traversal reliability and planning latency.'
 ],[
 '在相同 Astra 模型与冻结 tracker 下，加入控制经验文档后，楼梯成功数由 0/6 提升至 4/6，沟隙由 1/6 提升至 3/6。改善来自规划时利用累计文本经验；learned policy 在两类任务中均完成全部六个场景。',
 'Astra 的地形通过也需要更多实际时间。按全部六个楼梯场景取均值，使用文档的配置为 33.51 秒仿真时间、1707.87 秒实际耗时，learned policy 分别为 6.24 秒与 0.79 秒。Rollout 适应带来了进展，通过可靠性与规划延迟仍存在差距。'
 ])}/>
  <div className="sec-links"><a href="joint-data/terrain.csv" download>{c('Terrain data CSV ↓','地形数据 CSV ↓')}</a></div>
  </Section>;
}
Terrain.meta={id:'terrain',title:{en:'Terrain & Locomotion',zh:'地形与运动'}};
