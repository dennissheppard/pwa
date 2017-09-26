(() => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').then((registration) => {
      console.log('registered');
      console.log(registration);
    }, (err) => {
        console.log(err);
      });
    });
  } else {
    alert('No service worker support in this browser');
  }
})();