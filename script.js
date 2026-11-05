(()=>{
const C=window.LSPACE_CONFIG,$=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const set=(s,v)=>$$(s).forEach(e=>e.textContent=v);
$$("[data-social]").forEach(a=>{const s=C.socials[a.dataset.social];if(!s)return;a.href=s.url;a.target="_blank";a.rel="noopener";const h=a.querySelector(".h");if(h)h.textContent=s.handle});
$$("[data-linkedin-media]").forEach(a=>{a.href=C.linkedinMedia;a.target="_blank";a.rel="noopener"});
$$("[data-linkedin]").forEach(a=>{a.href=C.linkedin;a.target="_blank";a.rel="noopener"});
async function get(u,k,ttl){try{const c=JSON.parse(sessionStorage.getItem(k));if(c&&Date.now()-c.t<ttl)return c.d}catch(e){}
 const r=await fetch(u);if(!r.ok)throw 0;const d=await r.json();try{sessionStorage.setItem(k,JSON.stringify({t:Date.now(),d}))}catch(e){}return d}
const io="IntersectionObserver"in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12}):null;
const rv=()=>$$(".head,.card,.socials a,.mark,.tl li,.proj,.chips li,.two>div,.cta,.embed,.note").forEach((e,i)=>{if(e.classList.contains("rv"))return;e.classList.add("rv");e.style.transitionDelay=(i%5)*70+"ms";
 e.addEventListener("transitionend",()=>{e.style.transitionDelay="";e.classList.add("done")},{once:true});io?io.observe(e):e.classList.add("in")});
const up=(sel,n)=>{const t0=performance.now(),f=t=>{const k=Math.min(1,(t-t0)/1200);set(sel,Math.round(n*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
const hero=$(".hero");if(hero&&!matchMedia("(prefers-reduced-motion:reduce)").matches)hero.addEventListener("mousemove",e=>{hero.style.setProperty("--mx",(e.clientX/innerWidth-.5)*2);hero.style.setProperty("--my",(e.clientY/innerHeight-.5)*2)});
rv();
const col={youtube:"r"};
const CH=C.youtubeChannelId.slice(2),dead=i=>/^(deleted|private) video$/i.test(i.title),vid=i=>(i.link.match(/v=([^&]+)/)||[])[1],sg=()=>AbortSignal.timeout?AbortSignal.timeout(7000):undefined;
async function yt(pl){
 const t=Date.now(),F=encodeURIComponent("https://www.youtube.com/feeds/videos.xml?playlist_id="+pl),srt=a=>a.filter(i=>!dead(i)).sort((a,b)=>b.date-a.date);
 if(C.youtubeApiKey)try{const d=await fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=12&playlistId="+pl+"&key="+C.youtubeApiKey,{signal:sg()}).then(r=>r.json());
  return srt(d.items.map(i=>({title:i.snippet.title,link:"https://www.youtube.com/watch?v="+i.snippet.resourceId.videoId,thumbnail:(i.snippet.thumbnails.high||i.snippet.thumbnails.medium||{}).url,date:+new Date(i.snippet.publishedAt)||0})))}catch(e){}
 const A=fetch("https://api.rss2json.com/v1/api.json?rss_url="+F+"&t="+t,{cache:"no-store",signal:sg()}).then(r=>r.json()).then(d=>d.items.map(i=>({title:i.title,link:i.link,thumbnail:i.thumbnail,date:+new Date(String(i.pubDate).replace(" ","T")+"Z")||0})));
 const B=fetch("https://api.allorigins.win/raw?url="+F+"&t="+t,{cache:"no-store",signal:sg()}).then(r=>r.text()).then(x=>[...new DOMParser().parseFromString(x,"text/xml").querySelectorAll("entry")].map(e=>({title:e.querySelector("title").textContent,link:e.querySelector("link").getAttribute("href"),thumbnail:(e.getElementsByTagName("media:thumbnail")[0]||{getAttribute:()=>""}).getAttribute("url"),date:+new Date(e.querySelector("published").textContent)||0})));
 const r=(await Promise.allSettled([A,B])).filter(x=>x.status==="fulfilled").map(x=>srt(x.value)).filter(a=>a.length);r.sort((a,b)=>b[0].date-a[0].date);return r[0]||[]}
const fl=$$("[data-feed]");
if(fl.length)Promise.all([yt("UULF"+CH),yt("UUSH"+CH),yt("UU"+CH)]).then(([lo,sh,all])=>{
 const mixed=!lo.length&&!sh.length,ids=a=>new Set(a.map(vid));
 if(!lo.length)lo=all.filter(i=>!ids(sh).has(vid(i)));
 if(!sh.length)sh=all.filter(i=>!ids(lo).has(vid(i)));
 fl.forEach(f=>{const s=f.dataset.feed==="short",a=s?sh:lo,sec=f.closest("section");
  if(!a.length){if(!s&&!all.length)f.innerHTML=`<p>Impossible de charger les vidéos pour le moment. Retrouve-les directement sur <a href="${esc(C.socials.youtube.url)}" target="_blank" rel="noopener">YouTube</a>.</p>`;else sec.hidden=true;return}
  if(mixed&&!s)sec.querySelector("h2").textContent="Dernières vidéos";
  f.innerHTML=a.slice(0,s?6:4).map(i=>`<a class="card" href="${esc(i.link)}" target="_blank" rel="noopener"><div class="thumb">${i.thumbnail?`<img src="${esc(i.thumbnail)}" alt="" loading="lazy">`:""}<span class="tag"><i class="tri r"></i>${s?"short":"vidéo"}</span></div><h3>${esc(i.title)}</h3></a>`).join("");rv()})});
let net=null;const p=n=>String(n).padStart(2,"0");
const tick=()=>{if(!net)return;let d=(net-Date.now())/1e3,s=d<0?"T+ ":"T- ";d=Math.abs(d);const j=Math.floor(d/86400);
 set(".cd",s+(j?j+"j ":"")+p(Math.floor(d%86400/3600))+":"+p(Math.floor(d%3600/60))+":"+p(Math.floor(d%60)))};
get("https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1","launch",6e5).then(d=>{const l=d.results[0];net=new Date(l.net);
 set(".ln",l.name);set(".lp",[l.launch_service_provider?.name,l.pad?.location?.name].filter(Boolean).join(" · "));tick();setInterval(tick,1e3)}).catch(()=>{set(".ln","données indisponibles")});
get("https://ll.thespacedevs.com/2.2.0/astronaut/?in_space=true&limit=1&mode=list","crew",18e5).then(d=>up(".crew",d.count)).catch(()=>{});
})();
