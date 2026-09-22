import React from 'react';
import {useCopy} from './i18n.jsx';

// Chart semantics are fixed: cobalt is always an Astra configuration, slate a compared method.
export const colors={hybrid:'#5b7cff',gpt:'#9db0ff',adapted:'#5b7cff',unadapted:'#9db0ff',baseline:'#5a6280',proxy:'#3f4659'};
export const number=(value,decimals=0)=>value==null?'—':Number(value).toLocaleString('en-US',{minimumFractionDigits:decimals,maximumFractionDigits:decimals});

export function Section({id,index,title,subtitle,children}){
 return <section id={id} className="sec">
  <header className="sec-head">{index&&<span className="eyebrow">{index}</span>}<h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</header>
  {children}
 </section>;
}

/** Experimental setting: prose, an optional list of [method, pipeline] pairs, then the Results label. */
export function Setup({children,methods=[]}){
 const c=useCopy();
 return <>
  <div className="setup">
   <h4 className="label">{c('Experimental setting','实验设置')}</h4>
   <div className="setup-body">{children}
    {methods.length>0&&<dl className="methods">{methods.map(([name,flow])=><div key={name}><dt>{name}</dt><dd>{flow}</dd></div>)}</dl>}
   </div>
  </div>
  <h4 className="label results-label">{c('Results','实验结果')}</h4>
 </>;
}

export function Conclusion({children,paragraphs}){
 const c=useCopy();
 return <div className="conclusion"><h4 className="label">{c('Conclusion','小结')}</h4>
  <div>{paragraphs?paragraphs.map((p,i)=><p key={i}>{p}</p>):<p>{children}</p>}</div>
 </div>;
}

export const Note=({children,className=''})=><p className={'note '+className}>{children}</p>;

export function Details({title,children,className=''}){
 return <details className={'disclosure '+className}>
  <summary><span>{title}</span><i aria-hidden="true"/></summary>
  <div className="disclosure-body">{children}</div>
 </details>;
}

export function Figure({title,subtitle,children,caption,className=''}){
 return <figure className={'fig '+className}>
  {title&&<header className="fig-head"><h3>{title}</h3>{subtitle&&<span>{subtitle}</span>}</header>}
  {children}
  {caption&&<figcaption>{caption}</figcaption>}
 </figure>;
}

export function Bars({rows,max=100,unit='%',decimals=1,threshold,compact=false}){
 const show=r=>r.display||number(r.value,decimals)+unit;
 return <div className={'bars'+(compact?' is-compact':'')} role="img" aria-label={rows.map(r=>r.label+': '+show(r)).join('; ')}>
  {rows.map((r,i)=><div className="bar-row" key={r.label+i}>
   <span className="bar-label">{r.label}</span>
   <div className="bar-track">
    {threshold!=null&&<i className="bar-threshold" style={{left:(threshold/max*100)+'%'}}/>}
    <span className="bar-fill" style={{width:Math.max(0,Math.min(100,r.value/max*100))+'%',background:r.color||colors[r.method]||colors.hybrid}}/>
   </div>
   <strong>{show(r)}</strong>
  </div>)}
 </div>;
}

export function ChartTitle({children,aside}){
 return <div className="chart-title"><h4>{children}</h4>{aside&&<span>{aside}</span>}</div>;
}

export function DataTable({headers,rows,caption,className=''}){
 const c=useCopy();
 return <div className={'table-scroll '+className} tabIndex="0" role="region" aria-label={typeof caption==='string'?caption:c('Results table','结果表')}>
  <table className="table">{caption&&<caption>{caption}</caption>}
   <thead><tr>{headers.map((h,i)=><th key={i} scope="col">{h}</th>)}</tr></thead>
   <tbody>{rows.map((r,i)=><tr key={i}>{r.map((v,j)=>j===0?<th scope="row" key={j}>{v}</th>:<td key={j}>{v}</td>)}</tr>)}</tbody>
  </table>
 </div>;
}

export function Flow({items}){
 return <div className="flow">{items.map((s,i)=><React.Fragment key={i}>{i>0&&<span aria-hidden="true">→</span>}<div>{s}</div></React.Fragment>)}</div>;
}

export function Toggle({options,value,onChange,label}){
 return <div className="toggle" role="group" aria-label={label}>
  {options.map(([key,text])=><button type="button" key={key} aria-pressed={value===key} onClick={()=>onChange(key)}>{text}</button>)}
 </div>;
}

/** A row of headline numbers: [{value, unit, label}]. */
export function Stats({items}){
 return <div className="stats">{items.map((s,i)=><div key={i}><strong>{s.value}{s.unit&&<span>{s.unit}</span>}</strong><p>{s.label}</p></div>)}</div>;
}
