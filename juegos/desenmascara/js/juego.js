(()=>{
const THEMES={
  PP:{key:'PP',primary:'#1b4b8f',accent:'#1aa0dc',dark:'#0f2d57',bg:'#f2f5f9',
    headline:'Más libertad, menos impuestos',sub:'Un proyecto para que España funcione',
    nav:['Inicio','Propuestas','Noticias','Afíliate'],cta:['Afíliate','Dona'],
    cards:[['Economía','Bajar impuestos'],['Vivienda','Más propietarios'],['Empleo','Crear riqueza']]},
  VOX:{key:'VOX',primary:'#4f9a1f',accent:'#79c143',dark:'#2c5512',bg:'#f4f6f0',
    headline:'Defendemos lo nuestro',sub:'Valentía para cambiar España',
    nav:['Inicio','Programa','Actualidad','Únete'],cta:['Únete','Dona'],
    cards:[['Seguridad','Mano dura'],['Familia','Lo de siempre'],['Campo','Orgullo rural']]}
};
const MSG_LINE='TAX THE RICH · VOTO ÚTIL 29N · VOTA FRENTE AMPLIO · ';
const $=id=>document.getElementById(id);
const site=$('site'),cracks=$('cracks'),fx=$('fx'),hit=$('hit'),stage=$('stage');
const COARSE=matchMedia('(pointer:coarse)').matches;
let sctx,cctx,fctx,W,H,dpr,B,cols,rows,total;
let broken,prog,stg,brokenCount=0,party=null,theme,active=false,done=false,revealing=false,revealTimer=null,muted=false;
const ptr={down:false,x:-1,y:-1,inside:false};
let particles=[];

(function(){let s='';for(let i=0;i<40;i++)s+='<div>'+(i%2?'':'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')+MSG_LINE.repeat(6)+'</div>';$('bgtext').innerHTML=s;})();

/* ---------- utilidades ---------- */
function rng(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return((s>>>0)%100000)/100000;}}
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
function fit(c,text,maxW,size,weight,fam){fam=fam||'system-ui,sans-serif';let s=size;c.font=`${weight} ${s}px ${fam}`;
  while(c.measureText(text).width>maxW&&s>8){s-=1;c.font=`${weight} ${s}px ${fam}`;}return s;}
function setup(cv,read){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);cv.style.width=W+'px';cv.style.height=H+'px';
  const x=cv.getContext('2d',read?{willReadFrequently:true}:undefined);x.setTransform(dpr,0,0,dpr,0,0);return x;}
function vib(ms){try{navigator.vibrate&&navigator.vibrate(ms);}catch(e){}}

/* ---------- la fachada (web parodia) ---------- */
function drawSite(){
  const t=theme,c=sctx;c.clearRect(0,0,W,H);
  c.fillStyle=t.bg;c.fillRect(0,0,W,H);
  const s=Math.max(.62,Math.min(W/1200,H/800,1.4));
  const pad=Math.round(24*s),hh=Math.round(68*s)+(COARSE?40:52);
  const hy=COARSE?40:52;
  c.fillStyle=t.primary;c.fillRect(0,0,W,hh);
  const bh0=hh-hy;
  c.fillStyle='#fff';rr(c,pad,hy+bh0*.18,bh0*1.4,bh0*.64,8*s);c.fill();
  c.fillStyle=t.primary;c.font=`900 ${bh0*.42}px system-ui,sans-serif`;c.textBaseline='middle';c.textAlign='center';
  c.fillText(t.key,pad+bh0*.7,hy+bh0/2+1);
  if(W>640){c.textAlign='right';c.fillStyle='#fff';c.font=`600 ${Math.max(13,15*s)}px system-ui,sans-serif`;
    let x=W-pad;for(const n of [...t.nav].reverse()){c.fillText(n,x,hy+bh0/2);x-=c.measureText(n).width+28*s;}}
  else{c.fillStyle='#fff';for(let i=0;i<3;i++)c.fillRect(W-pad-26,hy+bh0/2-9+i*8,26,3);}
  const heroH=Math.round(H*.42);
  const g=c.createLinearGradient(0,hh,W,hh+heroH);g.addColorStop(0,t.dark);g.addColorStop(1,t.accent);
  c.fillStyle=g;c.fillRect(0,hh,W,heroH);
  c.globalAlpha=.09;c.fillStyle='#fff';
  c.beginPath();c.arc(W*.86,hh+heroH*.3,heroH*.62,0,7);c.fill();
  c.beginPath();c.arc(W*.08,hh+heroH,heroH*.42,0,7);c.fill();c.globalAlpha=1;
  const hx=Math.max(pad*1.5,W*.08);
  c.textAlign='left';c.fillStyle='#fff';
  const fs=fit(c,t.headline,W-hx*2,Math.min(66*s,W/9),800);
  c.fillText(t.headline,hx,hh+heroH*.36);
  c.globalAlpha=.85;c.font=`400 ${Math.max(14,22*s)}px system-ui,sans-serif`;c.fillText(t.sub,hx,hh+heroH*.36+fs*.95);c.globalAlpha=1;
  const by=hh+heroH*.68,bw=Math.max(110,150*s),bh=Math.max(36,46*s);
  c.fillStyle='#fff';rr(c,hx,by,bw,bh,bh/2);c.fill();
  c.fillStyle=t.primary;c.font=`700 ${Math.max(13,16*s)}px system-ui,sans-serif`;c.textAlign='center';c.fillText(t.cta[0],hx+bw/2,by+bh/2);
  c.strokeStyle='#fff';c.lineWidth=2;rr(c,hx+bw+14*s,by,bw,bh,bh/2);c.stroke();
  c.fillStyle='#fff';c.fillText(t.cta[1],hx+bw*1.5+14*s,by+bh/2);
  const fh=Math.round(54*s),top=hh+heroH+26*s,avail=H-fh-top-22*s;
  const nc=W<700?1:3,gap=20*s,cw=(W-pad*2-gap*(nc-1))/nc;
  const rowsAv=nc===1?Math.max(1,Math.floor(avail/(110*s+gap))):1;
  const ch=nc===1?Math.min(avail/rowsAv-gap,150*s):Math.min(avail,240*s);
  const shown=nc===1?Math.min(3,rowsAv):3;
  if(ch>60)for(let i=0;i<shown;i++){
    const cx=pad+(nc===1?0:i*(cw+gap)),cy=top+(nc===1?i*(ch+gap):0);
    c.save();c.shadowColor='rgba(0,0,0,.12)';c.shadowBlur=18*s;c.shadowOffsetY=6*s;c.fillStyle='#fff';rr(c,cx,cy,cw,ch,14*s);c.fill();c.restore();
    c.fillStyle=t.accent;c.globalAlpha=.18;c.beginPath();c.arc(cx+34*s,cy+36*s,20*s,0,7);c.fill();c.globalAlpha=1;
    c.fillStyle=t.primary;c.beginPath();c.arc(cx+34*s,cy+36*s,8*s,0,7);c.fill();
    c.textAlign='left';c.fillStyle='#1b1b1b';c.font=`800 ${Math.max(15,20*s)}px system-ui,sans-serif`;c.fillText(t.cards[i][0],cx+64*s,cy+30*s);
    c.fillStyle=t.primary;c.font=`600 ${Math.max(12,14*s)}px system-ui,sans-serif`;c.fillText(t.cards[i][1],cx+64*s,cy+52*s);
    c.fillStyle='#e3e6ea';
    for(let k=0;k<4;k++){const ly=cy+80*s+k*18*s;if(ly>cy+ch-16*s)break;rr(c,cx+22*s,ly,(cw-44*s)*(k===3?.55:1-k*.08),8*s,4*s);c.fill();}
  }
  c.fillStyle=t.dark;c.fillRect(0,H-fh,W,fh);
  c.fillStyle='rgba(255,255,255,.75)';c.textAlign='center';
  const ft='Web de parodia · no oficial · usa la maza para leer la letra pequeña';
  fit(c,ft,W-pad*2,Math.max(12,14*s),500);c.fillText(ft,W/2,H-fh/2);
}

/* ---------- grietas ---------- */
function drawCrack(i,st){
  const x=(i%cols)*B,y=Math.floor(i/cols)*B;
  cctx.clearRect(x,y,B,B);if(st<=0)return;
  cctx.save();cctx.beginPath();cctx.rect(x,y,B,B);cctx.clip();
  cctx.fillStyle=`rgba(0,0,0,${.07*st})`;cctx.fillRect(x,y,B,B);
  const r=rng(i*9301+49297),p=Math.max(2,Math.round(B/12));
  cctx.fillStyle='rgba(15,15,15,.8)';
  for(let k=0;k<8;k++){
    let px=x+B/2+(r()-.5)*B*.3,py=y+B/2+(r()-.5)*B*.3;
    const ang=r()*Math.PI*2,len=(B*.62)*(.45+.55*r()),steps=Math.floor(len/p);
    for(let s=0;s<steps;s++){px+=Math.cos(ang)*p+(r()-.5)*p*1.2;py+=Math.sin(ang)*p+(r()-.5)*p*1.2;
      if(k<st*2&&s<steps*st/4)cctx.fillRect(x+Math.round((px-x)/p)*p,y+Math.round((py-y)/p)*p,p,p);}
  }
  cctx.restore();
}

/* ---------- ladrillos que salen disparados ---------- */
function sample(x,y){
  try{const d=sctx.getImageData(Math.min(site.width-1,Math.max(0,Math.round(x*dpr))),Math.min(site.height-1,Math.max(0,Math.round(y*dpr))),1,1).data;
    if(d[3]>0)return`rgb(${d[0]},${d[1]},${d[2]})`;}catch(e){}
  return theme.primary;
}
function spitBricks(i,ox,oy,power){
  const x=(i%cols)*B,y=Math.floor(i/cols)*B;
  const n=particles.length>380?1:particles.length>220?2:3;
  for(let k=0;k<n;k++){
    const px=x+B*(.2+Math.random()*.6),py=y+B*(.2+Math.random()*.6);
    let ang=Math.atan2(py-oy,px-ox);if(!isFinite(ang))ang=Math.random()*6.28;ang+=(Math.random()-.5)*.7;
    const sp=(Math.max(W,H)*(1.1+Math.random()*1.3))*(.6+.4*power);
    const w=B*(.3+Math.random()*.25);
    particles.push({k:'brick',x:px,y:py,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp-120,g:700,rot:Math.random()*6,vr:(Math.random()-.5)*18,
      w,h:w*.55,c:sample(px,py),life:2.5,s:1});
  }
}
function breakBlock(i,ox,oy,power){
  if(broken[i])return;broken[i]=1;brokenCount++;
  spitBricks(i,ox,oy,power);
  const x=(i%cols)*B,y=Math.floor(i/cols)*B;
  sctx.clearRect(x-.5,y-.5,B+1,B+1);cctx.clearRect(x-.5,y-.5,B+1,B+1);
}
function damage(i,amount,ox,oy,power){
  if(broken[i])return;
  prog[i]+=amount;
  if(prog[i]>=1){breakBlock(i,ox,oy,power);return;}
  const st=Math.min(4,Math.floor(prog[i]*5));if(st!==stg[i]){stg[i]=st;drawCrack(i,st);}
}

/* ---------- la maza ---------- */
const CHARGE=.6,COOL=.22;
let charge=0,cool=0,swing=0,jolt=0,shX=0,shY=0,lastHitX=0,lastHitY=0;
function unit(){return Math.max(22,Math.min(46,B*.55));}
function strikeRadius(p){return B*(.75+.65*p);}
function strike(x,y,p){
  const R=strikeRadius(p),R2=R+B*.95;
  const c0=Math.max(0,Math.floor((x-R2)/B)),c1=Math.min(cols-1,Math.floor((x+R2)/B));
  const r0=Math.max(0,Math.floor((y-R2)/B)),r1=Math.min(rows-1,Math.floor((y+R2)/B));
  for(let cy=r0;cy<=r1;cy++)for(let cx=c0;cx<=c1;cx++){
    const i=cy*cols+cx,d=Math.hypot(cx*B+B/2-x,cy*B+B/2-y);
    if(d<R)damage(i,1,x,y,p);else if(d<R2)damage(i,.5*p,x,y,p);
  }
  particles.push({k:'ring',x,y,r:unit()*.6,vr:R2*5,life:.28,s:1});
  for(let k=0;k<14;k++){const a=Math.random()*6.28,sp=150+Math.random()*350;
    particles.push({k:'dust',x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,g:-40,life:.5+Math.random()*.4,s:unit()*(.25+Math.random()*.35),c:'rgba(235,225,210,'});}
  jolt=Math.max(jolt,(COARSE?14:22)*p);swing=.16;
  sfx('smash',p);vib(Math.round(30+50*p));
  updateHUD();
}
function drawMaza(c,x,y,sc,ang){
  const u=unit();
  c.save();c.translate(x,y);c.rotate(ang);c.scale(sc,sc);
  c.save();c.shadowColor='rgba(0,0,0,.45)';c.shadowBlur=u*.5;c.shadowOffsetY=u*.25;
  // mango
  const hg=c.createLinearGradient(-.14*u,0,.14*u,0);hg.addColorStop(0,'#6d4422');hg.addColorStop(.5,'#b07a44');hg.addColorStop(1,'#5c391b');
  c.fillStyle=hg;rr(c,-.13*u,.25*u,.26*u,2.7*u,.11*u);c.fill();c.restore();
  c.fillStyle='#2b2b2b';rr(c,-.16*u,2.2*u,.32*u,.8*u,.12*u);c.fill();
  c.fillStyle='rgba(255,255,255,.12)';for(let k=0;k<4;k++)c.fillRect(-.16*u,2.3*u+k*.18*u,.32*u,.05*u);
  // cabeza
  c.save();c.shadowColor='rgba(0,0,0,.5)';c.shadowBlur=u*.6;c.shadowOffsetY=u*.3;
  const g=c.createLinearGradient(0,-.45*u,0,.45*u);g.addColorStop(0,'#c9d0d7');g.addColorStop(.45,'#7c8792');g.addColorStop(1,'#3d454d');
  c.fillStyle=g;rr(c,-.85*u,-.45*u,1.7*u,.9*u,.1*u);c.fill();c.restore();
  c.fillStyle='#2f363d';rr(c,-.95*u,-.5*u,.22*u,1*u,.06*u);c.fill();rr(c,.73*u,-.5*u,.22*u,1*u,.06*u);c.fill();
  c.fillStyle='rgba(255,255,255,.35)';c.fillRect(-.7*u,-.38*u,1.4*u,.08*u);
  c.strokeStyle='#22282e';c.lineWidth=.05*u;rr(c,-.85*u,-.45*u,1.7*u,.9*u,.1*u);c.stroke();
  c.restore();
}

/* ---------- progreso y mensajes ---------- */
let milestones={},toastT=null;
function toast(step,big,small,win,ms){
  const t=$('toast');t.querySelector('.step').textContent=step;t.querySelector('.big').textContent=big;t.querySelector('.small').textContent=small||'';
  t.classList.toggle('win',!!win);t.classList.add('show');clearTimeout(toastT);
  toastT=setTimeout(()=>t.classList.remove('show'),ms||3400);
}
function checkMilestones(p){
  if(p>=.15&&!milestones[15]){milestones[15]=1;sfx('yay');
    toast('15 %','¡Lo estás haciendo bien!',`Estás arrebatando votos a ${party}. Sigue así.`);}
  if(p>=.5&&!milestones[50]){milestones[50]=1;sfx('yay');
    toast('50 %','Otro país es posible','Vivienda digna, sanidad pública y que paguen más quienes más tienen. Ya vas por la mitad.',false,4200);}
  if(p>=.75&&!milestones[75]){milestones[75]=1;sfx('yay');
    toast('75 %','¡Casi lo tienes!','Ya no les queda fachada donde esconderse. Un último empujón.');}
}
function updateHUD(){
  const p=brokenCount/total,pc=Math.round(p*100);
  $('pct').textContent=pc+'%';$('barfill').style.width=pc+'%';
  document.querySelectorAll('.mk').forEach(m=>m.classList.toggle('on',pc>=+m.dataset.v));
  checkMilestones(p);
  if(!revealing&&!done&&p>=.9)revealAll();
  if(!done&&brokenCount>=total)finish();
}
function revealAll(){
  if(revealing||done)return;revealing=true;
  const rest=[];for(let i=0;i<total;i++)if(!broken[i])rest.push(i);
  rest.sort(()=>Math.random()-.5);
  const per=Math.max(1,Math.ceil(rest.length/18));let k=0;
  revealTimer=setInterval(()=>{for(let j=0;j<per&&k<rest.length;j++)breakBlock(rest[k++],W/2,H/2,1);
    sfx('smash',.5);jolt=Math.max(jolt,8);updateHUD();
    if(k>=rest.length){clearInterval(revealTimer);revealTimer=null;finish();}},60);
}

/* ---------- final ---------- */
let confettiUntil=0;
const CONF=['#ffd400','#ff4f8b','#ffffff','#25d366','#9c27b0','#ff7a00'];
function finish(){if(done)return;done=true;
  $('pct').textContent='100%';$('barfill').style.width='100%';
  $('reveal').classList.add('done');$('kicker').textContent='¡Ganamos las elecciones!';
  sfx('yay');setTimeout(()=>sfx('yay'),200);setTimeout(()=>sfx('yay'),400);vib([60,60,120]);
  toast('100 %','¡GANAMOS LAS ELECCIONES!','Has derribado la fachada entera. Ahora compártelo.',true,4200);
  confettiUntil=performance.now()+3000;
  $('bOther').textContent='Ahora: '+(party==='PP'?'VOX':'PP');
  setTimeout(()=>{if(!done)return;$('prog').style.display='none';$('end').classList.add('show');},1800);
  setTimeout(()=>{if(done)buildGif();},2000);
}

/* ---------- grabación de tu destrucción (GIF) ---------- */
let recStopped=false,rec=[],recEvery=.11,recT=0,GW=0,GH=0,recReveal=null,recRevealFinal=null;
const MAXF=64;
function initRecorder(){
  const m=COARSE?400:440,sc=m/Math.max(W,H);GW=Math.max(2,Math.round(W*sc));GH=Math.max(2,Math.round(H*sc));
  rec=[];recEvery=.11;recT=0;recReveal=null;recRevealFinal=null;recStopped=false;
}
function capture(delay){
  const c=document.createElement('canvas');c.width=GW;c.height=GH;const x=c.getContext('2d');
  const k=GW/W;x.translate(shX*k,shY*k);
  x.drawImage(site,0,0,GW,GH);x.drawImage(cracks,0,0,GW,GH);x.drawImage(fx,0,0,GW,GH);
  rec.push({c,delay:Math.round(delay*100),final:done});
  if(rec.length>MAXF){const first=rec[0];rec=rec.filter((f,i)=>i%2===1);rec.forEach(f=>f.delay*=2);rec.unshift(first);recEvery*=2;}
}
function drawRevealTo(w,h,final){
  const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#4a148c');g.addColorStop(.55,'#880e4f');g.addColorStop(1,'#c2185b');x.fillStyle=g;x.fillRect(0,0,w,h);
  const IMP='Impact,"Arial Black",sans-serif';
  x.save();x.globalAlpha=.13;x.fillStyle='#fff';x.translate(w/2,h/2);x.rotate(-.21);const fs0=Math.max(9,Math.min(w,h)*.06);
  x.font=`900 ${fs0}px ${IMP}`;x.textAlign='center';for(let k=-14;k<=14;k++)x.fillText(MSG_LINE.repeat(4),k%2?fs0*3:0,k*fs0*1.25);x.restore();
  x.textAlign='center';x.textBaseline='middle';
  const m=Math.min(w,h*.75),cx=w/2;
  const s1=fit(x,'THE RICH',w*.86,m*.26,'900',IMP);
  const tagS=s1*.36,h2S=fit(x,'VOTA FRENTE AMPLIO',w*.86,s1*.34,'900',IMP);
  const kS=Math.max(10,s1*(final?.2:.13));
  const total=kS*2+s1*1.75+tagS*2.2+h2S*1.3,y0=h/2-total/2-h*.04;
  let y=y0+kS;
  const kt=final?'¡GANAMOS LAS ELECCIONES!':'DEBAJO DE LA FACHADA';
  fit(x,kt,w*.86,kS,'900',final?IMP:'system-ui,sans-serif');const kw=x.measureText(kt).width+kS*1.4;
  if(final){x.fillStyle='#ffd400';rr(x,cx-kw/2,y-kS*.8,kw,kS*1.6,kS*.8);x.fill();x.fillStyle='#2a0a3d';}
  else{x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=Math.max(1,kS*.12);rr(x,cx-kw/2,y-kS*.8,kw,kS*1.6,kS*.8);x.stroke();x.fillStyle='#fff';}
  x.fillText(kt,cx,y);
  y+=kS+s1*.55;x.fillStyle='#fff';x.font=`900 ${s1}px ${IMP}`;x.fillText('TAX',cx,y);y+=s1*.86;x.fillText('THE RICH',cx,y);
  y+=s1*.5+tagS*1.1;x.save();x.translate(cx,y);x.rotate(-.035);fit(x,'VOTO ÚTIL · 29N',w*.8,tagS,'900',IMP);
  const tw=x.measureText('VOTO ÚTIL · 29N').width+tagS*1.2;x.fillStyle='#ffd400';x.fillRect(-tw/2,-tagS*.75,tw,tagS*1.5);
  x.fillStyle='#2a0a3d';x.fillText('VOTO ÚTIL · 29N',0,tagS*.05);x.restore();
  y+=tagS*1.1+h2S*.9;x.fillStyle='#fff';x.font=`900 ${h2S}px ${IMP}`;x.fillText('VOTA FRENTE AMPLIO',cx,y);
  if(final){x.globalAlpha=.85;fit(x,'He desenmascarado a '+party,w*.8,Math.max(9,h2S*.5),'700');x.fillText('He desenmascarado a '+party,cx,h-Math.max(12,h*.05));x.globalAlpha=1;}
  return c;
}
function gifEncoder(w,h){
  const out=[];const b=v=>out.push(v&255);const w16=v=>{b(v);b(v>>8);};const str=s=>{for(const ch of s)b(ch.charCodeAt(0));};
  str('GIF89a');w16(w);w16(h);b(0xF7);b(0);b(0);
  for(let r=0;r<6;r++)for(let g=0;g<6;g++)for(let bl=0;bl<6;bl++){b(r*51);b(g*51);b(bl*51);}
  for(let i=216;i<256;i++){b(0);b(0);b(0);}
  b(0x21);b(0xFF);b(11);str('NETSCAPE2.0');b(3);b(1);w16(0);b(0);
  const bayer=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
  return{
    frame(data,delay){
      b(0x21);b(0xF9);b(4);b(0);w16(delay);b(0);b(0);
      b(0x2C);w16(0);w16(0);w16(w);w16(h);b(0);
      const n=w*h,px=new Uint8Array(n);
      for(let i=0;i<n;i++){const xx=i%w,yy=(i/w)|0,o=(bayer[(yy&3)*4+(xx&3)]/16-.47)*51,j=i*4;
        let r=Math.round((data[j]+o)/51),g=Math.round((data[j+1]+o)/51),bl=Math.round((data[j+2]+o)/51);
        r=r<0?0:r>5?5:r;g=g<0?0:g>5?5:g;bl=bl<0?0:bl>5?5:bl;px[i]=r*36+g*6+bl;}
      const min=8,clear=256,eoi=257;let cs=9,next=258,dict=new Map();const bytes=[];let cur=0,nb=0;
      const emit=c=>{cur|=c<<nb;nb+=cs;while(nb>=8){bytes.push(cur&255);cur>>>=8;nb-=8;}};
      b(min);emit(clear);let prefix=px[0];
      for(let i=1;i<n;i++){const k=px[i],key=prefix*256+k,v=dict.get(key);
        if(v!==undefined){prefix=v;continue;}
        emit(prefix);
        if(next===4096){emit(clear);dict=new Map();next=258;cs=9;}
        else{if(next>=(1<<cs))cs++;dict.set(key,next++);}
        prefix=k;}
      emit(prefix);emit(eoi);if(nb>0)bytes.push(cur&255);
      for(let i=0;i<bytes.length;i+=255){const len=Math.min(255,bytes.length-i);b(len);for(let j=0;j<len;j++)out.push(bytes[i+j]);}
      b(0);
    },
    end(){b(0x3B);return new Uint8Array(out);}
  };
}
let gifBlob=null,gifUrl=null,gifToken=0;
async function buildGif(){
  const token=++gifToken;gifBlob=null;$('bGif').disabled=true;$('bGif').textContent='Preparando tu GIF…';
  recStopped=true;const frames=rec.slice();if(!frames.length)return;
  const bg=drawRevealTo(GW,GH,false),bgF=drawRevealTo(GW,GH,true);
  const c=document.createElement('canvas');c.width=GW;c.height=GH;const x=c.getContext('2d',{willReadFrequently:true});
  const enc=gifEncoder(GW,GH);
  const list=frames.map((f,i)=>({c:f.c,final:f.final,delay:i===0?90:Math.max(6,f.delay)}));
  list.push({c:null,final:true,delay:300});
  for(let i=0;i<list.length;i++){
    if(token!==gifToken)return;
    const f=list[i];x.drawImage(f.final?bgF:bg,0,0);if(f.c)x.drawImage(f.c,0,0);
    enc.frame(x.getImageData(0,0,GW,GH).data,f.delay);
    $('bGif').textContent=`Preparando tu GIF… ${Math.round((i+1)/list.length*100)}%`;
    await new Promise(r=>setTimeout(r,0));
  }
  if(token!==gifToken)return;
  gifBlob=new Blob([enc.end()],{type:'image/gif'});
  if(gifUrl)URL.revokeObjectURL(gifUrl);gifUrl=URL.createObjectURL(gifBlob);
  const canFile=(()=>{try{return !!(navigator.canShare&&navigator.canShare({files:[new File([gifBlob],'a.gif',{type:'image/gif'})]}));}catch(e){return false;}})();
  $('bGif').disabled=false;$('bGif').textContent=canFile?'Compartir mi GIF':'Descargar mi GIF';
}

/* ---------- compartir ---------- */
function shareText(){
  const url=/^https?:/.test(location.protocol)?' Juega tú: '+location.href:'';
  return `He desenmascarado a ${party} y hemos ganado las elecciones. TAX THE RICH · Voto útil 29N · Vota Frente Amplio.${url}`;
}
$('bWa').onclick=()=>window.open('https://wa.me/?text='+encodeURIComponent(shareText()),'_blank');
$('bGif').onclick=async()=>{
  if(!gifBlob)return;
  const file=new File([gifBlob],`desenmascara-${party}-29N.gif`,{type:'image/gif'});
  try{if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],text:shareText()});return;}}
  catch(e){if(e&&e.name==='AbortError')return;}
  const a=document.createElement('a');a.href=gifUrl;a.download=file.name;document.body.appendChild(a);a.click();a.remove();
  toast('GIF','Descargado','Adjúntalo en WhatsApp junto con el mensaje.');
};

/* ---------- sonido ---------- */
let AC=null,rumble=null;
function ac(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();}catch(e){AC=null;}return AC;}
function noise(dur,freq,gain,curve){
  const a=AC,buf=a.createBuffer(1,Math.max(1,Math.floor(a.sampleRate*dur)),a.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,curve);
  const s=a.createBufferSource();s.buffer=buf;const f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=freq;const g=a.createGain();g.gain.value=gain;
  s.connect(f);f.connect(g);g.connect(a.destination);s.start();
}
function sfx(type,p){
  if(muted||!ac())return;
  const a=AC,t0=a.currentTime;
  if(type==='smash'){p=p||1;noise(.5,500+400*p,.6+.35*p,1.8);noise(.12,2600,.25,3);
    const o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.setValueAtTime(110,t0);o.frequency.exponentialRampToValueAtTime(38,t0+.3);
    g.gain.setValueAtTime(.7*p,t0);g.gain.exponentialRampToValueAtTime(.001,t0+.35);o.connect(g);g.connect(a.destination);o.start();o.stop(t0+.4);return;}
  if(type==='yay'){[523,659,784,1047].forEach((fq,k)=>{const o=a.createOscillator(),g=a.createGain();o.type='square';o.frequency.value=fq;
    g.gain.setValueAtTime(0,t0+k*.08);g.gain.linearRampToValueAtTime(.07,t0+k*.08+.01);g.gain.exponentialRampToValueAtTime(.001,t0+k*.08+.22);
    o.connect(g);g.connect(a.destination);o.start(t0+k*.08);o.stop(t0+k*.08+.25);});}
}
function rumbleSet(v){
  if(muted||!AC){if(rumble){rumble.g.gain.value=0;}return;}
  if(!rumble){const o=AC.createOscillator(),g=AC.createGain(),o2=AC.createOscillator();o.type='sawtooth';o2.type='sine';o.frequency.value=48;o2.frequency.value=31;
    const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=180;o.connect(f);o2.connect(f);f.connect(g);g.gain.value=0;g.connect(AC.destination);o.start();o2.start();rumble={o,g};}
  rumble.g.gain.setTargetAtTime(v*.22,AC.currentTime,.03);rumble.o.frequency.setTargetAtTime(40+v*40,AC.currentTime,.05);
}

/* ---------- entrada ---------- */
hit.addEventListener('pointerdown',e=>{
  if(!active||done)return;e.preventDefault();ac();
  ptr.x=e.clientX;ptr.y=e.clientY;ptr.inside=true;ptr.down=true;
  try{hit.setPointerCapture(e.pointerId);}catch(_){}
});
hit.addEventListener('pointermove',e=>{ptr.x=e.clientX;ptr.y=e.clientY;ptr.inside=true;});
hit.addEventListener('pointerleave',()=>{if(!ptr.down)ptr.inside=false;});
['pointerup','pointercancel'].forEach(ev=>hit.addEventListener(ev,()=>{ptr.down=false;if(COARSE)setTimeout(()=>{if(!ptr.down)ptr.inside=false;},250);}));
document.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('gesturestart',e=>e.preventDefault());

/* ---------- bucle ---------- */
let last=performance.now();
function loop(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;
  if(active&&!done){
    if(ptr.down){
      if(cool>0)cool-=dt;
      else{charge=Math.min(1,charge+dt/CHARGE);
        if(charge>=1){lastHitX=ptr.x;lastHitY=ptr.y;strike(ptr.x,ptr.y,1);charge=0;cool=COOL;}}
    }else if(charge>0){
      if(charge>.4){strike(ptr.x,ptr.y,charge);cool=COOL;}
      charge=0;
    }
    if(cool>0&&!ptr.down)cool-=dt;
  }else charge=0;
  rumbleSet(charge*charge);
  // temblor de pantalla
  const amp=(COARSE?9:14)*charge*charge+jolt;
  jolt*=Math.pow(.0009,dt);if(jolt<.3)jolt=0;
  if(amp>.2){shX=(Math.random()-.5)*2*amp;shY=(Math.random()-.5)*2*amp;stage.style.transform=`translate(${shX.toFixed(1)}px,${shY.toFixed(1)}px) rotate(${((Math.random()-.5)*amp*.05).toFixed(2)}deg)`;}
  else if(shX||shY){shX=shY=0;stage.style.transform='';}
  if(swing>0)swing-=dt;
  // confeti final
  if(now<confettiUntil&&particles.length<500)for(let k=0;k<5;k++)particles.push({k:'conf',x:Math.random()*W,y:-12,vx:(Math.random()-.5)*120,vy:60+Math.random()*120,g:160,
    rot:Math.random()*6,vr:(Math.random()-.5)*10,w:7+Math.random()*6,h:4+Math.random()*3,c:CONF[(Math.random()*CONF.length)|0],life:5,s:1});
  // dibujo de efectos
  if(fctx){
    fctx.clearRect(0,0,W,H);
    for(const p of particles){p.life-=dt;
      if(p.k==='ring'){p.r+=p.vr*dt;fctx.strokeStyle=`rgba(255,255,255,${Math.max(0,p.life/.28)*.8})`;fctx.lineWidth=6;fctx.beginPath();fctx.arc(p.x,p.y,p.r,0,7);fctx.stroke();continue;}
      p.vy+=(p.g||0)*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
      if(p.k==='dust'){p.vx*=.9;p.vy*=.9;p.s*=1+dt*1.5;fctx.fillStyle=p.c+Math.max(0,p.life)*.6+')';fctx.beginPath();fctx.arc(p.x,p.y,p.s,0,7);fctx.fill();continue;}
      p.rot+=p.vr*dt;fctx.save();fctx.translate(p.x,p.y);fctx.rotate(p.rot);fctx.fillStyle=p.c;fctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      if(p.k==='brick'){fctx.strokeStyle='rgba(0,0,0,.35)';fctx.lineWidth=1.5;fctx.strokeRect(-p.w/2,-p.h/2,p.w,p.h);}
      fctx.restore();
    }
    particles=particles.filter(p=>p.life>0&&p.x>-120&&p.x<W+120&&p.y<H+120&&p.y>-H);
    if(active&&!done&&ptr.inside){
      if(charge>0){const R=strikeRadius(charge);fctx.strokeStyle=`rgba(255,255,255,${.25+.4*charge})`;fctx.lineWidth=3;fctx.setLineDash([10,8]);
        fctx.beginPath();fctx.arc(ptr.x,ptr.y,R,0,7);fctx.stroke();fctx.setLineDash([]);}
      const sc=1+3.2*Math.pow(charge,1.4),ang=swing>0?.45:-.4-.75*charge;
      const mx=swing>0?lastHitX:ptr.x,my=swing>0?lastHitY:ptr.y;
      drawMaza(fctx,mx,my,swing>0?1.25:sc,ang);
    }
  }
  // grabar fotogramas
  if(active&&GW&&!recStopped){recT-=dt;const busy=charge>0||particles.length>0||swing>0||jolt>0;
    if(recT<=0&&(busy||done)){capture(recEvery);recT=recEvery;}}
  requestAnimationFrame(loop);
}

/* ---------- partida ---------- */
function layout(){
  W=window.innerWidth;H=window.innerHeight;dpr=Math.min(window.devicePixelRatio||1,2);
  B=Math.max(38,Math.round(Math.min(W,H)/9));
  cols=Math.ceil(W/B);rows=Math.ceil(H/B);total=cols*rows;
  sctx=setup(site,true);cctx=setup(cracks);fctx=setup(fx);
}
let lastW=0,lastH=0;
function start(p){
  if(revealTimer){clearInterval(revealTimer);revealTimer=null;}
  party=p;theme=THEMES[p];layout();lastW=W;lastH=H;drawSite();
  broken=new Uint8Array(total);prog=new Float32Array(total);stg=new Uint8Array(total);
  brokenCount=0;done=false;revealing=false;particles=[];milestones={};confettiUntil=0;charge=0;cool=0;jolt=0;gifToken++;
  $('toast').classList.remove('show');$('kicker').textContent='Debajo de la fachada';
  $('reveal').classList.remove('done');$('end').classList.remove('show');
  $('who').textContent='Desenmascarando a '+p;
  $('start').style.display='none';$('hud').style.display='flex';$('prog').style.display='block';
  active=true;initRecorder();capture(.9);updateHUD();
  toast('Cómo se juega','Mantén pulsado','La maza crece y la pantalla tiembla. Suelta o espera y ¡zas!',false,3000);
}
function home(){active=false;done=false;gifToken++;if(revealTimer){clearInterval(revealTimer);revealTimer=null;}
  $('toast').classList.remove('show');$('end').classList.remove('show');$('hud').style.display='none';$('prog').style.display='none';
  $('start').style.display='flex';rumbleSet(0);}

document.querySelectorAll('.choice').forEach(b=>b.addEventListener('click',()=>{ac();start(b.dataset.p);}));
$('bSnd').onclick=()=>{muted=!muted;$('bSnd').textContent=muted?'Sin sonido':'Sonido';if(muted)rumbleSet(0);};
$('bBack').onclick=home;$('bHome').onclick=home;
$('bOther').onclick=()=>start(party==='PP'?'VOX':'PP');
let rt;window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{
  if(!active)return;const w=window.innerWidth,h=window.innerHeight;
  // en móvil la barra del navegador cambia la altura: solo reiniciamos si gira la pantalla
  if(Math.abs(w-lastW)>40||Math.abs(h-lastH)>Math.max(160,lastH*.25)){if(!done)start(party);}
},300);});
requestAnimationFrame(loop);
})();
