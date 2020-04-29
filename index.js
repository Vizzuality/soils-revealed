const express = require('express');
const next = require('next');

// const gee = require('./api/gee');

const port = parseInt(process.env.PORT, 10) || 3000;
const isDev = process.env.NODE_ENV !== 'production';

const app = next({ dev: isDev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // server.get('/api/gee/:imageId/:z/:x/:y', gee);
  server.get('/api/*', (req, res) => res.status(404).end());
  server.all('*', (req, res) => handle(req, res));

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
