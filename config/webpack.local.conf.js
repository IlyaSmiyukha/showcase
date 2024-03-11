const utils = require("./utils");
const {merge} = require("webpack-merge");

const helper = require('./helper');

const WriteFilePlugin = require("write-file-webpack-plugin");

const baseWebpackConfig = require("./webpack.base.conf.js");

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: true,
      usePostCSS: true
    })
  },
  devtool: helper.DEVTOOL,
});

devWebpackConfig.plugins.push(new WriteFilePlugin());

module.exports = devWebpackConfig;
