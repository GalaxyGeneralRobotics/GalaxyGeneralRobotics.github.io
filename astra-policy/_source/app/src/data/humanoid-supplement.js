// Manually reviewed captions. Playback metadata is measured from supplied files.
import media from './evidence/humanoid-supplement-media.json';
const labels={
 'supplement-passage':{
  domain:'obstacles',benchmark:'Passage · supplementary demonstration',method:'baseline',
  title:{en:'Passage · an additional clutter scene',zh:'Passage · 补充杂乱场景'},
  caption:{en:'Passage traverses the Easy_011 clutter scene.',zh:'Passage 穿行于 Easy_011 杂乱场景。'}
 },
 'supplement-astra-clutter':{
  domain:'obstacles',benchmark:'Astra · supplementary demonstration',method:'gpt',
  title:{en:'Astra · a supplementary clutter recording',zh:'Astra · 补充杂乱场景录像'},
  caption:{en:'Astra uses xhigh reasoning to plan motion through a cluttered scene.',zh:'Astra 使用 xhigh 推理规划杂乱场景中的运动。'}
 },
 'supplement-humanoid-1':{
  domain:'humanoid',benchmark:'Humanoid · supplementary demonstration',
  title:{en:'Humanoid reaching · table scene',zh:'人形伸手动作 · 桌边场景'},
  caption:{en:'A humanoid reaches toward a table during a locomotion-and-manipulation sequence.',zh:'人形机器人在运动操作过程中向桌面伸手。'}
 },
 'supplement-humanoid-2':{
  domain:'humanoid',benchmark:'Humanoid · supplementary demonstration',
  title:{en:'Humanoid interaction · overhead view',zh:'人形交互 · 俯视画面'},
  caption:{en:'An overhead view of a room-scene interaction, labeled “recorded input replay · accelerated.”',zh:'居家场景交互的俯视录像，画面标注为加速的记录输入回放。'}
 },
 'supplement-humanoid-3':{
  domain:'humanoid',benchmark:'Humanoid · supplementary demonstration',
  title:{en:'Humanoid interaction · room scene',zh:'人形交互 · 居家场景'},
  caption:{en:'Humanoid movement and interaction in a room scene.',zh:'人形机器人在居家场景中的移动与交互。'}
 }
};
export const humanoidSupplement=media.map(r=>({...r,...labels[r.id],outcome:'demo'}));
