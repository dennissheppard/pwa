self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('version1').then((cache) => {
      return cache.addAll(
        [
          'index.html',
          '/pirates.html',
          '/styles/pirates.css',
          '/styles/pirate.ttf',
          '/images/i-love-pirates.jpg',
          'offline.html'
        ]);
    })
  );
});


self.addEventListener('fetch', (event) => {
  const version = 'version1';

  event.respondWith(
   caches.open(version).then(cache => {
      return cache.match(event.request).then((response) => {
        let fetchPromise = fetch(event.request).then(networkResponse => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        event.waitUntil(fetchPromise);
        return response;
      })
    })
  );
});

