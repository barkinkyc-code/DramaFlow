const CACHE = 'dm-sevkiyat-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/config.js',
  '/js/auth.js',
  '/js/gps.js',
  '/pages/panel.html',
  '/pages/plan.html',
  '/pages/companies.html',
  '/pages/tracking.html',
  '/pages/stats.html',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Tile requests — network first
  if (e.request.url.includes('openstreetmap') || e.request.url.includes('osrm')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  // App shell — cache first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res && res.status === 200) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});
