'use strict';
const GAMES=[
{id:'mm2',name:'Murder Mystery 2',cat:'Mystery',desc:'Roblox: one murderer, one sheriff, everyone else tries to survive.',emoji:'🔪',art:'mm2',tag:'SUPPORTED'},
{id:'deagle',name:'Deagle Duels',cat:'Shooter',desc:'Roblox: fast one-on-one duels with the Desert Eagle.',emoji:'🔫',art:'deagle',tag:'SUPPORTED'},
{id:'dahood',name:'Da Hood',cat:'Action',desc:'Roblox: open street world with fights, cash and crews.',emoji:'🏙️',art:'dahood',tag:'SUPPORTED'}];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
const DATA_VERSION='2026-11-23-reset3'; // change this text to wipe everyone's saved data again
try{if(localStorage.getItem('debuda.v')!==DATA_VERSION){Object.keys(localStorage).filter(k=>k.startsWith('debuda.')&&k!=='debuda.rt').forEach(k=>localStorage.removeItem(k));localStorage.setItem('debuda.v',DATA_VERSION)}}catch{}
const SALES_OPEN=false; // Alpha: buying is locked. Set to true only when a real checkout exists.
const ANCHORS=[[1,100],[7,500],[30,1200],[90,1900],[365,2500]]; // [days, cents]: $1 up to $25
const eur=c=>'$'+(c/100).toFixed(2);
let filter='All',active=null,days=7,mode='login',pendingBuy=false,saved=new Set(store.get('debuda.saved',[]));
let user=null;try{user=sessionStorage.getItem('debuda.session')}catch{}

function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2600)}
function card(g){const b=el('button','game');b.type='button';b.dataset.game=g.id;b.setAttribute('aria-label','View '+g.name+' — Supported in Alpha');
 const th=el('div','thumb c-'+g.art),cover=el('img','game-cover');
 cover.src='assets/games/'+g.art+'.png';cover.alt='';cover.width=768;cover.height=432;cover.loading='lazy';
 th.append(cover,el('span','game-status','Supported · Alpha'));
 const c=el('div','game-body'),features=el('span','game-features');
 ['Profile preview','Plan preview','UI settings'].forEach(feature=>features.append(el('span','game-feature',feature)));
 const link=el('span','game-link');link.append(document.createTextNode('View game'),el('span','game-arrow','↗'));
 c.append(el('small','',g.cat),el('h3','',g.name),el('p','',g.desc),el('span','game-feature-label','Available in Alpha'),features,el('span','game-note','Visual preview only'),link);
 b.append(th,c);return b}
function fill(sel,list){$(sel).replaceChildren(...list.map(card))}
function renderCatalog(){const q=$('#search').value.trim().toLowerCase();
 const l=GAMES.filter(g=>(filter==='All'||g.cat===filter)&&(g.name+g.cat+g.desc).toLowerCase().includes(q));
 fill('#catalog',l);$('#none').classList.toggle('hidden',l.length>0)}
function renderLib(){const l=GAMES.filter(g=>saved.has(g.id));fill('#libGrid',l);$('#libEmpty').classList.toggle('hidden',l.length>0)}
function setMenu(expanded){$('.top').classList.toggle('menu-open',expanded);$('#menuToggle').setAttribute('aria-expanded',String(expanded));$('#menuToggle').setAttribute('aria-label',expanded?'Close menu':'Open menu')}
$('#menuToggle').onclick=()=>setMenu($('#menuToggle').getAttribute('aria-expanded')!=='true');
function go(v,keepMenu=false){if(!keepMenu)setMenu(false);if(v==='profile'&&!user){openAuth('login');return}['home','games','library','roblox','shop','profile'].forEach(x=>$('#'+x+'View').classList.toggle('hidden',x!==v));
 $$('.nav').forEach(b=>b.classList.toggle('on',b.dataset.go===v));if(v==='games')renderCatalog();if(v==='library')renderLib();if(v==='roblox')loadLua();if(v==='shop')renderShop();if(v==='profile')renderProfile();scrollTo({top:0})}
let dialogReturnFocus=null;
function open(id){const modal=$('#'+id);dialogReturnFocus=document.activeElement;modal.classList.remove('hidden');document.body.style.overflow='hidden';$('#app').inert=true;requestAnimationFrame(()=>{const target=modal.querySelector('input:not([type=range]):not([type=checkbox])')||modal.querySelector('button:not([disabled]),[href]');if(target)target.focus()})}
function closeAll(){const wasOpen=$$('.back').some(m=>!m.classList.contains('hidden'));$$('.back').forEach(m=>m.classList.add('hidden'));document.body.style.overflow='';$('#app').inert=false;if(wasOpen&&dialogReturnFocus&&document.contains(dialogReturnFocus))dialogReturnFocus.focus();else if(wasOpen)$('#main').focus();dialogReturnFocus=null}

// ---- pricing: longer = cheaper ----
function price(d){let i=1;while(i<ANCHORS.length-1&&d>ANCHORS[i][0])i++;const[a,b]=[ANCHORS[i-1],ANCHORS[i]];const total=Math.min(2500,Math.max(100,Math.round(a[1]+(b[1]-a[1])*(d-a[0])/(b[0]-a[0]))));return{total,full:d*100,per:total/d}}
function setDays(d){days=Math.min(365,Math.max(1,Math.round(+d)||1));const p=price(days);
 $('#days').value=days;$('#dayOut').textContent=days;$('#total').textContent=eur(p.total);$('#perDay').textContent=eur(p.per);
 $('#save').textContent=p.full>p.total?eur(p.full-p.total):'—';const e=new Date(Date.now()+days*864e5);$('#ends').textContent=e.toLocaleDateString();
 $$('#chips button').forEach(b=>b.classList.toggle('on',+b.dataset.d===days))}
function openBuy(){closeAll();$('#pickStep').classList.remove('hidden');$('#doneStep').classList.add('hidden');setDays(days);open('buyModal')}

// ---- auth (client-side demo, hashed with PBKDF2) ----
const enc=new TextEncoder(),hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const unhex=h=>Uint8Array.from(h.match(/../g),x=>parseInt(x,16));
async function hash(pw,salt){const k=await crypto.subtle.importKey('raw',enc.encode(pw),'PBKDF2',false,['deriveBits']);
 return hex(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt,iterations:210000},k,256))}
function same(a,b){if(a.length!==b.length)return false;let r=0;for(let i=0;i<a.length;i++)r|=a.charCodeAt(i)^b.charCodeAt(i);return r===0}
function strength(p){let s=0;if(p.length>=8)s++;if(p.length>=12)s++;if(/[a-z]/.test(p)&&/[A-Z]/.test(p))s++;if(/\d/.test(p))s++;if(/[^A-Za-z0-9]/.test(p))s++;return s}
function setMode(m){mode=m;const r=m==='register';$$('[data-auth]').forEach(b=>b.classList.toggle('on',b.dataset.auth===m));
 $('#regOnly').classList.toggle('hidden',!r);$('#aTitle').textContent=r?'Create account':'Welcome back';$('#authBtn').textContent=r?'Register':'Log in';
 $('#pass').autocomplete=r?'new-password':'current-password';$('#authErr').textContent=''}
function openAuth(m){setMenu(false);closeAll();setMode(m||'login');open('authModal');$('#user').focus()}
function renderAcct(){const a=$('#acct');a.replaceChildren();
 if(!user){const l=el('button','btn ghost','Log in'),r=el('button','btn','Register');l.onclick=()=>openAuth('login');r.onclick=()=>openAuth('register');a.append(l,r);return}
 const u=store.get('debuda.users',{})[user],last=u&&u.orders&&u.orders[u.orders.length-1];
 const c=el('div','chip'),nb=el('button','link',pname());nb.onclick=()=>go('profile');c.append(miniAv(),nb);if(isOwner()){c.append(el('small','','👑 Owner'));const ab=el('button','adm','OPEN');ab.onclick=openAdmin;c.append(ab)}if(last&&new Date(last.ends)>new Date())c.append(el('small','','Alpha ✓'));
 const o=el('button','','Log out');o.onclick=()=>{user=null;setOwner(false);tokSet('',0);try{localStorage.removeItem('debuda.rt')}catch{}try{sessionStorage.removeItem('debuda.session')}catch{}renderAcct();toast('Logged out.')};c.append(o);a.append(c)}
$('#authForm').addEventListener('submit',async e=>{e.preventDefault();const err=$('#authErr'),btn=$('#authBtn');err.textContent='';
 const name=$('#user').value.trim().toLowerCase(),pw=$('#pass').value;
 if(!/^[a-z0-9_]{3,20}$/.test(name))return err.textContent='Username: 3–20 letters, numbers or _.';
 const lock=store.get('debuda.lock',{n:0,until:0});if(Date.now()<lock.until)return err.textContent='Too many attempts. Wait '+Math.ceil((lock.until-Date.now())/1000)+'s.';
 const users=store.get('debuda.users',{});btn.disabled=true;
 try{
  if(mode==='register'){
   if(pw.length<8||strength(pw)<3)return err.textContent='Password too weak (8+ chars, mixed case, numbers).';
   if(pw!==$('#pass2').value)return err.textContent='Passwords do not match.';
   if(Object.prototype.hasOwnProperty.call(users,name))return err.textContent='That username is taken.';
   const salt=crypto.getRandomValues(new Uint8Array(16));users[name]={salt:hex(salt),hash:await hash(pw,salt),orders:[]};store.set('debuda.users',users);
  }else{
   const u=Object.prototype.hasOwnProperty.call(users,name)?users[name]:null;
   const h=await hash(pw,u?unhex(u.salt):new Uint8Array(16));
   if(!u||!same(h,u.hash)){const n=lock.n+1;store.set('debuda.lock',{n:n%5?n:0,until:n%5?0:Date.now()+60000});return err.textContent='Wrong username or password.'}
  }
  store.set('debuda.lock',{n:0,until:0});user=name;setOwner(false);try{sessionStorage.setItem('debuda.session',name)}catch{}
  $('#authForm').reset();renderAcct();toast(mode==='register'?'Account created!':'Welcome, '+name+'!');
  if(pendingBuy){pendingBuy=false;toCheckout()}else closeAll();
 }finally{btn.disabled=false}});
$('#pass').addEventListener('input',()=>{const s=strength($('#pass').value),b=$('#meterBar');b.style.width=s*20+'%';b.style.background=s<3?'#f87171':s<4?'#fbbf24':'#22c55e';$('#meterTxt').textContent=['Too short','Weak','Weak','Okay','Strong','Very strong'][s]});

// ---- checkout ----
function toCheckout(){if(!SALES_OPEN)return toast('Debuda is in Alpha — buying is not open yet.');if(!user){pendingBuy=true;return openAuth('register')}
 closeAll();const p=price(days),e=new Date(Date.now()+days*864e5);
 $('#recap').replaceChildren(...[['Plan','Debuda Alpha'],['Duration',days+' day'+(days>1?'s':'')],['Ends',e.toLocaleDateString()],['Total',eur(p.total)]].map(([a,b])=>{const li=el('li');li.append(el('span','',a),el('b','',b));return li}));
 $('#pickStep').classList.add('hidden');$('#doneStep').classList.remove('hidden');open('buyModal')}
$('#confirm').onclick=()=>{if(!SALES_OPEN)return toast('Debuda is in Alpha — buying is not open yet.');const users=store.get('debuda.users',{});if(!user||!users[user])return;
 const base=Math.max(Date.now(),...users[user].orders.map(o=>+new Date(o.ends)));
 users[user].orders.push({days,total:price(days).total,ends:new Date(base+days*864e5).toISOString()});store.set('debuda.users',users);
 closeAll();renderAcct();toast('Debuda Alpha added for '+days+' day'+(days>1?'s':'')+' ✓')};
$('#toCheckout').onclick=toCheckout;if(SALES_OPEN){$('#toCheckout').disabled=false;$('#toCheckout').textContent='Continue →';$('#lockNote').classList.add('hidden')}
$('#days').addEventListener('input',e=>setDays(e.target.value));
$('#chips').addEventListener('click',e=>{if(e.target.dataset.d)setDays(e.target.dataset.d)});

// ---- events ----
document.addEventListener('click',e=>{const t=e.target;
 if(t.closest('[data-buy]'))return openBuy();
 const g=t.closest('[data-game]');if(g){active=GAMES.find(x=>x.id===g.dataset.game);if(!active)return;
  $('#gTitle').textContent=active.name;$('#gCat').textContent=active.cat.toUpperCase()+' · '+active.tag;$('#gDesc').textContent=active.desc;$('#gEmoji').textContent=active.emoji;$('#gCover').src='assets/games/'+active.art+'.png';$('#gCover').alt=active.name+' cover';
  $('#gArt').className='art c-'+active.art;$('#gSave').textContent=saved.has(active.id)?'★ Saved':'☆ Save';return open('gameModal')}
 if(t.closest('[data-close]')||t.classList.contains('back'))return closeAll();
 const n=t.closest('[data-go]');if(n){e.preventDefault();return go(n.dataset.go)}
 const f=t.closest('[data-f]');if(f){filter=f.dataset.f;$$('[data-f]').forEach(b=>b.classList.toggle('on',b===f));renderCatalog()}
 const a=t.closest('[data-auth]');if(a)setMode(a.dataset.auth)});
$('#gSave').onclick=()=>{if(!active)return;const adding=!saved.has(active.id);adding?saved.add(active.id):saved.delete(active.id);store.set('debuda.saved',[...saved]);$('#gSave').textContent=saved.has(active.id)?'★ Saved':'☆ Save';renderLib();if(adding){toast('Saved to your library.');document.dispatchEvent(new CustomEvent('debuda:saved',{detail:{source:$('#gSave')}}))}};
$('#search').addEventListener('input',()=>{if($('#gamesView').classList.contains('hidden'))go('games',true);renderCatalog()});
$('#enterBtn').onclick=()=>{$('#welcome').classList.add('hidden');$('#app').classList.remove('hidden')};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const menuOpen=$('#menuToggle').getAttribute('aria-expanded')==='true';setMenu(false);closeAll();if(menuOpen)$('#menuToggle').focus()}
 if(e.key==='Tab'){const modal=$$('.back').find(m=>!m.classList.contains('hidden'));if(!modal)return;const focusable=[...modal.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),a[href],[tabindex="0"]')].filter(node=>node.getClientRects().length);if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
fill('#featured',GAMES.slice(0,3));renderCatalog();renderLib();renderAcct();setDays(7);

let luaText='';
async function loadLua(){if(luaText)return;try{const r=await fetch('debuda.lua',{cache:'no-cache'});if(!r.ok)throw 0;luaText=await r.text()}catch{luaText='-- Could not load debuda.lua'}$('#luaCode').textContent=luaText}
$('#copyLua').onclick=async()=>{await loadLua();try{await navigator.clipboard.writeText(luaText);toast('Script copied!')}catch{toast('Select the text and copy it manually.')}};

// ---- Discord / GitHub login via Supabase (no library needed) ----
const CFG=window.DEBUDA_CONFIG||{};
document.addEventListener('click',e=>{const b=e.target.closest('[data-oauth]');if(!b)return;
 const p=b.dataset.oauth;if(!['discord','github'].includes(p))return;
 if(!CFG.SUPABASE_URL||!CFG.SUPABASE_ANON_KEY)return $('#authErr').textContent='Login with '+p+' is not set up yet (add keys in config.js).';
 location.href=CFG.SUPABASE_URL+'/auth/v1/authorize?provider='+p+'&redirect_to='+encodeURIComponent(location.origin+location.pathname)});
const sbH=()=>({apikey:CFG.SUPABASE_ANON_KEY,'Content-Type':'application/json'});
async function sbUser(tok){const r=await fetch(CFG.SUPABASE_URL+'/auth/v1/user',{headers:{...sbH(),Authorization:'Bearer '+tok}});if(!r.ok)throw 0;return r.json()}
async function sbRefresh(rt){const r=await fetch(CFG.SUPABASE_URL+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:sbH(),body:JSON.stringify({refresh_token:rt})});if(!r.ok)throw 0;return r.json()}
function applyUser(u){const md=u.user_metadata||{},n=md.custom_claims&&md.custom_claims.global_name||md.full_name||md.user_name||u.email;if(!n)throw 0;
 const gi=(u.identities||[]).find(i=>i.provider==='github'),gd=gi&&gi.identity_data||{};
 const gh=String(gd.user_name||gd.preferred_username||(u.app_metadata&&u.app_metadata.provider==='github'?md.user_name:'')||'').toLowerCase();
 user=String(n).slice(0,40);try{sessionStorage.setItem('debuda.session',user)}catch{}
 adoptAv(md.avatar_url||md.picture);setOwner(!!gh&&OWNERS.includes(gh));adminHook(u);
 $('#welcome').classList.add('hidden');$('#app').classList.remove('hidden');renderAcct();return user}
(async()=>{if(!CFG.SUPABASE_URL||!CFG.SUPABASE_ANON_KEY)return;
 const h=new URLSearchParams(location.hash.slice(1));let at=h.get('access_token'),rt=h.get('refresh_token');
 if(at)history.replaceState(null,'',location.pathname);else rt=store.get('debuda.rt',null);
 if(!at&&!rt)return;
 try{let u;if(at){u=await sbUser(at);tokSet(at,h.get('expires_at')||Math.floor(Date.now()/1000)+3600);if(rt)store.set('debuda.rt',rt)}
  else{const t=await sbRefresh(rt);store.set('debuda.rt',t.refresh_token);tokSet(t.access_token,t.expires_at||Math.floor(Date.now()/1000)+(t.expires_in||3600));u=t.user||await sbUser(t.access_token)}
  const nm=applyUser(u);if(at)toast('Signed in as '+nm+(isOwner()?' 👑':''))}
 catch{if(at)toast('Login failed. Try again.');else try{localStorage.removeItem('debuda.rt')}catch{}}})();
