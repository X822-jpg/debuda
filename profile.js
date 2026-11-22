'use strict';
// Rarities, then items as [name, rarity, price in cents, ...extras]
const RAR={c:['Common','#9ca3af'],r:['Rare','#3b82f6'],e:['Epic','#a855f7'],l:['Legendary','#f59e0b'],m:['Mythic','#ef4444']};
const TITLES=[['Rookie','c',499],['Night Owl','c',499],['Flower Child','c',599],['Roblox Fan','c',699],
['Sharpshooter','r',899],['Detective','r',999],['Duelist','r',1099],['Street Rat','r',1299],
['Shadow','e',1499],['Alpha Tester','e',1699],['Crown Holder','e',1999],
['Ghost','l',2299],['Overlord','l',2599],['Immortal','l',2799],['The One','m',3000]];
const FRAMES=[['Plain Ring','c',499,'#9ca3af'],['Mint Ring','c',599,'linear-gradient(135deg,#6ee7b7,#059669)'],
['Ocean','r',899,'linear-gradient(135deg,#38bdf8,#1d4ed8)'],['Sunset','r',1099,'linear-gradient(135deg,#fb923c,#db2777)'],['Rose Gold','r',1299,'linear-gradient(135deg,#fecdd3,#be7a6d,#fecdd3)'],
['Violet Flame','e',1499,'linear-gradient(135deg,#c084fc,#6d28d9)','#a855f7'],['Toxic','e',1799,'conic-gradient(#84cc16,#14532d,#84cc16)','#84cc16'],['Void','e',1999,'conic-gradient(#000,#7c3aed,#000,#7c3aed,#000)','#7c3aed'],
['Gold Crown','l',2399,'conic-gradient(#fde68a,#b45309,#fde68a,#b45309,#fde68a)','#f59e0b'],['Aurora','l',2699,'conic-gradient(#22d3ee,#a855f7,#22c55e,#22d3ee)','#22d3ee',1],
['Rainbow Glitch','m',2999,'conic-gradient(red,orange,yellow,lime,cyan,blue,magenta,red)','#ffffff',1],['Dark Galaxy','m',3000,'conic-gradient(#1e1b4b,#7c3aed,#ec4899,#1e1b4b)','#ec4899',1]];
const FONTS=[['Righteous','c',499],['Special Elite','c',599],['Pacifico','r',899],['Audiowide','r',999],['Permanent Marker','r',1199],
['Orbitron','e',1499],['Bungee','e',1799],['Press Start 2P','l',2299],['Creepster','l',2699],['Cinzel','m',2999]];
const PK={t:TITLES,f:FRAMES,n:FONTS},EMOJI=['🌸','🔥','👑','💀','🦊','🐺','🐉','🎯','👾','🌙','⚡','🎭'];
// Owner accounts: verified GitHub logins that get every shop item unlocked.
const OWNERS=['x822-jpg','tugalevltv-debug'];
function setOwner(v){try{v?sessionStorage.setItem('debuda.owner','1'):sessionStorage.removeItem('debuda.owner')}catch{}}
function isOwner(){try{return !!user&&sessionStorage.getItem('debuda.owner')==='1'}catch{return false}}
let pvw={t:null,f:null,n:null},shopKind='t';

function pf(){return (store.get('debuda.profiles',{})[user])||{}}
function pfSave(p){const a=store.get('debuda.profiles',{});a[user]=p;store.set('debuda.profiles',a)}
function pname(){return pf().name||user}
function okUrl(v){return typeof v==='string'&&(/^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(v)||/^https:\/\/(cdn\.discordapp\.com|avatars\.githubusercontent\.com)\/[^\s"'()\\]+$/.test(v))}
function adoptAv(url){if(!user||!okUrl(url))return;const p=pf();p.pav=url;if(!p.av)p.av={t:'url',v:url};pfSave(p)}
const fam=n=>'"'+n+'",Manrope,sans-serif';

function avEl(p,size,fr){const w=el('div','av'),f=FRAMES[fr],ring=el('div','ring'),face=el('div','face'),a=p.av||{};
 w.style.width=w.style.height=size+'px';
 ring.style.background=f?f[3]:'#1e1a2b';if(f&&f[4])ring.style.boxShadow='0 0 '+Math.round(size/4)+'px '+f[4];if(f&&f[5])ring.classList.add('spin');
 if((a.t==='img'||a.t==='url')&&okUrl(a.v))face.style.backgroundImage='url("'+a.v+'")';else{face.textContent=a.t==='e'?a.v:'🌸';face.style.fontSize=size*.45+'px'}
 w.append(ring,face);return w}
function miniAv(){return avEl(pf(),26,(pf().eq||{}).f)}
function pCard(host,p,eq,name){host.replaceChildren();const l=el('div','pl'),r=el('div'),n=el('div','pn',name);
 if(FONTS[eq.n])n.style.fontFamily=fam(FONTS[eq.n][0]);r.append(n);
 const T=TITLES[eq.t];if(T){const t=el('div','pt',T[0]);t.style.color=RAR[T[1]][1];r.append(t)}
 l.append(avEl(p,96,eq.f),r);host.append(l)}

function buyEquip(k,i){if(!user)return openAuth('login');const p=pf();p.own=p.own||[];p.eq=p.eq||{};
 if(isOwner()||p.own.includes(k+i)){p.eq[k]=p.eq[k]===i?null:i;pfSave(p);renderShop();renderAcct();return}
 if(!SALES_OPEN)return toast('Debuda is in Alpha — buying is not open yet.');
 p.own.push(k+i);pfSave(p);renderShop()}
function shopItem(k,i){const it=PK[k][i],p=pf(),own=isOwner()||(p.own||[]).includes(k+i),on=(p.eq||{})[k]===i,col=RAR[it[1]][1];
 const d=el('div','item'),th=el('div','ith'),rb=el('span','rar',RAR[it[1]][0]);d.style.borderColor=col+'66';rb.style.color=col;rb.style.borderColor=col;
 if(k==='t'){const s=el('b','',it[0]);s.style.color=col;th.append(s)}
 else if(k==='f')th.append(avEl(p,64,i));
 else{const s=el('b','',user?pname():'Your name');s.style.fontFamily=fam(it[0]);th.append(s)}
 const b1=el('button','btn ghost sm',pvw[k]===i?'Previewing':'Preview'),b2=el('button','btn sm',own?(on?'Unequip':'Equip'):(SALES_OPEN?'Buy':'🔒 Alpha'));
 b1.onclick=()=>{pvw[k]=pvw[k]===i?null:i;renderShop()};b2.onclick=()=>buyEquip(k,i);if(!own&&!SALES_OPEN)b2.setAttribute('aria-disabled','true');
 const r=el('div','row2');r.append(b1,b2);d.append(th,rb,el('h4','',it[0]),el('div','pr',eur(it[2])),r);return d}
function renderShop(){const p=pf(),eq=p.eq||{},o={};for(const k of ['t','f','n'])o[k]=pvw[k]!==null?pvw[k]:eq[k];
 pCard($('#shopPv'),p,o,user?pname():'Your name');
 if(pvw.t!==null||pvw.f!==null||pvw.n!==null){const b=el('button','btn ghost sm','Reset preview');b.onclick=()=>{pvw={t:null,f:null,n:null};renderShop()};$('#shopPv').append(b)}
 $('#shopGrid').replaceChildren(...PK[shopKind].map((_,i)=>shopItem(shopKind,i)))}
function renderProfile(){const p=pf();pCard($('#profCard'),p,p.eq||{},pname());$('#rnIn').value=pname();
 const box=$('#myItems');box.replaceChildren();const own=p.own||[];
 if(isOwner())return box.append(el('p','muted','Owner account: all 37 items are unlocked. Equip them in the Shop.'));
 if(!own.length)return box.append(el('p','muted','You own no items yet. Preview them in the Shop — buying opens after Alpha.'));
 for(const id of own){const k=id[0],i=+id.slice(1),it=PK[k]&&PK[k][i];if(!it)continue;const b=el('button','btn ghost sm',(((p.eq||{})[k]===i)?'✓ ':'')+it[0]);b.onclick=()=>buyEquip(k,i);box.append(b)}}
function setAv(a){const p=pf();p.av=a;pfSave(p);renderProfile();renderAcct()}

function pfInit(){
 $('#shopTabs').addEventListener('click',e=>{const b=e.target.closest('[data-sk]');if(!b)return;shopKind=b.dataset.sk;$$('[data-sk]').forEach(x=>x.classList.toggle('on',x===b));renderShop()});
 $('#rnBtn').onclick=()=>{const v=$('#rnIn').value.trim();if(!user)return;
  if(!/^[\p{L}\p{N} _.\-]{3,20}$/u.test(v))return toast('Name: 3–20 letters, numbers, space, _ . -');
  const p=pf();p.name=v;pfSave(p);renderProfile();renderAcct();toast('Renamed to '+v)};
 $('#emojis').replaceChildren(...EMOJI.map(x=>{const b=el('button','emo',x);b.onclick=()=>user&&setAv({t:'e',v:x});return b}));
 $('#avProv').onclick=()=>{const p=pf();if(p.pav)setAv({t:'url',v:p.pav});else toast('Log in with Discord or GitHub to use that avatar.')};
 $('#avFile').addEventListener('change',e=>{const f=e.target.files[0];e.target.value='';if(!f||!user)return;
  if(!/^image\/(png|jpeg|webp)$/.test(f.type)||f.size>5e6)return toast('Use a PNG, JPG or WebP image under 5 MB.');
  const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=c.height=128;const s=Math.min(im.width,im.height);
   c.getContext('2d').drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,128,128);setAv({t:'img',v:c.toDataURL('image/jpeg',.85)})};im.onerror=()=>toast('Could not read that image.');im.src=r.result};r.readAsDataURL(f)})}
document.addEventListener('DOMContentLoaded',pfInit);
