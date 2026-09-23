// Single-page routing. `view` selects the landing page, a domain page or the gallery;
// `lang` is handled by the language provider and threaded through every link.
export const domainCategories=[
 {id:'gripper-manipulation',en:'Gripper Manipulation',zh:'夹爪操作'},
 {id:'dexhand-manipulation',en:'DexHand Manipulation',zh:'灵巧手操作'},
 {id:'mobile-manipulation',en:'Mobile Manipulation',zh:'移动操作'},
 {id:'navigation',en:'Navigation',zh:'导航'},
 {id:'locomotion',en:'Locomotion',zh:'运动控制'},
 {id:'loco-manipulation',en:'Loco Manipulation',zh:'运动与操作协同'}
];
export const domainIds=domainCategories.map(r=>r.id);
const viewAliases={manipulation:'gripper-manipulation',dexterous:'dexhand-manipulation',humanoid:'loco-manipulation',obstacles:'locomotion'};
export const canonicalView=view=>viewAliases[view]||view;

export function currentView(search=window.location.search,hash=window.location.hash){
 const requested=new URLSearchParams(search).get('view');
 // The kitchen section moved to its own page; preserve its old deep link.
 if(requested==='manipulation'&&hash==='#mobile-manipulation')return 'mobile-manipulation';
 const view=canonicalView(requested);
 if(view==='gallery')return 'gallery';
 return domainIds.includes(view)?view:'home';
}

export function viewHref(view,language,extra){
 const params=new URLSearchParams();
 if(language==='zh')params.set('lang','zh');
 if(view&&view!=='home')params.set('view',canonicalView(view));
 if(extra)for(const [key,value] of Object.entries(extra))params.set(key,value);
 const query=params.toString();
 return 'index.html'+(query?'?'+query:'');
}
