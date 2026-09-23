import React from 'react';
import {useCopy,useText} from './i18n.jsx';
import {MediaCard,ImageFigure} from './media.jsx';
import {Details} from './ui.jsx';

export function FailureAnalysis({id,intro,cases}){
 const c=useCopy(),text=useText();
 return <div className="failure-analysis" id={id}>
  <div className="prose"><h3>{c('Failure case analysis','失败案例分析')}</h3><p>{text(intro)}</p></div>
  <div className="failure-case-list">{cases.map(row=><article className="failure-case" id={id+'-'+row.code.toLowerCase()} key={row.code}>
   <h4><span>{row.code}</span>{text(row.title)}</h4>
   <div className="failure-case-grid">
    <div className="failure-case-media">
     {row.clip?<MediaCard clip={row.clip} compact/>:<ImageFigure src={row.image} alt={text(row.frameCaption)}/>}
    </div>
    <div className="prose failure-case-copy">
     <p><strong>{c('Task and outcome. ','任务与结果。')}</strong>{text(row.context)}</p>
     <p><strong>{c('Failure mechanism. ','失效过程。')}</strong>{text(row.mechanism)}</p>
     <p><strong>{c('Capability boundary. ','能力边界。')}</strong>{text(row.boundary)}</p>
    </div>
   </div>
   {row.clip&&row.image&&<Details title={c('Key frames and state transitions','关键帧与状态变化')}><ImageFigure src={row.image} alt={text(row.frameCaption)} caption={text(row.frameCaption)}/></Details>}
  </article>)}</div>
 </div>;
}
