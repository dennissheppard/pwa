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
    const placeholderAssetURL = 'placeholder';
    event.respondWith(
      fetch(event.request).catch((e) => { // fetch fails
        return caches.open(version).then((cache) => {
          return cache.match(placeholderAssetURL);
        });
      })
    );
});

