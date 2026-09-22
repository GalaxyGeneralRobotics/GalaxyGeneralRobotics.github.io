import React from 'react';
import {useCopy,useLanguage} from '../i18n.jsx';
import {Cite} from '../references.jsx';
import {useReveal} from '../motion.js';
import {viewHref} from '../site.js';

// Five findings that hold across the six domains. Every number is reported on the domain page
// each finding links to; the citations place the observation in the wider literature.
const insights=[
 {n:'01',view:'humanoid',refs:['kahneman','helix','hirobot'],
  title:{en:'The interface, not the task, decides where Astra wins',zh:'决定 Astra 胜负的是接口层级，而不是任务'},
  figure:{value:'13 / 30 → 1.04 s',label:{en:'the same model: leads 13 HumanoidBench tasks when it issues commands, survives 1.04 s when it writes joint targets',zh:'同一个模型：下达任务指令时在 13 项 HumanoidBench 任务上领先，直接写关节目标时只存活 1.04 秒'}},
  body:{en:'Sort the six domains by the level at which Astra enters the loop and a gradient appears. Issuing task-level commands, it leads all four navigation subsets and 13 of 30 HumanoidBench tasks. Reviewing a learned policy, it wins or loses with that policy. Writing joint targets every step, it fails outright: 1.04 s of walking against a tracker’s 10 s. Deployed systems already split the work this way — Helix runs a 7–9 Hz language model over a 200 Hz motor policy — and these results show why: one level too low, and the drop is a cliff, not a slope.',
   zh:'按 Astra 进入闭环的层级排列六个领域，就能看到一条梯度。下达任务级指令时，它在四个导航子集和 30 项 HumanoidBench 任务中的 13 项领先；审核学习策略时，胜负跟随那个策略；逐步写关节目标时则直接失败：行走存活 1.04 秒，tracker 是 10 秒。已部署的系统本就这样分工——Helix 用 7–9 Hz 的语言模型驾驭 200 Hz 的运动策略——而这些结果说明了原因：低一层，就是断崖，不是斜坡。'}},

 {n:'02',view:'manipulation',refs:['moravec','saycan'],
  title:{en:'Gains come from deciding what; losses come from making contact',zh:'增益来自决定「做什么」，损失来自「接触」'},
  figure:{value:'−193 → 877',label:{en:'HumanoidBench Push return once a calibrated contact fragment was added to the skill — not to the prompt',zh:'HumanoidBench Push 的回报：把校准过的接触片段加进技能、而不是加进提示词之后'}},
  body:{en:'Where Astra helps, it edits intent: on RoboDojo it rewrites 14.4% of steps — change the object, clear an occluder, resume — and mean Score climbs from 37.81 to 62.60. Where it fails, the failure is physical: rims, slips, a handle reached but never turned. Push makes the point cleanly: the reasoning did not change, the skill gained a contact fragment, and the return went from −193.2 to 877.3. Moravec’s paradox in one experiment, and SayCan’s lesson in a stronger form — a model can choose among the behaviors a skill library affords, not summon ones it lacks.',
   zh:'Astra 起作用的地方改的是意图：在 RoboDojo 上它只改写 14.4% 的步——换物体、移开遮挡、接着做完——平均 Score 就从 37.81 升到 62.60。它失败的地方是物理的：撞边缘、滑脱、摸到把手却拧不动。Push 把这一点讲得最清楚：推理没变，技能补了一段接触片段，回报从 −193.2 变成 877.3。这是一次实验里的 Moravec 悖论，也是 SayCan 教训的加强版——模型能在技能库提供的行为里选择，却召唤不出它没有的行为。'}},

 {n:'03',view:'manipulation',refs:['saycan'],
  title:{en:'A learned prior is a bet on the distribution it was fitted to',zh:'学习到的先验，是对其拟合分布的一次押注'},
  figure:{value:'98 / 92',label:{en:'RoboLab success — Astra alone above Astra + π₀.₅, the reverse of RoboDojo',zh:'RoboLab 成功率：Astra 单独高于 Astra + π₀.₅，与 RoboDojo 正好相反'}},
  body:{en:'The hybrid is not monotonically better. A task-finetuned π₀.₅ nearly doubles RoboDojo success, 26% to 48%. A zero-shot π₀.₅ that succeeds only 36% on its own drags the same pairing below Astra alone on RoboLab, 92% against 98%, and on unseen kitchen tasks, 9/25 against 14/25. An off-distribution prior is not neutral: the reviewer spends its budget fixing proposals it should have ignored. It needs a signal for when to trust the policy — the role SayCan gave to affordance values.',
   zh:'混合架构并不单调地更好。任务微调的 π₀.₅ 让 RoboDojo 成功率从 26% 近乎翻倍到 48%；而单独只有 36% 成功率的零样本 π₀.₅，把同样的组合在 RoboLab 上拖到 Astra 单独之下（92% 对 98%），在未见厨房任务上也落后（9/25 对 14/25）。分布外的先验不是中性的：审核者会把预算花在修正本该忽略的候选上。它需要一个「何时信任策略」的信号——也就是 SayCan 交给 affordance 价值的那个角色。'}},

 {n:'04',view:'locomotion',refs:['reflexion','voyager','cap'],
  title:{en:'Natural language is a working adaptation channel — sample-efficient, compute-expensive',zh:'自然语言是一条可用的适应通道——样本高效，算力昂贵'},
  figure:{value:'0 → 4 / 6',label:{en:'stair traversals gained on held-out geometries by rewriting policy.md, with no weight update',zh:'不更新任何权重、只重写 policy.md，在留出几何上获得的楼梯通过数'}},
  body:{en:'Twelve rounds of rollout, reflection and rewriting a plain-text policy.md lift stairs from 0/6 to 4/6 on unseen geometries, with no weight update — Reflexion and Voyager arriving at physical control. The policy now lives in weights, in a document and in Astra-written trajectory generators, and only the document can be read line by line. The cost is structural: the document is re-read at every decision, so calls grow from 35,425 to 126,720 tokens and a scene takes 1,707.87 s against 0.79 s for the learned policy. Text learns fast and runs slow.',
   zh:'对一份纯文本 policy.md 做十二轮「运行—复盘—改写」，就把未见几何上的楼梯通过从 0/6 提到 4/6，一个权重都没更新——这是 Reflexion 与 Voyager 走进了物理控制。策略如今同时存在于权重、文档和 Astra 写的轨迹生成程序里，只有文档可以逐行阅读。代价是结构性的：文档每次决策都要重读，单次调用从 35,425 涨到 126,720 token，一个场景耗时 1707.87 秒，learned policy 只需 0.79 秒。文本学得快，跑得慢。'}},

 {n:'05',view:'obstacles',refs:['rtc','act','helix'],
  title:{en:'Decision cadence is part of the policy',zh:'决策节奏本身就是策略的一部分'},
  figure:{value:'0.080 s / 39.86 s',label:{en:'mean planning latency, Passage against Astra, in the same scene with the same tracker',zh:'相同场景、相同 tracker 下的平均规划延迟：Passage 对 Astra'}},
  body:{en:'The low-level failures share a mechanism: Astra sees the world only at segment boundaries, so a slip inside a segment is caught a segment late, and a 120-decision budget in in-hand rotation runs out at 7 s while RL is still working at 15 s. Latency compounds it — 39.86 s per plan against Passage’s 0.080 s, with physics paused throughout. Real-time chunking shows that even 100–200 ms of delay breaks action-chunked policies; deployed “System 2” layers run at 7–9 Hz. At about 0.025 Hz, Astra is three orders of magnitude off. The layer a model can occupy is set by its cadence before its intelligence is consulted.',
   zh:'底层的失败共享一个机制：Astra 只在动作段边界看到世界，段内的滑落要晚一段才被发现，手内旋转的 120 次决策预算 7 秒就用完，RL 却在 15 秒里持续工作。延迟再叠加其上——每次规划 39.86 秒，Passage 是 0.080 秒，而且全程暂停物理。Real-time chunking 表明 100–200 ms 的延迟就足以破坏动作分块策略；已部署的「系统 2」层运行在 7–9 Hz。以约 0.025 Hz 计，Astra 差了三个数量级。一个模型能占据哪一层，在考虑它的智能之前，已经由它的节奏决定了。'}}
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
   <h2>{c('What the results add up to','这些结果意味着什么')}</h2>
   <p>{c('One thesis and its consequences: a reasoning model’s value in the loop is set by the level at which it enters; the levels below must be earned by skills it cannot supply.',
    '一个论点及其推论：推理模型在闭环中的价值由它进入的层级决定；它之下的层级要靠它自己给不出的技能来换取。')}</p>
  </header>
  <ol className="insight-list band">{insights.map(item=><Insight key={item.n} item={item}/>)}</ol>
 </section>;
}
