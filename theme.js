'use strict';
(() => {
 const root=document.documentElement,system=matchMedia('(prefers-color-scheme: light)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let preference=null,busy=false,transition=null,reveal=null;
 try{preference=localStorage.getItem('debuda-theme')}catch{}
 function apply(theme){
  root.dataset.theme=theme;
  const light=theme==='light';
  document.querySelector('meta[name="theme-color"]').content=light?'#f6f4f0':'#141417';
  document.querySelectorAll('[data-theme-toggle]').forEach(button=>{
   button.setAttribute('aria-label','Switch to '+(light?'dark':'light')+' theme');
   button.querySelector('[data-theme-icon]').textContent=light?'◐':'☀';
   button.querySelector('[data-theme-label]').textContent=light?'Dark':'Light';
  });
 }
 apply(preference==='light'||preference==='dark'?preference:system.matches?'light':'dark');
 document.addEventListener('DOMContentLoaded',()=>apply(root.dataset.theme));
 document.addEventListener('click',async event=>{
  const button=event.target.closest('[data-theme-toggle]');
  if(!button||busy)return;
  preference=root.dataset.theme==='dark'?'light':'dark';
  try{localStorage.setItem('debuda-theme',preference)}catch{}
  if(reduced.matches||typeof document.startViewTransition!=='function'){apply(preference);return}
  busy=true;
  const rect=button.getBoundingClientRect(),x=rect.left+rect.width/2,y=rect.top+rect.height/2;
  const radius=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
  root.classList.add('theme-wave');
  try{
   transition=document.startViewTransition(()=>apply(preference));
   await transition.ready;
   if(reduced.matches){transition.skipTransition();return}
   reveal=root.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${radius}px at ${x}px ${y}px)`]},
    {duration:580,easing:'cubic-bezier(.22,1,.36,1)',pseudoElement:'::view-transition-new(root)'});
   await reveal.finished;
   await transition.finished;
  }catch{apply(preference);if(transition)transition.skipTransition()}
  finally{root.classList.remove('theme-wave');busy=false;transition=null;reveal=null}
 });
 reduced.addEventListener('change',event=>{if(event.matches){if(reveal)reveal.cancel();if(transition)transition.skipTransition()}});
 system.addEventListener('change',()=>{if(preference!=='light'&&preference!=='dark')apply(system.matches?'light':'dark')});
})();
