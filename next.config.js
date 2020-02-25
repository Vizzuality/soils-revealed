const webpack = require('webpack');
const withSass = require('@zeit/next-sass');
const withImages = require('next-images');

module.exports = withSass(
  withImages({
    webpack(config) {
      const newConfig = Object.assign({}, config);
      const envs = [{ name: 'NODE_ENV', default: 'development' }, 'API_URL'];
      const definePluginOptions = {};

      envs.forEach(e => {
        const envName = typeof e === 'object' ? e.name : e;
        const envValue = process.env[envName] || (typeof e === 'object' ? e.default : undefined);
        definePluginOptions[`process.env.${envName}`] = JSON.stringify(envValue);
      });

      // @ts-ignore
      newConfig.plugins.push(new webpack.DefinePlugin(definePluginOptions));

      newConfig.module.rules.push({
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
            name: '[name].[ext]',
          },
        },
      });

      return newConfig;
    },
  })
);
