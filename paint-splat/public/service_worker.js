self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open("paint-splat-cache-v1")
      .then((cache) => {
        return cache.addAll([]);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then( response => (response) ? response : fetch(event.request))
  );
});