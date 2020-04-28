const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const isDev = process.env.NODE_ENV !== 'production';

const app = next({ dev: isDev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all('*', (req, res) => handle(req, res));

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
