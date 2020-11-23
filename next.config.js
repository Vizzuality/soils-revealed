const withSass = require('@zeit/next-sass');
const dotenv = require('dotenv').config();

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(
  withSass({
    env: {
      ...dotenv.parsed,
    },
  })
);
