'use strict';
(() => {
 const root=document.documentElement,system=matchMedia('(prefers-color-scheme: light)');
 let preference=null;
 try{preference=localStorage.getItem('debuda-theme')}catch{}
 function apply(theme){
  root.dataset.theme=theme;
  const light=theme==='light';
  document.querySelector('meta[name="theme-color"]').content=light?'#f7f5fc':'#000000';
  document.querySelectorAll('[data-theme-toggle]').forEach(button=>{
   button.setAttribute('aria-label','Switch to '+(light?'dark':'light')+' theme');
   button.querySelector('[data-theme-icon]').textContent=light?'◐':'☀';
   button.querySelector('[data-theme-label]').textContent=light?'Dark':'Light';
  });
 }
 apply(preference==='light'||preference==='dark'?preference:system.matches?'light':'dark');
 document.addEventListener('DOMContentLoaded',()=>apply(root.dataset.theme));
 document.addEventListener('click',event=>{
  if(!event.target.closest('[data-theme-toggle]'))return;
  preference=root.dataset.theme==='dark'?'light':'dark';
  apply(preference);
  try{localStorage.setItem('debuda-theme',preference)}catch{}
 });
 system.addEventListener('change',()=>{if(preference!=='light'&&preference!=='dark')apply(system.matches?'light':'dark')});
})();
