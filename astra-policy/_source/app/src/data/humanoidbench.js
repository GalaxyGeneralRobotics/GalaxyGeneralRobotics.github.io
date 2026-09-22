// HumanoidBench rollouts of Astra + Humanoid-GPT on Unitree G1 (held-out evaluation episodes).
const clip=(id,file,width,duration,outcome,title,caption,statusLabel)=>({
 id:'hb-'+id,domain:'humanoid',benchmark:'HumanoidBench · '+title.en.split(' · ')[0],method:'hybrid',outcome,statusLabel,
 video:`media/humanoid/hb-${file}.mp4`,poster:`media/humanoid/hb-${file}.jpg`,width,height:720,duration,playback:'humanoidbench',
 title,caption
});
export const humanoidBenchVideos=[
 clip('push','push',720,9.2,'success',
  {en:'Push · box into the target region',zh:'Push · 将箱子推入目标区域'},
  {en:'Astra stages the body beside the table, then applies a sustained push until the box enters the native success region. Two-seed mean return 877.3 against a threshold of 700.',
   zh:'Astra 先在桌边调整站位，再持续施力，直到箱子进入原生成功区域。两 seed 平均回报 877.3，阈值 700。'}),
 clip('reach','reach',720,20.04,'demo',
  {en:'Reach · restaging the body before reaching',zh:'Reach · 先调整身体再伸手'},
  {en:'Astra repositions the body and retries until the hand closes on the target; the stronger seed ends 4.1 cm from it. Two-seed mean return 11,430.2 against a threshold of 12,000, with one seed above threshold.',
   zh:'Astra 反复调整身体位置再伸手，直到手部逼近目标；较强的 seed 最终距目标 4.1 cm。两 seed 平均回报 11,430.2，阈值 12,000，其中一个 seed 达标。'},
  {en:'One seed above threshold',zh:'一个 seed 达标'}),
 clip('door','door',960,20,'failure',
  {en:'Door · handle reached, door not opened',zh:'Door · 触到把手，未能开门'},
  {en:'Astra finds the handle but the frozen skills do not coordinate force through the hinge; the open-and-pass-through sequence is never completed. Two-seed mean return 142.4 against a threshold of 600.',
   zh:'Astra 找到了门把手，但冻结技能无法通过铰链协调施力，始终未完成开门并通过的序列。两 seed 平均回报 142.4，阈值 600。'})
];
export const humanoidBenchClip=id=>humanoidBenchVideos.find(r=>r.id==='hb-'+id);
