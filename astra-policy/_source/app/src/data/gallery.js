// Editorial classification of supplied recordings. Levels describe the evaluated
// action interface: S1 manipulation includes S2 review of an S1 policy.
import data from './results.json';
import original from './robodojo-robolab-gallery.json';
import {mobileVideos} from './mobile.js';
import {humanoidSupplement} from './humanoid-supplement.js';
import {humanoidBenchVideos} from './humanoidbench.js';
import {dexterousVideos,dexterousTasks} from './dexterous.js';
import {s0Videos} from './s0.js';
import {dexS0Videos} from './dex-s0.js';
import {egoNavigationVideos} from './ego-navigation.js';

export const settings=[
 ['all','All settings','全部场景'],['manipulation','Manipulation','操作'],
 ['dexterous','Dexterous manipulation','灵巧操作'],['visual-navigation','Visual navigation','视觉导航'],
 ['mobile-manipulation','Mobile manipulation','移动操作'],['humanoid','Humanoid','人形'],
 ['obstacles','Obstacles','避障'],['terrain','Terrain','地形'],['flat','Flat-ground locomotion','平地运动控制'],
 ['tracking','Motion tracking','运动追踪'],['proxy','Motion generators','轨迹生成器']
];
export const levels=[['all','All levels','全部层级'],['s0','S0 · Motor control','S0 · 运动控制'],['s1','S1 · Action generation','S1 · 动作生成'],['s2','S2 · Task decisions','S2 · 任务决策']];
export const methods=[
 ['all','All methods','全部方法'],['pi05','π₀.₅','π₀.₅'],['pi05-gpt','Astra + π₀.₅','Astra + π₀.₅'],['gpt-only','Astra','Astra'],
 ['rl','RL','RL'],['gpt-tracker','Astra + tracker','Astra + 追踪器'],['passage','Passage','Passage'],['gpt-passage','Astra + Passage','Astra + Passage'],
 ['terrain-policy','Learned policy','learned policy'],['gpt-skills','Astra + motor skills','Astra + 运动技能'],
 ['generator','Astra-authored generator','Astra 编写的生成器'],['demo','Supplementary demos','补充演示']
];
const task=(id,en,zh,group)=>({id,label:{en,zh},group});
const dexTasks={
 'dex-direct-failure-1':dexterousTasks[0], 'dex-direct-failure-2':dexterousTasks[5],
 'dex-hybrid-correction-1':dexterousTasks[6], 'dex-hybrid-correction-2':dexterousTasks[4]
};
const flatTasks={
 'flat-stand':['stand','Stand','站立'], 'flat-walk':['walk','Walk','直行'], 'flat-turn':['turn','Right turn','右转'],
 's0-l2':['walk','Walk','直行'], 's0-l3':['walk','Walk','直行'], 's0-l4':['turn','Right turn','右转']
};
const mobileTasks={
 DeliverStraw:['Deliver a straw','递送吸管'],PackIdenticalLunches:['Pack identical lunches','打包两份相同的午餐'],
 SearingMeat:['Sear meat','煎肉'],PickPlaceSinkToCounter:['Sink to counter','从水槽转移到台面'],
 MakeIceLemonade:['Make ice lemonade','制作冰柠檬水'],KettleBoiling:['Boil water in a kettle','水壶烧水'],
 RecycleBottlesByType:['Sort bottles by material','按材质分类瓶子'],CoffeeSetupMug:['Set up a coffee mug','摆放咖啡杯'],
 GatherTableware:['Gather tableware','收集餐具'],BreadSelection:['Select bread','选择面包'],
 HeatKebabSandwich:['Heat a kebab sandwich','加热烤肉三明治'],PickPlaceDrawerToCounter:['Drawer to counter','从抽屉转移到台面']
};
const modeMethod={direct:'gpt-only',pi05_skill:'pi05-gpt',pi05_only:'pi05'};
const policyMethod={gpt:'gpt-only',hybrid:'pi05-gpt',baseline:'pi05'};
function classify(r){
 let setting=r.domain==='dexterous-s0'?'dexterous':r.domain==='ego-navigation'?'obstacles':r.domain,level,methodIds,t;
 if(r.domain==='manipulation'){
  const id=r.id.split('__')[r.benchmark==='RoboDojo'?1:2];
  t=task(r.benchmark+':'+id,r.title.en.split(' · ')[0],r.title.zh.split(' · ')[0],r.benchmark);
  level='s1';methodIds=[policyMethod[r.method]];
 }else if(r.domain==='dexterous'){
  const row=dexTasks[r.id];t=task('dex:'+row.initial,row.task,row.zh,'Dexterous manipulation');
  level='s1';methodIds=[policyMethod[r.method]];
 }else if(r.domain==='dexterous-s0'){
  const id=r.id.includes('translation_rotation')?'translation-rotation':r.id.includes('translation')?'translation':r.id.includes('cylinder')?'cylinder-rotation':'cuboid-rotation';
  t=task('dex:'+id,r.title.en.split(' · ')[0],r.title.zh.split(' · ')[0],'In-hand manipulation');
  level='s0';methodIds=['gpt-only','rl'];
 }else if(r.domain==='visual-navigation'){
  const dataset=r.id.split('-')[0],names={r2r:'R2R',rxr:'RxR',mp3d:'MP3D',hm3d:'HM3D v2'};
  t=task('nav:'+dataset,names[dataset],names[dataset],'Visual navigation');level='s2';methodIds=['gpt-only'];
 }else if(r.domain==='mobile-manipulation'){
  const id=r.id.split('-')[1];t=task('robocasa:'+id,...mobileTasks[id],'RoboCasa365');
  level='s1';methodIds=r.comparison?r.outcomes.map(o=>modeMethod[o.mode]):[modeMethod[r.mode]];
 }else if(r.domain==='flat'){
  const [id,en,zh]=flatTasks[r.id];t=task('flat:'+id,en,zh,'Flat-ground locomotion');level='s0';methodIds=['gpt-only'];
 }else if(r.domain==='tracking'){
  const motion=r.benchmark.split(' · ')[1];t=task('tracking:'+motion,motion,motion,'LAFAN1');level='s0';methodIds=['gpt-only'];
 }else if(r.domain==='terrain'){
  const stairs=r.id.startsWith('stairs');t=task('terrain:'+(stairs?'stairs':'gaps'),stairs?'Stairs':'Gaps',stairs?'楼梯':'沟隙','Terrain');
  level='s1';methodIds=[r.method==='baseline'?'terrain-policy':'gpt-tracker'];
 }else if(r.domain==='ego-navigation'){
  t=task('ego:'+r.taskId,r.taskLabel.en,r.taskLabel.zh,'Ego-vision navigation');
  level=r.level;methodIds=[r.controller==='Astra + Passage'?'gpt-passage':'gpt-tracker'];
 }else if(r.domain==='obstacles'){
  const ceiling=r.id==='ceiling-passage',supp=r.id.startsWith('supplement');
  t=ceiling?task('clutter:ceiling','Low ceiling','低顶棚','Clutter'):supp?task('clutter:demo','Additional clutter scenes','补充杂乱场景','Clutter'):task('clutter:0089','Open clutter · scene 0089','开放杂乱场景 · 0089','Clutter');
  level='s1';methodIds=[r.method==='baseline'?'passage':'gpt-tracker'];
 }else if(r.domain==='proxy'){
  const five=r.id.includes('fivepoint');t=five?task('proxy:fivepoint','Five-point generator','五点生成器','Motion generators'):task('proxy:wholebody','14-point generator','14-point 生成器','Motion generators');
  level='s1';methodIds=['generator'];
 }else if(r.domain==='humanoid'&&r.id.startsWith('hb-')){
  const name=r.title.en.split(' · ')[0];
  t=task('humanoid:'+r.id.slice(3),name,name,'HumanoidBench');level='s2';methodIds=['gpt-skills'];
 }else if(r.domain==='humanoid'){
  t=task('humanoid:demos','Supplementary interactions','补充交互演示','HumanoidBench');
  level=null;methodIds=['demo'];
 }
 if(!t||!methodIds?.length||methodIds.some(id=>!methods.some(m=>m[0]===id)))throw Error('Unclassified gallery clip: '+r.id);
 return {...r,setting,level,methodIds,task:t};
}
const featureIds=['rxr-2682','robocasa-KettleBoiling-00','gaps-adapted-success','dex-hybrid-correction-1','robocasa-CoffeeSetupMug-03'];
const added=[...data.videos,...mobileVideos,...humanoidSupplement,...humanoidBenchVideos,...dexterousVideos,...s0Videos,...dexS0Videos,...egoNavigationVideos];
export const galleryVideos=[...featureIds.map(id=>added.find(r=>r.id===id)),...added.filter(r=>!featureIds.includes(r.id)),...original].map(classify);

export function clipOutcome(clip,method){
 const mode=Object.keys(modeMethod).find(key=>modeMethod[key]===method);
 const matched=clip.outcomes?.find(row=>row.mode===mode);
 if(matched)return matched.success?'success':'failure';
 // S0 recordings compare two trajectories; retention is not tracking success.
 if(clip.domain==='dexterous-s0'){
  if(method==='all')return 'demo';
  if(clip.controllerOutcomes?.[method])return clip.controllerOutcomes[method];
  if(method==='rl')return 'demo';
 }
 return clip.outcome;
}
export function matchesGallery(clip,filters,{ignoreTask=false,ignoreText=false}={}){
 const {setting,level,method,task:taskId,outcome,query}=filters;
 const searchable=[clip.title.en,clip.title.zh,clip.caption.en,clip.caption.zh,clip.benchmark,clip.id,clip.task.id,clip.task.label.en,clip.task.label.zh,...clip.methodIds.map(id=>methods.find(m=>m[0]===id).slice(1).join(' '))].join(' ').toLowerCase();
 return (setting==='all'||clip.setting===setting)&&(level==='all'||clip.level===level)&&(method==='all'||clip.methodIds.includes(method))&&
  (ignoreTask||taskId==='all'||clip.task.id===taskId)&&(ignoreText||(outcome==='all'||clipOutcome(clip,method)===outcome)&&searchable.includes(query.trim().toLowerCase()));
}
export const defaultFilters={setting:'all',level:'all',method:'all',task:'all',outcome:'all',query:''};
export function parseGalleryFilters(search){
 const p=new URLSearchParams(search),f={...defaultFilters};
 f.setting=p.get('setting')||p.get('domain')||'all';f.level=p.get('level')||'all';
 if(f.setting==='dexterous-s0'){f.setting='dexterous';f.level='s0';}
 for(const key of ['method','task','outcome'])f[key]=p.get(key)||'all';f.query=p.get('q')||'';
 for(const [key,options] of [['setting',settings],['level',levels],['method',methods]])if(!options.some(o=>o[0]===f[key]))f[key]='all';
 if(!['all','success','failure','demo'].includes(f.outcome))f.outcome='all';
 if(f.task!=='all'&&!galleryVideos.some(r=>r.task.id===f.task))f.task='all';
 return f;
}
export function galleryURL(filters,language){
 const p=new URLSearchParams({lang:language,view:'gallery'});
 for(const key of ['setting','level','method','task','outcome'])if(filters[key]!=='all')p.set(key,filters[key]);
 if(filters.query.trim())p.set('q',filters.query.trim());
 return 'index.html?'+p;
}
export function galleryClip(clip,method){
 // A comparison remains one case; the selected method is not a new recording.
 if(clip.domain==='dexterous-s0'||clip.comparison&&method!=='all'){
  const outcome=clipOutcome(clip,method),m=methods.find(m=>m[0]===method),label=method==='all'?['Astra / RL','Astra / RL']:m.slice(1);
  const result=outcome==='success'?['Success','成功']:outcome==='failure'?['Failure','失败']:['Comparison','对照'];
  const selectedMode=Object.keys(modeMethod).find(key=>modeMethod[key]===method);
  return {...clip,outcome,selectedMode,initialView:clip.comparison&&method!==modeMethod[clip.mode]?'comparison':clip.initialView,
   statusLabel:{en:label[0]+' · '+result[0],zh:label[1]+' · '+result[1]}};
 }
 return clip;
}
