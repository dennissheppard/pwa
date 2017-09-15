
/*********************
 *  Push notifications
 *********************/
self.addEventListener('push', function(event) {
  console.log(`Push received with this data: "${event.data.text()}"`);

  const title = 'Peggy says:';

  let options = {
    body: event.data.text(),
    icon: 'images/peggy_parrot.jpg',
    actions: [
      {
        action: "feed", title: "Feed Peggy"
      },
      {
        action: "wait", title: "Wait to Feed Peggy"
      }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  let promise = new Promise((resolve) => {
    event.notification.close();
    if (event.action === "feed") {
        fetch('http://localhost:8081/feed', {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then(() => resolve());
    } else if (event.action !== 'wait') {
      self.clients.matchAll().then((clients) => {
        if (clients.length > 0) {
          clients[0].navigate("http://localhost:8080/peggy_parrot.html?feed=true");
        } else {
          self.clients.openWindow("http://localhost:8080/peggy_parrot.html?feed=true");
        }
        resolve();
      });
    }
  });
  event.waitUntil(promise);
});

/*******************
 *  Background Sync
 *******************/
self.addEventListener('sync', (event) => {
  if (event.tag == 'post-comment') {
    event.waitUntil(pirateManager.postComment().then((data) => {
      notifyClient(data);
    }));
  }
});


function notifyClient(msg){
  self.clients.matchAll({"includeUncontrolled": true}).then((clients) => {
    clients[0].postMessage(msg);
  });
}