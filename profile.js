'use strict';
// ---- Rarities, price bands (cents) and how many items of each rarity per section (50 total) ----
const RAR={c:['Common','#9ca3af'],r:['Rare','#3b82f6'],e:['Epic','#a855f7'],l:['Legendary','#f59e0b'],m:['Mythic','#ef4444'],x:['Exotic','#14b8a6'],t:['Eternal','#38bdf8'],s:['Secret','#e879f9'],o:['OG','#facc15']};
const BAND={c:[499,699],r:[799,1299],e:[1399,1999],l:[2199,2999],m:[3299,3999],x:[4499,5499],t:[5999,6999],s:[7299,7599],o:[8000,8000]};
const CNT=[['c',10],['r',10],['e',8],['l',7],['m',5],['x',4],['t',3],['s',2],['o',1]];
function mk(list,fn){const out=[];let n=0;for(const [r,c] of CNT){const [lo,hi]=BAND[r];for(let j=0;j<c;j++,n++){const t=c>1?j/(c-1):0;out.push(fn(list[n],r,r==='o'?8000:Math.round((lo+(hi-lo)*t+1)/100)*100-1))}}return out}
const L=s=>s.trim().split('\n');

const TITLES=mk(`Rookie,Night Owl,Flower Child,Roblox Fan,Newbie,Lurker,Casual Player,Snack Lover,Sleepy Head,Bystander,Sharpshooter,Detective,Duelist,Street Rat,Not a Spy,Drama Man,Lucky Charm,Sus,Speedrunner,Clutch Kid,Shadow,Alpha Tester,Crown Holder,Plot Twist,Menace,Ninja,Sweat Lord,Big Brain,Ghost,Overlord,Immortal,Final Boss,Phantom,Nightmare,Legend,The One,Mastermind,Warlord,Mythbreaker,Chosen,Cosmic Being,Void Walker,Ultra Rare,Untouchable,Eternal Flame,Forever King,Time Itself,[REDACTED],???,OG`.split(','),(n,r,p)=>[n,r,p]);

// frame spec: Name|type colors|ear shape + color   (type: s solid, l linear, c conic; * glow, ! spin)
const FRAMES=mk(L(`
Plain Ring|s #9ca3af
Mint Ring|l #6ee7b7 #059669
Sky Ring|l #7dd3fc #2563eb
Peach Ring|l #fed7aa #f97316
Lilac Ring|l #e9d5ff #9333ea
Lemon Ring|l #fef08a #eab308
Mouse Ears|s #d1d5db|round #d1d5db
Pig Ears|s #f9a8d4|round #f472b6
Bear Ears|s #92400e|round #b45309
Sunny Ring|l #fde047 #f97316
Cat Ears|l #f9a8d4 #ec4899|cat #f472b6
Dog Ears|l #d6b48a #92400e|dog #92400e
Bunny Ears|l #fbcfe8 #f9a8d4|bunny #fbcfe8
Ocean|l #38bdf8 #1d4ed8
Sunset|l #fb923c #db2777
Rose Gold|l #fecdd3 #be7a6d #fecdd3
Forest|l #4ade80 #14532d
Candy|c #f472b6 #38bdf8
Ice|l #e0f2fe #38bdf8
Ember|l* #f97316 #7f1d1d
Fox Ears|l* #fb923c #ea580c|fox #ea580c
Wolf Ears|l* #9ca3af #374151|fox #6b7280
Panda Ears|l* #ffffff #111111|round #111111
Violet Flame|l* #c084fc #6d28d9
Toxic|c* #84cc16 #14532d
Void|c* #7c3aed #000000
Neon Pink|c*! #f0abfc #ec4899
Storm|c* #64748b #38bdf8
Devil Horns|l* #ef4444 #7f1d1d|horn #dc2626
Angel Halo|l* #fef9c3 #fde047|halo #fde047
Golden Crown|c* #fde68a #b45309|crown #f59e0b
Aurora|c*! #22d3ee #a855f7 #22c55e
Lava|c*! #f97316 #7f1d1d #facc15
Frostbite|c*! #e0f2fe #3b82f6
Emerald|c* #34d399 #064e3b
Black Cat Ears|c* #a855f7 #111111|cat #111827
Cyber Bunny|c*! #22d3ee #ec4899|bunny #22d3ee
Rainbow Glitch|c*! #ff0000 #ffff00 #00ff00 #00ffff #0000ff #ff00ff
Dark Galaxy|c*! #1e1b4b #7c3aed #ec4899
Phoenix|c*! #facc15 #ef4444 #7f1d1d|crown #ef4444
Flower Crown|c*! #f472b6 #86efac #fde047|crown #f472b6
Plasma|c*! #22d3ee #a78bfa #f472b6
Supernova|c*! #ffffff #fde047 #f97316
Mecha|c*! #94a3b8 #22d3ee|horn #22d3ee
Eternal Halo|c*! #ffffff #38bdf8 #6366f1|halo #38bdf8
Chrono|c*! #fde68a #38bdf8
Infinity|c*! #c084fc #38bdf8 #f472b6
Shadow Veil|c*! #000000 #e879f9|horn #e879f9
Glitch ???|c*! #ffffff #000000
OG Gold|c*! #fde047 #f59e0b #ffffff|crown #facc15
`),(s,r,p)=>{const [n,ring,ear]=s.split('|'),tk=ring.split(' '),ty=tk[0],cs=tk.slice(1);
 return [n,r,p,{bg:ty[0]==='s'?cs[0]:ty[0]==='l'?'linear-gradient(135deg,'+cs+')':'conic-gradient('+cs.concat(cs[0])+')',glow:ty.includes('*')?cs[0]:'',spin:ty.includes('!'),ear:ear?ear.split(' '):null}]});

const FONTS=mk(`Nunito,Poppins,Comfortaa,Fredoka,Baloo 2,Quicksand,Rubik,Lobster,Righteous,Chewy,Pacifico,Audiowide,Permanent Marker,Bangers,Special Elite,Caveat,Kaushan Script,Satisfy,Russo One,Black Ops One,Orbitron,Bungee,Monoton,Rubik Glitch,Faster One,Fascinate,Bungee Shade,Gloria Hallelujah,Press Start 2P,Creepster,Nosifer,Eater,Metal Mania,Butcherman,Pirata One,Cinzel,Cinzel Decorative,Michroma,Megrim,Great Vibes,Syncopate,Plaster,Rampart One,Zen Dots,Playfair Display,Cormorant Garamond,Bungee Inline,VT323,Silkscreen,Bungee Outline`.split(','),(n,r,p)=>[n,r,p]);

// background spec: Name|type colors  (l linear, r radial, c conic, a animated)
const BGS=mk(L(`
Midnight|l #0b0a10 #1e1b4b
Charcoal|l #111111 #374151
Ocean Floor|l #0c4a6e #082f49
Forest Night|l #052e16 #14532d
Plum|l #3b0764 #1e1b4b
Rust|l #431407 #7c2d12
Slate|l #0f172a #334155
Berry|l #500724 #831843
Deep Teal|l #042f2e #115e59
Dusk|l #1e1b4b #7c2d12
Sunset Sky|l #1e1b4b #db2777 #fb923c
Northern Lights|l #022c22 #0e7490 #7c3aed
Cherry Blossom|r #fbcfe8 #be185d #1c0a14
Neon City|l #0f0c29 #302b63 #24243e
Candy Floss|l #f472b6 #818cf8
Lagoon|r #22d3ee #0c4a6e #020617
Volcano|l #450a0a #ea580c
Mint Fog|r #6ee7b7 #064e3b #020b08
Royal|l #1e3a8a #6d28d9
Peach Haze|l #fed7aa #fb7185
Galaxy|r #7c3aed #1e1b4b #000000
Inferno|a #7f1d1d #f97316 #450a0a
Deep Space|r #1e293b #020617
Toxic Cloud|a #14532d #84cc16 #052e16
Vapor|a #f472b6 #38bdf8 #a78bfa
Blood Moon|r #dc2626 #450a0a #000000
Ice Cave|a #0c4a6e #7dd3fc #082f49
Amethyst|c #4c1d95 #a855f7
Gold Rush|a #78350f #fbbf24 #78350f
Aurora Flow|a #22d3ee #a855f7 #22c55e
Cosmic Dust|a #0f172a #7c3aed #ec4899
Magma|a #450a0a #f97316 #facc15
Deep Ocean|a #082f49 #0ea5e9 #082f49
Enchanted|a #14532d #a3e635 #166534
Twilight|a #1e1b4b #f472b6 #fb923c
Rainbow Wave|a #ef4444 #facc15 #22c55e #3b82f6 #a855f7
Supercell|a #020617 #6366f1 #22d3ee
Dragon Fire|a #7f1d1d #f97316 #fef08a #7f1d1d
Glitch|a #000000 #22d3ee #f43f5e #000000
Nebula|a #581c87 #db2777 #1d4ed8
Quasar|a #000000 #ffffff #7c3aed #000000
Plasma Storm|a #1e1b4b #22d3ee #f472b6 #1e1b4b
Solar Flare|a #7c2d12 #fde047 #fb923c #7c2d12
Hologram|a #67e8f9 #f0abfc #fde68a #67e8f9
Eternal Night|a #000000 #1e3a8a #000000
Time Warp|a #4c1d95 #38bdf8 #fde68a #4c1d95
Forever Aurora|a #34d399 #818cf8 #f0abfc #34d399
The Void|a #000000 #3b0764 #000000 #581c87 #000000
Static ???|a #ffffff #000000 #ffffff #000000
OG Gold|a #422006 #facc15 #fff7ad #422006 #facc15
`),(s,r,p)=>{const [n,sp]=s.split('|'),tk=sp.split(' '),ty=tk[0],cs=tk.slice(1);
 return [n,r,p,{bg:ty==='l'?'linear-gradient(135deg,'+cs+')':ty==='r'?'radial-gradient(circle at 30% 20%,'+cs+')':ty==='c'?'conic-gradient(from 200deg at 70% 30%,'+cs.concat(cs[0])+')':'linear-gradient(120deg,'+cs+')',an:ty==='a'}]});

// animated icon spec: emoji|Name|animation
const ICONS=mk(L(`
🐱|Dancing Cat|wiggle
🐶|Happy Dog|bounce
🐰|Hop Bunny|bounce
🐸|Frog Pop|float
🐥|Spin Chick|spin
🍕|Pizza Spin|spin
🍩|Donut Roll|spin
🌸|Blossom|float
⭐|Twinkle|pulse
💧|Drip Drop|bounce
🦊|Fox Flip|flip
🐼|Panda Wobble|wiggle
👻|Ghost Float|float
🎮|Gamer Shake|shake
🎯|Bullseye|pulse
💎|Gem Shine|pulse
🔔|Ringing|shake
🧿|Evil Eye|blink
🍀|Lucky Spin|spin
🎈|Balloon|float
🔥|Flame Dance|wiggle
👾|Invader|bounce
🤖|Robot Glitch|glitch
💀|Skull Shake|shake
⚡|Lightning|pulse
🌙|Moon Drift|float
🐉|Dragon Sway|wiggle
🦄|Unicorn Flip|flip
👑|Spinning Crown|spin
🌪️|Tornado|spin
☄️|Comet|float
🌈|Rainbow Pulse|pulse
🧠|Big Brain|pulse
🦅|Eagle Glide|float
🐺|Wolf Howl|bounce
🌌|Galaxy Spin|spin
🔱|Trident|shake
🪐|Saturn|spin
🦋|Butterfly|flip
🧬|DNA Twist|spin
🕳️|Black Hole|spin
☢️|Nuclear Pulse|pulse
🪬|Hamsa Glow|blink
🌀|Vortex|spin
♾️|Infinity|spin
⏳|Time Flip|flip
🌠|Shooting Star|float
🥷|Ghost Ninja|glitch
❓|Mystery Box|flip
🏆|OG Trophy|bounce
`),(s,r,p)=>{const [e,n,a]=s.split('|');return [n,r,p,e,a]});

const PK={t:TITLES,f:FRAMES,n:FONTS,b:BGS,i:ICONS},EMOJI=['🌸','🔥','👑','💀','🦊','🐺','🐉','🎯','👾','🌙','⚡','🎭'];
// Owner accounts: verified GitHub logins that get every shop item unlocked.
const OWNERS=['x822-jpg','tugalevltv-debug'];
function setOwner(v){try{v?sessionStorage.setItem('debuda.owner','1'):sessionStorage.removeItem('debuda.owner')}catch{}}
function isOwner(){try{return !!user&&sessionStorage.getItem('debuda.owner')==='1'}catch{return false}}
let pvw={t:null,f:null,n:null,b:null,i:null},shopKind='t';
const noPv=()=>({t:null,f:null,n:null,b:null,i:null});

function pf(){return (store.get('debuda.profiles',{})[user])||{}}
function pfSave(p){const a=store.get('debuda.profiles',{});a[user]=p;store.set('debuda.profiles',a)}
function pname(){return pf().name||user}
function okUrl(v){return typeof v==='string'&&(/^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(v)||/^https:\/\/(cdn\.discordapp\.com|avatars\.githubusercontent\.com)\/[^\s"'()\\]+$/.test(v))}
function adoptAv(url){if(!user||!okUrl(url))return;const p=pf();p.pav=url;if(!p.av)p.av={t:'url',v:url};pfSave(p)}
const fam=n=>'"'+n+'",Manrope,sans-serif';

// ear shapes: [width, height, clip-path, radius, left offset, top offset, rotation of left ear] (fractions of avatar size)
const TRI='polygon(50% 0,100% 100%,0 100%)';
const EARS={cat:[.34,.34,TRI,'',.02,-.2,-12],fox:[.3,.5,TRI,'',.05,-.38,-14],dog:[.3,.5,'','40% 40% 60% 60%',-.14,.06,18],bunny:[.2,.62,'','50%',.16,-.58,-10],round:[.3,.3,'','50%',0,-.12,0],horn:[.2,.38,TRI,'',.12,-.3,-22]};
function ears(w,s,sh,c){const px=v=>Math.round(v*s)+'px';
 if(sh==='halo'||sh==='crown'){const d=el('div','ear'),h=sh==='halo';d.style.width=px(h?.7:.6);d.style.height=px(h?.2:.28);d.style.left=px(h?.15:.2);d.style.top=px(h?-.22:-.24);
  if(h){d.style.border=Math.max(2,Math.round(s/24))+'px solid '+c;d.style.borderRadius='50%';d.style.boxShadow='0 0 10px '+c}
  else{d.style.background=c;d.style.clipPath='polygon(0 100%,0 30%,25% 60%,50% 0,75% 60%,100% 30%,100% 100%)'}
  w.append(d);return Math.round(s*(h?.22:.24))}
 const E=EARS[sh];if(!E)return 0;
 for(const side of [-1,1]){const d=el('div','ear');d.style.width=px(E[0]);d.style.height=px(E[1]);d.style.background=c;if(E[2])d.style.clipPath=E[2];if(E[3])d.style.borderRadius=E[3];
  d.style.left=side<0?px(E[4]):px(1-E[4]-E[0]);d.style.top=px(E[5]);d.style.transform='rotate('+(side<0?E[6]:-E[6])+'deg)';w.append(d)}
 return Math.max(0,Math.round(-E[5]*s))}
function avEl(p,size,fr,ic){const w=el('div','av'),f=FRAMES[fr],I=ICONS[ic],ring=el('div','ring'),face=el('div','face'),a=p.av||{};
 w.style.width=w.style.height=size+'px';
 if(f&&f[3].ear&&size>=40)w.style.marginTop=ears(w,size,f[3].ear[0],f[3].ear[1])+'px';
 ring.style.background=f?f[3].bg:'#1e1a2b';if(f&&f[3].glow)ring.style.boxShadow='0 0 '+Math.round(size/4)+'px '+f[3].glow;if(f&&f[3].spin)ring.classList.add('spin');
 if(I){face.textContent=I[3];face.style.fontSize=size*.5+'px';face.classList.add('ia-'+I[4]);if(I[1]!=='c')face.style.filter='drop-shadow(0 0 6px '+RAR[I[1]][1]+')'}
 else if((a.t==='img'||a.t==='url')&&okUrl(a.v))face.style.backgroundImage='url("'+a.v+'")';
 else{face.textContent=a.t==='e'?a.v:'🌸';face.style.fontSize=size*.45+'px'}
 w.append(ring,face);return w}
function miniAv(){const q=pf().eq||{};return avEl(pf(),26,q.f,q.i)}
function pCard(host,p,eq,name){host.replaceChildren();const l=el('div','pl'),r=el('div'),n=el('div','pn',name),B=BGS[eq.b];
 host.style.background=B?B[3].bg:'';host.style.backgroundSize=B&&B[3].an?'300% 300%':'';host.classList.toggle('bgan',!!(B&&B[3].an));
 if(FONTS[eq.n])n.style.fontFamily=fam(FONTS[eq.n][0]);r.append(n);
 const T=TITLES[eq.t];if(T){const t=el('div','pt',T[0]);t.style.color=RAR[T[1]][1];r.append(t)}
 l.append(avEl(p,96,eq.f,eq.i),r);host.append(l)}

function buyEquip(k,i){if(!user)return openAuth('login');const p=pf();p.own=p.own||[];p.eq=p.eq||{};
 if(isOwner()||p.own.includes(k+i)){p.eq[k]=p.eq[k]===i?null:i;pfSave(p);renderShop();renderAcct();return}
 if(!SALES_OPEN)return toast('Debuda is in Alpha — buying is not open yet.');
 p.own.push(k+i);pfSave(p);renderShop()}
function shopItem(k,i){const it=PK[k][i],p=pf(),own=isOwner()||(p.own||[]).includes(k+i),on=(p.eq||{})[k]===i,col=RAR[it[1]][1];
 const d=el('div','item'),th=el('div','ith'),rb=el('span','rar',RAR[it[1]][0]);d.style.borderColor=col+'66';rb.style.color=col;rb.style.borderColor=col;
 if(k==='t'){const s=el('b','',it[0]);s.style.color=col;th.append(s)}
 else if(k==='f')th.append(avEl(p,56,i));
 else if(k==='n'){const s=el('b','',user?pname():'Your name');s.style.fontFamily=fam(it[0]);th.append(s)}
 else if(k==='b'){th.style.background=it[3].bg;th.style.backgroundSize=it[3].an?'300% 300%':'';th.classList.toggle('bgan',!!it[3].an);th.classList.add('swatch');th.append(el('b','tsh',user?pname():'Preview'))}
 else th.append(avEl(p,56,null,i));
 const b1=el('button','btn ghost sm',pvw[k]===i?'Previewing':'Preview'),b2=el('button','btn sm',own?(on?'Unequip':'Equip'):(SALES_OPEN?'Buy':'🔒 Alpha'));
 b1.onclick=()=>{pvw[k]=pvw[k]===i?null:i;renderShop()};b2.onclick=()=>buyEquip(k,i);if(!own&&!SALES_OPEN)b2.setAttribute('aria-disabled','true');
 const r=el('div','row2');r.append(b1,b2);d.append(th,rb,el('h4','',it[0]),el('div','pr',eur(it[2])),r);return d}
function renderShop(){$('#shopHint').textContent=isOwner()?'👑 Owner account: everything is unlocked.':'Owner accounts: log in with GitHub in this browser to unlock everything.';
 const p=pf(),eq=p.eq||{},o={};for(const k of 'tfnbi')o[k]=pvw[k]!==null?pvw[k]:eq[k];
 pCard($('#shopPv'),p,o,user?pname():'Your name');
 if(Object.values(pvw).some(v=>v!==null)){const b=el('button','btn ghost sm','Reset preview');b.onclick=()=>{pvw=noPv();renderShop()};$('#shopPv').append(b)}
 $('#shopGrid').replaceChildren(...PK[shopKind].map((_,i)=>shopItem(shopKind,i)))}
function renderProfile(){const p=pf();pCard($('#profCard'),p,p.eq||{},pname());$('#rnIn').value=pname();
 const box=$('#myItems');box.replaceChildren();const own=p.own||[];
 if(isOwner())return box.append(el('p','muted','Owner account: all '+Object.values(PK).reduce((a,b)=>a+b.length,0)+' items are unlocked. Equip them in the Shop.'));
 if(!own.length)return box.append(el('p','muted','You own no items yet. Preview them in the Shop — buying opens after Alpha.'));
 for(const id of own){const k=id[0],i=+id.slice(1),it=PK[k]&&PK[k][i];if(!it)continue;const b=el('button','btn ghost sm',(((p.eq||{})[k]===i)?'✓ ':'')+it[0]);b.onclick=()=>buyEquip(k,i);box.append(b)}}
function setAv(a){const p=pf();p.av=a;pfSave(p);renderProfile();renderAcct()}

function pfInit(){
 $('#resetBtn').onclick=()=>{if(!confirm('Reset ALL saved Debuda data in this browser (account, profile, items, login)?'))return;try{Object.keys(localStorage).filter(k=>k.startsWith('debuda.')&&k!=='debuda.v').forEach(k=>localStorage.removeItem(k));sessionStorage.clear()}catch{}location.href=location.pathname};
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
