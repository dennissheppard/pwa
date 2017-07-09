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
  if(!navigator.onLine && event.request.url.indexOf('index.html') !== -1) {
    event.respondWith(showOfflineLanding(event));
  }
  else {
    event.respondWith(pullFromCache(event));
  }

});

function showOfflineLanding(event) {
  return caches.match(new Request('offline.html'));
}

function pullFromCache(event) {
  return caches.match(event.request).then((response) => {
    return response || fetch(event.request).then((response) => {
        return caches.open('version1').then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
  });
}
