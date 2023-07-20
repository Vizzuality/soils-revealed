const pino = require('pino');

const logger = pino({
  browser: {},
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

module.exports = logger;
