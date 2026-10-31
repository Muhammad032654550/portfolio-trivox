(function(){
var R=matchMedia('(prefers-reduced-motion:reduce)').matches,d=document,root=d.documentElement,$=function(s){return d.querySelector(s)},$$=function(s){return[].slice.call(d.querySelectorAll(s))};
/* Premium loader: keeps the first frame intentional and exits on page readiness */
var loader=d.createElement('div');loader.id='trivox-loader';loader.setAttribute('role','status');loader.setAttribute('aria-label','Loading Trivox Solutions');
loader.innerHTML='<div class="loader-inner"><img class="loader-mark" src="assets/logo.webp" alt=""><div class="loader-name">TRIVOX</div><div class="loader-caption">Digital experiences, elevated</div><div class="loader-track"><div class="loader-progress"></div></div><div class="loader-foot"><span>PREPARING YOUR EXPERIENCE</span><span class="loader-percent">0%</span></div></div>';
d.body.appendChild(loader);
var loaderProgress=loader.querySelector('.loader-progress'),loaderPercent=loader.querySelector('.loader-percent'),loaderStart=performance.now(),loaderDone=false;
function finishLoader(){if(loaderDone)return;loaderDone=true;loaderProgress.style.width='100%';loaderPercent.textContent='100%';setTimeout(function(){loader.classList.add('loader-out');d.body.classList.add('ready');setTimeout(function(){if(loader.parentNode)loader.parentNode.removeChild(loader)},850)},220)}
function loaderTick(now){if(loaderDone)return;var p=Math.min((now-loaderStart)/1250,0.92);p=1-Math.pow(1-p,2.2);loaderProgress.style.width=Math.round(p*100)+'%';loaderPercent.textContent=Math.round(p*100)+'%';if(p<.92)requestAnimationFrame(loaderTick)}
requestAnimationFrame(loaderTick);
if(d.readyState==='complete')setTimeout(finishLoader,450);else addEventListener('load',function(){setTimeout(finishLoader,300)},{once:true});
setTimeout(finishLoader,3200);
requestAnimationFrame(function(){/* page reveal is handled by the loader */});
// scenes
var sc=$('#scene');function setScene(el){var a=el.dataset.scene.split(',');sc.style.setProperty('--c1',a[0]);sc.style.setProperty('--c2',a[1])}setScene($('.hero'));
var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)setScene(e.target)})},{rootMargin:'-45% 0px -45% 0px'});$$('[data-scene]').forEach(function(e){so.observe(e)});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.2});
$$('.rv').forEach(function(el,i){el.style.transitionDelay=(i%3)*80+'ms';io.observe(el)});
var co=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;co.unobserve(e.target);var el=e.target,n=+el.dataset.n,sf=el.dataset.s,t0=performance.now();(function f(t){var p=Math.min((t-t0)/1600,1);el.textContent=Math.round(n*(1-Math.pow(1-p,3)))+sf;if(p<1)requestAnimationFrame(f)})(t0)})},{threshold:.6});$$('[data-n]').forEach(function(e){co.observe(e)});
// parallax
var flw=$('#flw');if(R&&flw&&flw.setCurrentTime)flw.setCurrentTime(6);var hero=$('.hero'),heroVis=true,bar=$('#bar'),proc=$('#proc'),links=$$('.links a'),pt=0,px0=0,py0=0;
function offIO(list){var o=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('off',!e.isIntersecting);if(e.target===hero)heroVis=e.isIntersecting})},{rootMargin:'80px'});list.forEach(function(e){if(e)o.observe(e)})}
offIO([hero,$('.marq'),$('.big'),$('.studio'),$('#devs'),$('.wa')]);
if(!R&&matchMedia('(pointer:fine)').matches)addEventListener('pointermove',function(e){if(!heroVis)return;px0=(e.clientX/innerWidth-.5)*2;py0=(e.clientY/innerHeight-.5)*2;if(!pt){pt=1;requestAnimationFrame(function(){pt=0;hero.style.setProperty('--mx',px0.toFixed(3));hero.style.setProperty('--my',py0.toFixed(3))})}},{passive:true});
function onS(){bar.style.width=scrollY/(root.scrollHeight-innerHeight)*100+'%';var r=proc.getBoundingClientRect();proc.style.setProperty('--p',Math.max(0,Math.min(1,(innerHeight*.8-r.top)/(r.height+innerHeight*.3))));links.forEach(function(a){var b=$(a.getAttribute('href')).getBoundingClientRect();a.classList.toggle('on',b.top<innerHeight*.4&&b.bottom>innerHeight*.4)})}
var sT=0;addEventListener('scroll',function(){if(!sT){sT=1;requestAnimationFrame(function(){sT=0;onS()})}},{passive:true});onS();
// magnetic + tilt
if(!R&&matchMedia('(pointer:fine)').matches){$$('.mag').forEach(function(b){b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+(e.clientX-r.left-r.width/2)*.25+'px,'+(e.clientY-r.top-r.height/2)*.35+'px)'});b.addEventListener('pointerleave',function(){b.style.transform=''})});
$$('.tilt,#dash').forEach(function(t){t.addEventListener('pointermove',function(e){var r=t.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;t.style.transform='perspective(900px) rotateY('+px*14+'deg) rotateX('+-py*14+'deg) scale(1.02)'});t.addEventListener('pointerleave',function(){t.style.transform=''})})}
// carousel
var cs=$$('.card'),cur=1,n=cs.length;
function lay(){cs.forEach(function(k,i){var o=i-cur;k.style.transform='translateX('+o*(innerWidth<860?58:78)+'%) translateZ('+(-Math.abs(o)*180)+'px) rotateY('+(-o*32)+'deg) scale('+(o?.88:1)+')';k.style.opacity=o?.55:1;k.style.zIndex=10-Math.abs(o);k.style.pointerEvents='auto';if(o)k.classList.remove('flip')})}
function go(i){cur=(i+n)%n;lay()}
cs.forEach(function(k,i){k.addEventListener('click',function(){if(i===cur)k.classList.toggle('flip');else go(i)})});
$('#pv').onclick=function(){go(cur-1)};$('#nx').onclick=function(){go(cur+1)};
addEventListener('keydown',function(e){if(e.key==='ArrowLeft')go(cur-1);if(e.key==='ArrowRight')go(cur+1)});
var sx=null,st=$('#stage');st.addEventListener('pointerdown',function(e){sx=e.clientX});addEventListener('pointerup',function(e){if(sx!==null&&Math.abs(e.clientX-sx)>50)go(cur+(e.clientX<sx?1:-1));sx=null});
addEventListener('resize',lay);lay();

var I=[['SaaS','M10 38a10 10 0 0 1 2-19 14 14 0 0 1 27 4 8 8 0 0 1-1 15z','Launch faster and turn trials into customers.',250],['Healthcare','M24 8h12v16h16v12H36v16H24V36H8V24h16z','Build trust and book more appointments.',170],['Finance','M8 52V32h10v20zM26 52V18h10v34zM44 52V8h10v44z','Credibility, clarity and qualified leads.',215],['Real Estate','M8 32L32 10l24 22v22H8zM26 54V40h12v14','Rank locally and showcase listings.',330],['Ecommerce','M6 10h8l6 28h30l6-20H16M24 50a3 3 0 1 0 .1 0M46 50a3 3 0 1 0 .1 0','Product pages built for checkout.',350],['Education','M32 10L4 24l28 14 28-14zM16 32v12c8 8 24 8 32 0V32','Grow enrolments with clear journeys.',20]];
var T=$('#htr');T.innerHTML=I.map(function(a){return '<div class="ic" style="--h:'+a[3]+'"><svg viewBox="0 0 64 64"><path d="'+a[1]+'"/></svg><div><h3>'+a[0]+'</h3><p>'+a[2]+'</p></div></div>'}).join('');
var HP=$('#hp'),FL=$$('.fl');
function onH(){var r=HP.getBoundingClientRect(),p=Math.max(0,Math.min(1,-r.top/(r.height-innerHeight)));T.style.transform='translateX('+(-p*(T.scrollWidth-innerWidth+innerWidth*.08))+'px)';FL.forEach(function(f){var b=f.getBoundingClientRect();f.style.translate='0 '+((b.top+b.height/2-innerHeight/2)*(+f.dataset.s))+'px'})}
if(!R){var hT=0;addEventListener('scroll',function(){if(!hT){hT=1;requestAnimationFrame(function(){hT=0;onH()})}},{passive:true});onH()}

var C=[{n:'SaaS landing concept',d:'Clear offer, live proof and one action.',h:255,t:'Ship reports your team actually reads',p:'Automated dashboards that turn raw data into decisions.',b:'Start free trial',k:'s',hs:[[6,42,'Clear offer'],[58,30,'Live product proof'],[6,66,'One primary action'],[44,88,'Social proof']],st:[['4.9','Rating'],['2.1×','Conversions'],['98','Speed score']]},
{n:'Ecommerce storefront concept',d:'Fast product pages built for checkout.',h:330,t:'Everyday carry, made to last',p:'Free shipping over $50 and 30-day returns.',b:'Shop the collection',k:'e',hs:[[6,42,'Benefit-led headline'],[60,30,'Scannable product grid'],[6,66,'Primary shop action'],[44,88,'Trust badges']],st:[['30d','Returns'],['Free','Shipping'],['4.8','Reviews']]},
{n:'Service business concept',d:'Local SEO structure with booking built in.',h:165,t:'Book your visit in 60 seconds',p:'Local experts, clear pricing, same-week slots.',b:'Check availability',k:'b',hs:[[6,42,'Promise in the headline'],[58,30,'Instant booking widget'],[6,66,'Single booking action'],[44,88,'Local trust signals']],st:[['500+','Local clients'],['4.9','Rating'],['60s','To book']]}];
function vz(c){var S='<div class="vz art"><svg viewBox="0 0 200 150" role="img" aria-label="Concept graphic">';
if(c.k=='s'){S+='<defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:hsl(var(--h) 90% 66%)"/><stop offset="1" style="stop-color:hsl(var(--h) 90% 66%);stop-opacity:0"/></linearGradient></defs><rect class="w" width="200" height="150" rx="12"/><path d="M10 112C40 104 52 64 80 72S120 44 150 48 182 24 190 20V132H10Z" fill="url(#ag)" opacity=".55"/><path class="ln2" d="M10 112C40 104 52 64 80 72S120 44 150 48 182 24 190 20"/><circle cx="190" cy="20" r="4" fill="#fff"/><circle cx="160" cy="120" r="0" /><g transform="translate(14 12)"><rect class="b" width="46" height="8" rx="4"/><rect class="w2" y="14" width="30" height="5" rx="2.5"/></g><g transform="translate(120 100)"><circle class="w2" cx="24" cy="24" r="18"/><circle class="don" cx="24" cy="24" r="18"/></g><g transform="translate(14 120)"><circle class="a" cx="6" cy="6" r="6"/><circle class="b" cx="18" cy="6" r="6"/><circle fill="#fff" cx="30" cy="6" r="6"/></g>'}
else if(c.k=='e'){var P=['<path d="M-14 6a14 14 0 0 1 28 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><rect x="-19" y="4" width="9" height="16" rx="4" fill="#fff"/><rect x="10" y="4" width="9" height="16" rx="4" fill="#fff"/>','<rect x="-6" y="-26" width="12" height="14" rx="3" fill="#fff" opacity=".6"/><rect x="-6" y="14" width="12" height="14" rx="3" fill="#fff" opacity=".6"/><circle r="15" fill="#fff"/><circle r="11" class="a"/><path d="M0 0V-7M0 0l5 3" stroke="#1c063a" stroke-width="2" stroke-linecap="round"/>','<rect x="-15" y="-18" width="30" height="38" rx="10" fill="#fff"/><rect x="-10" y="2" width="20" height="12" rx="4" class="a"/><path d="M-6-18v-4a6 6 0 0 1 12 0v4" fill="none" stroke="#fff" stroke-width="3"/>'],pr=['$48','$62','$39'];S+='<rect class="w" width="200" height="150" rx="12"/>';for(var i=0;i<3;i++)S+='<g transform="translate('+(8+i*64)+' 10)"><rect class="w2" width="56" height="130" rx="10"/><circle class="b" cx="28" cy="46" r="24" opacity=".85"/><ellipse cx="28" cy="82" rx="18" ry="3" fill="#000" opacity=".25"/><g transform="translate(28 46)">'+P[i]+'</g><rect x="8" y="96" width="40" height="5" rx="2.5" fill="#fff" opacity=".8"/><rect class="a" x="8" y="108" width="26" height="14" rx="7"/><text x="21" y="118" font-size="8" font-weight="700" text-anchor="middle" fill="#1c063a">'+pr[i]+'</text></g>'}
else{S+='<rect class="w" width="200" height="150" rx="12"/><g transform="translate(12 12)"><rect class="b" width="60" height="7" rx="3.5"/>';for(var i=0;i<28;i++){var on=[9,10,16,17,23].indexOf(i)>-1;S+='<rect x="'+(i%7)*13+'" y="'+(16+Math.floor(i/7)*17)+'" width="10" height="13" rx="4" class="'+(i==16?'a':on?'w3':'w2')+'"/>'}S+='</g><g transform="translate(118 18)"><circle class="b" cx="30" cy="20" r="16"/><circle fill="#fff" cx="30" cy="15" r="6"/><path fill="#fff" d="M17 32a13 9 0 0 1 26 0z"/><rect class="w2" x="4" y="46" width="52" height="6" rx="3"/><text x="30" y="68" font-size="9" text-anchor="middle" fill="#d79fff">★★★★★</text></g><g transform="translate(12 106)"><rect class="a" width="44" height="22" rx="11"/><rect class="w3" x="50" width="44" height="22" rx="11"/><rect class="w3" x="100" width="44" height="22" rx="11"/></g>'}
return S+'</svg></div>'}
var WF=$('#wf'),WL=$('#wl'),wi=0,wt;
WF.insertAdjacentHTML('afterbegin',C.map(function(c){return'<div class="ui" style="--h:'+c.h+'"><div class="bc"><i></i><i></i><i></i><span>yourbrand.com</span></div><div class="bd"><div class="nv"><b></b><span></span><span></span><span></span><em>Contact</em></div><div class="hr"><div><h4>'+c.t+'</h4><p>'+c.p+'</p><a class="ub">'+c.b+'</a></div>'+vz(c)+'</div><div class="pf">'+c.st.map(function(s){return'<div><b>'+s[0]+'</b>'+s[1]+'</div>'}).join('')+'</div></div>'+c.hs.map(function(q){return'<button class="hs" style="left:'+q[0]+'%;top:'+q[1]+'%" aria-label="'+q[2]+'"><span>'+q[2]+'</span></button>'}).join('')+'</div>'}).join(''));
WL.innerHTML=C.map(function(c,i){return'<button class="wt" role="tab"><b>'+c.n+'</b><span>'+c.d+'</span></button>'}).join('');
var U=$$('.ui'),TB=$$('.wt');
function show(i){wi=i;U.forEach(function(u,k){u.classList.toggle('on',k==i)});TB.forEach(function(t,k){t.classList.remove('on');if(k==i){void t.offsetWidth;t.classList.add('on')}});$('#wph').style.setProperty('--h',C[i].h)}
TB.forEach(function(t,i){t.onclick=function(){show(i);cyc()}});
function cyc(){clearInterval(wt);if(!R)wt=setInterval(function(){show((wi+1)%3)},6000)}
if(R)$('#work').classList.add('nocy');
$('#ws').addEventListener('pointerenter',function(){clearInterval(wt)});$('#ws').addEventListener('pointerleave',cyc);
if(!R&&matchMedia('(pointer:fine)').matches){$('#ws').addEventListener('pointermove',function(e){var r=this.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;WF.style.transform='rotateY('+px*9+'deg) rotateX('+-py*9+'deg)'});$('#ws').addEventListener('pointerleave',function(){WF.style.transform=''})}
show(0);cyc();

$('#wf2').addEventListener('submit',function(e){e.preventDefault();var f=new FormData(this),t='Hello Trivox, I would like to discuss a project.%0AName: '+encodeURIComponent(f.get('name'))+'%0APhone: '+encodeURIComponent(f.get('phone'))+'%0ACompany: '+encodeURIComponent(f.get('company')||'-')+'%0AService: '+encodeURIComponent(f.get('service'))+'%0ADetails: '+encodeURIComponent(f.get('details'));window.open('https://wa.me/923264088500?text='+t,'_blank')});

var HD=$('#hd'),BG=$('#bgr'),MM=$('#mm'),ly=0,PL=$('#pill'),LK=$('#lk');
function tm(o){BG.setAttribute('aria-expanded',o);MM.classList.toggle('open',o);MM.setAttribute('aria-hidden',!o);d.body.style.overflow=o?'hidden':''}
BG.onclick=function(){tm(BG.getAttribute('aria-expanded')!=='true')};$$('#mm a').forEach(function(a){a.onclick=function(){tm(false)}});
function pl(a){if(!a){PL.style.opacity=0;return}PL.style.opacity=1;PL.style.width=a.offsetWidth+'px';PL.style.transform='translateX('+a.offsetLeft+'px)'}
$$('#lk a').forEach(function(a){a.addEventListener('pointerenter',function(){pl(a)})});LK.addEventListener('pointerleave',function(){pl($('#lk a.on'))});
addEventListener('scroll',function(){var y=scrollY;HD.classList.toggle('sc',y>40);if(BG.getAttribute('aria-expanded')!=='true')HD.classList.toggle('hid',y>300&&y>ly);ly=y;if(!LK.matches(':hover'))pl($('#lk a.on'))},{passive:true});
var W2=['rank','convert','scale','grow'],wx=0,RT=$('#rot');if(!R)setInterval(function(){if(!heroVis||d.hidden)return;RT.classList.add('sw');setTimeout(function(){wx=(wx+1)%4;RT.textContent=W2[wx];RT.classList.remove('sw')},300)},2400);

(function(){var cv=$('#rc'),x=cv.getContext('2d'),W=960,H=500,t=0,pl=!R,vis=false,last=0,CAP=['1. Build','2. Rank','3. Scale'];
function ez(v){v=Math.max(0,Math.min(1,v));return 1-Math.pow(1-v,3)}
function rr(a,b,w,hh,r,c){x.fillStyle=c;x.beginPath();x.roundRect(a,b,Math.max(w,0),hh,r);x.fill()}
function draw(){var sc=Math.floor(t/5)%3,p=(t%5)/5,g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#370a78');g.addColorStop(1,'#14032a');x.fillStyle=g;x.fillRect(0,0,W,H);
 x.globalAlpha=Math.min(1,p*6,(1-p)*6);$('#rcap').textContent=CAP[sc];
 if(sc==0){rr(70,50,820*ez(p*4),34,10,'#4c179e');rr(86,60,60,14,5,'#955aff');
  for(var i=0;i<3;i++)rr(86,130+i*40,(i==2?300:480)*ez(p*3-.4-i*.3),22,8,i?'#ae7fff':'#fff');
  rr(86,270,(170*ez(p*4-1.4)),46,23,'#b966f4');
  for(i=0;i<3;i++){var q=ez(p*3-1.2-i*.25);rr(86+i*190,350+(1-q)*40,170,110*q,16,'rgba(149,90,255,'+.35*q+')')}
  rr(600,120,290,330,16,'rgba(20,3,42,.8)');for(i=0;i<9;i++)rr(620,145+i*34,(60+((i*53)%150))*ez(p*5-.5-i*.25),12,6,i%3?'#955aff':'#b966f4')}
 else if(sc==1){var r=4*(1-ez(p*1.5)),nm=['seotools.com','agencyhub.net','growthblog.io','marketpro.co'];x.font='600 20px Sora,sans-serif';
  for(var j=0;j<4;j++){var s=j+Math.max(0,Math.min(1,j+1-r));rr(120,70+s*72,720,58,14,'rgba(149,90,255,.18)');x.fillStyle='#d5bcff';x.fillText(nm[j],150,106+s*72)}
  rr(120,70+r*72,720,58,14,'#b966f4');x.fillStyle='#15042e';x.fillText('yourbrand.com  (Trivox optimized)',150,106+r*72);
  if(r<.15){x.font='800 30px Sora,sans-serif';x.fillStyle='#fff';x.fillText('#1',860,108+r*72)}}
 else{x.strokeStyle='rgba(255,255,255,.1)';for(var k=0;k<5;k++){x.beginPath();x.moveTo(80,80+k*80);x.lineTo(880,80+k*80);x.stroke()}
  var n=60*ez(p*1.4),pts=[];for(k=0;k<=n;k++){var u=k/60;pts.push([80+u*800,400-(Math.pow(u,2.2)*300+Math.sin(u*14)*8)])}
  x.beginPath();pts.forEach(function(a,i){i?x.lineTo(a[0],a[1]):x.moveTo(a[0],a[1])});x.strokeStyle='#b966f4';x.lineWidth=5;x.lineCap='round';x.shadowColor='#b966f4';x.shadowBlur=18;x.stroke();x.shadowBlur=0;
  var e=pts[pts.length-1];x.fillStyle='#fff';x.beginPath();x.arc(e[0],e[1],9,0,6.3);x.fill();x.font='800 64px Sora,sans-serif';x.fillText('+'+Math.round(214*ez(p*1.4))+'%',90,70);x.font='600 18px Sora,sans-serif';x.fillStyle='#b89fe0';x.fillText('qualified leads',96,100)}
 x.globalAlpha=1;$('#rb').style.width=(t/15*100)+'%';var s=Math.floor(t);$('#rt').textContent='0:'+(s<10?'0':'')+s+' / 0:15'}
function loop(ts){if(vis&&pl){t=(t+(ts-last)/1000)%15}last=ts;if(vis)draw();requestAnimationFrame(loop)}
new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(cv);
$('#rpp').onclick=function(){pl=!pl;this.textContent=pl?'||':'▶'};
if(R){t=4.5;draw();vis=false}else requestAnimationFrame(loop);
})();
// particles (light): few dots, no blur, ~30fps, paused when tab hidden
var cv=$('#cv'),g=cv.getContext('2d'),W,H,P=[],lt=0;
function sz(){W=cv.width=innerWidth;H=cv.height=innerHeight;P=[];for(var i=0;i<(innerWidth<860?16:34);i++)P.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.8+.6,v:Math.random()*.35+.12,p:Math.random()*6})}sz();var rzT;addEventListener('resize',function(){clearTimeout(rzT);rzT=setTimeout(sz,150)});
function dr(t){if(!R)requestAnimationFrame(dr);if(d.hidden||t-lt<33)return;lt=t;g.clearRect(0,0,W,H);for(var i=0;i<P.length;i++){var p=P[i];if(!R){p.y-=p.v;p.x+=Math.sin(t/1200+p.p)*.3;if(p.y<-5){p.y=H+5;p.x=Math.random()*W}}g.globalAlpha=.3+.4*Math.sin(t/700+p.p);g.fillStyle=p.r>1.6?'#c77dfc':'#d8a5fc';g.beginPath();g.arc(p.x,p.y,p.r,0,6.3);g.fill()}}
requestAnimationFrame(dr);
})();
