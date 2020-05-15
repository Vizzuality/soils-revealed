const express = require('express');
const next = require('next');
const ee = require('@google/earthengine');

const landCoverLayer = require('./api/land-cover');
const socExperimentalTimeseriesLayer = require('./api/soc-experimental-timeseries');
const socExperimentalChangeLayer = require('./api/soc-experimental-change');

const port = parseInt(process.env.PORT, 10) || 3000;
const isDev = process.env.NODE_ENV !== 'production';

const app = next({ dev: isDev });
const handle = app.getRequestHandler();

let geePrivateKey;
try {
  geePrivateKey = require('./gee.key.json');
  ee.data.authenticateViaPrivateKey(
    geePrivateKey,
    () => {
      ee.initialize();
      console.log('> GEE authenticated and initialized');
    },
    err => {
      console.log('> GEE authentication failed');
      console.log(err);
    }
  );
} catch (e) {
  console.log('> GEE private key missing. GEE services disabled.');
}

app.prepare().then(() => {
  const server = express();

  if (geePrivateKey) {
    server.get('/api/land-cover/:year/:z/:x/:y', landCoverLayer);
    server.get(
      '/api/soc-experimental/:type/:depth/timeseries/:year/:z/:x/:y',
      socExperimentalTimeseriesLayer
    );
    server.get(
      '/api/soc-experimental/:type/:depth/change/:year1/:year2/:z/:x/:y',
      socExperimentalChangeLayer
    );
  }
  server.get('/api/*', (req, res) => res.status(404).end());
  server.all('*', (req, res) => handle(req, res));

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
