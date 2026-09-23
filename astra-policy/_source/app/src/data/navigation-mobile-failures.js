import evidence from './evidence/navigation-mobile-failures.json';
const bi=(en,zh)=>({en,zh});

export const navigationFailureIntro=bi(
 'The failure trajectories separate instruction following and target recognition from reliable arrival. Four cases expose landmark ambiguity, premature stopping, repeated collision recovery and inefficient reuse of search history.',
 '失败轨迹揭示了指令跟随、目标识别与可靠到达之间的差距。以下四个案例分别涉及地标消歧、提前停止、反复碰撞恢复，以及搜索历史未能有效约束后续行动。'
);
export const mobileFailureIntro=bi(
 'Astra can organize grasping, transport, placement and device operation, yet execution can break down after substantial task progress. Six cases trace failures in grasp formation, sustained contact, insertion, mobile carrying, device mapping and maintenance of task prerequisites.',
 'Astra 能组织抓取、搬运、放置与设备操作，但任务取得较大进展后，执行过程仍可能失效。以下六个案例分别分析抓握形成、接触保持、精确插入、携物移动、设备映射与任务前提维护中的困难。'
);

const nav=[
 {code:'F1',id:'r2r-189',benchmark:'VLN-CE · R2R',
  title:bi('Ambiguous landmarks treated as arrival evidence','将弱地标线索作为到达依据'),
  context:bi('R2R / 189 asks the robot to find the stairs beside a tripod and stop on the second step. Astra issues STOP after 319 actions and 40.54 m of travel, ending 12.91 m from the goal; nDTW is 1.10% and the episode fails.','R2R / 189 要求找到三脚架旁的楼梯，并停在第二级台阶。Astra 在执行 319 步、行走 40.54 m 后主动 STOP，终局距目标 12.91 m，nDTW 为 1.10%，任务失败。'),
  mechanism:bi('At action 277, Astra describes a wall shadow as tripod-shaped while still recording that the tripod requires confirmation. At actions 318–319, the same tentative cue becomes the basis for STOP without additional confirming evidence. The long detour also fails to trigger a strong consistency check against the short route described in the instruction.','第 277 步，Astra 将墙上阴影描述为“三脚架形状”，同时仍记录“还需确认三脚架”；到第 318–319 步，这一疑似线索在没有新增确认依据的情况下，被用作 STOP 的理由。长距离绕行也未触发对指令所述短路线的充分一致性检查。'),
  boundary:bi('Instruction order and backtracking are preserved, but landmark disambiguation and evidence confidence are not maintained reliably through the final stopping decision.','模型能够保留指令顺序并回溯纠错，但地标消歧与证据置信度未能可靠地维持到最终停止决策。'),
  frameCaption:bi('Actions 270, 277 and 318: returning to the entrance, identifying the stair area and looking back before STOP.','第 270、277、318 步：返回起点门口、发现楼梯区域、停止前回望。')
 },
 {code:'F2',id:'rxr-3125',benchmark:'VLN-CE · RxR',
  title:bi('An intermediate landing mistaken for the staircase endpoint','将中间平台误认为楼梯终点'),
  context:bi('RxR / 3125 requires descending the stairs completely and stopping while facing the wall. Astra stops after 90 actions and 12.05 m, with 3.17 m remaining to the goal. The episode fails despite an nDTW of 90.22%.','RxR / 3125 要求一直下楼，并面对墙壁停止。Astra 在执行 90 步、行走 12.05 m 后主动 STOP，终局距目标 3.17 m；尽管 nDTW 达到 90.22%，任务仍失败。'),
  mechanism:bi('The earlier route is followed accurately, including active inspection of the handrail and landing. Astra then equates the end of one flight with the end of the entire descent. It stops at an elevation of 1.889 m, compared with 0.635 m at the reference goal, while the side view still reveals further downward stairs.','前段路线执行较好，Astra 也主动检查了扶手与平台，但随后将“一段楼梯结束”替代为“整个下楼过程结束”。停止位置高度为 1.889 m，参考目标高度为 0.635 m，侧向观测中仍可见后续下行结构。'),
  boundary:bi('High route similarity can coexist with an incorrect endpoint. Multi-flight spatial interpretation and explicit verification of the final instruction remain necessary for a correct STOP.','较高的路线相似度仍可能伴随错误终点。多段楼梯的空间层级理解，以及对指令最终条件的明确核验，是正确 STOP 的关键。'),
  frameCaption:bi('Key views around the landing and final stop expose the remaining descent.','平台附近与停止前的关键视角显示了尚未完成的下行路线。')
 },
 {code:'F3',id:'mp3d-d8e848c88cc11f9266095a76',benchmark:'ObjectNav · MP3D',
  title:bi('Repeated approach and collision after target recognition','识别目标后仍反复接近并碰撞'),
  context:bi('MP3D ObjectGoal / d8e848c88cc11f9266095a76 requires finding a chair. Astra exhausts 500 actions without STOP, recording 81 collisions and 38.16 m of travel; the final annotated-goal-viewpoint distance is 1.82 m.','MP3D ObjectGoal / d8e848c88cc11f9266095a76 要求寻找椅子。Astra 耗尽 500 步且未发出 STOP，累计 81 次碰撞、行走 38.16 m，终局距标注目标视点 1.82 m。'),
  mechanism:bi('Several chairs are recognized at the initial observation. After obstruction, Astra backs up, shifts laterally and changes its approach angle, but does not retain effective constraints on repeatedly unsuccessful directions. An early plan to leave the bottleneck gives way to revisiting similar doorway and seating-area approaches.','初始观测中已识别出多把椅子。遇阻后，Astra 会后退、侧移并更换接近角度，却未能将反复无效的方向持续纳入行动约束。早期记录的“离开这个瓶颈”也未能保持，后期仍返回相近的门口与座椅区接近模式。'),
  boundary:bi('Target recognition and local recovery are available, but repeated failures are not consolidated into a persistent escape strategy, limiting spatial progress and execution efficiency.','目标识别与局部恢复已具备，但多次失败未能积累为持续有效的脱困策略，限制了空间进展与执行效率。'),
  frameCaption:bi('Repeated approaches around the doorway and chairs illustrate the collision-recovery loop.','门口与座椅区域的重复接近展示了碰撞与恢复循环。')
 },
 {code:'F4',id:'hm3d-9de789f9f275910a6bcd96aa',benchmark:'ObjectNav · HM3D v2',
  title:bi('Search memory fails to constrain repeated attempts','搜索记忆未能约束重复尝试'),
  context:bi('HM3D ObjectGoal / 9de789f9f275910a6bcd96aa requires finding a plant. Astra exhausts 500 actions without STOP, with 65 collisions and 44.50 m of travel, without confirming a physical plant.','HM3D ObjectGoal / 9de789f9f275910a6bcd96aa 要求寻找植物。Astra 耗尽 500 步且未发出 STOP，累计 65 次碰撞、行走 44.50 m，始终未确认实体植物。'),
  mechanism:bi('Astra explicitly records searches of the kitchen, living room, bathroom and entrance, and distinguishes pictured plants from real ones. However, two rounds of stair approaches, retries and retreats consume 119 primitive actions, or 23.8% of the budget. Near the end it re-enters the previously searched kitchen.','Astra 明确记录了厨房、客厅、卫生间和入口等区域的搜索结果，也能区分画中绿植与实体植物。然而，两轮楼梯接近、重试和退出共消耗 119 个基础动作，占总预算的 23.8%；末段又重新进入已检查的厨房。'),
  boundary:bi('Explicit search state does not by itself enforce retry limits or prioritize informative revisits. Search history must influence both action selection and allocation of the remaining budget.','显式搜索状态本身未能形成有效的重试上限与重访优先级。搜索历史需要持续约束动作选择及剩余预算分配，才能推动搜索收敛。'),
  frameCaption:bi('Stair retries and revisits consume the search budget despite recorded room-level search history.','楼梯重试与区域重访持续消耗预算，已有房间搜索记录未能有效约束后续行动。')
 }
];
const mobile=[
 {code:'M1',id:'robocasa-CoffeeSetupMug-00',taskId:'CoffeeSetupMug',
  title:bi('Repeated empty grasps without a secure mug hold','反复空抓后仍未抓稳杯子'),
  context:bi('CoffeeSetupMug / 00 requires placing a mug below the coffee-machine outlet. Astra executes 600 control steps in 30 action segments without success.','CoffeeSetupMug / 00 要求将杯子放到咖啡机出水口下方。Astra 执行 600 个控制步、30 个动作段，未能成功。'),
  mechanism:bi('Astra repeatedly observes that the mug has not risen with the gripper and tries the mug body, handle and different gripper angles. In the final attempt, contact by only one finger is treated as sufficient to chain closing, transport, lowering and release into a single segment, without an intermediate observation.','Astra 多次正确指出杯子未随夹爪抬起，并尝试杯身、把手及不同夹爪角度。但最后仅看到一根手指接触杯子，就将闭爪、搬运、下降和松爪串入同一动作段，中途未再观察。'),
  boundary:bi('Empty-grasp detection does not consistently produce a viable two-finger grasp or a verified transition from grasping to transport.','空抓检测未能稳定转化为可行的双指夹持几何，也未形成从抓取进入搬运前的可靠持物确认。'),
  frameCaption:bi('Repeated grasp attempts and the final action sequence around the mug.','杯子周围的反复抓取尝试与末段动作序列。')
 },
 {code:'M2',id:'robocasa-OpenStandMixerHead-00',taskId:'OpenStandMixerHead',
  title:bi('Loss of contact after partially lifting the mixer head','机头短暂抬起后失去接触'),
  context:bi('OpenStandMixerHead / 00 requires opening the mixer head. Astra executes 450 control steps in 23 action segments without success.','OpenStandMixerHead / 00 要求打开厨师机机头。Astra 执行 450 个控制步、23 个动作段，未能成功。'),
  mechanism:bi('Astra recognizes the hinged motion and lifts the head to approximately 0.333 rad (19.1°). Further lifting and wrist reorientation then break contact, allowing the hinge angle to return to approximately −0.0008 rad. The intended arc is not realized as sustained support or grasping contact.','Astra 理解机头需要沿铰链运动，并曾将其抬起约 0.333 rad（19.1°）。下一段继续上抬并改变腕姿时失去接触，机头回到约 −0.0008 rad。沿圆弧抬升的计划未能落实为持续支撑或夹持。'),
  boundary:bi('Understanding articulation and recognizing regression are insufficient without coordinated control of the contact point, end-effector orientation and joint trajectory.','理解装置关节运动、识别状态回退，还需要与接触点、末端姿态及关节轨迹的联合控制相结合。'),
  frameCaption:bi('The mixer head rises briefly before loss of contact returns it to its initial position.','机头短暂抬起，随后因接触丢失回到初始位置。')
 },
 {code:'M3',id:'robocasa-DeliverStraw-04',taskId:'DeliverStraw',
  title:bi('Transport completed, but insertion and release fail','完成携物搬运后仍未将吸管插入杯口'),
  context:bi('DeliverStraw / 04 requires retrieving a straw from a drawer and placing it in a glass on the dining table. Astra executes 2,550 control steps in 128 action segments without success.','DeliverStraw / 04 要求从抽屉取出吸管，并放入餐台上的玻璃杯。Astra 执行 2,550 个控制步、128 个动作段，未能成功。'),
  mechanism:bi('Astra opens the drawer, retrieves the straw and carries it across the kitchen. It then releases beside the glass rim, dropping the straw outside. A further 1,110 recovery steps do not complete insertion, and the bent section repeatedly catches on the fingers.','Astra 完成了开抽屉、取吸管与跨区域携物，但在杯沿旁松爪，吸管落到杯外。随后 1,110 步的恢复仍未完成插入，吸管弯折部位还多次挂在手指上。'),
  boundary:bi('Long-horizon task organization and carrying succeed locally, while thin-object orientation, opening alignment and contact during release remain limiting factors.','长程任务组织与携物移动取得了进展，但细长物体姿态、孔口对准和释放过程中的接触控制仍限制最终完成。'),
  frameCaption:bi('Placement attempts at the glass and subsequent recovery after the straw falls outside.','杯口附近的放置尝试，以及吸管落到杯外后的恢复过程。')
 },
 {code:'M4',id:'robocasa-PackIdenticalLunches-02',taskId:'PackIdenticalLunches',
  title:bi('Object loss followed by unsuccessful whole-body recovery','携物丢失后全身协调未能恢复任务'),
  context:bi('PackIdenticalLunches / 02 requires placing one potato and one steak in each of two lunch boxes. Astra executes 3,900 control steps in 195 action segments without success.','PackIdenticalLunches / 02 要求给两只餐盒各放一块土豆和一块牛排。Astra 执行 3,900 个控制步、195 个动作段，未能成功。'),
  mechanism:bi('A test lift confirms that the potato moves with the gripper, but arm withdrawal, wrist reorientation and base motion lead to a drop near the refrigerator. Subsequent retreats, lateral motions and torso or wrist adjustments around doors, drawers and shelves do not establish a repeatable approach and withdrawal path.','试提确认土豆随夹爪移动后，撤臂、改变腕姿与底座运动导致土豆掉到冰箱附近。随后，Astra 在门、抽屉和层架附近反复撤退、侧移并调整躯干与手腕，仍未形成可持续的站位与进出路径方案。'),
  boundary:bi('Initial grasp verification does not ensure stable carrying. Low-level access and recovery in confined spaces require sustained coordination of the base, arm and carried object.','初始持物验证未能保证后续搬运稳定。低位接近与狭窄空间恢复需要底座、机械臂和被携物体之间的持续协调。'),
  frameCaption:bi('The carrying sequence loses the potato, followed by repeated adjustments in the constrained workspace.','携物过程中土豆掉落，随后在受限工作空间内反复调整。')
 },
 {code:'M5',id:'robocasa-KettleBoiling-00-direct-failure',taskId:'KettleBoiling',
  title:bi('Correct kettle placement followed by the wrong burner','水壶已放好却点燃错误炉头'),
  context:bi('KettleBoiling / 00 requires placing the kettle on a burner and switching on that same burner. Astra executes 1,500 control steps in 75 action segments without success.','KettleBoiling / 00 要求将水壶放到炉头上，并打开对应炉头。Astra 执行 1,500 个控制步、75 个动作段，未能成功。'),
  mechanism:bi('The kettle is placed on the rear-right burner, but Astra selects a right-side knob without verifying which burner it controls, igniting the front-right burner instead. The flame reveals the mismatch, but only the final 20 steps remain when the error is recognized.','水壶已放在右后炉头，Astra 却将“选择一个右侧旋钮”替代为“确认旋钮控制放壶位置”，点燃了右前炉头。火焰反馈使其识别出错误，但此时仅剩最后 20 步。'),
  boundary:bi('Successful transport and knob contact do not establish the device’s functional mapping. Verifying the knob–burner relation before actuation is critical to completing the task.','成功搬运和旋钮接触并不等于建立了设备功能映射。动作前核验旋钮与炉头的对应关系，是完成任务的关键。'),
  frameCaption:bi('The kettle and the ignited burner occupy different positions on the stove.','水壶所在炉头与实际点燃炉头的位置不一致。')
 },
 {code:'M6',id:'robocasa-HeatKebabSandwich-00',taskId:'HeatKebabSandwich',
  title:bi('Continuing the oven sequence after losing a prerequisite','食物未回收仍继续执行烤箱流程'),
  context:bi('HeatKebabSandwich / 00 requires placing a kebab and a baguette in the toaster oven, closing the door and setting the timer. Astra executes 2,700 control steps in 135 action segments without success.','HeatKebabSandwich / 00 要求将肉串与长面包放入小烤箱，关门并设置定时器。Astra 执行 2,700 个控制步、135 个动作段，未能成功。'),
  mechanism:bi('Astra explicitly recognizes the dropped kebab and the failed recovery, yet returns to the oven with an empty gripper. The final 460 steps are spent closing the door and operating the timer even though the prerequisite that all food be inside is no longer satisfied.','Astra 明确识别肉串落地，也承认回收失败，却抬起空夹爪返回烤箱，将最后 460 步用于关门和操作定时器。“食物全部入炉”这一前提已失效，却未阻止后续阶段继续执行。'),
  boundary:bi('Recognizing object loss must be coupled to invalidating downstream subgoals and revising the plan. Otherwise, a coherent action sequence can continue from an incorrect task state.','物体丢失识别需要进一步触发后续子目标失效与计划重排，否则动作序列仍可能从错误的任务状态继续推进。'),
  frameCaption:bi('Control steps 960, 2,220 and 2,680: initial food placement, the kebab still on the floor, and returning to the timer.','第 960、2,220、2,680 步：初步放入食物、肉串仍在地面、返回操作定时器。')
 }
];

function attach(row,isNav){
 const media=evidence.cases.find(r=>r.code===row.code);
 const clip=media.video?{
  id:row.id,domain:isNav?'visual-navigation':'mobile-manipulation',benchmark:row.benchmark||'RoboCasa365',
  title:bi('Astra · '+row.title.en,'Astra · '+row.title.zh),caption:row.context,
  video:media.video,poster:media.poster,duration:media.duration,width:media.width,height:media.height,
  outcome:'failure',method:'gpt',mode:'direct',playback:isNav?'nav-primitives':'robocasa',
  ...(row.code==='M5'?{paired:'robocasa-KettleBoiling-00'}:{})
 }:null;
 return {...row,image:media.image,clip};
}
export const navigationFailureCases=nav.map(r=>attach(r,true));
export const mobileFailureCases=mobile.map(r=>attach(r,false));
export const navigationMobileFailureVideos=[...navigationFailureCases,...mobileFailureCases].flatMap(r=>r.clip?[r.clip]:[]);
