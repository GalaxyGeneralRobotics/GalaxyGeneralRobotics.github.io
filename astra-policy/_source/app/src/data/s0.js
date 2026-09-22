// Editorial values and captions reconciled manually with the S0 report and logs.
import media from './evidence/s0-media.json';
export const trackingPair=[
 {label:'Astra · a01',survival:1.04,error:10.276002926984802,method:'gpt'},
 {label:'Astra · a02',survival:.96,error:10.828863375354558,method:'gpt',color:'#c9d3ff'},
 {label:'ScaleTrack',survival:10,error:4.453711467795074,method:'baseline'}
];
export const trackingPolicies=[['walk2_subject3',4.453711467795074,7.141316655650735],['walk1_subject2',3.1161847186740487,6.636213819216936],['walk2_subject4',4.213662152178586,7.267170343920588],['walk3_subject1',3.893124264432117,6.743775492813438]];
export const locomotionTasks=[
 {task:'stand',en:'Stand',zh:'站立',tokens:16719070,calls:601,actions:600,failures:0,censored:0,survival:30},
 {task:'walk',en:'Walk',zh:'直行',tokens:37572824,calls:1057,actions:1048,failures:8,censored:1,survival:7.6},
 {task:'turn_right',en:'Right turn',zh:'右转',tokens:38514563,calls:1057,actions:1041,failures:10,censored:1,survival:7.15}
];
const labels={
 's0-t1':{domain:'tracking',benchmark:'LAFAN1 · walk2_subject4',title:{en:'Tracking · standing, then loss of balance',zh:'运动追踪 · 站稳后失去平衡'},caption:{en:'This earlier run uses assisted multi-row control. The robot remains upright for about 4 s, and native termination first occurs at 5.54 s. The 10 s video includes protective control and a final hold after failure; these are excluded from metrics.',zh:'这次早期实验采用辅助式多行控制。机器人前约 4 秒保持直立，并在 5.54 秒首次触发原生终止。10 秒录像含失败后的保护控制与定姿片段，均不计入指标。'}},
 's0-t2':{domain:'tracking',benchmark:'LAFAN1 · walk2_subject3',title:{en:'Tracking · corrective steps and support drift',zh:'运动追踪 · 修正步伐与支撑漂移'},caption:{en:'This earlier run uses assisted multi-row control. Corrective stepping fails to arrest lateral drift; first native failure at 2.20 s. Protective control and holds in the remainder of this 10 s recording are excluded from metrics.',zh:'这次早期实验采用辅助式多行控制。修正步伐未能抑制横向漂移，2.20 秒首次触发原生失败；10 秒录像余下的保护控制与定姿不计入指标。'}},
 's0-t3':{domain:'tracking',benchmark:'LAFAN1 · walk2_subject3',title:{en:'Tracking · one target per 20 ms',zh:'运动追踪 · 每 20 ms 一个目标'},caption:{en:'V39 a01. One fresh observation and one joint target per interval, with simulator diagnostics. Body-position error triggers termination at 1.04 s. This is the a01 condition in the chart; the recording stops at that endpoint.',zh:'V39 a01。每个间隔读取新观测并生成一个关节目标，使用仿真诊断。身体位置误差在 1.04 秒触发终止；对应图中 a01，录像止于该时刻。'}},
 's0-t4':{domain:'tracking',benchmark:'LAFAN1 · walk3_subject1',title:{en:'Tracking · walk3_subject1 reference',zh:'运动追踪 · walk3_subject1 参考动作'},caption:{en:'V38 a03 uses single-step decisions with simulator diagnostics. Native body-position termination occurs at 3.26 s. This is a different reference motion from the walk2_subject3 a01/a02 comparison.',zh:'V38 a03 使用逐步决策与仿真诊断，在 3.26 秒触发原生身体位置终止。此参考动作与walk2_subject3 的 a01/a02 配对实验不同。'}},
 's0-l2':{domain:'flat',benchmark:'Direct-PD locomotion · walk attempt 6',title:{en:'Walk · tilt limit at 4.00 s',zh:'直行 · 4.00 秒触发倾角上限'},caption:{en:'Attempt 6 ends at 15.39° tilt. It also reaches the study’s largest forward position, 0.384 m. Evaluation ends at the tilt limit; the red-banner tail shows an unscored continuation holding the final target.',zh:'第 6 次尝试在倾角达到 15.39° 时结束，也达到本组最大前向位置 0.384 m。评测截至倾角超限时刻；红条后段展示保持最后目标的非计分续演。'},playback:'s0-continuation'},
 's0-l3':{domain:'flat',benchmark:'Direct-PD locomotion · walk attempt 8',title:{en:'Walk · longest completed attempt',zh:'直行 · 最长完整尝试'},caption:{en:'Attempt 8 ends at 7.60 s on the cross-track limit. The red-banner tail holds the final target in a restored simulator state; contact follows 0.95 s into that unscored continuation.',zh:'第 8 次尝试在 7.60 秒因横向越界结束。红条后段从终止状态保持最后目标续演，0.95 秒后发生非足部接触；续演不计分。'},playback:'s0-continuation'},
 's0-l4':{domain:'flat',benchmark:'Direct-PD locomotion · turn attempt 7',title:{en:'Right turn · −31.2° heading',zh:'右转 · 航向达到 −31.2°'},caption:{en:'Attempt 7 reaches the largest clockwise heading and ends at 5.45 s on stance-foot slip. The red-banner tail is an unscored held-target continuation. The longest surviving turn is a different attempt, at 7.15 s.',zh:'第 7 次尝试达到最大顺时针转角，在 5.45 秒因支撑脚滑移结束。红条后段为非计分的定目标续演；最长存活 7.15 秒来自另一次右转尝试。'},playback:'s0-continuation'}
};
export const s0Videos=media.map(r=>({...r,method:'gpt',outcome:'failure',playback:'s0',...labels[r.id]}));
export const s0Clip=id=>s0Videos.find(r=>r.id===id);
