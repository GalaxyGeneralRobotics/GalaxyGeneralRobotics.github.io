// Ego-vision navigation recordings, shown in the rollout gallery under Obstacles.
import results from './evidence/ego-navigation-results.json';
import media from './evidence/ego-navigation-media.json';

const cases=[
 {id:'ego-indoor-g-motion',scene:'g_motion',setting:'S2',level:'s1',taskId:'g-motion',task:{en:'Through a doorway · g_motion',zh:'穿过门口 · g_motion'},method:'Astra + 5-point BFM',wait:8853.989680462284,
  instruction:'从当前房间穿过可见门口，前往相邻客厅的开阔处。避开墙壁和家具，保持平衡；抵达后输出 stop。',
  caption:{en:'The robot remains upright near the doorway and ends after 9.94 s with 100 Astra calls. The final distance to the goal is 3.251 m; eight seconds of little displacement trigger termination.',zh:'机器人在门口附近保持站立，9.94 秒后因持续停滞结束，共调用 Astra 100 次。最终距目标 3.251 m，最后八秒的位移触发停滞判据。'}},
 {id:'ego-indoor-stair-duck',scene:'stair_duck',setting:'S2',level:'s1',taskId:'stair-duck',task:{en:'Navigate toward the stairs · stair_duck',zh:'导航至楼梯前 · stair_duck'},method:'Astra + 5-point BFM',wait:6923.768224481028,
  instruction:'绕过客厅家具，前往楼梯前的开阔处；本次不要求上楼。避开障碍，保持平衡，抵达后输出 stop。',
  caption:{en:'The robot remains upright but ends farther from the goal: 3.986 m versus 3.742 m initially. The episode ends after 10.34 s and 104 Astra calls when motion stays within a 0.1 m radius for eight seconds.',zh:'机器人保持站立，但距目标由初始 3.742 m 增至 3.986 m。10.34 秒、104 次 Astra 调用后，因连续八秒停留在半径 0.1 m 的范围内结束。'}},
 {id:'ego-race-fivepoint',scene:'race',setting:'S2',level:'s1',taskId:'race',task:{en:'Obstacle course · scene 0089',zh:'障碍跑道 · 场景 0089'},method:'Astra + 5-point BFM',wait:9459.033403307549,
  instruction:'沿跑道避开障碍，到达前方尽头，然后停止。',
  caption:{en:'Five-point references keep the robot upright, but goal distance decreases by only 0.022 m. The run ends in stagnation after 11.92 s and 100 Astra calls, with 9.094 m remaining.',zh:'五点参考下机器人保持站立，但距目标仅缩短 0.022 m。运行在 11.92 秒、100 次 Astra 调用后因停滞结束，距目标仍有 9.094 m。'}},
 {id:'ego-race-passage',scene:'race',setting:'S3',level:'s2',taskId:'race',task:{en:'Obstacle course · scene 0089',zh:'障碍跑道 · 场景 0089'},method:'Astra + Passage',wait:579.5530945338542,
  instruction:'沿跑道避开障碍，到达前方尽头，然后停止。',
  caption:{en:'Astra issues local navigation commands and Passage generates the motion. The robot travels 8.899 m without falling, then receives STOP after 24.00 s and 19 Astra calls. It remains 1.628 m from the goal, outside the 0.5 m success tolerance.',zh:'Astra 发出局部导航指令，Passage 生成运动。机器人无跌倒地行走 8.899 m，在 24.00 秒、19 次 Astra 调用后收到 STOP。此时距目标 1.628 m，仍在 0.5 m 成功容差之外。'}}
];

export const egoNavigationRows=cases.map(row=>({...results.find(r=>r.scene===row.scene&&r.setting===row.setting),...row}));
export const egoNavigationVideos=egoNavigationRows.map(row=>({...media.find(m=>m.id===row.id),id:row.id,domain:'ego-navigation',benchmark:'Ego-vision navigation',method:'hybrid',outcome:'failure',level:row.level,taskId:row.taskId,taskLabel:row.task,controller:row.method,instruction:row.instruction,playback:'ego-navigation',title:{en:row.task.en+' · '+row.method,zh:row.task.zh+' · '+row.method},caption:row.caption}));
