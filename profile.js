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
// ---- Cases: 10 cases made of the 250 shop items + 2 Xmas cases with exclusive items (case-only, index >= BASE) ----
const BASE=50,SEC={t:'Title',f:'Frame',n:'Font',b:'Background',i:'Icon'},ORD=Object.keys(RAR);
const RW={c:40,r:28,e:14,l:8,m:5,x:2.5,t:1.5,s:.7,o:.3}; // drop weights per rarity (shown to the player as odds)
function frObj(ring,ear){const tk=ring.split(' '),ty=tk[0],cs=tk.slice(1);return {bg:ty[0]==='s'?cs[0]:ty[0]==='l'?'linear-gradient(135deg,'+cs+')':'conic-gradient('+cs.concat(cs[0])+')',glow:ty.includes('*')?cs[0]:'',spin:ty.includes('!'),ear:ear?ear.split(' '):null}}
function bgObj(sp){const tk=sp.split(' '),ty=tk[0],cs=tk.slice(1);return {bg:ty==='l'?'linear-gradient(135deg,'+cs+')':'linear-gradient(120deg,'+cs+')',an:ty==='a'}}
function applyBg(n,o){n.style.background=o?o.bg:'';n.style.backgroundSize=o?(o.size!==undefined?o.size:(o.an?'300% 300%':'')):'';n.style.backgroundPosition=o&&o.pos||'';n.classList.remove('bgan','xsnow');const c=o&&(o.cls||(o.an?'bgan':''));if(c)n.classList.add(c)}
function winterSvg(){let b='',w='';[[0,50,110],[44,36,150],[78,56,95],[130,40,135],[168,60,105],[225,44,160],[266,52,100]].forEach(([x,bw,h],n)=>{const y=225-h;
 b+=`<rect x="${x}" y="${y}" width="${bw}" height="${h}" fill="#0f1a3a"/><rect x="${x}" y="${y-3}" width="${bw}" height="4" fill="#f1f5f9"/>`;
 for(let r=0;r<Math.floor(h/16);r++)for(let c=0;c<Math.floor(bw/12);c++)if((r*7+c*3+n*5)%4<2)w+=`<rect x="${x+5+c*12}" y="${y+10+r*16}" width="6" height="8" fill="#fde68a"/>`});
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" preserveAspectRatio="xMidYMax slice"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050816"/><stop offset=".7" stop-color="#312e81"/><stop offset="1" stop-color="#be185d"/></linearGradient></defs><rect width="400" height="240" fill="url(#s)"/><circle cx="330" cy="40" r="32" fill="#fef9c3" opacity=".15"/><circle cx="330" cy="40" r="20" fill="#fef9c3"/>${b}${w}<rect y="218" width="400" height="22" fill="#f8fafc"/><ellipse cx="90" cy="222" rx="120" ry="9" fill="#e2e8f0"/><g transform="translate(322 150)"><circle cy="62" r="22" fill="#fff"/><circle cy="30" r="16" fill="#fff"/><circle cy="6" r="11" fill="#fff"/><rect x="-9" y="-16" width="18" height="12" fill="#111"/><rect x="-14" y="-6" width="28" height="3" fill="#111"/><path d="M0 6l16 3-16 3z" fill="#f97316"/><circle cx="-4" cy="3" r="1.6" fill="#111"/><circle cx="4" cy="3" r="1.6" fill="#111"/><rect x="-11" y="14" width="22" height="5" fill="#dc2626"/><circle cy="28" r="2" fill="#111"/><circle cy="38" r="2" fill="#111"/><path d="M-16 30l-22-10M16 30l22-10" stroke="#78350f" stroke-width="3"/></g></svg>`}
const SNOW='radial-gradient(2px 2px at 15px 20px,#fff 60%,#0000),radial-gradient(1.5px 1.5px at 45px 50px,#fff 60%,#0000)';
const WINTER={bg:SNOW+',url("data:image/svg+xml,'+encodeURIComponent(winterSvg())+'")',size:'70px 70px,100px 100px,cover',pos:'0 0,0 0,center bottom',cls:'xsnow'};
const AURORA={bg:SNOW+',linear-gradient(180deg,#022c22,#0e7490 55%,#312e81)',size:'70px 70px,100px 100px,auto',pos:'0 0,0 0,center bottom',cls:'xsnow'};
function reg(list){return list.map(([k,r,n,a,b])=>{const it=k==='f'?[n,r,0,frObj(a,b)]:k==='b'?[n,r,0,typeof a==='string'?bgObj(a):a]:k==='i'?[n,r,0,a,b]:[n,r,0];PK[k].push(it);return [k,PK[k].length-1]})}
const X1=reg([['t','c',"Santa's Helper"],['f','c','Candy Cane Ring','c! #ef4444 #ffffff'],['i','c','Gift Drop','🎁','bounce'],
 ['t','r','Naughty List'],['i','r','Snowflake Spin','❄️','spin'],['b','r','Snowy Night','l #0b1026 #1e3a8a #e0f2fe'],
 ['f','e','Reindeer Ears','l* #b45309 #78350f','fox #92400e'],['i','e','Dancing Snowman','⛄','wiggle'],
 ['n','l','Mountains of Christmas'],['b','l','Frosted Window','a #0c4a6e #e0f2fe #7dd3fc #0c4a6e'],['b','s','Winter City',WINTER]]);
const X2=reg([['t','c','Last Minute Shopper'],['f','c','Mistletoe Ring','l #86efac #dc2626'],['i','c','Cookie Spin','🍪','spin'],
 ['t','r','Eggnog Enjoyer'],['i','r','Stocking Swing','🧦','shake'],['b','r','Gingerbread Lane','l #7c2d12 #fde68a'],
 ['f','e','Elf Ears','l* #4ade80 #166534','fox #16a34a'],['i','e','Rudolph Glow','🦌','pulse'],
 ['n','l','Emilys Candy'],['b','l','Candy Cane Swirl','a #ef4444 #ffffff #ef4444 #ffffff'],['b','s','Aurora Night',AURORA]]);
const ALL=k=>PK[k].slice(0,BASE).map((_,i)=>[k,i]),ALLP=[].concat(...['t','f','n','b','i'].map(ALL)),byR=(refs,rs)=>refs.filter(([k,i])=>rs.includes(PK[k][i][1]));
const CASES=[
 {id:'starter',name:'Starter Case',price:499,em:'📦',pool:byR(ALLP,'cr')},
 {id:'titles',name:'Titles Case',price:999,em:'🏷️',pool:ALL('t')},
 {id:'fonts',name:'Fonts Case',price:999,em:'🔤',pool:ALL('n')},
 {id:'ears',name:'Ears Case',price:999,em:'🐱',pool:ALL('f').filter(([k,i])=>PK.f[i][3].ear)},
 {id:'frames',name:'Frames Case',price:1499,em:'🖼️',pool:ALL('f')},
 {id:'icons',name:'Animated Icons Case',price:1499,em:'🎭',pool:ALL('i')},
 {id:'bgs',name:'Backgrounds Case',price:1499,em:'🌆',pool:ALL('b')},
 {id:'epic',name:'Epic Case',price:2499,em:'💜',pool:byR(ALLP,'elm')},
 {id:'legend',name:'Legend Case',price:3999,em:'👑',pool:byR(ALLP,'lmxt')},
 {id:'og',name:'OG Case',price:8000,em:'🏆',pool:byR(ALLP,'mxtso')},
 {id:'xmas1',name:'Xmas Case: Winter City',price:1999,em:'🎄',pool:X1,xmas:1},
 {id:'xmas2',name:'Xmas Case: Holiday Magic',price:1999,em:'🎅',pool:X2,xmas:1}];
function odds(c){const m={};for(const [k,i] of c.pool){const r=PK[k][i][1];m[r]=(m[r]||0)+1}const sum=Object.keys(m).reduce((a,r)=>a+RW[r],0);return Object.keys(m).sort((a,b)=>RW[b]-RW[a]).map(r=>({r,n:m[r],pct:RW[r]/sum*100}))}
function rnd(){return crypto.getRandomValues(new Uint32Array(1))[0]/4294967296}
function roll(c){const o=odds(c);let x=rnd()*100,r=o[o.length-1].r;for(const q of o){if(x<q.pct){r=q.r;break}x-=q.pct}const g=c.pool.filter(([k,i])=>PK[k][i][1]===r);return g[Math.floor(rnd()*g.length)]}
function thumbOf(k,i){const it=PK[k][i],p=pf(),th=el('div','ith'),col=RAR[it[1]][1];
 if(k==='t'){const s=el('b','',it[0]);s.style.color=col;th.append(s)}else if(k==='f')th.append(avEl(p,56,i));
 else if(k==='n'){const s=el('b','',user?pname():'Your name');s.style.fontFamily=fam(it[0]);th.append(s)}
 else if(k==='b'){applyBg(th,it[3]);th.classList.add('swatch');th.append(el('b','tsh',user?pname():'Preview'))}else th.append(avEl(p,56,null,i));return th}
function caseCard(c){const d=el('div','item'),th=el('div','ith cemo',c.em),top=odds(c).pop(),b1=el('button','btn ghost sm','Contents & odds'),b2=el('button','btn sm',SALES_OPEN?'Buy':'🔒 Alpha'),r=el('div','row2'),
 tag=el('span','rar',c.xmas?'Limited · Xmas':c.pool.length+' items');tag.style.color=c.xmas?'#fb7185':'#9ca3af';tag.style.borderColor=tag.style.color;if(c.xmas)d.style.borderColor='#fb718566';
 b1.onclick=()=>openCase(c);b2.onclick=()=>toast(SALES_OPEN?'Case checkout is not built yet.':'Debuda is in Alpha — buying is not open yet.');if(!SALES_OPEN)b2.setAttribute('aria-disabled','true');
 r.append(b1,b2);d.append(th,tag,el('h4','',c.name),el('div','muted','Top drop: '+RAR[top.r][0]),el('div','pr',eur(c.price)),r);return d}
let cmCase=null,cmSel=null,cmBusy=false;
function cmRender(){liveCard($('#cmPv'));const a=$('#cmAct');a.replaceChildren();if(!cmSel)return;const [k,i]=cmSel,it=PK[k][i],p=pf(),own=isOwner()||(p.own||[]).includes(k+i),on=(p.eq||{})[k]===i;
 const b=el('button','btn sm',own?(on?'Unequip ':'Equip ')+it[0]:'🔒 '+it[0]+' (not owned)');if(!own)b.setAttribute('aria-disabled','true');b.onclick=()=>own?(buyEquip(k,i),cmRender()):toast('You do not own this item yet.');a.append(b)}
function openCase(c){closeAll();cmCase=c;cmSel=null;pvw=noPv();$('#cmTitle').textContent=c.name;$('#cmKick').textContent=c.xmas?'LIMITED XMAS CASE · '+eur(c.price):'CASE · '+eur(c.price);
 $('#cmReel').classList.remove('win');$('#cmReel').replaceChildren(el('span','muted','Press "Test open" for a free demo roll.'));
 $('#cmOdds').replaceChildren(...odds(c).map(q=>{const d=el('div','orow'),s=el('b','',RAR[q.r][0]);s.style.color=RAR[q.r][1];d.append(s,el('span','muted',q.n+' items'),el('span','',q.pct.toFixed(2)+'%'));return d}));
 $('#cmItems').replaceChildren(...c.pool.slice().sort((a,b)=>ORD.indexOf(PK[b[0]][b[1]][1])-ORD.indexOf(PK[a[0]][a[1]][1])).map(([k,i])=>{const it=PK[k][i],b=el('button','',it[0]);b.title=SEC[k]+' · '+RAR[it[1]][0];b.style.color=RAR[it[1]][1];b.style.borderColor=RAR[it[1]][1]+'88';b.onclick=()=>{pvw[k]=i;cmSel=[k,i];cmRender()};return b}));
 open('caseModal');cmRender()}
function demoOpen(){if(cmBusy||!cmCase)return;cmBusy=true;const c=cmCase,reel=$('#cmReel'),res=roll(c);let n=0;reel.classList.remove('win');
 const tick=()=>{const [k,i]=n<24?c.pool[Math.floor(rnd()*c.pool.length)]:res,it=PK[k][i];reel.replaceChildren(thumbOf(k,i),el('b','',it[0]));reel.style.borderColor=RAR[it[1]][1];
  if(++n<=24)setTimeout(tick,40+n*8);else{reel.append(el('div','muted','You got a '+RAR[it[1]][0]+' '+SEC[k]+'! (demo, not saved)'));reel.classList.add('win');pvw[k]=i;cmSel=[k,i];cmRender();cmBusy=false}};tick()}
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
 applyBg(host,B&&B[3]);
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
 else if(k==='b'){applyBg(th,it[3]);th.classList.add('swatch');th.append(el('b','tsh',user?pname():'Preview'))}
 else th.append(avEl(p,56,null,i));
 const b1=el('button','btn ghost sm',pvw[k]===i?'Previewing':'Preview'),b2=el('button','btn sm',own?(on?'Unequip':'Equip'):(SALES_OPEN?'Buy':'🔒 Alpha'));
 b1.onclick=()=>{pvw[k]=pvw[k]===i?null:i;renderShop()};b2.onclick=()=>buyEquip(k,i);if(!own&&!SALES_OPEN)b2.setAttribute('aria-disabled','true');
 const r=el('div','row2');r.append(b1,b2);d.append(th,rb,el('h4','',it[0]),el('div','pr',eur(it[2])),r);return d}
function liveCard(host){const p=pf(),eq=p.eq||{},o={};for(const k of 'tfnbi')o[k]=pvw[k]!==null?pvw[k]:eq[k];pCard(host,p,o,user?pname():'Your name');
 if(Object.values(pvw).some(v=>v!==null)){const b=el('button','btn ghost sm','Reset preview');b.onclick=()=>{pvw=noPv();cmSel=null;shopKind==='c'&&cmCase&&!$('#caseModal').classList.contains('hidden')?cmRender():renderShop()};host.append(b)}}
function renderShop(){$('#shopHint').textContent=isOwner()?'👑 Owner account: everything is unlocked.':'Owner accounts: log in with GitHub in this browser to unlock everything.';
 liveCard($('#shopPv'));
 $('#shopGrid').replaceChildren(...(shopKind==='c'?CASES.map(caseCard):PK[shopKind].slice(0,BASE).map((_,i)=>shopItem(shopKind,i))))}
function renderProfile(){const p=pf();pCard($('#profCard'),p,p.eq||{},pname());$('#rnIn').value=pname();
 const box=$('#myItems');box.replaceChildren();const own=p.own||[];
 if(isOwner())return box.append(el('p','muted','Owner account: all '+Object.values(PK).reduce((a,b)=>a+b.length,0)+' items are unlocked. Equip them in the Shop.'));
 if(!own.length)return box.append(el('p','muted','You own no items yet. Preview them in the Shop — buying opens after Alpha.'));
 for(const id of own){const k=id[0],i=+id.slice(1),it=PK[k]&&PK[k][i];if(!it)continue;const b=el('button','btn ghost sm',(((p.eq||{})[k]===i)?'✓ ':'')+it[0]);b.onclick=()=>buyEquip(k,i);box.append(b)}}
function setAv(a){const p=pf();p.av=a;pfSave(p);renderProfile();renderAcct()}

function pfInit(){
 $('#resetBtn').onclick=()=>{if(!confirm('Reset ALL saved Debuda data in this browser (account, profile, items, login)?'))return;try{Object.keys(localStorage).filter(k=>k.startsWith('debuda.')&&k!=='debuda.v').forEach(k=>localStorage.removeItem(k));sessionStorage.clear()}catch{}location.href=location.pathname};
 $('#cmOpen').onclick=demoOpen;$('#cmBuy').onclick=()=>toast('Debuda is in Alpha — buying is not open yet.');
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
