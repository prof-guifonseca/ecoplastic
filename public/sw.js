// Service worker do EcoPlastic.
//
// Estrategia (corrige "tela bugada" pos-deploy para quem ja tinha cache):
// - NAVEGACOES (HTML): network-first -> online sempre serve a versao mais nova
//   (que referencia os chunks atuais); offline cai no cache (ou no login).
// - DEMAIS GETs (chunks hasheados de _next/static, assets): cache-first, pois
//   sao imutaveis (o hash muda a cada build).
// CACHE_NAME versionado: ao atualizar o worker, o activate apaga caches antigos.
const CACHE_NAME = 'ecoplastic-static-v4';

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
  const req = event.request;
  if (req.method !== 'GET') return;

  const isNavigation = req.mode === 'navigate' || req.destination === 'document';

  if (isNavigation) {
    event.respondWith(
      fetch(req)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return response;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('/app/login/')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return response;
      });
    })
  );
});
