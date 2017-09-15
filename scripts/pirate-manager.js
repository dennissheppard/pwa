var pirateManager = (() => {
  var commentList = [];
  var messageText = '';
  var swReg;
  var publicServerKey = 'BCi3AfGJVfxoDOB3JGMbvyAzOBJ8KiqRrUn6OhYaWsfUrwOq6h9hI1x464AQaVyaNFhAGNi0thYCtSxRmy0P8SI';

  return {
    getComments: getComments,
    postComment: postComment,
    registerServiceWorker: registerServiceWorker,
    subscribeToPush: subscribeToPush
  };

  function getComments() {
    return fetch('https://pirates-b74f7.firebaseio.com/commentList.json')
      .then((response) => response.json())
      .then((data) => {
        this.commentList = data;
        return this.commentList;
      });
  }

  function postComment() {
      return localforage.getItem('comment').then((val) => {
        let d = new Date();
        let data = {
          commentText: val,
          date: (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
        };

        return fetch("https://pirates-b74f7.firebaseio.com/commentList.json",
        {
            method: "POST",
            body: JSON.stringify(data)
        }).then(() => {
          localforage.removeItem('comment');
          return data;
        });
      });
    }

    function registerServiceWorker() {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js').then((registration) => {
          swReg = registration;
        }, function(err) {
            console.log(err);
          });

      } else {
        console.log('No service worker support in this browser');
      }
    }

    function subscribeToPush() {
      const options = {
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(publicServerKey)
      };
      navigator.serviceWorker.ready.then((reg) => {
          return reg.pushManager.getSubscription().then((subscription) => {
            if (subscription === null) {
              return reg.pushManager.subscribe(options);
            } else {
              let promise = new Promise((resolve, reject) => {
                resolve(subscription);
              });
              return promise;
            }
          });
        })
        .then((subscription) => {
          fetch('http://localhost:8081/register', {
            method: 'post',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify(subscription)
          });
          console.log('subscription: ', JSON.stringify(subscription));
          return subscription;
        })
        .catch((error) => {
          alert('error: ' + error);
        });
    }

    function urlB64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }

})();