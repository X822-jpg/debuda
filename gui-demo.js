'use strict';
(() => {
 const modal=document.querySelector('#guiModal'),stage=document.querySelector('#guiStage');
 const tabs=[...modal.querySelectorAll('[data-gui-tab]')],small=matchMedia('(max-width:600px)');
 let initialGame=GAMES[0],device='desktop',plan='Month';
 const feedback=text=>{document.querySelector('#guiFeedback').textContent=text};
 function setGame(game){
  document.querySelector('#guiContext').textContent=game.name+' / GUI preview';
  document.querySelector('#guiBackdrop').src='assets/games/'+game.art+'.png';
  modal.querySelectorAll('[data-gui-game]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.guiGame===game.id)));
 }
 function setPage(name){
  const selected=tabs.find(tab=>tab.dataset.guiTab===name);if(!selected)return;
  const activePane=modal.querySelector('.gui-pane:not(.hidden)'),moveFocus=activePane&&activePane.contains(document.activeElement);
  tabs.forEach(tab=>{const on=tab===selected;tab.setAttribute('aria-selected',String(on));tab.tabIndex=on?0:-1;document.querySelector('#'+tab.getAttribute('aria-controls')).classList.toggle('hidden',!on)});
  if(moveFocus)selected.focus();
 }
 function orientation(){modal.querySelector('.gui-nav').setAttribute('aria-orientation',device==='mobile'||small.matches?'horizontal':'vertical')}
 function setDevice(next){device=next;stage.classList.toggle('is-mobile',next==='mobile');modal.querySelectorAll('[data-gui-device]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.guiDevice===next)));orientation()}
 function setPlan(next){plan=next;modal.querySelectorAll('[data-gui-plan]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.guiPlan===plan)));feedback('Selected '+plan+'. Use Preview selection to apply this sample plan.')}
 function showWindow(visible,focus=true){document.querySelector('#guiWindow').classList.toggle('hidden',!visible);document.querySelector('#guiReopen').classList.toggle('hidden',visible);if(focus)(visible?tabs.find(tab=>tab.getAttribute('aria-selected')==='true'):document.querySelector('#guiReopen')).focus()}
 function reset(){
  setGame(initialGame);setDevice('desktop');setPage('Home');plan='Month';
  modal.querySelectorAll('[data-gui-plan]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.guiPlan===plan)));
  document.querySelector('#guiPlanName').textContent=plan;document.querySelector('#guiPlanPreview').textContent='Preview selection';showWindow(true,false);feedback('');
 }
 function openDemo(id){initialGame=id==='current'?(active||GAMES[0]):(GAMES.find(game=>game.id===id)||GAMES[0]);closeAll();reset();open('guiModal')}
 const list=document.querySelector('#guiGameList');
 GAMES.forEach(game=>{const row=el('div','gui-game-row'),copy=el('div'),button=el('button','','VIEW');button.type='button';button.dataset.guiGame=game.id;button.setAttribute('aria-label','Preview '+game.name+' backdrop');copy.append(el('b','',game.name),el('small','','Supported Roblox game'));row.append(copy,button);list.append(row)});
 document.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-demo]');if(trigger){openDemo(trigger.dataset.demo);return}
  if(!modal.contains(event.target))return;
  const tab=event.target.closest('[data-gui-tab]');if(tab){setPage(tab.dataset.guiTab);return}
  const go=event.target.closest('[data-gui-go]');if(go){setPage(go.dataset.guiGo);return}
  const size=event.target.closest('[data-gui-device]');if(size){setDevice(size.dataset.guiDevice);return}
  const choice=event.target.closest('[data-gui-plan]');if(choice){setPlan(choice.dataset.guiPlan);return}
  const game=event.target.closest('[data-gui-game]');if(game){const next=GAMES.find(item=>item.id===game.dataset.guiGame);if(next){setGame(next);feedback(next.name+' backdrop selected. No game is launched.')}}
 });
 modal.addEventListener('keydown',event=>{
  const tab=event.target.closest('[data-gui-tab]');if(!tab)return;
  const index=tabs.indexOf(tab);let next;
  if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%tabs.length;
  else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index-1+tabs.length)%tabs.length;
  else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;
  event.preventDefault();setPage(tabs[next].dataset.guiTab);tabs[next].focus();
 });
 document.querySelector('#guiPlanPreview').onclick=()=>{document.querySelector('#guiPlanName').textContent=plan;document.querySelector('#guiPlanPreview').textContent='Preview: '+plan;feedback(plan+' plan preview applied. Nothing was purchased.')};
 for(const id of ['guiHide','guiSettingsHide'])document.querySelector('#'+id).onclick=()=>showWindow(false);
 document.querySelector('#guiReopen').onclick=()=>showWindow(true);
 document.querySelector('#guiReset').onclick=()=>{reset();feedback('Demo reset.')};
 small.addEventListener('change',orientation);
})();
