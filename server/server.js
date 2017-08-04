let express = require("express");
let webPush = require('web-push');
let bodyParser = require('body-parser');
let app = express();
let subscriptions = [];
let timeLeft = 15;
let timer;

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const vapidKeys = {
  publicKey:
'BCi3AfGJVfxoDOB3JGMbvyAzOBJ8KiqRrUn6OhYaWsfUrwOq6h9hI1x464AQaVyaNFhAGNi0thYCtSxRmy0P8SI',
  privateKey: 'tjl2sNdpoiLYqUhR_TjSSZNq1U2fcBNw2LT76C_nCOM'
};

webPush.setVapidDetails(
  'mailto:dennissheppard+pwa@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

function sendNotification(subscription) {
  timer = null;
  const notificationText = 'Peggy wants a pretzel! You have ' + timeLeft + ' seconds to feed her!';
  webPush.sendNotification(subscription, notificationText).then(function() {
    console.log('Notification sent');
  }).catch(function(error) {
    console.log('Error sending Notification' + error);
    subscriptions.splice(subscriptions.indexOf(endpoint), 1);
  });
}

function setPushTimer() {
  timer = setTimeout(() => {
      console.log('timeleft: ', timeLeft);
      subscriptions.forEach(sendNotification);
    }, 1000 * timeLeft);
}

app.post('/register', (req, res) => {
  if (!req.body || !req.body.endpoint) {
    // Invalid subscription.
    res.status(400);
    res.send('Invalid subscription');
    return false;
  }

  console.log('Subscription registered ' + req.body.endpoint);
  const found = subscriptions.some((sub) => {
    return sub.endpoint === req.body.endpoint;
  });
  if (!found) {
    subscriptions.push(req.body);
  }

  if (!timer) {
    setPushTimer();
  }

  res.sendStatus(200);
});

app.post('/feed', (req, res) => {
  timeLeft = 15;
  if (!timer) {
    setPushTimer();
  }
  res.sendStatus(200);
});

// Start the server
app.listen(8081, function() {
  console.log(`Listening on port 8081`);
});

