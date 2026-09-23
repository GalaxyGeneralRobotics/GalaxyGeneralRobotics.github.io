import evidence from './evidence/manipulation-failures.json';
const bi=(en,zh)=>({en,zh});
export const manipulationFailureIntro=bi(
 'The failed rollouts expose limits in contact geometry, feedback timing and task-state verification. Four hybrid cases and one Astra-only case show how a plausible goal-directed action can lose progress during grasping, transport or release.',
 '失败轨迹揭示了接触几何、反馈时机与任务状态核验方面的局限。以下四个组合策略案例与一个 Astra 单独控制案例，展示了目标合理的动作如何在抓取、搬运或释放阶段失去进展。'
);
const rows=[
 {code:'G1',source:'clip__cb2554914fe8187ac98e9e45__0',
  title:bi('Insufficient clearance around the container rim','容器边缘净空不足'),
  context:bi('In sorting-sequence imitation, Astra + π₀.₅ must place objects in the demonstrated order. The trajectory exhausts its 1,600-step budget and finishes unsuccessfully with Score 15/100.','模仿排序任务要求 Astra + π₀.₅ 按示范顺序将物体放入篮中。该轨迹耗尽 1,600 个控制步，最终 Score 为 15/100，未完成任务。'),
  mechanism:bi('The gripper or carried object contacts the container rim during transport, disrupting placement. Selecting the correct destination does not preserve sufficient clearance along the approach and withdrawal paths.','搬运过程中，夹爪或被携物体与容器边缘发生接触，干扰了放置。正确选择目标容器后，接近与撤离路径仍未保留足够净空。'),
  boundary:bi('Semantic ordering must be coupled to collision-aware control of the combined gripper–object geometry throughout transport.','语义顺序需要与搬运全过程中的几何约束结合，同时考虑夹爪和被携物体的占据空间。')
 },
 {code:'G2',source:'clip__7ef164f7a8783f3af3eb9090__0',
  title:bi('Corrective feedback arrives after within-segment slipping','动作段内滑落使纠错反馈滞后'),
  context:bi('In tower building, Astra + π₀.₅ must assemble wooden blocks and boards into a stable structure. The trajectory reaches 1,050 control steps with Score 10/100 and fails.','搭塔任务要求 Astra + π₀.₅ 用木块和木板构成稳定结构。该轨迹执行至 1,050 个控制步，Score 为 10/100，任务失败。'),
  mechanism:bi('Slipping occurs while an action segment is executing. Astra receives the next observation at the segment boundary, so corrective action begins only after the contact state has already changed. The remaining commands in the segment can therefore continue from an outdated grasp or support assumption.','滑落发生在动作段执行期间，而 Astra 在动作段边界才接收下一次观测，因此纠错启动时接触状态已经变化。段内剩余动作仍可能沿用已经失效的抓握或支撑假设。'),
  boundary:bi('Reviewing each proposed segment does not ensure stable contact throughout its execution. Feedback timing is especially consequential during release and load transfer.','审核候选动作段并不能保证段内持续接触稳定。在释放与承重转移阶段，反馈时机尤其影响恢复效果。')
 },
 {code:'G3',source:'clip__5b7eb4161fbb1a8e5851cf52__0',
  title:bi('Repeated grasp corrections consume the remaining budget','反复修正抓取耗尽剩余预算'),
  context:bi('In table organization, Astra + π₀.₅ must place the alarm clock on the drawer along with several other object-specific operations. The trajectory reaches the 1,000-step limit with Score 75/100, without full completion.','整理桌面任务包含将闹钟放到抽屉上等多项物体操作。Astra + π₀.₅ 执行至 1,000 步上限，Score 为 75/100，仍未完成全部目标。'),
  mechanism:bi('The excerpt repeatedly revisits the clock grasp, alternating approach, lowering, finger alignment and closure. These local corrections consume the remaining steps without establishing a reliably completed placement.','片段中，策略反复尝试抓取闹钟，在接近、下降、手指对齐与闭爪之间调整。局部修正不断消耗剩余步数，最终仍未可靠完成放置。'),
  boundary:bi('Detecting an unfinished grasp must lead to an effective change in contact geometry and a viable recovery plan. Repeated local retries can preserve activity while exhausting the task budget.','发现抓取未完成后，需要形成有效的接触几何调整与恢复方案。持续局部重试虽维持了动作，却可能耗尽完成剩余任务所需的预算。')
 },
 {code:'G4',source:'clip__bd5f4382adb568ed22dfca47__0',
  title:bi('Task-state errors are not recognized promptly','操作状态错误未被及时识别'),
  context:bi('In the Mahjong Kong task, Astra + π₀.₅ must respond to the discarded tile using the matching tiles. The trajectory exhausts 600 control steps and ends with Score 0/100.','麻将杠牌任务要求 Astra + π₀.₅ 根据弃牌操作匹配的麻将牌。该轨迹耗尽 600 个控制步，最终 Score 为 0/100。'),
  mechanism:bi('The visible tile arrangement changes during manipulation while the system continues accepting action segments for the ongoing tile-handling sequence. The execution error is not recognized soon enough to restore the required arrangement before the budget is exhausted.','操作过程中，麻将牌的可见摆放状态发生变化，系统仍持续接受面向当前操作序列的动作段。执行偏差未被及时识别，未能在预算耗尽前恢复要求的牌面排列。'),
  boundary:bi('A task-level plan requires persistent verification of object configuration. Continuing an apparently relevant action sequence is insufficient when the physical state no longer supports the intended next step.','任务级计划需要持续核验物体配置。当实际状态已不支持下一步时，仅继续执行看似相关的动作序列不足以恢复任务。')
 },
 {code:'G5',source:'clip__b34c1a832bb5123d6eb6a6af__0',
  title:bi('A sweeping plan without reliable object transfer','扫落方案未形成可靠搬运'),
  context:bi('Astra alone attempts to place bottles in a dustbin. The trajectory exhausts 700 control steps and ends unsuccessfully with Score 0/100.','Astra 单独执行瓶子入桶任务，耗尽 700 个控制步，最终 Score 为 0/100，未能完成。'),
  mechanism:bi('Astra selects a non-prehensile strategy, using the arm to sweep bottles toward the bin. The plan avoids a conventional grasp-and-carry sequence but does not reliably control the bottles’ transfer into the container.','Astra 选择非抓取策略，尝试用机械臂将瓶子扫向桶内。这一方案避开了常规抓取搬运流程，但未能可靠控制瓶子进入容器的过程。'),
  boundary:bi('Generating alternative manipulation plans is a useful capability; execution still depends on controlling contact, object motion and the final receiving geometry.','提出不同的操作方案体现了规划灵活性，其有效执行仍取决于对接触、物体运动和目标容器几何关系的控制。')
 }
];
export const manipulationFailureCases=rows.map(row=>{
 const source=evidence.clips.find(c=>c.id===row.source),method=source.method==='mix'?'Astra + π₀.₅':'Astra';
 return {...row,clip:{
  id:source.id,domain:'manipulation',benchmark:'RoboDojo',method:source.method==='mix'?'hybrid':'gpt',outcome:'failure',
  title:bi(method+' · '+row.title.en,method+' · '+row.title.zh),
  caption:bi(`${row.context.en} Excerpt: ${source.start.toFixed(2)}–${source.end.toFixed(2)} s of the recorded trajectory.`,`${row.context.zh}视频节选自轨迹的 ${source.start.toFixed(2)}–${source.end.toFixed(2)} 秒。`),
  video:source.video,poster:source.poster,width:source.width,height:source.height,duration:source.duration,
  instruction:source.instruction,paired:source.paired_gallery_id,playback:'robodojo-excerpt'
 }};
});
