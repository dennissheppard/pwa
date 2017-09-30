importScripts('sw-toolbox.js', 'pirate-manager.js', 'node_modules/localforage/dist/localforage.min.js');

self.addEventListener('install', (event) => {

});

self.addEventListener('sync', (event) => {
  if (event.tag == 'post-comment') {
    event.waitUntil(pirateManager.postComment().then((data) => {
      notifyClient(data);
    }));
  }
});

toolbox.router.get('/images/*', toolbox.fastest, {
  cache: {
    name: 'sw-toolbox-version1',
    maxEntries: 20,
    maxAgeSeconds: 60 * 30
  }
});

toolbox.router.get('/styles/*', toolbox.cacheFirst, {
  cache: {
    name: 'sw-toolbox-version1',
    maxEntries: 20,
    maxAgeSeconds: 60 * 60 * 24 * 7
  }
});

toolbox.router.get('*.html', toolbox.cacheFirst, {
  cache: {
    name: 'sw-toolbox-version1',
    maxEntries: 20,
    maxAgeSeconds: 60 * 60 * 24 * 7
  }
});

toolbox.router.get('/*', toolbox.networkFirst, {
  origin: 'openlibrary.org',
  cache: {
    name: 'sw-toolbox-version1',
    maxEntries: 20,
    maxAgeSeconds: 60 * 60 * 12
  }
});

toolbox.router.get('/*', toolbox.networkFirst, {
  origin: 'firebaseio.com',
  cache: {
    name: 'sw-toolbox-version1',
    maxEntries: 20,
    maxAgeSeconds: 60 * 60 * 24 * 14
  }
});

function notifyClient(msg){
  self.clients.matchAll({'includeUncontrolled': true}).then((clients) => {
    clients[0].postMessage(msg);
  });
}