const CACHE_NAME = 'step-challenge-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/models/player.glb',
  '/models/coin.glb',
  '/models/virus.glb',
  '/sounds/hit.mp3',
  '/sounds/success.mp3',
  '/sounds/background.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  
  const url = new URL(event.request.url);
  const isStaticAsset = 
    url.pathname.includes('/models/') ||
    url.pathname.includes('/sounds/') ||
    url.pathname.includes('/textures/') ||
    url.pathname.endsWith('.glb') ||
    url.pathname.endsWith('.mp3') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg');
  
  if (!isStaticAsset) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            return new Response('Network error', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request)
            .then((response) => {
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
              return response;
            })
            .catch(() => {
              return caches.match(event.request);
            });
        })
    );
  }
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
