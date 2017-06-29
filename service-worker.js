self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('updated service worker installed', event);
});

self.addEventListener('activate', (event) => {
  console.log('updated service worker activated', event);
});
