// Service worker: deixa o app e o leitor de códigos disponíveis sem internet
const CACHE="emblocamento-v16";
const SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-180.png","./logo.png"];
const EXT=["https://cdn.jsdelivr.net/npm/zxing-wasm@2.2.4/dist/iife/reader/index.js","https://cdn.jsdelivr.net/npm/zxing-wasm@2.2.4/dist/reader/zxing_reader.wasm"];
self.addEventListener("install",e=>{e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(SHELL);
  for(const u of EXT){try{const r=await fetch(u,{mode:"cors"});if(r.ok)await c.put(u,r)}catch(err){}}self.skipWaiting()})())});
self.addEventListener("activate",e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==CACHE)await caches.delete(k);await self.clients.claim()})())});
self.addEventListener("fetch",e=>{const req=e.request;if(req.method!=="GET")return;const url=new URL(req.url);
  // páginas do app: tenta a rede (para receber atualizações) e cai no cache sem internet
  if(url.origin===location.origin){e.respondWith((async()=>{const c=await caches.open(CACHE);try{const r=await fetch(req,{cache:"no-cache"});if(r.ok)c.put(req,r.clone());return r}catch(err){return (await c.match(req,{ignoreSearch:true}))||(await c.match("./index.html"))}})());return}
  // leitor de códigos (CDN): do cache primeiro
  if(EXT.includes(req.url)){e.respondWith((async()=>{const c=await caches.open(CACHE);const m=await c.match(req.url);if(m)return m;const r=await fetch(req);if(r.ok)c.put(req.url,r.clone());return r})())}});
