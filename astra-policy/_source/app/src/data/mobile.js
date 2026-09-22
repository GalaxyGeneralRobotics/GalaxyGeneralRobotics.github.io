// Editorial labels are handwritten. Numerical data and captions come from the
// supplied structured records; the full source package is retained unchanged.
import navigation from './evidence/navigation-summary.json';
import groups from './evidence/robocasa-summary.json';
import actionSources from './evidence/robocasa-action-sources.json';
import published from './evidence/published-navigation.json';
import media from './mobile-gallery.json';
import playback from './evidence/mobile-playback.json';
export {navigation,groups,actionSources,published};
export const mobileRoot='sources/navigation-mobile/';
const posterUrl=path=>path?'media/joint/mobile-posters/'+path.split('/').pop().replace(/\.[^.]+$/,'.webp'):undefined;
export const datasetNames={r2r:'R2R',rxr:'RxR',mp3d:'MP3D',hm3d:'HM3D v2'};
export const navMethods=[['astra','Astra','#5b7cff'],['lightnav','LightNav-0','#5a6280'],['uninavid','Uni-NaVid 7B','#4b5370'],['omninav','OmniNav Flow · 3 RGB','#3f4659']];
export const taskGroups={atomic_seen:['Atomic seen','原子 · 已见'],composite_seen:['Composite seen','复合 · 已见'],composite_unseen:['Composite unseen','复合 · 未见'],all:['All tasks','全部任务']};
export const controlMethods=[['pi05_only','π₀.₅','baseline'],['direct','Astra','gpt'],['pi05_skill','Astra + π₀.₅','hybrid']];
// Manually reconciled against the 15-row task CSV and the manuscript heatmap.
export const tasks=[
 ['CoffeeSetupMug','atomic_seen',3,0,0],
 ['OpenDrawer','atomic_seen',3,2,3],
 ['OpenStandMixerHead','atomic_seen',1,0,2],
 ['PickPlaceDrawerToCounter','atomic_seen',2,0,3],
 ['PickPlaceSinkToCounter','atomic_seen',4,5,5],
 ['DeliverStraw','composite_seen',0,1,1],
 ['KettleBoiling','composite_seen',0,1,3],
 ['PackIdenticalLunches','composite_seen',1,1,2],
 ['SearingMeat','composite_seen',0,1,1],
 ['WashLettuce','composite_seen',2,0,0],
 ['BreadSelection','composite_unseen',0,4,2],
 ['GatherTableware','composite_unseen',0,0,1],
 ['HeatKebabSandwich','composite_unseen',0,2,1],
 ['MakeIceLemonade','composite_unseen',0,3,2],
 ['RecycleBottlesByType','composite_unseen',1,5,3]
];
const titlesZh={
 'r2r-314':'从烤箱经过壁炉，到达灰色沙发',
 'r2r-680':'定位车轮装饰的楼梯栏杆',
 'r2r-1472':'从餐区走向门廊台球桌',
 'rxr-6022':'穿过厨房拱门，到达第四级台阶',
 'rxr-1622':'从餐厅走向两个展示台',
 'rxr-3852':'从健身房走到桌角与橱柜之间',
 'mp3d-82bab0c34ef7e4466c33febc':'寻找台面',
 'mp3d-752a407317bb31624789056a':'长距离搜索后找到沙发',
 'hm3d-d3862628202d6451c79b325a':'长距离寻找植物',
 'hm3d-ed6f0f0e011888329e7a27ef':'成功找到马桶',
 'r2r-552':'穿过长画廊',
 'r2r-1639':'从手工房走向餐厅',
 'r2r-444':'路线跟随 · STOP 未成功',
 'r2r-518':'厨房转弯与楼梯平台定位',
 'r2r-913':'从走廊走向客厅地毯',
 'r2r-802':'路线接近，终点未达标',
 'rxr-2682':'遵循 173 词指令穿过多个画廊',
 'rxr-7796':'从玻璃门走到第二间洗手间',
 'rxr-1124':'返回壁炉所在的房间',
 'rxr-8156':'经过卧室、厨房，到达玻璃门',
 'rxr-8632':'连续的拱门与转弯',
 'rxr-1024':'偏离路线后的终点',
 'mp3d-bb16cafc25611c30552523a2':'高效寻找椅子',
 'mp3d-d85d14e6f78f570f4ef30dc1':'跨楼层寻找床',
 'mp3d-a31411f9e9b786354e28f764':'寻找淋浴设施直至步数耗尽',
 'mp3d-33c5aeeec866328f56f08494':'寻找显示器 · STOP 未成功',
 'hm3d-dd7aa17effe4a51d6f41c21d':'从卧室出发寻找椅子',
 'hm3d-083de1a97fc102f2f2094c63':'从厨房出发寻找沙发',
 'hm3d-869e9dd3566a14d1c7ed6d3f':'寻找马桶直至预算耗尽',
 'hm3d-80e1ccbe1d71f9dececa8662':'寻找电视，STOP 未成功',
 'robocasa-DeliverStraw-02':'递送吸管',
 'robocasa-PackIdenticalLunches-03':'打包两份相同的午餐',
 'robocasa-SearingMeat-01':'煎肉',
 'robocasa-PickPlaceSinkToCounter-00':'从水槽转移到台面',
 'robocasa-MakeIceLemonade-00':'制作冰柠檬水',
 'robocasa-KettleBoiling-00':'放置水壶并打开炉灶',
 'robocasa-RecycleBottlesByType-01':'按材质分类瓶子',
 'robocasa-CoffeeSetupMug-03':'咖啡杯准备 · π₀.₅ 成功，Astra 与 Astra + π₀.₅ 失败',
 'robocasa-GatherTableware-02':'收集并分类餐具',
 'robocasa-BreadSelection-03':'选择面包并取出果酱',
 'robocasa-HeatKebabSandwich-03':'加热烤肉三明治',
 'robocasa-PickPlaceDrawerToCounter-04':'从抽屉转移到台面'
};
export const mobileVideos=media.map(r=>({
 id:r.id,domain:r.kind==='navigation'?'visual-navigation':'mobile-manipulation',
 benchmark:r.kind==='navigation'?(r.dataset==='r2r'||r.dataset==='rxr'?'VLN-CE · ':'ObjectNav · ')+datasetNames[r.dataset]:'RoboCasa365',
 title:{en:r.title,zh:titlesZh[r.id]},caption:{en:r.selection_reason_en,zh:r.selection_reason_zh},
 video:mobileRoot+r.video.replace('../',''),poster:posterUrl(r.poster),
 comparison:r.comparison?mobileRoot+r.comparison.replace('../',''):undefined,
 comparisonDuration:playback[r.id+'-comparison']?.duration,
 comparisonPoster:posterUrl(playback[r.id+'-comparison']?.poster),
 duration:playback[r.id]?.duration??r.duration_s,outcome:r.success?'success':'failure',mode:r.hero_mode,outcomes:r.outcomes,
 instruction:r.instruction,playback:r.kind==='navigation'?'nav-primitives':'robocasa',
}));
export const mobileClip=id=>mobileVideos.find(r=>r.id===id);
