const CACHE = "tokoku-v1";
const ASSETS = ["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))); });
self.addEventListener("fetch", e => {
  const req = e.request;
  e.respondWith(caches.match(req).then(r => r || fetch(req).then(resp => {
    if(req.method === "GET" && new URL(req.url).origin === location.origin){
      const copy = resp.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
    }
    return resp;
  }).catch(() => caches.match("./index.html"))));
});