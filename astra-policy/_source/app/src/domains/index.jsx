import {dexHybridSuccesses} from '../data/dexterous-s1.js';
import {mobileClip} from '../data/mobile.js';
import {domainOverviews} from '../data/domain-overviews.js';
import {domainCategories} from '../site.js';
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

// Six categories retain their full domain pages. Landing summaries use a
// narrative overview and two outcome videos instead of repeating score charts.
const domainContent=[
 {id:'gripper-manipulation',
  short:{en:'Gripper',zh:'夹爪操作'},
  kicker:{en:'RoboDojo · RoboLab',zh:'RoboDojo · RoboLab'},
  lead:{en:'20 bimanual and single-arm tasks with grippers. Astra plans and corrects intent; π₀.₅ supplies continuous action patterns when the task prior fits.',
   zh:'20 项双臂与单臂夹爪操作任务。Astra 负责规划并修正意图；任务先验适配时，由 π₀.₅ 提供连续动作模式。'},
  stat:{value:'48.0% vs 26.0%',caption:{en:'RoboDojo success: Astra + π\u2080.\u2085 versus Astra alone.',zh:'RoboDojo 成功率：Astra + π\u2080.\u2085 对比 Astra 单独运行。'}},
  clip:()=>manipulationClips[0],
  sections:[Manipulation]},

 {id:'dexhand-manipulation',
  short:{en:'DexHand',zh:'灵巧手操作'},
  kicker:{en:'10 dexterous tasks · Sharpa & Allegro',zh:'10 项灵巧操作任务 · Sharpa 与 Allegro'},
  lead:{en:'One hand, two levels: scene-level correction of a dexterous policy, and direct finger control against RL.',
   zh:'同一只手的两个层级：对灵巧策略的场景级修正，以及与 RL 对比的直接手指控制。'},
  stat:{value:'61.6 vs 16.6',caption:{en:'Mean Score: Astra + π\u2080.\u2085 versus Astra alone. In-hand RL still holds 76.90% against 0.51%.',zh:'平均 Score：Astra + π\u2080.\u2085 对比 Astra 单独运行。手内控制中 RL 仍为 76.90%，Astra 仅 0.51%。'}},
  clip:()=>dexHybridSuccesses.find(r=>r.taskId==='07_egg_into_tray'),
  sections:[DexterousManipulation,DexterousS0]},

 {id:'mobile-manipulation',
  short:{en:'Mobile Manip.',zh:'移动操作'},
  kicker:{en:'RoboCasa365 · 15 kitchen tasks · 75 episodes per condition',zh:'RoboCasa365 · 15 项厨房任务 · 每种条件 75 次运行'},
  lead:{en:'Kitchen tasks combining end-effector, gripper, base and torso control, with atomic seen, composite seen and composite unseen task groups.',
   zh:'结合末端、夹爪、底盘与躯干控制的厨房任务，覆盖已见原子、已见复合及未见复合三类任务。'},
  stat:{value:'29 / 75',caption:{en:'Astra + π₀.₅ successes, versus 25 for Astra and 17 for π₀.₅; Astra alone leads on unseen composite tasks.',zh:'Astra + π₀.₅ 成功数；Astra 为 25 次，π₀.₅ 为 17 次，未见复合任务上 Astra 单独更好。'}},
  clip:()=>({...mobileClip('robocasa-KettleBoiling-00'),initialView:'comparison'}),
  sections:[MobileManipulation]},

 {id:'navigation',
  short:{en:'Navigation',zh:'导航'},
  kicker:{en:'VLN-CE R2R / RxR · ObjectNav MP3D / HM3D v2',zh:'VLN-CE R2R / RxR · ObjectNav MP3D / HM3D v2'},
  lead:{en:'One RGB view and an instruction. 50 fixed episodes per dataset, compared with learned navigation policies.',
   zh:'仅有单目 RGB 与一句指令。每个数据集 50 个固定 episode，与导航策略进行对照。'},
  stat:{value:'4 / 4',caption:{en:'Local datasets with strong Astra S2 navigation results on both success rate and SPL. RxR reaches 92%.',zh:'Astra 在本地四个数据集上均取得较强的 S2 导航结果，并同时报告成功率与 SPL。RxR 达到 92%。'}},
  clip:()=>mobileClip('rxr-2682'),
  sections:[VisualNavigation]},

 {id:'locomotion',
  short:{en:'Locomotion',zh:'运动控制'},
  kicker:{en:'LAFAN1 · flat ground · stairs & gaps · clutter',zh:'LAFAN1 · 平地控制 · 楼梯与沟隙 · 杂乱场景'},
  lead:{en:'From direct joint control and motion tracking to terrain traversal and obstacle avoidance, including five-point and 14-point motion-reference interfaces.',
   zh:'从直接关节控制与运动追踪，到地形通过和避障，涵盖五点与 14-point 运动参考接口。'},
  stat:{value:'0 → 4 / 6',caption:{en:'Stair traversals after textual adaptation, with no weight update; the learned policy completes 6/6.',zh:'文本适应后、无需更新权重的楼梯通过数；learned policy 完成 6/6。'}},
  clip:()=>s0Clip('s0-t3'),
  sections:[MotionTracking,MotorControl,Terrain,Obstacles,ClutterInterfaces]},

 {id:'loco-manipulation',
  short:{en:'Loco Manip.',zh:'运动操作'},
  kicker:{en:'HumanoidBench · Unitree G1 · 30 tasks',zh:'HumanoidBench · Unitree G1 · 30 项任务'},
  lead:{en:'Coordinating body movement and object interaction through frozen humanoid skills, with the complete 30-task HumanoidBench evaluation and supplementary demonstrations.',
   zh:'通过冻结的人形技能协调身体运动与物体交互，保留 HumanoidBench 完整 30 项任务评测及补充演示。'},
  stat:{value:'13 / 30',caption:{en:'Task comparisons where the Astra + Humanoid-GPT S2 system is above all three published H1 references; six means clear native thresholds.',zh:'Astra + Humanoid-GPT 这一 S2 组合系统高于全部三个公开 H1 参考的任务比较数；6 项任务均值达到原生阈值。'}},
  clip:()=>humanoidBenchClip('push'),
  sections:[Humanoid]}
];
export const domains=domainCategories.map((category,i)=>({
 ...domainContent.find(r=>r.id===category.id),
 ...domainOverviews[category.id],
 index:String(i+1).padStart(2,'0'),name:{en:category.en,zh:category.zh}
}));
export const domainById=new Map(domains.map(r=>[r.id,r]));
