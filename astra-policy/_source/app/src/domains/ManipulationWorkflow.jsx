import React from 'react';
import {useCopy} from '../i18n.jsx';

// Inline math in plain HTML: <V> is an italic variable with optional sub/superscript.
const V=({v,sub,sup})=><span className="math"><var>{v}</var>{sub&&<sub>{sub}</sub>}{sup&&<sup>{sup}</sup>}</span>;
const Obs=()=><V v="o" sub="t"/>,Prop=()=><V v="p" sub="t"/>,Instr=()=><V v="ℓ"/>,Hist=()=><V v="h" sub="t"/>;
const Api=()=><V v="A" sub="t" sup="π"/>,Aastra=()=><V v="A" sub="t" sup={<span className="rm">Astra</span>}/>;
const Args=({history,policy})=><span className="math">(<Obs/>, <Prop/>, <Instr/>{history&&<>, <Hist/></>}{policy&&<>, <Api/></>})</span>;

// The two closed-loop diagrams from the original manipulation report.
export function ManipulationWorkflow(){
 const c=useCopy();
 const input=<div className="flow-node">{c('Images','图像')} <Obs/> · {c('Proprioception','本体状态')} <Prop/> · {c('Instruction','指令')} <Instr/></div>;
 const loop=<div className="flow-node is-loop">{c('Execute','执行')} <V v="k" sub="t"/> {c('steps','步')} → <V v="o" sub={<>t+k<sub>t</sub></>}/>, <V v="p" sub={<>t+k<sub>t</sub></>}/> ↺</div>;
 return <figure className="workflow">
  <div className="workflow-grid">
   <div className="flowchart"><h3>Astra + π₀.₅</h3>
    {input}<i className="flow-arrow" aria-hidden="true"/>
    <div className="flow-node"><span className="math"><Api/> = π<sub>0.5</sub><Args/></span><small>{c('Candidate joint-space action sequence','关节空间候选动作段')}</small></div><i className="flow-arrow" aria-hidden="true"/>
    <div className="flow-node is-accent">Astra {c('review','审核')}<br/><Args history policy/></div>
    <div className="flow-choice"><span>{c('Choose one · OR','二选一 · OR')}</span>
     <div className="flow-branches">
      <div className="flow-node">{c('Accept','沿用')} <Api/><small>{c('Execute 1–15 steps','执行 1–15 步')}</small></div>
      <div className="flow-node">{c('EEF correction','EEF 修正')} <Aastra/><small>{c('Execute 1–5 steps','执行 1–5 步')}</small></div>
     </div>
    </div><i className="flow-arrow" aria-hidden="true"/>
    {loop}
   </div>
   <div className="flowchart"><h3>Astra</h3>
    {input}<i className="flow-arrow" aria-hidden="true"/>
    <div className="flow-node">{c('Execution history','执行历史')} <Hist/><small>{c('Tools · persistent notes','工具 · 持久笔记')}</small></div><i className="flow-arrow" aria-hidden="true"/>
    <div className="flow-node is-accent"><span className="math"><Aastra/> = <span className="rm">Astra</span><Args history/></span></div><i className="flow-arrow" aria-hidden="true"/>
    <div className="flow-node">{c('Bimanual EEF targets','双臂 EEF 目标')} <span className="math">(<b>x</b>, <var>R</var>, <var>g</var>)</span><small>{c('Position · orientation · gripper; execute 1–5 steps','位置 · 姿态 · 夹爪；执行 1–5 步')}</small></div><i className="flow-arrow" aria-hidden="true"/>
    {loop}
   </div>
  </div>
  <figcaption>{c('Closed-loop control on RoboDojo. π₀.₅ proposes 50 joint-space actions from images, a 14-dimensional proprioceptive state and the instruction. Astra reviews their forward-kinematics trajectory and either accepts 1–15 actions or replaces them with 1–5 end-effector (EEF) corrections. In the Astra condition, the model generates every EEF action. Both conditions use xhigh reasoning and observe the robot again after each segment. Feedback also includes task progress, partial credit and native termination status.',
   'RoboDojo 闭环控制流程。π₀.₅ 根据图像、14 维本体状态和指令提出 50 步关节动作；Astra 审核其正运动学轨迹，选择沿用 1–15 步或替换为 1–5 步末端执行器（EEF）修正。Astra 条件下，全部 EEF 动作均由模型生成。两种条件均采用 xhigh 推理，每段动作结束后重新获取观测；反馈还包含任务进度、部分分与原生终止状态。')}</figcaption>
 </figure>;
}
