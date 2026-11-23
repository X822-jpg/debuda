'use strict';
// ---- Admin panel + live events (say / unlock animation / Christmas) + bans. Server side: see supabase-setup.sql ----
let sbTok='',sbExp=0,sbUid='',banKey='',evLast=null,evTimer=0,stageEl=null,stageRaf=0,stageT=0;
const sbCfg=()=>window.DEBUDA_CONFIG||{},sbOn=()=>!!(sbCfg().SUPABASE_URL&&sbCfg().SUPABASE_ANON_KEY);
function tokSet(t,expSec){sbTok=t||'';sbExp=(+expSec||0)*1000}
async function freshTok(){if(sbTok&&sbExp-Date.now()>120000)return sbTok;const rt=store.get('debuda.rt',null);if(!rt)throw new Error('no session');
 const t=await sbRefresh(rt);store.set('debuda.rt',t.refresh_token);tokSet(t.access_token,t.expires_at||Math.floor(Date.now()/1000)+(t.expires_in||3600));return sbTok}
async function rest(path,opt={},auth=false){const c=sbCfg(),h={apikey:c.SUPABASE_ANON_KEY,'Content-Type':'application/json',...(opt.headers||{})};
 if(auth)h.Authorization='Bearer '+await freshTok();
 const r=await fetch(c.SUPABASE_URL+'/rest/v1/'+path,{...opt,headers:h});if(!r.ok)throw new Error(r.status);const tx=await r.text();return tx?JSON.parse(tx):null}

// called after every verified Supabase login
function adminHook(u){const md=u.user_metadata||{},ids=u.identities||[],gi=ids.find(i=>i.provider==='github'),di=ids.find(i=>i.provider==='discord'),gd=gi&&gi.identity_data||{},dd=di&&di.identity_data||{};
 sbUid=u.id||'';banKey=gi?'github:'+String(gd.user_name||gd.preferred_username||'').toLowerCase():di?'discord:'+String(dd.full_name||dd.user_name||md.full_name||'').toLowerCase().trim():'';
 if(banKey&&!isOwner())rest('bans?key=eq.'+encodeURIComponent(banKey)+'&select=key').then(r=>{if(r&&r.length)banned()}).catch(()=>{})}
function banned(){user=null;setOwner(false);tokSet('',0);try{localStorage.removeItem('debuda.rt');sessionStorage.removeItem('debuda.session')}catch{}renderAcct();
 const s=mkStage('ban',false),b=el('button','btn','OK');b.onclick=()=>location.href=location.pathname;s.append(el('h1','','You are banned'),el('p','muted','This account can no longer use Debuda.'),b)}

// ---- live events: everyone polls the site_events table ----
function startEvents(){if(!sbOn()||evTimer)return;const tick=async()=>{if(document.hidden)return;try{
  if(evLast===null){const r=await rest('site_events?select=id&order=id.desc&limit=1');evLast=r&&r[0]?r[0].id:0;return}
  const r=await rest('site_events?select=id,kind,payload,created_at&id=gt.'+evLast+'&order=id.asc&limit=5');
  for(const e of r||[]){evLast=Math.max(evLast,e.id);if(Date.now()-new Date(e.created_at)<60000)playEvent(e)}}catch{}};
 tick();evTimer=setInterval(tick,3500)}
function playEvent(e){const p=e.payload||{};if(e.kind==='say')sayBanner(String(p.by||'admin').slice(0,24),String(p.text||'').slice(0,140));else if(e.kind==='unlock')unlockStage();else if(e.kind==='xmas')xmasStage()}
function sayBanner(by,text){const d=el('div','say');d.append(el('b','',by+': '),el('span','',text));document.body.append(d);setTimeout(()=>d.remove(),9000)}

// ---- full-screen stages ----
function closeStage(){cancelAnimationFrame(stageRaf);clearTimeout(stageT);if(stageEl){stageEl.remove();stageEl=null}document.body.style.overflow=''}
function mkStage(cls,closable=true){closeStage();const s=el('div','stage '+cls);if(closable){const x=el('button','x','×');x.setAttribute('aria-label','Close');x.onclick=closeStage;s.append(x)}document.body.append(s);document.body.style.overflow='hidden';stageEl=s;return s}
function unlockStage(){const s=mkStage('unl'),box=el('div','term'),h=el('h1','glt','UNLOCKING…'),bar=el('div','bar'),fill=el('i'),log=el('pre','tlog'),tag=el('div','tmode','TEST MODE · nothing is actually unlocked');
 h.dataset.t='UNLOCKING…';bar.append(fill);box.append(el('div','kick','DEBUDA ALPHA // UNLOCK SEQUENCE'),h,bar,log,tag);s.append(box);
 const L=['loading modules ........ OK','linking interface ...... OK','MM2 .................. READY','DEAGLE DUELS .......... READY','DA HOOD ............... READY','verifying ............. OK','sequence complete'];let i=0;
 const step=()=>{if(stageEl!==s)return;if(i<L.length){log.textContent+='> '+L[i]+'\n';fill.style.width=Math.round(++i/L.length*100)+'%';stageT=setTimeout(step,650+Math.random()*350)}
  else{h.textContent=h.dataset.t='UNLOCK COMPLETE (TEST)';h.classList.add('done');stageT=setTimeout(()=>stageEl===s&&closeStage(),5000)}};step()}
function xmasStage(){const s=mkStage('xm');for(let i=0;i<3;i++)s.append(el('div','aur a'+i));
 const cv=el('canvas','xcv'),g=el('div','garland'),t=el('div','xtitle'),btn=el('button','btn xbtn','Open the Christmas Cases');s.append(cv);
 for(let i=0;i<28;i++){const b=el('i');b.className='b'+(i%4);b.style.animationDelay=i*.15+'s';g.append(b)}
 [...'CHRISTMAS EVENT'].forEach((c,i)=>{const sp=el('span','',c===' '?'\u00a0':c);sp.style.animationDelay=1.2+i*.06+'s';t.append(sp)});
 btn.onclick=()=>{closeStage();go('shop');shopKind='c';renderShop();openCase(CASES[10])};
 s.append(g,t,el('div','xsub','2026 · the Christmas Case is here'),btn,el('div','xground'));
 stageT=setTimeout(()=>stageEl===s&&closeStage(),24000);
 if((window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)||!cv.getContext)return;
 const ctx=cv.getContext('2d'),dpr=Math.min(2,devicePixelRatio||1);let W=innerWidth,H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
 const fl=Array.from({length:Math.min(260,Math.floor(W*H/6000))},()=>({x:Math.random()*W,y:Math.random()*H,z:Math.random(),p:Math.random()*6})),gifts=[],spark=[],t0=performance.now();
 const frame=now=>{if(stageEl!==s)return;const T=(now-t0)/1000;ctx.clearRect(0,0,W,H);
  for(const f of fl){f.y+=.6+f.z*2.2;f.x+=Math.sin(T*.8+f.p)*.6+.4+f.z*.5;if(f.y>H){f.y=-5;f.x=Math.random()*W}if(f.x>W)f.x=0;ctx.globalAlpha=.35+f.z*.65;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(f.x,f.y,.8+f.z*2.4,0,7);ctx.fill()}
  if(T>1&&T<8){const u=(T-1)/7,x=-220+(W+440)*u,y=H*.22+Math.sin(u*9)*H*.04;ctx.globalAlpha=1;ctx.font='60px serif';ctx.fillText('🦌🦌🛷',x,y);
   for(let k=0;k<3;k++)spark.push({x:x+10,y:y-10+Math.random()*30,vx:-1-Math.random()*2,vy:Math.random()-.2,l:1,h:Math.random()*60+30});
   if(Math.random()<.35)gifts.push({x:x+40,y:y+20,vx:Math.random()*2-1,vy:1+Math.random()*2,r:0,vr:Math.random()*.2-.1,e:['🎁','🎄','⭐','🔔'][Math.floor(Math.random()*4)]})}
  for(let i=spark.length-1;i>=0;i--){const q=spark[i];q.x+=q.vx;q.y+=q.vy;q.l-=.02;if(q.l<=0){spark.splice(i,1);continue}ctx.globalAlpha=q.l;ctx.fillStyle='hsl('+q.h+',100%,70%)';ctx.fillRect(q.x,q.y,3,3)}
  for(let i=gifts.length-1;i>=0;i--){const q=gifts[i];q.vy+=.05;q.x+=q.vx;q.y+=q.vy;q.r+=q.vr;if(q.y>H+40){gifts.splice(i,1);continue}ctx.save();ctx.globalAlpha=1;ctx.translate(q.x,q.y);ctx.rotate(q.r);ctx.font='28px serif';ctx.fillText(q.e,-14,10);ctx.restore()}
  ctx.globalAlpha=1;stageRaf=requestAnimationFrame(frame)};stageRaf=requestAnimationFrame(frame)}

// ---- admin panel ----
async function openAdmin(){if(!isOwner())return;closeAll();open('adminModal');const st=$('#admStatus');st.textContent='Checking admin access…';
 try{const r=await rest('admins?id=eq.'+sbUid+'&select=id',{},true);st.textContent=r&&r.length?'✅ Server admin confirmed. Broadcast and bans are on.':'⚠ Not a server admin yet. Run supabase-setup.sql (see README.txt). Animations still play on your screen.'}
 catch{st.textContent='⚠ Could not reach the server. Check config.js and run supabase-setup.sql.'}loadBans()}
async function emit(kind,payload){payload.by=String(pname()||'admin').slice(0,24);
 if(!$('#tgAll').checked)return playEvent({kind,payload});
 try{const r=await rest('site_events',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({kind,payload})},true);const id=r&&r[0]&&r[0].id;if(id&&(evLast===null||id>evLast))evLast=id;playEvent({kind,payload});toast('Sent to everyone ✓')}
 catch{playEvent({kind,payload});toast('Could not broadcast, played only on your screen. Check supabase-setup.sql.')}}
async function loadBans(){const box=$('#banList');box.replaceChildren();
 try{const r=await rest('bans?select=key&order=created_at.desc&limit=50');if(!r||!r.length)return box.append(el('span','muted','No bans.'));
  for(const b of r){const c=el('button','btn ghost sm',b.key+'  ✕ unban');c.onclick=()=>unban(b.key);box.append(c)}}catch{box.append(el('span','muted','Could not load bans.'))}}
async function banUser(){const n=$('#banName').value.trim().toLowerCase();if(!/^[\p{L}\p{N}_.\-# ]{2,40}$/u.test(n))return toast('Enter a valid username.');const key=$('#banProv').value+':'+n;
 if(OWNERS.map(o=>'github:'+o).includes(key))return toast('You cannot ban an owner account.');
 try{await rest('bans?on_conflict=key',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates'},body:JSON.stringify({key})},true);toast('Banned '+key);$('#banName').value='';loadBans()}
 catch{toast('Ban failed. Are you a server admin? (supabase-setup.sql)')}}
async function unban(key){try{await rest('bans?key=eq.'+encodeURIComponent(key),{method:'DELETE'},true);toast('Unbanned '+key);loadBans()}catch{toast('Unban failed.')}}
function admInit(){
 $('#admSayBtn').onclick=()=>{const v=$('#admSay').value.trim();if(!v)return;emit('say',{text:v.slice(0,140)});$('#admSay').value=''};
 $('#admUnlock').onclick=()=>emit('unlock',{test:true});$('#admXmas').onclick=()=>emit('xmas',{});$('#banBtn').onclick=banUser;
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeStage()});startEvents()}
document.addEventListener('DOMContentLoaded',admInit);
