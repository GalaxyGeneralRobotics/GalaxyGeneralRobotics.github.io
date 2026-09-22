import React from 'react';
import {Cite} from '../references.jsx';
import media from '../data/evidence/manipulation-media.json';
import {useCopy,useLanguage} from '../i18n.jsx';
import {viewHref} from '../site.js';
import {Section,Figure,Bars,Details,DataTable,Setup,Conclusion,number} from '../ui.jsx';
import {MediaCard} from '../media.jsx';
import {robolabRows,robodojoRows,publicReferences} from '../data/manipulation.js';
import {ManipulationWorkflow} from './ManipulationWorkflow.jsx';

const publishedModelRefs={'DM0.5':'dm05','GalaxeaVLA (G0.5)':'g05','Xiaomi-Robotics-1':'xiaomi1','OpenWAM-α':'openwam','Meituan-Robotics-0':'meituan0','Hy-Embodied-0.5-VLA':'hy-vla','Spatial Forcing':'spatial-forcing','InternVLA-A1.5':'internvla15','StarVLA-PI_v3':'starvla-pi3','Pi-05':'pi05'};

// The two featured RoboDojo rollouts; full records live in data/robodojo-robolab-gallery.json.
export const manipulationClips=[
 {...media.find(r=>r.id==='mix__fold_clothes__standard__g0__l0'),
  caption:{en:'Astra + π₀.₅ folds the sleeves inward and the hem upward, then returns both arms to their rest poses. The episode passes RoboDojo’s native task check.',zh:'Astra + π₀.₅ 将衣袖内折、下摆上折，再将双臂归位，完成 RoboDojo 的叠衣任务。'}},
 {...media.find(r=>r.id==='gpt__classify_objects__standard__g0__l0'),
  caption:{en:'Astra sorts the objects by category into three baskets and returns both arms to their rest poses. This episode completes in 737 control steps.',zh:'Astra 将物体按类别放入三个篮子并归位双臂，在 737 个控制步内完成任务。'}}
];
// Conclusion of the original manipulation report, with the report-wide method names.
const conclusion={
 en:['Astra already demonstrates strong capabilities as a robot policy: it can propose actions from task semantics, correct goal-alignment errors, perform non-prehensile manipulation, and reason and recover from execution feedback. Its strength lies not only in generating actions, but also in reconsidering what should be done next when exceptional situations arise.',
  'π₀.₅ can be viewed as the architecture’s “cerebellum”: it supplies skilled action trajectories and object-interaction priors with relatively low inference overhead. Building on these priors, Astra judges goals, handles exceptions, and makes targeted corrections. With Astra correcting just 14.4% of executed control steps, their combination achieves a higher success rate on the RoboDojo task subset while consuming fewer tokens than Astra alone.',
  'These results suggest a useful division of labor: let the embodied policy handle the continuous manipulation it performs well, and let the general-purpose model reassess when the goal, geometry, or task progress deviates from expectations. Semantic reasoning and motor experience need not replace one another; they can reinforce each other within the same closed loop.',
  'The RoboLab results add a condition to this interpretation: on the selected semantic pick-and-place tasks, where π₀.₅ is transferred zero-shot, Astra achieves near-perfect performance. Astra + π₀.₅ is slightly below Astra but remains substantially above the π₀.₅ baseline. Whether π₀.₅’s action prior fits the task is an important consideration when interpreting the difference between the two architectures.'],
 zh:['Astra 已展现出很强的机器人策略能力：它能从任务语义出发提出动作，纠正目标对齐错误，进行非抓取操作，并根据执行反馈推理和恢复。它的优势不仅在于生成动作，还在于遇到特殊情况时重新理解“现在应该做什么”。',
  'π₀.₅ 则可以类比为这一架构的“小脑”：以较低的推理开销提供熟练的动作轨迹和物体交互先验。Astra 在其基础上判断目标、处理异常并作出针对性修正。两者结合后，仅 14.4% 的执行控制步由 Astra 修正，就在 RoboDojo 任务子集上获得了更高的成功率，同时比 Astra 直接控制消耗更少的 token。',
  '这些结果指向一种有价值的分工：让具身策略承担它擅长的连续操作，让通用模型在目标、几何或任务进度偏离预期时重新判断。语义推理与动作经验并非互相替代，而是可以在同一个闭环中相互增强。',
  'RoboLab 的结果补充了这一结论的适用条件：在本次以语义抓放为主、π₀.₅ 零样本迁移的任务子集中，Astra 已接近全成功，混合方法略低于 Astra，但仍明显高于 π₀.₅ baseline。π₀.₅ 提供的动作先验是否适合当前任务，是理解两种架构表现差异的重要因素。']
};

export function Manipulation(){
 const c=useCopy(),{language}=useLanguage();
 return <Section id="manipulation" index={c('MANIPULATION / END-EFFECTOR CONTROL','操作 / 末端控制')} title="RoboDojo & RoboLab" subtitle={c('Bimanual manipulation and single-arm transfer','双臂操作与单臂迁移')}>
  <Setup>
   <p>{c('We evaluate Astra and Astra + π₀.₅ on ten RoboDojo tasks: organizing a table, classifying by language, imitating a sorting sequence, arranging the largest number, packing a box, sorting objects, building a tower, making a Kong in Mahjong, folding clothes and putting bottles in a bin. Each method runs each task five times, for 50 episodes per method. The two conditions share the task, scene and evaluation seeds. Number arrangement, packing and folding each use two standard and three randomized layouts; the other tasks use five standard layouts.','我们在 RoboDojo 上评测 Astra 和 Astra + π₀.₅，选择整理桌面、按语言分类、模仿排序顺序、排出最大数字、装箱、物体分类、搭塔、麻将杠牌、叠衣服和瓶子入桶十项任务。每种方法、每项任务运行五次，共 50 次；两种条件逐实例对齐任务、场景与评测 seed。数字摆放、装箱和叠衣各使用两次标准场景与三次随机场景，其余任务使用五个标准布局。')}<Cite ids={["robodojo"]}/></p>
   <p>{c('Task selection spans semantic classification, sequence memory, construction and deformable-object manipulation. We divide the official π₀.₅ success-rate range of 0–72% into four equal intervals and select 6, 2, 1 and 1 tasks from the lowest to highest interval. RoboDojo’s native success rate and subgoal Score (rescaled to 0–100) measure complete task execution and intermediate progress. The π₀.₅ component uses RoboDojo’s task-finetuned weights; published policy results are reweighted to the same task subset.','任务选择覆盖语义分类、顺序记忆、结构搭建和柔性物体操作。按 π₀.₅ 官方成功率，将 0–72% 等分为四个区间，从低到高分别选择 6、2、1、1 项。评测采用 RoboDojo 原生成功率与按 0–100 展示的子目标 Score，分别衡量任务完成情况和中间进展。组合中的 π₀.₅ 使用 RoboDojo 发布的任务微调权重；公开策略结果按相同任务子集重加权。')}<Cite ids={["pi05","robodojo"]}/></p>
   <p>{c('RoboLab evaluates zero-shot transfer to ten single-arm Franka tasks: putting blocks in a bin, retrieving pumpkins from clutter, placing butter on a raisin box, stacking blocks in a specified order, reorienting a red mug, selecting the larger raisin box, placing sauce bottles in a crate, and transferring canned food, yogurt and a Rubik’s cube to their target containers. Each policy runs each task five times; the metric is task success rate. The comparison includes Astra, Astra + π₀.₅, and the DROID-trained π₀.₅, Cosmos3-Nano-Policy and DreamZero policies.','RoboLab 检验单臂 Franka 的零样本迁移，选择积木入箱、杂乱场景取南瓜、黄油放到葡萄干盒上、按指定顺序叠积木、摆正红杯、选择较大的葡萄干盒、酱料瓶入筐，以及罐头、酸奶和魔方放入目标容器十项任务。每种策略、每项任务运行五次，以任务成功率比较 Astra、Astra + π₀.₅，以及基于 DROID 训练的 π₀.₅、Cosmos3-Nano-Policy 和 DreamZero。')}<Cite ids={["robolab","droid","cosmos3","dreamzero"]}/></p>
   <ManipulationWorkflow/>
  </Setup>
  <div className="charts-3">
   <Figure title="RoboDojo" subtitle={c('Success rate · %','成功率 · %')}><Bars rows={robodojoRows('sr')} decimals={1}/></Figure>
   <Figure title="RoboDojo" subtitle={c('Mean Score · 0–100','平均 Score · 0–100')}><Bars rows={robodojoRows('score')} unit="" decimals={2}/></Figure>
   <Figure title="RoboLab" subtitle={c('Success rate · %','成功率 · %')}><Bars rows={robolabRows} decimals={0}/></Figure>
  </div>
  <p className="note">{c('RoboDojo: success n = 50 per method; Score n = 48 for Astra and 50 for Astra + π₀.₅. † Published references use separate evaluation runs, reweighted to the ten selected tasks. RoboLab: 50 trials per policy; the three learned-policy baselines are historical runs on the same task subset.','RoboDojo：每种方法的成功率样本量为 50；Score 的样本量为 Astra 48、Astra + π₀.₅ 50。† 公开策略来自独立评测，按所选十项任务重加权。RoboLab：每策略 50 次；三种 learned policy baseline 均来自同一任务子集上的历史运行。')}</p>
  <Details title={c('All ten published RoboDojo references','RoboDojo 全部十种公开策略参考')}><DataTable headers={[c('Policy','策略'),c('Success · %','成功率 · %'),'Score']} rows={publicReferences.map(r=>[<span>{r.name==='Pi-05'?'π₀.₅':r.name}<Cite ids={publishedModelRefs[r.name]}/></span>,number(r.sr,2),number(r.score,2)])}/></Details>
  <div className="prose"><p>{c('The two benchmarks show that the value of learned action priors depends on the task distribution. Astra + π₀.₅ achieves 48% success on RoboDojo, compared with 26% for Astra, while Astra leads on RoboLab at 98% versus 92%. Rollouts help explain this difference: the task-finetuned policy supplies useful interaction patterns on RoboDojo, and Astra revises actions when the intended object, contact or task stage is misaligned. We observe four recurring patterns.','两个基准表明，learned action prior 的作用取决于任务分布。RoboDojo 上，Astra + π₀.₅ 的成功率为 48%，Astra 为 26%；RoboLab 上则是 Astra 以 98% 领先于组合方法的 92%。执行过程有助于理解这一差异：任务微调策略为 RoboDojo 提供了适用的交互动作，Astra 则在物体选择、接触位置或任务进度偏离目标时修正动作。我们观察到以下四点。')}</p><ul>
   <li>{c('Astra corrects semantic grounding and task progress: it can change the selected object, reveal an occluded target and continue an unfinished task after the policy has stopped.','Astra 能修正目标理解与任务进度判断，包括改变操作对象、移开遮挡，以及在策略停止后继续完成尚未结束的任务。')}</li>
   <li>{c('Targeted intervention can preserve useful motor behavior. On RoboDojo, 85.6% of executed steps follow π₀.₅ proposals and 14.4% are Astra corrections; the combined method raises mean Score from Astra’s 37.81 to 62.60.','针对性介入可以保留策略已有的运动能力。RoboDojo 中，85.6% 的实际控制步沿用 π₀.₅ 候选，14.4% 为 Astra 修正；组合方法的平均 Score 为 62.60，高于 Astra 的 37.81。')}</li>
   <li>{c('Astra can devise alternative transport plans and recover from blocked motion, while sustained contact remains difficult. Rim collisions, slipping and feedback arriving only after an action segment can disrupt otherwise plausible plans.','Astra 能提出不同的搬运方案，并在运动受阻后重新规划；持续接触仍然困难。容器边缘碰撞、物体滑移，以及动作片段结束后才能获得的反馈，都可能破坏原本合理的计划。')}</li>
   <li>{c('The value of a learned prior depends on its fit to the task. Astra + π₀.₅ improves RoboDojo performance and uses 44.8% fewer recorded tokens than Astra. On the selected RoboLab tasks, Astra already succeeds in 49/50 trials, while the combination succeeds in 46/50.','动作先验的价值取决于其与任务的适配程度。Astra + π₀.₅ 改善了 RoboDojo 表现，记录的 token 用量比 Astra 少 44.8%；在所选 RoboLab 任务上，Astra 已完成 49/50 次，组合方法完成 46/50 次。')}</li>
  </ul></div>
  <div className="media-grid">{manipulationClips.slice().reverse().map(clip=><MediaCard key={clip.id} clip={clip}/>)}</div>
  <Conclusion paragraphs={conclusion[language]}/>
  <div className="sec-links"><a href={viewHref('gallery',language,{setting:'manipulation',level:'s1'})}>{c('Manipulation rollout gallery ↗','操作轨迹视频库 ↗')}</a><a href="joint-data/robodojo-scores.csv" download>{c('RoboDojo scores · CSV ↓','RoboDojo 得分 · CSV ↓')}</a><a href="joint-data/robolab-scores.csv" download>{c('RoboLab per-task successes · CSV ↓','RoboLab 逐任务成功数 · CSV ↓')}</a></div>
 </Section>;
}
Manipulation.meta={id:'manipulation',title:{en:'RoboDojo & RoboLab',zh:'RoboDojo 与 RoboLab'}};
