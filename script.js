(()=>{
const C=window.LSPACE_CONFIG,$=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const set=(s,v)=>$$(s).forEach(e=>e.textContent=v);
$$("[data-social]").forEach(a=>{const s=C.socials[a.dataset.social];if(!s)return;a.href=s.url;a.target="_blank";a.rel="noopener";const h=a.querySelector(".h");if(h)h.textContent=s.handle});
$$("[data-linkedin-media]").forEach(a=>{a.href=C.linkedinMedia;a.target="_blank";a.rel="noopener"});
$$("[data-linkedin]").forEach(a=>{a.href=C.linkedin;a.target="_blank";a.rel="noopener"});
async function get(u,k,ttl){try{const c=JSON.parse(sessionStorage.getItem(k));if(c&&Date.now()-c.t<ttl)return c.d}catch(e){}
 const r=await fetch(u);if(!r.ok)throw 0;const d=await r.json();try{sessionStorage.setItem(k,JSON.stringify({t:Date.now(),d}))}catch(e){}return d}
/* animations */
const io="IntersectionObserver"in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.1}):null;
const rv=()=>$$(".head,.card,.socials a,.mark,.tl li,.two>div,.cta,.note,.lr,.pc,.post,.stn h3").forEach((e,i)=>{if(e.classList.contains("rv"))return;e.classList.add("rv");e.style.transitionDelay=(i%5)*70+"ms";
 e.addEventListener("transitionend",()=>{e.style.transitionDelay="";e.classList.add("done")},{once:true});io?io.observe(e):e.classList.add("in")});
window.rv=rv;
const up=(sel,n)=>{const t0=performance.now(),f=t=>{const k=Math.min(1,(t-t0)/1200);set(sel,Math.round(n*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
const hero=$(".hero");if(hero&&!matchMedia("(prefers-reduced-motion:reduce)").matches)hero.addEventListener("mousemove",e=>{hero.style.setProperty("--mx",(e.clientX/innerWidth-.5)*2);hero.style.setProperty("--my",(e.clientY/innerHeight-.5)*2)});
const mb=$(".mb");if(mb)mb.addEventListener("click",()=>mb.setAttribute("aria-expanded",document.body.classList.toggle("nav-open")));
$$("nav a").forEach(a=>a.addEventListener("click",()=>document.body.classList.remove("nav-open")));
rv();
/* YouTube : une seule ligne de vidéos récentes */
const CH=C.youtubeChannelId.slice(2),dead=i=>/^(deleted|private) video$/i.test(i.title),sg=()=>AbortSignal.timeout?AbortSignal.timeout(7000):undefined;
async function yt(pl){
 const t=Date.now(),F=encodeURIComponent("https://www.youtube.com/feeds/videos.xml?playlist_id="+pl),srt=a=>a.filter(i=>!dead(i)).sort((a,b)=>b.date-a.date);
 if(C.youtubeApiKey)try{const d=await fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=12&playlistId="+pl+"&key="+C.youtubeApiKey,{signal:sg()}).then(r=>r.json());
  return srt(d.items.map(i=>({title:i.snippet.title,link:"https://www.youtube.com/watch?v="+i.snippet.resourceId.videoId,thumbnail:(i.snippet.thumbnails.high||i.snippet.thumbnails.medium||{}).url,date:+new Date(i.snippet.publishedAt)||0})))}catch(e){}
 const A=fetch("https://api.rss2json.com/v1/api.json?rss_url="+F+"&t="+t,{cache:"no-store",signal:sg()}).then(r=>r.json()).then(d=>d.items.map(i=>({title:i.title,link:i.link,thumbnail:i.thumbnail,date:+new Date(String(i.pubDate).replace(" ","T")+"Z")||0})));
 const B=fetch("https://api.allorigins.win/raw?url="+F+"&t="+t,{cache:"no-store",signal:sg()}).then(r=>r.text()).then(x=>[...new DOMParser().parseFromString(x,"text/xml").querySelectorAll("entry")].map(e=>({title:e.querySelector("title").textContent,link:e.querySelector("link").getAttribute("href"),thumbnail:(e.getElementsByTagName("media:thumbnail")[0]||{getAttribute:()=>""}).getAttribute("url"),date:+new Date(e.querySelector("published").textContent)||0})));
 const r=(await Promise.allSettled([A,B])).filter(x=>x.status==="fulfilled").map(x=>srt(x.value)).filter(a=>a.length);r.sort((a,b)=>b[0].date-a[0].date);return r[0]||[]}
const vid=i=>(i.link.match(/v=([^&]+)/)||[])[1],fl=$$("[data-feed]");
if(fl.length)Promise.all([yt("UULF"+CH),yt("UUSH"+CH),yt("UU"+CH)]).then(([lo,sh,all])=>{
 const mixed=!lo.length&&!sh.length,ids=a=>new Set(a.map(vid));
 if(!lo.length)lo=all.filter(i=>!ids(sh).has(vid(i)));
 if(!sh.length)sh=all.filter(i=>!ids(lo).has(vid(i)));
 fl.forEach(f=>{const s=f.dataset.feed==="short",a=s?sh:lo,sec=f.closest("section");
  if(!a.length){if(!s&&!all.length)f.innerHTML=`<p>Impossible de charger les vidéos pour le moment. Retrouve-les sur <a href="${esc(C.socials.youtube.url)}" target="_blank" rel="noopener">YouTube</a>.</p>`;else sec.hidden=true;return}
  if(mixed&&!s)sec.querySelector("h2").textContent="Dernières vidéos";
  f.innerHTML=a.slice(0,s?10:8).map(i=>`<a class="card" href="${esc(i.link)}" target="_blank" rel="noopener"><div class="thumb">${i.thumbnail?`<img src="${esc(i.thumbnail)}" alt="" loading="lazy">`:""}<span class="tag"><i class="tri r"></i>${s?"vertical":"vidéo"}</span></div><h3>${esc(i.title)}</h3></a>`).join("");rv()})});
/* Lancements */
const Q="?limit=20&hide_recent_previous=true",U=["https://ll.thespacedevs.com/2.3.0/launches/upcoming/"+Q,"https://ll.thespacedevs.com/2.2.0/launch/upcoming/"+Q,"https://lldev.thespacedevs.com/2.2.0/launch/upcoming/"+Q],ab=l=>l.status?.abbrev||"";
const LST=async()=>{for(const [i,u] of U.entries()){try{const d=await get(u,"launch"+i,9e5);if((d.results||[]).length)return d.results}catch(e){}}return[]};
const fut=r=>r.filter(l=>+new Date(l.net)>Date.now()-36e5);
const pickL=r=>{const f=fut(r);return f.find(l=>/^(go|tbc)$/i.test(ab(l)))||f.find(l=>!/tbd/i.test(ab(l)))||f[0]};
const fmt=(d,o)=>new Intl.DateTimeFormat("fr-FR",{timeZone:"Europe/Paris",...o}).format(d),exact=l=>/second|minute|hour/i.test(l.net_precision?.name||"Minute");
let net=null;const p2=n=>String(n).padStart(2,"0");
const tick=()=>{if(!net)return;let d=(net-Date.now())/1e3,s=d<0?"T+ ":"T- ";d=Math.abs(d);const j=Math.floor(d/86400);
 set(".cd",s+(j?j+"j ":"")+p2(Math.floor(d%86400/3600))+":"+p2(Math.floor(d%3600/60))+":"+p2(Math.floor(d%60)))};
if($(".cd"))(async()=>{const l=pickL(await LST());if(!l){set(".ln","Prochain lancement indisponible");return}
 net=new Date(l.net);const ex=exact(l),tm=ex?{hour:"2-digit",minute:"2-digit"}:{};
 set(".ln",l.name);set(".lp",[l.launch_service_provider?.name,l.pad?.location?.name].filter(Boolean).join(" · "));
 set(".ld",fmt(net,{weekday:"long",day:"numeric",month:"long",year:"numeric",...tm,...(ex?{timeZoneName:"short"}:{})})+(ex?"":" · heure à confirmer")+(/tbc|tbd/i.test(ab(l))?" · à confirmer":""));
 set(".ds","· "+fmt(net,{day:"numeric",month:"short",...tm}));tick();setInterval(tick,1e3)})();
const lw=$("#launches");
if(lw)LST().then(r=>{const L=fut(r);if(!L.length){lw.innerHTML="<p>Calendrier indisponible pour le moment.</p>";return}
 const pv=l=>l.launch_service_provider?.name||"",cnt={};L.forEach(l=>cnt[pv(l)]=(cnt[pv(l)]||0)+1);
 const top=Object.entries(cnt).filter(e=>e[0]).sort((a,b)=>b[1]-a[1]).slice(0,5).map(e=>e[0]);let cur="";
 const ST={go:["Go","y"],tbc:["À confirmer",""],tbd:["Date à déterminer",""],hold:["En attente","r"]};
 const draw=()=>{lw.innerHTML=L.filter(l=>!cur||pv(l)===cur).map(l=>{const n=new Date(l.net),s=ST[ab(l).toLowerCase()]||[ab(l),""],ex=exact(l),h=(n-Date.now())/36e5,rel=h<0?"en cours":h<24?"dans "+Math.max(1,Math.round(h))+" h":"dans "+Math.round(h/24)+" j",im=typeof l.image==="string"?l.image:l.image?.thumbnail_url||l.image?.image_url;
  return `<article class="lr">${im?`<img src="${esc(im)}" alt="" loading="lazy">`:`<div class="ph0"></div>`}<div class="dt"><b>${fmt(n,{day:"numeric"})}</b><span>${fmt(n,{month:"short"})}</span></div><div class="lb"><h3>${esc(l.name)}</h3><p>${esc([pv(l),l.pad?.location?.name].filter(Boolean).join(" · "))}</p><span class="cap">${esc(fmt(n,ex?{weekday:"long",hour:"2-digit",minute:"2-digit",timeZoneName:"short"}:{weekday:"long"})+(ex?"":" · heure à confirmer"))}</span></div><div class="ls"><span class="st ${s[1]}">${esc(s[0])}</span><span class="cap">${rel}</span></div></article>`}).join("");rv()};
 const f=$("#flt");f.innerHTML=["",...top].map(p=>`<button type="button" aria-pressed="${p===""}" data-p="${esc(p)}">${p?esc(p):"Tous"}</button>`).join("");
 f.onclick=e=>{const b=e.target.closest("button");if(!b)return;cur=b.dataset.p;f.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));draw()};draw()});
/* Personnes dans l'espace */
const CQ="https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json",pw=$("#people");
const crew=async()=>{try{const d=await get(CQ,"crew2",18e5);if(d.people&&d.people.length)return d}catch(e){}return null};
(async()=>{const d=await crew();let n=d?d.people.length:0;
 if(!(n>0))for(const [u,k,f] of [["https://api.open-notify.org/astros.json","crew3",x=>x.number],["https://ll.thespacedevs.com/2.2.0/astronaut/?in_space=true&limit=1&mode=list","crew0",x=>x.count]]){try{const m=+f(await get(u,k,18e5));if(m>0&&m<30){n=m;break}}catch(e){}}
 if(!(n>0))n=C.peopleInSpaceFallback||0;
 if(n>0)up(".crew",n);else $$(".crew").forEach(e=>{const c=e.closest(".live>div,.top>span");if(c)c.hidden=true});
 if(pw){if(!d){pw.innerHTML="<p>Liste des équipages indisponible pour le moment.</p>";return}
  const now=Date.now()/1e3,g={ISS:[],Tiangong:[]};d.people.forEach(p=>(p.iss===false?g.Tiangong:g.ISS).push(p));
  pw.innerHTML=Object.entries(g).filter(e=>e[1].length).map(([k,a])=>`<div class="stn"><h3>${k==="ISS"?"Station spatiale internationale":"Station Tiangong"} <span class="cap">${a.length} ${a.length>1?"personnes":"personne"}</span></h3><div class="pgrid">${a.map(p=>{const dm=p.launched?Math.max(0,Math.floor((now-p.launched)/86400)):null;
   return `<a class="pc" href="${esc(p.url||"#")}" target="_blank" rel="noopener">${p.image?`<img class="ph1" src="${esc(p.image)}" alt="" loading="lazy">`:`<div class="ph1"></div>`}<div><b>${esc(p.name)}</b><span class="cap">${p.flag_code?`<img class="fl" src="https://flagcdn.com/w40/${esc(p.flag_code)}.png" alt="">`:""}${esc(p.country||"")}${p.agency?" · "+esc(p.agency):""}</span><span class="cap">${esc(p.position||"")}</span><span class="cap">${esc(p.spacecraft||"")}</span>${dm!==null?`<span class="cap y">${dm} j en mission · ${dm+(p.days_in_space||0)} j au total</span>`:""}</div></a>`}).join("")}</div></div>`).join("");rv()}})();
})();
