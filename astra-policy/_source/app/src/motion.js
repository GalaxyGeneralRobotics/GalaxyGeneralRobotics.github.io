import {useEffect,useLayoutEffect,useRef,useState} from 'react';

// Scroll-triggered motion. Elements are hidden before paint and animated once when they
// first enter the viewport. Everything is skipped under prefers-reduced-motion, so the
// page is fully readable without any animation at all.
const EASE='cubic-bezier(.22,1,.36,1)';
const still=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const players={
 fade(el){
  el.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:640,easing:EASE,fill:'backwards'});
 },
 bars(el){
  el.querySelectorAll('.bar-fill,.lead-track i').forEach((bar,i)=>{
   bar.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:760,delay:i*34,easing:EASE,fill:'backwards'});
  });
  el.querySelectorAll('.bar-row strong,.bar-label,.lead-bar b,.lead-key').forEach((label,i)=>{
   label.animate([{opacity:0},{opacity:1}],{duration:460,delay:Math.min(420,i*16)+140,easing:EASE,fill:'backwards'});
  });
 }
};

export function useReveal(kind='fade'){
 const ref=useRef(null);
 useLayoutEffect(()=>{
  const el=ref.current;
  if(!el||still())return;
  el.classList.add('will-'+kind);
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(!entry.isIntersecting)continue;
    observer.unobserve(entry.target);
    entry.target.classList.remove('will-'+kind);
    players[kind](entry.target);
   }
  },{threshold:0,rootMargin:'0px 0px -40px 0px'});
  observer.observe(el);
  return ()=>observer.disconnect();
 },[kind]);
 return ref;
}

// Staggered entrance for above-the-fold headers.
export function useEntrance(){
 const ref=useRef(null);
 useLayoutEffect(()=>{
  const el=ref.current;
  if(!el||still())return;
  [...el.children].forEach((child,i)=>{
   child.animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{duration:720,delay:80*i,easing:EASE,fill:'backwards'});
  });
 },[]);
 return ref;
}

// Which of the given section ids is currently in the reading position.
export function useActiveSection(ids){
 const [active,setActive]=useState(ids[0]);
 useEffect(()=>{
  const sections=ids.map(id=>document.getElementById(id)).filter(Boolean);
  if(!sections.length)return;
  const update=()=>{
   const line=window.innerHeight*.3;
   let current=sections[0].id;
   for(const section of sections)if(section.getBoundingClientRect().top<=line)current=section.id;
   setActive(current);
  };
  update();
  window.addEventListener('scroll',update,{passive:true});
  return ()=>window.removeEventListener('scroll',update);
 },[ids.join()]);
 return active;
}
