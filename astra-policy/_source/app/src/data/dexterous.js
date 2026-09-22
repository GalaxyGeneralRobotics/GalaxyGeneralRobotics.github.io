// Scores manually checked against raw_docs/humanoid_resule.png (2026-09-20).
// Captions remain tied to the original handoff's recorded episodes.
import media from './evidence/dexterous-media.json';
export const dexterousTasks=[
 {task:'Lift and stably hold a pot',zh:'提起并稳定握持锅具',pi05:40,direct:44,hybrid:62,initial:'01_grasp_pot'},
 {task:'Place headphones in a box',zh:'将耳机放入盒中',pi05:42,direct:22,hybrid:42,initial:'02_pack_headset'},
 {task:'Remove a toy from a box',zh:'从盒中取出玩具',pi05:100,direct:22,hybrid:100,initial:'03_grasp_from_bin_toy'},
 {task:'Hang a mug on a rack',zh:'将杯子挂上杯架',pi05:62,direct:4,hybrid:82,initial:'04_hang_cup_on_rack'},
 {task:'Place two mahjong tiles in a basket',zh:'将两块麻将牌放入篮中',pi05:48,direct:18,hybrid:88,initial:'05_mahjong_into_basket'},
 {task:'Place two bottles in the left basket and two cans in the right basket',zh:'将两个瓶子放入左篮、两个罐子放入右篮',pi05:72,direct:14,hybrid:100,initial:'06_sort_bottles_cans'},
 {task:'Place an egg upright in an egg tray',zh:'将鸡蛋直立放入蛋托',pi05:6,direct:12,hybrid:38,initial:'07_egg_into_tray'},
 {task:'Stack two bowls on a coaster',zh:'在垫子上叠放两个碗',pi05:46,direct:20,hybrid:52},
 {task:'Insert two bread slices into separate slots',zh:'将两片面包分别插入两个槽中',pi05:10,direct:8,hybrid:28,initial:'09_bread_into_slots'},
 {task:'Arrange nesting dolls by size',zh:'将套娃按大小排列',pi05:16,direct:2,hybrid:26,initial:'10_sort_nesting_dolls'}
];
export const dexterousMeans=Object.fromEntries(['pi05','direct','hybrid'].map(method=>[method,dexterousTasks.reduce((sum,task)=>sum+task[method],0)/dexterousTasks.length]));
const labels={
 'direct-failure-1':{method:'gpt',outcome:'failure',title:{en:'Astra · repeatedly aligning with the pot',zh:'Astra · 反复对准锅具'},caption:{en:'The right hand repeatedly realigns over the handle without securing it. The episode ends at the decision budget: 40 decisions and 200 control steps.',zh:'右手反复对准锅柄，却未形成稳定抓握。该回合在达到调用预算时结束：40 次决策、200 个控制步。'}},
 'direct-failure-2':{method:'gpt',outcome:'failure',title:{en:'Astra · the hand topples the bottle',zh:'Astra · 手部碰倒瓶子'},caption:{en:'The hand approaches the bottle, but its outer surface contacts it before the fingers enclose it. The bottle topples; the run ends with an object-out-of-boundary outcome after 135 control steps.',zh:'手部接近瓶子时，外侧先于手指包覆接触物体，导致瓶子倒下。运行在 135 个控制步后因物体越界结束。'}},
 'hybrid-correction-1':{method:'hybrid',outcome:'success',title:{en:'Astra + π₀.₅ · centering the egg over its holder',zh:'Astra + π₀.₅ · 将鸡蛋对准蛋托'},caption:{en:'π₀.₅ executes 512/562 control steps. Astra intervenes in three bursts: 10 decisions over 50 steps. The first includes hand edits and a wrist rise of up to 4.5 cm; later lateral corrections recenter the egg before release. The egg ends upright.',zh:'π₀.₅ 执行 562 个控制步中的 512 步。Astra 分三段介入，共 10 次决策、50 步；首段包含手部配置修正及最大 4.5 cm 的抬腕，随后横向微调使鸡蛋在释放前重新对准蛋托。最终鸡蛋直立。'}},
 'hybrid-correction-2':{method:'hybrid',outcome:'success',title:{en:'Astra + π₀.₅ · revealing the second mahjong tile',zh:'Astra + π₀.₅ · 露出被遮挡的第二块麻将'},caption:{en:'π₀.₅ executes 604/688 control steps. Astra makes 17 decisions over 84 steps in three bursts, using wrist translations and retaining the policy’s finger configurations. After the first tile is placed, moving the empty left hand reveals the second; both tiles end in the basket.',zh:'π₀.₅ 执行 688 个控制步中的 604 步。Astra 分三段介入，共 17 次决策、84 步，平移手腕并保留策略的手指配置。第一块放好后，移开空着的左手露出第二块，两块麻将最终均进入篮中。'}}
};
export const dexterousVideos=media.map(r=>({...r,...labels[r.id],id:'dex-'+r.id,domain:'dexterous',benchmark:'Dexterous manipulation',playback:'dexterous'}));
