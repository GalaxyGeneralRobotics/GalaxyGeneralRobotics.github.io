import React from 'react';
import {useCopy,useLanguage} from '../i18n.jsx';
import {Cite} from '../references.jsx';
import {useReveal} from '../motion.js';
import {viewHref} from '../site.js';

// Five findings that hold across the six domains. Every number is reported on the domain page
// each finding links to; the citations place the observation in the wider literature.
const insights=[
 {n:'01',view:'loco-manipulation',refs:['kahneman','helix','hirobot'],
  title:{en:'Astra is strongest when it operates at S2',zh:'Astra 在 S2 层最能发挥优势'},
  figure:{value:'48% / 61.6',label:{en:'hybrid results: RoboDojo success and dexterous mean Score after Astra is paired with embodied policies',zh:'组合结果：Astra 与具身策略结合后的 RoboDojo 成功率与灵巧操作平均 Score'}},
  body:{en:'Across the domains, Astra’s clearest contribution is S2 reasoning: choosing a goal, correcting intent and directing a skill. On RoboDojo, Astra + π₀.₅ reaches 48% success versus 26% for Astra alone; on dexterous tasks, the hybrid mean Score is 61.6 versus 16.6 for Astra alone and 44.2 for π₀.₅. HumanoidBench shows the same division: Astra chooses task-level commands while Humanoid-GPT supplies the motor skills. The strongest results come from the combined system, not from asking the reasoning model to replace every lower layer.',
   zh:'综合各领域结果，Astra 最清晰的价值在 S2 推理层：选择目标、修正意图并调度技能。RoboDojo 上，Astra + π₀.₅ 的成功率为 48%，Astra 单独运行仅 26%；灵巧操作中，组合方法平均 Score 为 61.6，Astra 单独为 16.6，π₀.₅ 为 44.2。HumanoidBench 也体现了同样的分工：Astra 选择任务级指令，Humanoid-GPT 提供运动技能。最强结果来自组合系统，而不是让推理模型替代所有底层。'}},

 {n:'02',view:'locomotion',refs:['moravec','saycan'],
  title:{en:'Embodied policies carry contact and balance',zh:'具身策略承担接触与平衡'},
  figure:{value:'6 / 6 vs 4 / 6',label:{en:'learned policy versus Astra + ScaleTrack + policy.md on held-out stair geometries',zh:'留出楼梯几何上 learned policy 与 Astra + ScaleTrack + policy.md 的通过数'}},
  body:{en:'Astra can decide what to do, but lower levels still need a policy that has learned contact and balance. The direct-control results make this visible: the learned tracker completes a ten-second walk while Astra’s joint-target skill lasts about one second, and RL stays within the orientation tolerance for 76.90% of cylinder-rotation steps versus 0.51% for Astra. At S1, textual adaptation improves Astra + ScaleTrack from 0/6 to 4/6 on stairs, but the learned locomotion policy still completes 6/6. Astra supplies useful plans and corrections; embodied policies supply the motor regularity.',
   zh:'Astra 可以判断应该做什么，但更底层仍需要已经学会接触与平衡的策略。直接控制结果清楚地显示了这一点：learned tracker 能完成十秒行走，而 Astra 的关节目标技能约一秒就终止；圆柱旋转中，RL 处于朝向容差内的步数占比为 76.90%，Astra 仅 0.51%。在 S1 层，文本适应使 Astra + ScaleTrack 的楼梯通过数从 0/6 提升到 4/6，但 learned locomotion policy 仍完成 6/6。Astra 提供有用的规划与修正，具身策略提供运动的稳定性。'}},

 {n:'03',view:'gripper-manipulation',refs:['saycan'],
  title:{en:'Composition works when the embodied prior fits the task',zh:'具身先验适配任务时，组合才能发挥作用'},
  figure:{value:'98 / 92',label:{en:'RoboLab success — Astra alone above Astra + π₀.₅, the reverse of RoboDojo',zh:'RoboLab 成功率：Astra 单独高于 Astra + π₀.₅，与 RoboDojo 正好相反'}},
  body:{en:'The hybrid is not automatically better; the embodied prior must fit the task. A task-finetuned π₀.₅ nearly doubles RoboDojo success, 26% to 48%. On RoboLab, the zero-shot π₀.₅ condition is weaker and the same pairing falls below Astra alone, 92% against 98%; on unseen kitchen tasks, the hybrid is 9/25 against Astra’s 14/25. The lesson is to give Astra a signal for when to trust, edit or bypass the embodied policy — the role SayCan assigns to affordance values.',
   zh:'组合方法并不会自动变好，具身先验必须适配当前任务。任务微调的 π₀.₅ 让 RoboDojo 成功率从 26% 近乎翻倍到 48%；但在 RoboLab 中，零样本 π₀.₅ 本身较弱，同样的组合低于 Astra 单独运行（92% 对 98%）；在未见厨房任务上，组合方法为 9/25，Astra 为 14/25。关键是让 Astra 判断何时信任、修改或绕过具身策略，这正是 SayCan 中 affordance value 所承担的作用。'}},

 {n:'04',view:'locomotion',refs:['reflexion','voyager','cap'],
  title:{en:'Textual adaptation improves S1 planning, at a high compute cost',zh:'文本适应能改善 S1 规划，但计算成本很高'},
  figure:{value:'0 → 4 / 6',label:{en:'stair traversals gained on held-out geometries by rewriting policy.md, with no weight update',zh:'不更新任何权重、只重写 policy.md，在留出几何上获得的楼梯通过数'}},
  body:{en:'Twelve rounds of rollout, reflection and rewriting a plain-text policy.md lift stairs from 0/6 to 4/6 on unseen geometries, with no weight update — Reflexion and Voyager arriving at physical control. The policy now lives in weights, in a document and in Astra-written trajectory generators, and only the document can be read line by line. The cost is structural: the document is re-read at every decision, so calls grow from 35,425 to 126,720 tokens and a scene takes 1,707.87 s against 0.79 s for the learned policy. Text learns fast and runs slow.',
   zh:'对一份纯文本 policy.md 做十二轮「运行—复盘—改写」，就把未见几何上的楼梯通过从 0/6 提到 4/6，一个权重都没更新——这是 Reflexion 与 Voyager 走进了物理控制。策略如今同时存在于权重、文档和 Astra 写的轨迹生成程序里，只有文档可以逐行阅读。代价是结构性的：文档每次决策都要重读，单次调用从 35,425 增加到 126,720 token，一个场景耗时 1707.87 秒，learned policy 只需 0.79 秒。文本学得快，运行得慢。'}},

 {n:'05',view:'locomotion',refs:['rtc','act','helix'],
  title:{en:'Astra’s current cadence is not real-time motor control',zh:'Astra 当前的决策节奏还不足以承担实时运动控制'},
  figure:{value:'0.080 s / 39.86 s',label:{en:'mean planning latency, Passage against Astra, in the same scene with the same tracker',zh:'相同场景、相同 tracker 下的平均规划延迟：Passage 对 Astra'}},
  body:{en:'The remaining limitation is timing. Astra sees the world at segment boundaries, so a slip inside a segment is detected late; in the in-hand combined task its 120-decision budget ends around 6–8 s while RL continues to 15 s. In the clutter experiment, Astra’s mean model latency is 39.86 s per plan versus 0.080 s for Passage, with physics paused during inference. This is why the practical architecture is hierarchical: Astra can occupy S2, while S0/S1 policies run the high-frequency control loop.',
   zh:'剩下的主要限制是实时性。Astra 只在动作段边界看到世界，段内滑落要延迟到下一段才会被发现；手内联合任务中，Astra 的 120 次决策预算约在 6–8 秒耗尽，而 RL 可以持续运行 15 秒。在避障实验中，Astra 每次规划的平均模型延迟为 39.86 秒，Passage 为 0.080 秒，推理期间物理暂停。这也说明了分层架构的实际意义：Astra 适合处于 S2 层，S0/S1 策略负责高频控制闭环。'}},
];

function Insight({item}){
 const c=useCopy(),{language}=useLanguage();
 return <li ref={useReveal()}>
  <span className="insight-n">{item.n}</span>
  <div className="insight-body">
   <h3>{c(item.title.en,item.title.zh)}</h3>
   <p>{c(item.body.en,item.body.zh)}<Cite ids={item.refs}/></p>
   <a className="arrow-link" href={viewHref(item.view,language)}>{c('Evidence','查看依据')}<i aria-hidden="true">→</i></a>
  </div>
  <p className="insight-figure"><strong>{item.figure.value}</strong><span>{c(item.figure.label.en,item.figure.label.zh)}</span></p>
 </li>;
}

export function Insights(){
 const c=useCopy();
 return <section className="insights" id="insights">
  <header className="band-head band" ref={useReveal()}>
   <span className="eyebrow">{c('Findings','核心发现')}</span>
   <h2>{c('Key Findings and Discussion','主要发现与讨论')}</h2>
   <p>{c('One thesis and its consequences: Astra is a strong S2 reasoning layer, while embodied policies supply the real-time skills below it. The highest task success comes from composing the two.',
    '一个论点及其推论：Astra 是很强的 S2 推理层，具身策略提供其下方的实时运动技能；将二者组合起来，才能获得更高的最终任务成功率。')}</p>
  </header>
  <ol className="insight-list band">{insights.map(item=><Insight key={item.n} item={item}/>)}</ol>
 </section>;
}
