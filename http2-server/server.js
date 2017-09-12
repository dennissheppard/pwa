const port = 8081;
const express = require('express');
const spdy = require('spdy');
const fs = require('mz/fs');

const app = express();

const cert = {
                key: fs.readFileSync('./localhost.key'),
                cert: fs.readFileSync('./localhost.cert')
             };

const index = fs.readFileSync('../index.html');
const css = fs.readFileSync('../styles/pirates.css');
const pirateManager = fs.readFileSync('../scripts/pirate-manager.js');

app.use(express.static('../'));

app.get('/home', (req, res) => {

    let cssResource = {
      path: '/styles/pirates.css',
      contentType: 'text/css',
      file: css
    };

    let pirateManagerResource = {
      path: '/scripts/pirate-manager.js',
      contentType: 'application/javascript',
      file: pirateManager
    };

    pushResource(res, cssResource);
    pushResource(res, resource);

    res.writeHead(200);
    res.end(index);
});

function pushResource(res, resource) {
  let stream = res.push(resource.path, {
      req: {'accept': '**/*'},
      res: {'content-type': resource.contentType}
    });

    stream.on('error', err => {
      console.log(err);
    });

    stream.end(resource.file);
}

spdy.createServer(cert, app)
    .listen(port, console.log('Listening on port: ' + port));