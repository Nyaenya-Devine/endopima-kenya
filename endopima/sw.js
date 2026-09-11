/* EndoPima Service Worker - offline-first cache for static demo
   God Mode PWA: cache-first for assets, network-first for navigation fallback.
   No external network, no analytics. Safe for low-connectivity Kenya contexts.
*/
const CACHE_NAME = 'endopima-v1-2026-05-12';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Only handle same-origin
  if (url.origin !== self.location.origin) return;

  // Navigation: network-first, fallback to cache + offline page
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req).then((m) => m || caches.match('./index.html')))
    );
    return;
  }

  // Assets: cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, clone));
        }
        return res;
      });
    })
  );
});
