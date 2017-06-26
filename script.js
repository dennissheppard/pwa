(() => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
    navigator.serviceWorker.register('scripts/trivia/service-worker.js', {scope: 'scripts'}).then((registration) => {
      console.log('registered');
      console.log(registration);
    }, function(err) {
        console.log(err);
      });
    });
  } else {
    alert('No service worker support in this browser');
  }
})();