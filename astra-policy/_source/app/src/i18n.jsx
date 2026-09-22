import React,{createContext,useContext,useEffect,useState} from 'react';

// Language changes presentation only; data, media and query IDs stay intact.
// A plain URL opens in English; `?lang=zh` opens in Chinese.
const LanguageContext=createContext(null);
export const reportTitle={en:'Exploring the Comprehensive Capabilities of GPT-6 Astra as Policies',zh:'探索 GPT-6 Astra 作为策略的综合能力'};
export const reportShort={en:'GPT-6 Astra as an Embodied Policy',zh:'GPT-6 Astra 作为具身策略'};

export function LanguageProvider({children}){
 const [language,setLanguage]=useState(()=>new URLSearchParams(window.location.search).get('lang')==='zh'?'zh':'en');
 const changeLanguage=next=>{
  setLanguage(next);
  const url=new URL(window.location.href);url.searchParams.set('lang',next);
  window.history.replaceState(window.history.state,'',url);
 };
 useEffect(()=>{
  document.documentElement.lang=language==='zh'?'zh-CN':'en';
  document.title=reportTitle[language];
 },[language]);
 return <LanguageContext.Provider value={{language,changeLanguage}}>{children}</LanguageContext.Provider>;
}

export const useLanguage=()=>useContext(LanguageContext);
/** c(en, zh) → the string for the active language. */
export function useCopy(){const {language}=useLanguage();return (en,zh)=>language==='zh'?zh:en;}
/** text({en, zh}) → the active language; plain strings pass through. */
export function useText(){const {language}=useLanguage();return value=>value&&typeof value==='object'?value[language]:value;}

export function LanguageSwitch(){
 const {language,changeLanguage}=useLanguage();
 const next=language==='en'?'zh':'en';
 return <button type="button" className="lang-switch" onClick={()=>changeLanguage(next)} lang={next==='zh'?'zh-CN':'en'}
  aria-label={language==='en'?'Switch to Chinese':'切换为英文'}>
  <span aria-hidden="true" className={language==='en'?'is-on':undefined}>EN</span>
  <span aria-hidden="true" className={language==='zh'?'is-on':undefined}>中</span>
 </button>;
}
