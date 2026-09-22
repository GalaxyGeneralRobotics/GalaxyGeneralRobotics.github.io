// RoboDojo and RoboLab result rows, extracted from the original manipulation report's data.json.
import results from './evidence/manipulation-results.json';

const methodName=name=>name==='gpt'?'Astra':name==='mix'?'Astra + π₀.₅':name==='Pi-05'?'π₀.₅':name;
const methodKind=name=>name==='gpt'?'gpt':name==='mix'?'hybrid':'baseline';

export const robolabRows=results.robolab.slice().sort((a,b)=>b.sr-a.sr)
 .map(r=>({label:methodName(r.name),value:r.sr,method:methodKind(r.name)}));

// Five public references: the four leading Score references on this task subset, plus π₀.₅.
// Every published method remains available in `publicReferences`.
const referenceNames=['GalaxeaVLA (G0.5)','Xiaomi-Robotics-1','OpenWAM-α','DM0.5','Pi-05'];
export const publicReferences=results.models.filter(r=>r.origin==='official').slice().sort((a,b)=>b.score-a.score);
export const robodojoRows=metric=>['mix','gpt',...referenceNames].map(name=>{
 const r=results.models.find(r=>r.name===name);
 return {label:methodName(name)+(r.origin==='official'?' †':''),value:r[metric],method:methodKind(name)};
});
