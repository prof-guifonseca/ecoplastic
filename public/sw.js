// Service worker do EcoPlastic — cache-first para boot offline (contingencia da feira).
// Precacheia o app shell (todas as rotas navegaveis + assets do prototipo 3D).
// Os chunks hasheados de _next/static sao cacheados em runtime no primeiro acesso.
const CACHE_NAME = 'ecoplastic-static-v3';

const APP_SHELL = [
  '/',
  '/app/',
  '/app/login/',
  '/app/morador/',
  '/app/morador/inicio/',
  '/app/morador/historico/',
  '/app/morador/qr/',
  '/app/morador/trocar/',
  '/app/sindico/',
  '/app/sindico/dashboard/',
  '/app/sindico/coletas/',
  '/app/sindico/financeiro/',
  '/app/sindico/moradores/',
  '/app/sindico/esg/',
  '/app/sindico/config/',
  '/equipamento/',
  '/prototipo-3d/',
  '/prototipo-3d/vendor/three.min.js',
  '/prototipo-3d/vendor/qrcode.min.js',
  '/manifest.webmanifest',
  '/icons/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // cache.add individual + allSettled: um 404 isolado nao quebra o install.
      await Promise.allSettled(APP_SHELL.map((url) => cache.add(url)));
      await self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match('/app/login/'));
    })
  );
});
