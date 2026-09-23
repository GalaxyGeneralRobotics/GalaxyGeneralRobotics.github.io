import evidence from './evidence/dexterous-s1-0920.json';
import {dexterousTasks} from './dexterous.js';

const descriptions={
 '03_grasp_from_bin_toy__seed23260952__astra_direct':{
  title:['Astra · grasping inside a bin','Astra · 箱内抓取'],
  caption:['The hands repeatedly approach the toy and contact the bin, moving the container without completing retrieval and placement on the table.','双手反复接近玩具并与箱体接触，带动容器移动，但未完成取出玩具并放到桌面的任务。']
 },
 '06_sort_bottles_cans__seed35261006__astra_direct':{
  title:['Astra · contact control during sorting','Astra · 分类过程中的接触控制'],
  caption:['Repeated wrist and hand adjustments disturb the bottles and baskets. Astra does not complete the required sorting into the two destination baskets.','反复调整手腕与手型时，瓶子和篮筐受到扰动。Astra 未能完成将瓶子与罐子分别放入目标篮筐的任务。']
 },
 '02_pack_headset__seed22260923__hybrid':{
  title:['Astra + π₀.₅ · releasing the headset','Astra + π₀.₅ · 耳机释放'],
  caption:['Hand adjustments dislodge the headset from the fingers and complete placement in the box.','通过手部调整使耳机从手指上脱离，完成入盒放置。']
 },
 '05_mahjong_into_basket__seed25260921__hybrid':{
  title:['Astra + π₀.₅ · correcting motion and clearing occlusion','Astra + π₀.₅ · 纠正移动并消除遮挡'],
  caption:['Astra corrects wrist motion and moves the empty hand aside to reveal the second tile, retaining the policy’s finger configurations. Both tiles reach the basket. π₀.₅ executes 604 of 688 control steps; Astra intervenes over 84 steps in three bursts.','Astra 修正手腕移动，并移开空手以露出第二块麻将，全程保留策略的手指配置，最终将两块麻将放入篮中。π₀.₅ 执行 688 个控制步中的 604 步；Astra 分三段介入，共 84 步。']
 },
 '06_sort_bottles_cans__seed35260921__hybrid':{
  title:['Astra + π₀.₅ · wrist corrections for sorting','Astra + π₀.₅ · 微调手腕完成分类'],
  caption:['Small wrist-position corrections support grasping and placement, completing bottle-and-can sorting.','通过小幅修正手腕位置辅助抓取与放置，完成瓶罐分类。']
 },
 '07_egg_into_tray__seed27260953__hybrid':{
  title:['Astra + π₀.₅ · grasp and placement correction','Astra + π₀.₅ · 修正抓姿与放置位置'],
  caption:['Grasp-posture and wrist-position corrections recenter the egg over its holder, leaving it upright. π₀.₅ executes 512 of 562 control steps; Astra intervenes over 50 steps in three bursts, including a wrist rise of up to 4.5 cm.','通过抓取姿态与手腕位置修正，将鸡蛋重新对准蛋托并直立放置。π₀.₅ 执行 562 个控制步中的 512 步；Astra 分三段介入，共 50 步，其中抬腕幅度最大为 4.5 cm。']
 },
 '09_bread_into_slots__seed30260932__hybrid':{
  title:['Astra + π₀.₅ · correcting bread placement','Astra + π₀.₅ · 纠正面包放置位置'],
  caption:['Astra corrects a misplaced bread slice and coordinates further adjustments so that the two slices enter separate toaster slots.','Astra 纠正面包片的错误放置位置，并协调后续调整，使两片面包分别进入两个槽位。']
 },
 '05_mahjong_into_basket__seed25260958__hybrid':{
  title:['Astra + π₀.₅ · constrained hand-pose adjustment','Astra + π₀.₅ · 受限空间内的手型调整'],
  caption:['Repeated hand-pose adjustments in a constrained position fail to complete tile placement before the episode times out.','在受限位置反复调整手型，仍未能完成麻将放置，回合以超时结束。']
 },
 '07_egg_into_tray__seed27260944__hybrid':{
  title:['Astra + π₀.₅ · grasp correction and pose assessment','Astra + π₀.₅ · 抓姿修正与终态判断'],
  caption:['Repeated grasp corrections are compounded by an incorrect assessment of the egg’s final orientation. The upright-placement requirement is not met before timeout.','连续抓姿修正伴随对鸡蛋最终朝向的错误判断，未能在时限内满足直立放置要求。']
 },
 '08_stack_bowls_on_coaster__seed28260944__hybrid':{
  title:['Astra + π₀.₅ · repeated rim alignment','Astra + π₀.₅ · 反复对齐碗沿'],
  caption:['Repeated adjustments of the bowl rims do not establish the required nested, upright stack before timeout.','反复调整碗沿对齐关系，仍未能在时限内形成要求的直立嵌套堆叠。']
 },
 '09_bread_into_slots__seed30260927__hybrid':{
  title:['Astra + π₀.₅ · regrasping after a drop','Astra + π₀.₅ · 掉落后的重新抓取'],
  caption:['After a bread slice drops, repeated regrasp attempts fail to recover the insertion sequence. The episode times out.','面包片掉落后，多次重新抓取未能恢复插入流程，回合以超时结束。']
 },
 '10_sort_nesting_dolls__seed40260925__hybrid':{
  title:['Astra + π₀.₅ · grasp and pose adjustment','Astra + π₀.₅ · 抓取与姿态调整'],
  caption:['The rollout illustrates repeated grasp attempts and pose adjustments during size-based doll arrangement, with object tilting complicating subsequent contact.','该轨迹展示了按大小排列套娃时反复尝试抓取与调整姿态的过程，物体倾斜增加了后续接触控制的难度。']
 }
};
const labels={pi05:'π₀.₅',astra_direct:'Astra',hybrid:'Astra + π₀.₅'};
const methods={pi05:'baseline',astra_direct:'gpt',hybrid:'hybrid'};
const order={pi05:0,astra_direct:1,hybrid:2};
export const dexInitialTasks=evidence.initial_tasks.map(id=>dexterousTasks.find(t=>t.id===id));
export const dexS1Videos=evidence.clips.map(r=>{
 const task=dexterousTasks.find(t=>t.id===r.task_id),key=r.id.slice('dex-s1-0920-'.length),detail=descriptions[key];
 // The source labels this doll case inconsistently; retain its qualitative
 // observations without assigning a binary outcome (see evidence notes).
 const diagnostic=key==='10_sort_nesting_dolls__seed40260925__hybrid';
 const outcome=diagnostic?'demo':r.feature_group==='direct_failure'?'failure':r.recorded_outcome?(r.recorded_outcome.success?'success':'failure'):'demo';
 const base=detail?.caption||[
  `${labels[r.method]} rollout for ${task.task.toLowerCase()}.`,
  `${labels[r.method]} 执行“${task.zh}”任务的轨迹回放。`
 ];
 const counts=r.method==='hybrid'?[
  ` Astra makes ${r.takeover_decisions} takeover decisions, including ${r.hand_edit_decisions} with hand-configuration edits.`,
  `Astra 接管 ${r.takeover_decisions} 次，其中 ${r.hand_edit_decisions} 次包含手型修改。`
 ]:['',''];
 return {
  id:r.id,domain:'dexterous',benchmark:'Dexterous manipulation',collection:'dex-s1-0920',taskId:r.task_id,seed:r.seed,
  method:methods[r.method],outcome,featureGroup:r.feature_group,diagnostic,
  title:{en:detail?.title[0]||`${labels[r.method]} · ${task.task}`,zh:detail?.title[1]||`${labels[r.method]} · ${task.zh}`},
  caption:{en:base[0]+counts[0]+` Seed ${r.seed}.`,zh:base[1]+counts[1]+` Seed ${r.seed}。`},
  ...(outcome==='demo'?{statusLabel:{en:diagnostic?'Control analysis':'Rollout',zh:diagnostic?'控制分析':'轨迹回放'}}:{}),
  instruction:r.instruction,video:r.video,poster:r.poster,width:r.width,height:r.height,duration:r.duration,
  playback:r.method==='hybrid'?'dex-s1-hybrid':'dex-s1-rerender',paired:`dex-s1-0920-${r.task_id}__seed${r.seed}`,
  methodOrder:order[r.method]
 };
}).sort((a,b)=>a.taskId.localeCompare(b.taskId)||a.seed-b.seed||a.methodOrder-b.methodOrder);
export const dexDirectFailures=dexS1Videos.filter(r=>r.featureGroup==='direct_failure');
export const dexHybridSuccesses=dexS1Videos.filter(r=>r.featureGroup==='hybrid_success_cases');
export const dexHybridLimitations=dexS1Videos.filter(r=>r.featureGroup==='hybrid_failure_cases');
