const withSass = require('@zeit/next-sass');
const dotenv = require('dotenv').config();

module.exports = withSass({
  env: {
    ...dotenv.parsed,
  },
});
