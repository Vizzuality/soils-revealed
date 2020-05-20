const express = require('express');
const next = require('next');
const ee = require('@google/earthengine');

require('dotenv').config();

const landCover = require('./api/land-cover');
const socExperimentalTimeseries = require('./api/soc-experimental-timeseries');
const socExperimentalChange = require('./api/soc-experimental-change');
const socStockHistoricPeriod = require('./api/soc-stock-historic-period');
const socStockHistoricChange = require('./api/soc-stock-historic-change');
const socStockRecentTimeseries = require('./api/soc-stock-recent-timeseries');
const socStockRecentChange = require('./api/soc-stock-recent-change');
const socStockFuturePeriod = require('./api/soc-stock-future-period');
const socStockFutureChange = require('./api/soc-stock-future-change');

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
    server.get('/api/land-cover/:year/:z/:x/:y', landCover);
    server.get(
      '/api/soc-experimental/:type/:depth/timeseries/:year/:z/:x/:y',
      socExperimentalTimeseries
    );
    server.get(
      '/api/soc-experimental/:type/:depth/change/:year1/:year2/:z/:x/:y',
      socExperimentalChange
    );
    server.get('/api/soc-stock/historic/period/:period/:z/:x/:y', socStockHistoricPeriod);
    server.get('/api/soc-stock/historic/change/:z/:x/:y', socStockHistoricChange);
    server.get('/api/soc-stock/recent/timeseries/:year/:z/:x/:y', socStockRecentTimeseries);
    server.get('/api/soc-stock/recent/change/:year1/:year2/:z/:x/:y', socStockRecentChange);
    server.get('/api/soc-stock/future/:scenario/period/:year/:z/:x/:y', socStockFuturePeriod);
    server.get('/api/soc-stock/future/:scenario/change/:year/:z/:x/:y', socStockFutureChange);
  }
  server.get('/api/*', (req, res) => res.status(404).end());
  server.all('*', (req, res) => handle(req, res));

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
