self.addEventListener('install', (event) => {
  event.waitUntil(() => {
    if (!'caches' in window) {
      alert ('Sad arrrgh! This browser does not support service worker caching!');
      return;
    }
    caches.open('version2').then((cache) => {
      return cache.addAll(
        [
          'index.html',
          'offline.html'
        ]);
    })
  });
});

self.addEventListener('activate', (event) => {
  let CURRENT_CACHE = 'version2';
  event.waitUntil(
    caches.keys().then((cacheKeys) => {
      return Promise.all(
        cacheKeys.map((cacheKey) => {
          if (cacheKey !== CURRENT_CACHE) {
            console.log('Deleting cache: ' + cacheKey);
            return caches.delete(cacheKey);
          }
        })
      )
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
        return caches.open('version2').then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
  });
}
