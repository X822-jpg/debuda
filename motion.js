'use strict';
(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(min-width: 821px) and (hover: hover) and (pointer: fine)');
 const animations=new Set(),decorations=new Set(),previewAnimations=new WeakMap();
 const hero=document.querySelector('.hero'),plate=document.querySelector('.botanical-plate');
 let flowerFrame=0,cardFrame=0,activeCard=null,introStarted=false;
 let lean={x:0,y:0,r:0},target={x:0,y:0,r:0},cardPoint={x:0,y:0};
 const enabled=()=>!reduced.matches&&!document.hidden;
 function play(node,frames,options){
  if(!node||!enabled()||typeof node.animate!=='function')return null;
  const animation=node.animate(frames,options);animations.add(animation);
  const clean=()=>animations.delete(animation);animation.finished.then(clean,clean);return animation;
 }
 function intro(){
  if(introStarted||document.hidden)return;introStarted=true;
  if(!enabled()||!hero)return;
  const ease='cubic-bezier(.22,1,.36,1)';
  const lines=hero.querySelectorAll('.hero-line > *');
  lines.forEach((line,index)=>play(line,[{transform:'translateY(110%)',opacity:0},{transform:'translateY(0)',opacity:1}],
   {duration:760,delay:80+index*100,easing:ease,fill:'backwards'}));
  [hero.querySelector('.eyebrow'),hero.querySelector('.hero-description'),hero.querySelector('.row'),hero.querySelector('.hero-footnote')].forEach((node,index)=>
   play(node,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,delay:index*90,easing:ease,fill:'backwards'}));
  play(plate,[{opacity:0,transform:'translateY(18px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:850,delay:140,easing:ease,fill:'backwards'});
  hero.querySelectorAll('.plate-orbit ellipse').forEach((orbit,index)=>play(orbit,[{strokeDashoffset:308,opacity:0},{strokeDashoffset:0,opacity:1}],
   {duration:950,delay:220+index*110,easing:ease,fill:'backwards'}));
 }
 function flowerTick(){
  if(!enabled()||!plate){flowerFrame=0;return}
  let distance=0;
  for(const key of ['x','y','r']){lean[key]+=(target[key]-lean[key])*.14;distance+=Math.abs(target[key]-lean[key])}
  plate.style.setProperty('--flower-x',lean.x.toFixed(3)+'px');
  plate.style.setProperty('--flower-y',lean.y.toFixed(3)+'px');
  plate.style.setProperty('--flower-lean',lean.r.toFixed(3)+'deg');
  flowerFrame=distance>.02?requestAnimationFrame(flowerTick):0;
 }
 function setFlower(x,y,r){target={x,y,r};if(!flowerFrame&&enabled())flowerFrame=requestAnimationFrame(flowerTick)}
 if(hero&&plate){
  hero.addEventListener('pointermove',event=>{
   if(!fine.matches||event.pointerType==='touch'||!enabled())return;
   const box=plate.getBoundingClientRect();
   const x=Math.max(-1,Math.min(1,(event.clientX-box.left-box.width/2)/(box.width/2)));
   const y=Math.max(-1,Math.min(1,(event.clientY-box.top-box.height/2)/(box.height/2)));
   setFlower(x*7,y*4,x*3.5);
  },{passive:true});
  hero.addEventListener('pointerleave',()=>setFlower(0,0,0),{passive:true});
 }
 function resetCard(){
  if(cardFrame)cancelAnimationFrame(cardFrame);cardFrame=0;
  if(activeCard){activeCard.classList.remove('is-tilting');activeCard.style.removeProperty('--tilt-x');activeCard.style.removeProperty('--tilt-y')}
  activeCard=null;
 }
 document.addEventListener('pointermove',event=>{
  if(!fine.matches||event.pointerType==='touch'||!enabled())return;
  const card=event.target.closest('.game');
  if(!card){resetCard();return}
  if(activeCard!==card){resetCard();activeCard=card}
  cardPoint={x:event.clientX,y:event.clientY};
  if(cardFrame)return;
  cardFrame=requestAnimationFrame(()=>{
   cardFrame=0;if(!activeCard||!activeCard.isConnected||!enabled())return;
   const box=activeCard.getBoundingClientRect();
   const x=Math.max(-1,Math.min(1,(cardPoint.x-box.left)/box.width*2-1));
   const y=Math.max(-1,Math.min(1,(cardPoint.y-box.top)/box.height*2-1));
   activeCard.style.setProperty('--tilt-x',(-y*2.2).toFixed(2)+'deg');
   activeCard.style.setProperty('--tilt-y',(x*2.8).toFixed(2)+'deg');activeCard.classList.add('is-tilting');
  });
 },{passive:true});
 document.addEventListener('pointerleave',resetCard,{passive:true});
 document.addEventListener('pointerdown',event=>{
  if(event.pointerType!=='touch'||!enabled())return;
  const card=event.target.closest('.game');
  if(card)play(card,[{transform:'scale(1)'},{transform:'scale(.985)',offset:.4},{transform:'scale(1)'}],{duration:190,easing:'ease-out'});
 },{passive:true});
 document.addEventListener('debuda:saved',event=>{
  if(!enabled())return;
  const source=event.detail&&event.detail.source;
  const library=document.querySelector('.nav[data-go="library"]');
  const destination=library&&library.getClientRects().length?library:document.querySelector('#menuToggle');
  if(!source||!destination||!destination.getClientRects().length)return;
  const start=source.getBoundingClientRect(),end=destination.getBoundingClientRect();
  const sx=start.left+start.width/2,sy=start.top+start.height/2,ex=end.left+end.width/2,ey=end.top+end.height/2;
  const cx=(sx+ex)/2+(ex<sx?-65:65),cy=Math.min(sy,ey)-55;
  const petal=document.createElementNS('http://www.w3.org/2000/svg','svg');
  petal.setAttribute('viewBox','-26 -94 52 94');petal.setAttribute('aria-hidden','true');petal.classList.add('petal-flight');
  const shape=document.createElementNS('http://www.w3.org/2000/svg','use');shape.setAttribute('href','#pt');petal.append(shape);
  if(decorations.size>=3){const oldest=decorations.values().next().value;oldest.remove();decorations.delete(oldest)}
  document.body.append(petal);decorations.add(petal);
  const frames=Array.from({length:13},(_,index)=>{
   const t=index/12,u=1-t,x=u*u*sx+2*u*t*cx+t*t*ex,y=u*u*sy+2*u*t*cy+t*t*ey;
   return{offset:t,transform:`translate3d(${x-12}px,${y-17}px,0) rotate(${-35+t*155}deg) scale(${1-t*.35})`,opacity:t<.1?t*10:t>.85?(1-t)/.15:1};
  });
  const flight=play(petal,frames,{duration:740,easing:'cubic-bezier(.3,0,.35,1)'});
  const remove=()=>{petal.remove();decorations.delete(petal)};
  if(flight)flight.finished.then(()=>{remove();play(destination,[{boxShadow:'0 0 0 0px transparent'},{boxShadow:'0 0 0 7px #bfa0ed55',offset:.4},{boxShadow:'0 0 0 12px transparent'}],{duration:500,easing:'ease-out'})},remove);else remove();
 });
 document.addEventListener('debuda:preview',event=>{
  const host=event.detail&&event.detail.host;if(!host||!host.isConnected||!enabled())return;
  const previous=previewAnimations.get(host);if(previous)previous.cancel();
  const animation=play(host.querySelector('.pl'),[{opacity:.45,transform:'translateY(7px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:360,easing:'cubic-bezier(.22,1,.36,1)'});
  if(animation)previewAnimations.set(host,animation);
  document.querySelectorAll('#shopGrid .item.is-previewing').forEach(item=>{
   play(item.querySelector('.ith'),[{opacity:.55,transform:'scale(.97)'},{opacity:1,transform:'scale(1)'}],{duration:320,easing:'ease-out'});
   play(item,[{boxShadow:'0 0 0 0px transparent'},{boxShadow:'0 0 0 3px #bfa0ed66',offset:.3},{boxShadow:'0 0 0 8px transparent'}],{duration:500,easing:'ease-out'});
  });
 });
 function stop(){
  if(flowerFrame)cancelAnimationFrame(flowerFrame);flowerFrame=0;lean={x:0,y:0,r:0};target={x:0,y:0,r:0};
  if(plate)for(const property of ['--flower-x','--flower-y','--flower-lean'])plate.style.removeProperty(property);
  resetCard();animations.forEach(animation=>animation.cancel());animations.clear();decorations.forEach(node=>node.remove());decorations.clear();
 }
 reduced.addEventListener('change',event=>{if(event.matches)stop()});
 fine.addEventListener('change',()=>{if(!fine.matches){resetCard();setFlower(0,0,0)}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else intro()});
 window.addEventListener('pagehide',stop);
 intro();
})();
