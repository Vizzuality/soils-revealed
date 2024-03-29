const express = require('express');
const next = require('next');
const ee = require('@google/earthengine');
const AWS = require('aws-sdk');
const logger = require('pino-http')()

require('dotenv').config();

// Validation
const validation = require('./api/validation/middleware');
const schemas = require('./api/validation/schemas');

// Tiles server handlers
const landCover = require('./api/tiles/land-cover');
const socExperimentalTimeseries = require('./api/tiles/soc-experimental-timeseries');
const socExperimentalChange = require('./api/tiles/soc-experimental-change');
const socStockHistoricPeriod = require('./api/tiles/soc-stock-historic-period');
const socStockHistoricChange = require('./api/tiles/soc-stock-historic-change');
const socStockRecentTimeseries = require('./api/tiles/soc-stock-recent-timeseries');
const socStockRecentChange = require('./api/tiles/soc-stock-recent-change');
const socStockFuturePeriod = require('./api/tiles/soc-stock-future-period');
const socStockFutureChange = require('./api/tiles/soc-stock-future-change');

// Chart data handlers
const charts = require('./api/charts');

// Other data handlers
const areaInterestSearch = require('./api/misc/area-interest-search');
const areaInterestRanking = require('./api/misc/area-interest-ranking');

const port = parseInt(process.env.PORT, 10) || 3000;
const isDev = process.env.NODE_ENV !== 'production';

const app = next({ dev: isDev });
const handle = app.getRequestHandler();

// Initialize GEE
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

// Initialize AWS
AWS.config.update({ region: process.env.AWS_REGION });

app.prepare().then(() => {
  const server = express();

  server.use(express.json());
  server.use(logger);

  // Tiles server handlers
  if (geePrivateKey) {
    server.get(
      '/api/land-cover/:group/:year/:z/:x/:y',
      validation(schemas.landCover, 'params'),
      landCover
    );
    server.get(
      '/api/soc-experimental/:type/:depth/timeseries/:year/:z/:x/:y',
      validation(schemas.socExperimentalTimeseries, 'params'),
      socExperimentalTimeseries
    );
    server.get(
      '/api/soc-experimental/:type/:depth/change/:year1/:year2/:z/:x/:y',
      validation(schemas.socExperimentalChange, 'params'),
      socExperimentalChange
    );
    server.get(
      '/api/soc-stock/historic/:depth/period/:period/:z/:x/:y',
      validation(schemas.socStockHistoricPeriod, 'params'),
      socStockHistoricPeriod
    );
    server.get(
      '/api/soc-stock/historic/:depth/change/:z/:x/:y',
      validation(schemas.socStockHistoricChange, 'params'),
      socStockHistoricChange
    );
    server.get(
      '/api/soc-stock/recent/timeseries/:year/:z/:x/:y',
      validation(schemas.socStockRecentTimeseries, 'params'),
      socStockRecentTimeseries
    );
    server.get(
      '/api/soc-stock/recent/change/:year1/:year2/:z/:x/:y',
      validation(schemas.socStockRecentChange, 'params'),
      socStockRecentChange
    );
    server.get(
      '/api/soc-stock/future/:scenario/period/:year/:z/:x/:y',
      validation(schemas.socStockFuturePeriod, 'params'),
      socStockFuturePeriod
    );
    server.get(
      '/api/soc-stock/future/:scenario/change/:year/:z/:x/:y',
      validation(schemas.socStockFutureChange, 'params'),
      socStockFutureChange
    );
  }

  // Chart data handlers
  server.post(
    '/api/charts/:layer/:type/:boundaries/:depth',
    validation(schemas.charts, 'params'),
    validation(schemas.chartsQuery, 'query'),
    validation(schemas.chartsBody, 'body'),
    charts
  );

  // Other data handlers
  server.get(
    '/api/area-interest/search/:search',
    validation(schemas.areaInterestSearch, 'params'),
    validation(schemas.areaInterestSearchQuery, 'query'),
    areaInterestSearch
  );
  server.get(
    '/api/area-interest/ranking/:layer/:type/:depth/:boundaries/:level/:order/:aggregation',
    validation(schemas.areaInterestRanking, 'params'),
    validation(schemas.areaInterestRankingQuery, 'query'),
    areaInterestRanking
  );

  server.get('/api/*', (req, res) => res.status(404).end());
  server.all('*', (req, res) => handle(req, res));

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
