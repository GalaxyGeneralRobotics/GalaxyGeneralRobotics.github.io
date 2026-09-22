import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
import {useCopy} from './i18n.jsx';
import {Section} from './ui.jsx';
import {references} from './data/references.js';
import reportBibtex from './data/report-citation.bib?raw';
import reportBibtexUrl from './data/report-citation.bib?url';

const byId=new Map(references.map(r=>[r.id,r]));

// References are numbered per page in order of first citation. <Cite> registers an id while
// rendering; <References> lists everything registered on the page once it has mounted.
const ScopeContext=createContext(null);
export function ReferenceScope({children}){
 const order=useRef([]);
 const cite=id=>{if(!order.current.includes(id))order.current.push(id);return order.current.indexOf(id)+1;};
 return <ScopeContext.Provider value={{cite,order}}>{children}</ScopeContext.Provider>;
}

export function Cite({ids}){
 const c=useCopy(),scope=useContext(ScopeContext);
 if(!scope)return null;
 const entries=(Array.isArray(ids)?ids:[ids]).map(id=>{
  const entry=byId.get(id);
  if(!entry)throw new Error('Unknown reference: '+id);
  return {...entry,number:scope.cite(id)};
 });
 return <sup className="cite">{entries.map((r,i)=><React.Fragment key={r.id}>{i>0&&','}<a href={'#ref-'+r.id} title={r.title} aria-label={c('Reference ','参考文献 ')+r.number}>{r.number}</a></React.Fragment>)}</sup>;
}

export function References(){
 const c=useCopy(),scope=useContext(ScopeContext),[ids,setIds]=useState([]);
 useEffect(()=>{setIds([...scope.order.current]);},[]);
 if(!ids.length)return null;
 return <Section id="references" index={c('Cited on this page','本页引用')} title={c('References','参考文献')}>
  <ol className="reference-list">{ids.map(id=>{const r=byId.get(id);return <li key={id} id={'ref-'+id}>
   <span>{r.authors}.</span>{' '}
   <a className="reference-title" href={r.url} target="_blank" rel="noreferrer">{r.title}</a>.{' '}
   <span>{[r.venue,r.year].filter(Boolean).join(', ')}.</span>
   {r.links?.map(([label,url])=><a className="reference-extra" key={url} href={url} target="_blank" rel="noreferrer">{label==='Project'?c('Project','项目'):label==='Code'?c('Code','代码'):label} ↗</a>)}
  </li>;})}</ol>
 </Section>;
}

export function Citation(){
 const c=useCopy(),[status,setStatus]=useState('idle'),timer=useRef(null);
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 const copy=async()=>{
  let copied=false;
  try{await navigator.clipboard.writeText(reportBibtex);copied=true;}catch{copied=false;}
  setStatus(copied?'copied':'error');clearTimeout(timer.current);
  timer.current=setTimeout(()=>setStatus('idle'),2600);
 };
 return <Section id="citation" index="BibTeX" title={c('Cite this report','引用本报告')}>
  <div className="bibtex">
   <pre tabIndex="0" aria-label={c('Report citation in BibTeX','本报告的 BibTeX 引用')}><code>{reportBibtex}</code></pre>
   <div className="bibtex-tools">
    <button type="button" className="button" onClick={copy}>{status==='copied'?c('Copied ✓','已复制 ✓'):status==='error'?c('Select the text above','请选中上方文本'):c('Copy BibTeX','复制 BibTeX')}</button>
    <a className="button is-quiet" href={reportBibtexUrl} download="gpt-as-policy.bib">{c('Download .bib','下载 .bib')} ↓</a>
   </div>
  </div>
 </Section>;
}
