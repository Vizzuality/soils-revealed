const withSass = require('@zeit/next-sass');
const dotenv = require('dotenv').config();
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(
  withSass({
    env: {
      ...dotenv.parsed,
    },
    webpack: config => {
      config.plugins.push(new MomentLocalesPlugin());

      return config;
    },
  })
);
