import React,{Suspense,lazy} from 'react';
import './app.css';
import {LanguageProvider,useCopy,useLanguage} from './i18n.jsx';
import {MediaProvider} from './media.jsx';
import {ReferenceScope} from './references.jsx';
import {TopBar,SiteFooter} from './chrome.jsx';
import {Landing} from './pages/Landing.jsx';
import {DomainPage} from './pages/DomainPage.jsx';
// The gallery carries every recorded case; load it only on its own route.
const GalleryPage=lazy(()=>import('./pages/GalleryPage.jsx').then(m=>({default:m.GalleryPage})));
import {currentView} from './site.js';

function Page(){
 const c=useCopy(),{language}=useLanguage(),view=currentView();
 return <MediaProvider>
  <a className="skip-link" href={view==='gallery'?'#rollouts':view==='home'?'#leading':'#results'}>{c('Skip to results','跳至结果')}</a>
  <TopBar view={view}/>
  <main className={'page is-'+view} lang={language==='zh'?'zh-CN':'en'}>
   <ReferenceScope>{view==='gallery'?<Suspense fallback={<div className="band loading"/>}><GalleryPage/></Suspense>:view==='home'?<Landing/>:<DomainPage view={view}/>}</ReferenceScope>
  </main>
  <SiteFooter/>
 </MediaProvider>;
}

export const App=()=><LanguageProvider><Page/></LanguageProvider>;
