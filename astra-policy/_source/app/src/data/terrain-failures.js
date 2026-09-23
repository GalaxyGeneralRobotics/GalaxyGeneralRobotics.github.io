import results from './results.json';
const bi=(en,zh)=>({en,zh});
export const terrainFailureIntro=bi(
 'Gap traversal requires the motion reference to coordinate foot placement, body advance and support transfer across the opening. The two failed rollouts below show that approaching the far platform is insufficient to complete a stable crossing, both with and without the adapted control document.',
 '跨越沟隙需要运动参考同时协调落足、身体前移与支撑转移。以下两条失败轨迹表明，无论是否加载适应后的控制文档，接近对岸平台都不等于完成稳定跨越。'
);
export const terrainFailureCases=[
 {code:'T1',clip:results.videos.find(v=>v.id==='gaps-unadapted-failure'),
  title:bi('Unstable support transfer at the gap edge','沟隙边缘的支撑转移失稳'),
  context:bi('Astra + ScaleTrack attempts gap traversal from the initial instructions, without the adapted policy document. This recorded rollout fails to complete the crossing.','Astra + ScaleTrack 根据初始指令规划沟隙跨越，未加载适应后的策略文档；该轨迹未完成通过。'),
  mechanism:bi('The robot advances to the edge and extends a foot toward the far platform. During the transfer, its torso pitches forward and descends between the platforms rather than establishing stable support on the far side.','机器人接近边缘后，将脚伸向对岸平台；转移过程中躯干明显前倾，并向两平台之间下沉，未在对岸建立稳定支撑。'),
  boundary:bi('A reachable foot target must be coordinated with body progression and the remaining support contacts. The reference needs to describe a stable transition, not only a destination for the swing foot.','可达的落足目标还需与身体推进及其余支撑接触协调。运动参考必须描述稳定的支撑转换过程，才能将摆动脚目标转化为完整跨越。')
 },
 {code:'T2',clip:results.videos.find(v=>v.id==='gaps-adapted-failure'),
  title:bi('Control guidance does not guarantee a completed crossing','控制文档未能保证跨越完成'),
  context:bi('Astra + ScaleTrack uses the rollout-refined control document to plan a gap crossing. This example still ends unsuccessfully.','Astra + ScaleTrack 使用经 rollout 修订的控制文档规划沟隙跨越，该案例仍未成功。'),
  mechanism:bi('The approach remains upright for much of the recording, but the final step leaves the robot at the lip of the far platform with the transfer incomplete. The planned five-point motion does not produce a stable passage of the whole body across the gap.','录像中大部分接近过程保持直立，但末段跨步使机器人停留在对岸边缘附近，支撑转移尚未完成。规划的五点运动未能转化为全身稳定越过沟隙的过程。'),
  boundary:bi('Accumulated textual guidance can improve aggregate traversal performance while individual references still fail at the contact transition. Reliable crossing depends on the compatibility of landing geometry, support timing and tracker execution.','累计文本经验能改善整体通过表现，但具体参考仍可能在接触转换处失效。可靠跨越取决于落足几何、支撑时序与追踪器执行之间的匹配。')
 }
];
