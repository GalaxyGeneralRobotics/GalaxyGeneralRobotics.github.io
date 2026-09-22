// Single-page routing. `view` selects the landing page, a domain page or the gallery;
// `lang` is handled by the language provider and threaded through every link.
export const domainIds=['manipulation','dexterous','navigation','humanoid','locomotion','obstacles'];

export function currentView(search=window.location.search){
 const view=new URLSearchParams(search).get('view');
 if(view==='gallery')return 'gallery';
 return domainIds.includes(view)?view:'home';
}

export function viewHref(view,language,extra){
 const params=new URLSearchParams();
 if(language==='zh')params.set('lang','zh');
 if(view&&view!=='home')params.set('view',view);
 if(extra)for(const [key,value] of Object.entries(extra))params.set(key,value);
 const query=params.toString();
 return 'index.html'+(query?'?'+query:'');
}
