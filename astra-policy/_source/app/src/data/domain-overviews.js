import results from './results.json';
import manipulationMedia from './evidence/manipulation-media.json';
import {dexDirectFailures} from './dexterous-s1.js';
import {dexS0Clip} from './dex-s0.js';
import {mobileClip} from './mobile.js';
import {humanoidBenchClip} from './humanoidbench.js';
import {roboDojoMeanTokens,millionTokens} from './token-usage.js';

const astraTokens=millionTokens(roboDojoMeanTokens.astra);
const hybridTokens=millionTokens(roboDojoMeanTokens.hybrid);
const savedTokens=(100*(1-roboDojoMeanTokens.hybrid/roboDojoMeanTokens.astra)).toFixed(1);
const featured=(clip,en,zh)=>({...clip,title:{en,zh}});
// This selected record is also retained in robodojo-robolab-gallery.json.
// Keep the landing page independent of the complete gallery payload.
const gripperFailure={
 id:'gpt__pack_objects_into_box__standard__g0__l0',domain:'manipulation',benchmark:'RoboDojo',method:'gpt',outcome:'failure',
 title:{en:'Astra · packing objects into a box',zh:'Astra · 装箱未完成'},
 caption:{en:'Astra partially completes the packing task but does not satisfy the full task check; native Score is 0.5. Objects must be placed in the box with the instructed orientation, followed by arm reset.',zh:'Astra 部分完成装箱，但未通过完整任务判据，原生 Score 为 0.5。任务要求物体入箱、满足指定朝向，并归位双臂。'},
 video:'media/rollouts/gpt__pack_objects_into_box__standard__g0__l0.mp4',poster:'media/posters/gpt__pack_objects_into_box__standard__g0__l0.jpg',duration:52.04,
 paired:'mix__pack_objects_into_box__standard__g0__l0'
};
const dexSuccess={...dexS0Clip('translation_sample_001'),statusLabel:{en:'Astra · success',zh:'Astra · 成功'}};

// Each overview is one concise paragraph grounded in the reported results.
export const domainOverviews={
 'gripper-manipulation':{
  overview:{
   en:`Astra performs semantic sorting and pick-and-place, reaching 26% success on RoboDojo and 98% on RoboLab. Adding π₀.₅ raises RoboDojo success to 48% and reduces mean tokens per trajectory from ${astraTokens} to ${hybridTokens}, a ${savedTokens}% reduction. The benefit depends on the task: on RoboLab, the hybrid reaches 92%, below Astra alone.`,
   zh:`Astra 可完成语义分类与抓放，在 RoboDojo 和 RoboLab 上的成功率分别为 26% 与 98%。与 π₀.₅ 组合后，RoboDojo 成功率升至 48%，平均每条轨迹的 token 消耗由 ${astraTokens} 降至 ${hybridTokens}，减少 ${savedTokens}%。组合收益依赖任务适配：RoboLab 上组合方法为 92%，低于 Astra 单独运行。`
  },
  overviewClips:[featured(manipulationMedia.find(r=>r.id==='gpt__classify_objects__standard__g0__l0'),'Astra · sorting objects into baskets','Astra · 将物体分类入篮'),gripperFailure]
 },
 'dexhand-manipulation':{
  overview:{
   en:'Astra makes partial progress on grasping and placement, but stable grasp and continuous in-hand control remain difficult. Adding π₀.₅ raises mean Score from 16.6 to 61.6, above π₀.₅ alone at 44.2: the policy sustains finger motion while Astra corrects placement.',
   zh:'Astra 可完成部分抓取与放置子目标，但稳定抓握和持续手内控制仍较弱。与 π₀.₅ 组合后，平均 Score 从 16.6 提升至 61.6，高于 π₀.₅ 单独的 44.2，体现了手指控制与场景修正的互补作用。'
  },
  overviewClips:[featured(dexSuccess,'Astra / RL · in-hand translation','Astra / RL · 手内平移对照'),dexDirectFailures[0]]
 },
 'mobile-manipulation':{
  overview:{
   en:'Astra coordinates base and gripper actions for kitchen tasks, completing 25/75 RoboCasa365 trials; adding π₀.₅ increases this to 29/75. Gains concentrate on seen tasks, while Astra alone performs better on unseen composite tasks (14/25 versus 9/25).',
   zh:'Astra 能协调底盘与夹爪完成厨房操作，在 RoboCasa365 上完成 25/75 次任务，与 π₀.₅ 组合后增至 29/75。增益主要来自已见任务；未见复合任务上，Astra 单独运行更好（14/25 对 9/25）。'
  },
  overviewClips:[featured(mobileClip('robocasa-RecycleBottlesByType-01'),'Astra · sorting bottles by material','Astra · 按材质分类瓶子'),featured(mobileClip('robocasa-CoffeeSetupMug-03'),'Astra · coffee-mug setup','Astra · 咖啡杯准备')]
 },
 navigation:{
  overview:{
   en:'Using a single RGB view, Astra follows long instructions and searches for objects, outperforming the evaluated baselines in success rate and SPL on each of the four local subsets; RxR success reaches 92%. Failures mainly involve inefficient search and premature stopping.',
   zh:'Astra 仅凭单目 RGB 即可执行长路线指令与物体搜索，在四个本地子集上的成功率和 SPL 均高于各子集内所测的策略，RxR 成功率达 92%。主要失败来自低效搜索与提前停止。'
  },
  overviewClips:[featured(mobileClip('rxr-2682'),'Astra · following a long route instruction','Astra · 执行长路线指令'),featured(mobileClip('r2r-802'),'Astra · stopping outside the goal region','Astra · 在目标区域外停止')]
 },
 locomotion:{
  overview:{
   en:'Astra can directly stand for 30 seconds, but sustained locomotion and motion tracking remain unreliable. With ScaleTrack executing motion references, adding a control document raises stair success from 0/6 to 4/6 and gap success from 1/6 to 3/6. Document-guided tests average 9.82M and 0.77M tokens per scene, respectively, over all six scenes in each task, excluding prior document adaptation.',
   zh:'Astra 可直接维持站立 30 秒，但持续运动与动作追踪仍不稳定。在 ScaleTrack 执行运动参考的基础上，加入控制文档使楼梯通过数从 0/6 提升至 4/6、沟隙从 1/6 提升至 3/6。文档引导测试按各类全部六个场景取均值，每场景分别消耗 9.82M 和 0.77M tokens，不含前期文档适应。'
  },
  overviewClips:[featured(results.videos.find(r=>r.id==='flat-stand'),'Astra · standing for 30 seconds','Astra · 维持站立 30 秒'),featured(results.videos.find(r=>r.id==='flat-walk'),'Astra · walking terminated by foot slip','Astra · 行走因脚滑移终止')]
 },
 'loco-manipulation':{
  overview:{
   en:'Astra directs frozen Humanoid-GPT skills to coordinate movement and interaction, succeeding at pushing while struggling with door opening. The combined system exceeds all three published H1 references on 13/30 tasks, although robot and training protocols differ.',
   zh:'Astra 调度冻结的 Humanoid-GPT 技能完成移动与交互，能够推箱，但开门仍较困难。组合系统在 30 项任务中的 13 项高于全部三个公开 H1 参考，不过机器人与训练协议不同。'
  },
  overviewClips:[featured(humanoidBenchClip('push'),'Astra + Humanoid-GPT · pushing a box','Astra + Humanoid-GPT · 推箱'),featured(humanoidBenchClip('door'),'Astra + Humanoid-GPT · opening a door','Astra + Humanoid-GPT · 开门')]
 }
};
