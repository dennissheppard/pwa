const port = 8081;
const express = require('express');
const spdy = require('spdy');
const fs = require('mz/fs');

const app = express();

const cert = {
                key: fs.readFileSync('./localhost.key'),
                cert: fs.readFileSync('./localhost.cert')
             };

app.use(express.static('../'));

app.get('*', (req, res) => {
  res.status(200);
});

spdy.createServer(cert, app)
    .listen(port, console.log('Listening on port: ' + port));