import React from 'react';
import {number} from '../ui.jsx';
import {useCopy} from '../i18n.jsx';
import {useReveal} from '../motion.js';
import results from '../data/results.json';
import {robodojoRows,robolabRows} from '../data/manipulation.js';
import {dexterousMeans} from '../data/dexterous.js';
import {navigation,groups} from '../data/mobile.js';
import {roboDojoMeanTokens,navigationMeanTokens,roboCasaMeanTokens,millionTokens,roboDojoUsage} from '../data/token-usage.js';

const bar=(label,value,kind,training=null,tokens=null)=>({label,value,kind,training,tokens});
const bestBy=(rows,predicate)=>rows.filter(predicate).reduce((a,b)=>b.value>a.value?b:a);
const nav=(model,dataset)=>navigation.find(r=>r.model===model&&r.dataset===dataset).sr_pct;
const bestNav=dataset=>navigation.filter(r=>r.model!=='astra'&&r.dataset===dataset).reduce((a,b)=>b.sr_pct>a.sr_pct?b:a);
const navName={lightnav:'LightNav-0',uninavid:'Uni-NaVid 7B',omninav:'OmniNav Flow',spannav:'SpanNav',navfom:'NavFoM'};
const humanoid=task=>results.humanoid.find(r=>r.task===task);

// These rows summarize the available configurations across the control stack. Several rows
// are hybrid systems in which Astra directs a learned embodied component; the caption states
// the protocols and the domain pages retain the lower-level results.
function leadingRows(c){
 // Training labels describe the embodied policy in this evaluation, not the model
 // name globally: DROID-trained policies transfer zero-shot on RoboLab.
 const dojoTraining={component:'π₀.₅',note:c('π₀.₅ uses RoboDojo task-finetuned weights, including in the hybrid.','π₀.₅ 使用 RoboDojo 任务微调权重；组合方法使用同一微调策略。')};
 const dexTraining={component:'π₀.₅',note:c('π₀.₅ is finetuned on 100 demonstrations per task, 1,000 in total; the hybrid uses the same policy.','π₀.₅ 按每任务 100 条、共 1,000 条示范微调；组合方法使用同一策略。')};
 // Finetuning for RoboCasa365 π₀.₅ and RoboDojo G0.5 confirmed by the
 // report author on 2026-09-23; seen/unseen membership remains task-specific.
 const casaTraining={component:'π₀.₅',note:c('π₀.₅ is finetuned, including the policy used in the hybrid. Evaluation mixes 10 seen and 5 unseen tasks relative to policy training.','π₀.₅ 经过微调，组合方法使用同一微调策略；评测混合训练集中 10 项已见与 5 项未见任务。')};
 const dojoReferenceTraining={note:c('G0.5 is finetuned for RoboDojo.','G0.5 经过 RoboDojo 任务微调。')};
 // Original training recipes: LightNav-0 §§ IV–V (arXiv:2608.30935),
 // Uni-NaVid § V (2412.06224), OmniNav § 4 (2509.25687).
 // These are task-family training labels, not claims of training on test episodes.
 const navTraining={
  lightnav:{note:c('Navigation SFT, DAgger and RL; training sources include R2R, RxR, MP3D and HM3D. Evaluation uses a shared checkpoint without further benchmark-specific finetuning.','经过导航 SFT、DAgger 与 RL；训练来源包括 R2R、RxR、MP3D 和 HM3D。评测使用统一 checkpoint，不再逐基准微调。')},
  uninavid:{note:c('Multitask navigation finetuning includes R2R/RxR and HM3D ObjectNav. This does not establish training on MP3D ObjectNav or the HM3D v2 evaluation split.','经过多任务导航微调，包含 R2R/RxR 与 HM3D ObjectNav；不据此推定训练过 MP3D ObjectNav 或 HM3D v2 评测划分。')},
  omninav:{note:c('Navigation post-training includes R2R/RxR and HM3D-OVON. This does not establish training on the closed-vocabulary MP3D/HM3D v2 evaluation tasks.','导航后训练包含 R2R/RxR 与 HM3D-OVON；不据此推定训练过闭词表 MP3D/HM3D v2 评测任务。')}
 };
 // HumanoidBench § V and Table V (arXiv:2403.10506): task-specific RL,
 // not necessarily finetuning from a pretrained checkpoint.
 const rlTraining={note:c('Task-specific reinforcement learning on HumanoidBench; this is task training, not necessarily finetuning a pretrained model.','在 HumanoidBench 上按任务进行强化学习训练，不等同于从预训练模型微调。')};
 const dojo=robodojoRows('sr');
 const dojoHybrid=dojo.find(r=>r.method==='hybrid');
 const dojoGpt=dojo.find(r=>r.method==='gpt');
 const dojoEmbodied=dojo.find(r=>r.label.startsWith('π₀.₅'));
 const dojoSota=bestBy(dojo,r=>r.method==='baseline'&&!r.label.startsWith('π₀.₅'));
 const labGpt=robolabRows.find(r=>r.method==='gpt');
 const labHybrid=robolabRows.find(r=>r.method==='hybrid');
 const labEmbodied=robolabRows.find(r=>r.label==='π₀.₅');
 const labSota=bestBy(robolabRows,r=>r.method==='baseline'&&r.label!=='π₀.₅');
 const all=groups.find(r=>r.group==='all');
 const maze=humanoid('Maze'),reach=humanoid('Reach');
 const navRow=(dataset,name)=>{
  const other=bestNav(dataset);
  const learned=navigation.filter(r=>r.dataset===dataset&&r.model!=='astra');
  return {benchmark:name,metric:c('Success rate · %','成功率 · %'),max:100,unit:'%',decimals:0,
   tokenNote:c('Mean total tokens per trajectory over all 50 evaluated trajectories in this dataset.','该数据集全部 50 条评测轨迹的平均总 token 消耗。'),
   bars:[bar('Astra',nav('astra',dataset),'gpt',null,navigationMeanTokens[dataset]),...learned.map(r=>bar(navName[r.model],r.sr_pct,r.sr_pct===other.sr_pct?'sota':'embodied',navTraining[r.model]))]};
 };
 return [
  {benchmark:'RoboDojo',metric:c('10 bimanual tasks · success · %','10 项双臂任务 · 成功率 · %'),max:100,unit:'%',decimals:1,
   tokenNote:c('Mean input + output tokens per trajectory over all 50 selected trajectories, including failures and incomplete runs.','全部 50 条选定轨迹的输入与输出 token 均值，包含失败及未完成记录。'),
   bars:[bar(dojoGpt.label,dojoGpt.value,'gpt',null,roboDojoMeanTokens.astra),bar(dojoHybrid.label,dojoHybrid.value,'hybrid',dojoTraining,roboDojoMeanTokens.hybrid),bar(dojoEmbodied.label,dojoEmbodied.value,'embodied',dojoTraining),bar(dojoSota.label,dojoSota.value,'sota',dojoReferenceTraining)]},
  {benchmark:'RoboLab',metric:c('10 single-arm tasks · success · %','10 项单臂任务 · 成功率 · %'),max:100,unit:'%',decimals:0,
   bars:[bar(labGpt.label,labGpt.value,'gpt'),bar(labHybrid.label,labHybrid.value,'hybrid'),bar(labEmbodied.label,labEmbodied.value,'embodied'),bar(labSota.label,labSota.value,'sota')]},
  {benchmark:c('Dexterous manipulation','灵巧操作'),metric:c('10 tasks · mean Score','10 项任务 · 平均 Score'),max:100,unit:'',decimals:1,
   bars:[bar('Astra',dexterousMeans.direct,'gpt'),bar('Astra + π₀.₅',dexterousMeans.hybrid,'hybrid',dexTraining),bar('π₀.₅',dexterousMeans.pi05,'embodied',dexTraining)]},
  {benchmark:'RoboCasa365',metric:c('15 kitchen tasks · success · %','15 项厨房任务 · 成功率 · %'),max:100,unit:'%',decimals:1,
   tokenNote:c('Mean total tokens per trajectory over all 75 evaluated trajectories for this configuration (15 tasks × 5 seeds).','该配置全部 75 条评测轨迹（15 项任务 × 5 个 seed）的平均总 token 消耗。'),
   bars:[bar('Astra',100*all.direct/all.n,'gpt',null,roboCasaMeanTokens.direct),bar('Astra + π₀.₅',100*all.pi05_skill/all.n,'hybrid',casaTraining,roboCasaMeanTokens.pi05_skill),bar('π₀.₅',100*all.pi05_only/all.n,'embodied',casaTraining)]},
  navRow('r2r','VLN-CE R2R'),navRow('rxr','VLN-CE RxR'),
  navRow('mp3d','ObjectNav MP3D'),navRow('hm3d','ObjectNav HM3D v2'),
  {benchmark:'HumanoidBench Maze',metric:c('Mean return','平均回报'),max:1500,unit:'',decimals:1,
   bars:[bar('Astra + Humanoid-GPT',maze.mean,'hybrid'),bar('DreamerV3 ‡',parseFloat(maze.dreamerv3_h1hand),'sota',rlTraining),bar('TD-MPC2 ‡',parseFloat(maze.tdmpc2_h1hand),'embodied',rlTraining),bar('SAC ‡',parseFloat(maze.sac_h1hand),'embodied',rlTraining)]},
  {benchmark:'HumanoidBench Reach',metric:c('Mean return','平均回报'),max:12000,unit:'',decimals:1,
   bars:[bar('Astra + Humanoid-GPT',reach.mean,'hybrid'),bar('DreamerV3 ‡',parseFloat(reach.dreamerv3_h1hand),'sota',rlTraining),bar('TD-MPC2 ‡',parseFloat(reach.tdmpc2_h1hand),'embodied',rlTraining),bar('SAC ‡',parseFloat(reach.sac_h1hand),'embodied',rlTraining)]}
 ];
}

function MethodLabel({item}){
 const {label,training}=item;
 if(!training)return <span className="lead-key">{label}</span>;
 const name=training.component||label.replace(/ [†‡]$/,'');
 const start=label.indexOf(name);
 return <span className="lead-key" title={training.note} aria-label={label+' — '+training.note}>{label.slice(0,start)}<em className="lead-trained-name">{name}</em>{label.slice(start+name.length)}</span>;
}

function Row({row,index}){
 const c=useCopy();
 const width=value=>Math.max(1.5,Math.min(100,value/row.max*100))+'%';
 const show=value=>number(value,row.decimals)+row.unit;
 return <div className="lead-row">
  <div className="lead-name"><small>{String(index+1).padStart(2,'0')}</small><strong>{row.benchmark}</strong><span>{row.metric}</span></div>
  <div className="lead-pair">
   {row.bars.map(item=><div className={'lead-bar is-'+item.kind} key={item.label}>
    <div className="lead-method">
     <MethodLabel item={item}/>
     {item.tokens!=null&&<small className="lead-tokens" title={row.tokenNote}>{millionTokens(item.tokens)} tokens / {c('traj.','轨迹')}</small>}
    </div>
    <div className="lead-track"><i style={{width:width(item.value)}}/></div>
    <b>{show(item.value)}</b>
   </div>)}
  </div>
 </div>;
}

export function LeadingResults(){
 const c=useCopy(),rows=leadingRows(c);
 return <figure className="lead-figure band" id="leading" ref={useReveal('bars')}>
  <header className="lead-head">
   <div><span className="eyebrow">FIG. 00 · {c('Ten results across the control stack','控制体系中的十项评测结果')}</span>
    <h2>{c('Astra and hybrid policies across ten evaluation results','Astra 与组合策略的十项评测结果一览')}</h2></div>
   <dl className="lead-legend">
    <div><dt className="is-gpt"/><dd>{c('GPT / Astra','GPT / Astra')}</dd></div>
    <div><dt className="is-hybrid"/><dd>{c('GPT + embodied policy','GPT + 具身策略')}</dd></div>
    <div><dt className="is-embodied"/><dd>{c('Embodied policy','具身策略')}</dd></div>
    <div><dt className="is-sota"/><dd>{c('Best embodied reference','现有最强具身参考')}</dd></div>
   </dl>
  </header>
  <div className="lead-training-legend">
   <p><em className="lead-trained-name">{c('Italic + underline','斜体＋下划线')}</em>{c(' = task-related finetuning / post-training or task-specific RL. Only the trained embodied component is marked in hybrids.','：经过任务相关微调／后训练，或任务级 RL；组合方法仅标记对应的具身策略。')}</p>
  </div>
  <div className="lead-rows">{rows.map((row,i)=><Row key={row.benchmark} row={row} index={i}/>)}</div>
  <figcaption>
   {c('Each row uses its own metric and scale. Bars are shown only when the corresponding record exists: GPT, GPT + embodied policy, a standalone embodied policy and the strongest available learned-policy reference. RoboDojo and RoboLab use 10 tasks × 5 trials per policy; RoboCasa365 uses 15 tasks × 5 seeds. Dexterous Score is mean subgoal completion over 10 tasks. Navigation uses 50 fixed episodes per local system and dataset. † Published RoboDojo references are reweighted to the ten selected tasks. ‡ HumanoidBench baselines are published H1 results under their own robot and training protocols.','各行使用各自的指标与尺度。只有已有对应记录时才展示柱条：GPT、GPT + 具身策略、单独具身策略，以及现有记录中最强的 learned-policy 参考。RoboDojo 与 RoboLab 为每策略 10 个任务 × 5 次；RoboCasa365 为 15 个任务 × 5 个 seed。灵巧 Score 为 10 项任务的平均子目标完成度。导航使用各本地系统、各数据集 50 个固定 episode。† RoboDojo 公开参考按所选十项任务重加权。‡ HumanoidBench baseline 为公开 H1 结果，沿用各自的机器人与训练协议。')}
   <span className="lead-token-note">{c('Token figures are mean total tokens per trajectory; M denotes one million. Navigation averages all 50 trajectories per dataset; RoboCasa365 averages all 75 trajectories per configuration (15 tasks × 5 seeds). RoboDojo averages all 50 selected trajectories per method, including failures and two incomplete Astra runs; input and output tokens are summed, with cached input and reasoning output included once. Earlier retries are excluded. ','Token 数值为每条轨迹的平均总消耗，M 表示百万。导航按每个数据集全部 50 条轨迹取均值；RoboCasa365 按每个配置全部 75 条轨迹（15 项任务 × 5 个 seed）取均值。RoboDojo 按每种方法全部 50 条选定轨迹取均值，包含失败及 Astra 的 2 条未完成记录；统计输入与输出，缓存输入与推理输出不重复计数，不含此前重试。')}<a href={roboDojoUsage.source} target="_blank" rel="noreferrer">{c('RoboDojo source ↗','RoboDojo 统计来源 ↗')}</a></span>
  </figcaption>
 </figure>;
}
