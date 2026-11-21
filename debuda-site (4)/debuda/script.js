'use strict';
const GAMES=[
{id:'mm2',name:'Murder Mystery 2',cat:'Mystery',desc:'Roblox: one murderer, one sheriff, everyone else tries to survive.',emoji:'🔪',art:'mm2',tag:'SUPPORTED'},
{id:'deagle',name:'Deagle Duels',cat:'Shooter',desc:'Roblox: fast one-on-one duels with the Desert Eagle.',emoji:'🔫',art:'deagle',tag:'SUPPORTED'},
{id:'dahood',name:'Da Hood',cat:'Action',desc:'Roblox: open street world with fights, cash and crews.',emoji:'🏙️',art:'dahood',tag:'SUPPORTED'}];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
const SALES_OPEN=false; // Alpha: buying is locked. Set to true only when a real checkout exists.
const ANCHORS=[[1,100],[7,500],[30,1200],[90,1900],[365,2500]]; // [days, cents]: $1 up to $25
const eur=c=>'$'+(c/100).toFixed(2);
let filter='All',active=null,days=7,mode='login',pendingBuy=false,saved=new Set(store.get('debuda.saved',[]));
let user=null;try{user=sessionStorage.getItem('debuda.session')}catch{}

function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2600)}
function card(g){const b=el('button','game');b.dataset.game=g.id;
 const th=el('div','thumb c-'+g.art);th.append(el('span','',g.emoji));
 const c=el('div');c.append(el('small','',g.cat+' · '+g.tag),el('h3','',g.name),el('p','',g.desc));b.append(th,c);return b}
function fill(sel,list){$(sel).replaceChildren(...list.map(card))}
function renderCatalog(){const q=$('#search').value.trim().toLowerCase();
 const l=GAMES.filter(g=>(filter==='All'||g.cat===filter)&&(g.name+g.cat+g.desc).toLowerCase().includes(q));
 fill('#catalog',l);$('#none').classList.toggle('hidden',l.length>0)}
function renderLib(){const l=GAMES.filter(g=>saved.has(g.id));fill('#libGrid',l);$('#libEmpty').classList.toggle('hidden',l.length>0)}
function go(v){['home','games','library','roblox'].forEach(x=>$('#'+x+'View').classList.toggle('hidden',x!==v));
 $$('.nav').forEach(b=>b.classList.toggle('on',b.dataset.go===v));if(v==='games')renderCatalog();if(v==='library')renderLib();if(v==='roblox')loadLua();scrollTo({top:0})}
function open(id){$('#'+id).classList.remove('hidden');document.body.style.overflow='hidden'}
function closeAll(){$$('.back').forEach(m=>m.classList.add('hidden'));document.body.style.overflow=''}

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
function openAuth(m){closeAll();setMode(m||'login');open('authModal');$('#user').focus()}
function renderAcct(){const a=$('#acct');a.replaceChildren();
 if(!user){const l=el('button','btn ghost','Log in'),r=el('button','btn','Register');l.onclick=()=>openAuth('login');r.onclick=()=>openAuth('register');a.append(l,r);return}
 const u=store.get('debuda.users',{})[user],last=u&&u.orders&&u.orders[u.orders.length-1];
 const c=el('div','chip');c.append(el('span','',user));if(last&&new Date(last.ends)>new Date())c.append(el('small','','Alpha ✓'));
 const o=el('button','','Log out');o.onclick=()=>{user=null;try{sessionStorage.removeItem('debuda.session')}catch{}renderAcct();toast('Logged out.')};c.append(o);a.append(c)}
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
  store.set('debuda.lock',{n:0,until:0});user=name;try{sessionStorage.setItem('debuda.session',name)}catch{}
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
  $('#gTitle').textContent=active.name;$('#gCat').textContent=active.cat.toUpperCase()+' · '+active.tag;$('#gDesc').textContent=active.desc;$('#gEmoji').textContent=active.emoji;
  $('#gArt').className='art c-'+active.art;$('#gSave').textContent=saved.has(active.id)?'★ Saved':'☆ Save';return open('gameModal')}
 if(t.closest('[data-close]')||t.classList.contains('back'))return closeAll();
 const n=t.closest('[data-go]');if(n){e.preventDefault();return go(n.dataset.go)}
 const f=t.closest('[data-f]');if(f){filter=f.dataset.f;$$('[data-f]').forEach(b=>b.classList.toggle('on',b===f));renderCatalog()}
 const a=t.closest('[data-auth]');if(a)setMode(a.dataset.auth)});
$('#gSave').onclick=()=>{if(!active)return;saved.has(active.id)?saved.delete(active.id):saved.add(active.id);store.set('debuda.saved',[...saved]);$('#gSave').textContent=saved.has(active.id)?'★ Saved':'☆ Save';renderLib()};
$('#search').addEventListener('input',()=>{if($('#gamesView').classList.contains('hidden'))go('games');renderCatalog()});
$('#enterBtn').onclick=()=>{$('#welcome').classList.add('hidden');$('#app').classList.remove('hidden')};
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
fill('#featured',GAMES.slice(0,3));renderCatalog();renderLib();renderAcct();setDays(7);

let luaText='';
async function loadLua(){if(luaText)return;try{const r=await fetch('debuda.lua',{cache:'no-cache'});if(!r.ok)throw 0;luaText=await r.text()}catch{luaText='-- Could not load debuda.lua'}$('#luaCode').textContent=luaText}
$('#copyLua').onclick=async()=>{await loadLua();try{await navigator.clipboard.writeText(luaText);toast('Script copied!')}catch{toast('Select the text and copy it manually.')}};
