const webpack = require('webpack');
const { merge } = require('webpack-merge');

const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const helper = require('./helper');
const baseWebpackConfig = require('./webpack.base.conf.js');
const utils = require('./utils');

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: helper.TARGET.isDevelopment(),
      extract: true,
      usePostCSS: true,
    }),
  },
  plugins: [
    new OptimizeCSSPlugin({
      cssProcessorOptions: helper.TARGET.isDevelopment()
        ? { safe: true, map: { inline: false } }
        : { safe: true },
    }),
    new CleanWebpackPlugin({
      root: helper.PATHS.root,
      verbose: true,
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
});

if (!helper.TARGET.isDevelopment()) {
  webpackConfig.plugins.push(new TerserPlugin({
    parallel: true,
    terserOptions: {
      ecma: 6,
    },
  }));
}

module.exports = webpackConfig;
