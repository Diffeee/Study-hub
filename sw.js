const V="studyhub-23a9860ab4";
const FILES=["./", "index.html", "d1.html", "d2.html", "d3.html", "d4.html", "d5.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k.startsWith("studyhub-")).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.origin===location.origin){
    // pages: network first so updates arrive, cache when offline
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res;}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match("index.html"))));
  } else if(u.host==="fonts.googleapis.com"||u.host==="fonts.gstatic.com"){
    // fonts: cache first
    e.respondWith(caches.open("studyhub-fonts").then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{c.put(r,res.clone());return res;}))));
  }
});
