// Manually reconciled with the four-task 0920 README, endpoint CSVs and raw traces.
import media from './evidence/dex-s0-media.json';
export const dexS0Rotation=[
 {id:'cylinder',en:'Cylinder rotation',zh:'圆柱旋转',speed:1,duration:20,astra:{full:3,drop:1,steps:1749,goal:.51,error:1.626,speed:.960},rl:{full:5,drop:0,steps:2000,goal:76.90,error:.173,speed:.276}},
 {id:'cuboid',en:'Cuboid rotation',zh:'长方体旋转',speed:.2,duration:10,astra:{full:5,drop:0,steps:1000,goal:4.40,error:.742,speed:.143},rl:{full:5,drop:0,steps:1000,goal:63.50,error:.096,speed:.063}}
];
export const dexS0Translation=[
 {id:'000',astra:{position:74.7300,success:false},rl:{position:10.0231,success:true}},
 {id:'001',astra:{position:19.1292,success:true},rl:{position:31.1240,success:false}},
 {id:'002',astra:{position:61.6692,success:false},rl:{position:9.8376,success:true}},
 {id:'003',astra:{position:37.6755,success:false},rl:{position:14.9890,success:true}},
 {id:'004',astra:{position:102.0575,success:false},rl:{position:20.4982,success:true}}
];
export const dexS0Combined=[
 {id:'000',steps:153,astra:{position:51.2229,rotation:38.7715,success:false},matched:{position:18.8356,rotation:3.2167,success:true},rl:{position:19.3700,rotation:3.3911,success:true}},
 {id:'001',steps:129,astra:{position:38.1172,rotation:28.5624,success:false},matched:{position:15.5339,rotation:3.5729,success:true},rl:{position:15.3750,rotation:3.5542,success:true}},
 {id:'002',steps:134,astra:{position:49.6769,rotation:35.1619,success:false},matched:{position:21.0660,rotation:21.7036,success:false},rl:{position:20.9395,rotation:5.7134,success:true}},
 {id:'003',steps:120,astra:{position:50.6035,rotation:27.4115,success:false},matched:{position:10.4220,rotation:9.5556,success:true},rl:{position:11.2649,rotation:1.8713,success:true}},
 {id:'004',steps:132,astra:{position:47.1456,rotation:33.6712,success:false},matched:{position:15.2218,rotation:3.5255,success:true},rl:{position:13.4475,rotation:2.9078,success:true}}
];
const average=(rows,method,metric)=>rows.reduce((total,row)=>total+row[method][metric],0)/rows.length;
export const dexS0TranslationMeans=Object.fromEntries(['astra','rl'].map(method=>[method,average(dexS0Translation,method,'position')]));
export const dexS0CombinedMeans=Object.fromEntries(['astra','matched','rl'].map(method=>[method,{position:average(dexS0Combined,method,'position'),rotation:average(dexS0Combined,method,'rotation'),success:dexS0Combined.filter(row=>row[method].success).length}]));
export const dexS0Videos=media.map(r=>{
 const combined=r.id.includes('translation_rotation'),translation=r.id.includes('translation')&&!combined,cylinder=r.id.includes('cylinder'),sample=r.id.match(/(?:case|sample)_(\d+)/)[1];
 const task=combined?['Translation + rotation','平移与旋转']:translation?['Cylinder translation','圆柱平移']:cylinder?['Cylinder rotation','圆柱旋转']:['Cuboid rotation','长方体旋转'];
 let caption={en:'Astra and task-specific RL from the same saved initial state. Both controllers track a continuously rotating target; orientation and axial-speed errors measure tracking quality.',zh:'Astra 与任务专用 RL 从相同保存初态开始。两种控制器追踪持续旋转的目标，以朝向与轴向速度误差衡量追踪质量。'};
 let controllerOutcomes,outcome='demo';
 if(translation){
  const row=dexS0Translation.find(row=>row.id===sample);
  controllerOutcomes={'gpt-only':row.astra.success?'success':'failure',rl:row.rl.success?'success':'failure'};
  outcome=controllerOutcomes['gpt-only'];
  caption={en:`Sample ${sample}: Astra finishes at ${row.astra.position.toFixed(2)} mm position error; RL at ${row.rl.position.toFixed(2)} mm. Both retain the object for the full 15 s. Success requires a final error below 22.4 mm.`,zh:`样本 ${sample}：Astra 最终位置误差 ${row.astra.position.toFixed(2)} mm，RL 为 ${row.rl.position.toFixed(2)} mm。两者在完整 15 秒内均未掉落物体；成功要求终点误差小于 22.4 mm。`};
  if(sample==='001')caption={en:'Sample 001 has the shortest initial displacement. Astra reaches the target and finishes at 19.13 mm; RL enters the target region but later leaves it, ending at 31.12 mm. Both retain the object throughout the 15 s run.',zh:'样本 001 的初始目标位移最短。Astra 到达目标，最终误差为 19.13 mm；RL 曾进入目标区域，但随后离开，最终误差为 31.12 mm。两者在完整 15 秒内均保持物体。'};
 }
 if(combined){
  const row=dexS0Combined.find(row=>row.id===sample),time=(row.steps*.05).toFixed(2);
  controllerOutcomes={'gpt-only':'failure',rl:'success'};outcome='failure';
  caption={en:`Sample ${sample}: Astra reaches 120 decisions at ${time} s, with ${row.astra.position.toFixed(2)} mm position error and ${row.astra.rotation.toFixed(2)}° rotation error. RL has ${row.matched.position.toFixed(2)} mm / ${row.matched.rotation.toFixed(2)}° at the same control step, and ${row.rl.position.toFixed(2)} mm / ${row.rl.rotation.toFixed(2)}° at 15 s. The video holds Astra’s endpoint while RL continues.`,zh:`样本 ${sample}：Astra 在 ${time} 秒用完 120 次决策，位置误差为 ${row.astra.position.toFixed(2)} mm、旋转误差为 ${row.astra.rotation.toFixed(2)}°。相同控制步数下，RL 为 ${row.matched.position.toFixed(2)} mm／${row.matched.rotation.toFixed(2)}°；15 秒时为 ${row.rl.position.toFixed(2)} mm／${row.rl.rotation.toFixed(2)}°。视频在 Astra 结束后保持其终点画面，RL 继续运行。`};
 }
 if(cylinder&&sample==='000')caption={en:'Astra ends after 223 evaluated steps (11.15 s), with the video marking BUDGET ENDED; its final state is held while RL continues to 20 s. No drop is recorded in this Astra trace.',zh:'Astra 在 223 个评测步（11.15 秒）后结束，视频标注 BUDGET ENDED；其末帧保持，RL 继续到 20 秒。该 Astra 记录未掉落物体。'};
 if(cylinder&&sample==='004'){outcome='failure';caption={en:'Astra drops the cylinder at 16.3 s; RL completes 20 s. This is the selected drop case, with synchronized Astra / RL views.',zh:'Astra 在 16.3 秒掉落圆柱，RL 完成 20 秒。这是所选掉落案例，同步展示 Astra／RL 画面。'};}
 if(!combined&&!translation&&!cylinder&&sample==='004')caption={en:'The initial state is held out from the RL initialization set. Both controllers complete 10 s; the moving orientation target reveals different tracking behavior.',zh:'此初始状态未包含在 RL 的初始化集合中。两种控制器均完成 10 秒，持续变化的朝向目标呈现出不同追踪表现。'};
 return {...r,domain:'dexterous-s0',benchmark:'Dexterous S0 · '+task[0],method:'gpt',outcome,controllerOutcomes,statusLabel:{en:'Astra / RL',zh:'Astra / RL'},playback:'dex-s0',title:{en:task[0]+' · '+sample,zh:task[1]+' · '+sample},caption};
});
export const dexS0Clip=key=>dexS0Videos.find(r=>r.id==='dex-s0-'+key);
