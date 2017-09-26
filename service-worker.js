self.addEventListener('install', (event) => {
    console.log('updated service worker installed', event);
});

self.addEventListener('activate', (event) => {
  console.log('service worker activated', event);
});
