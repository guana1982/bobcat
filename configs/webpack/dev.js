// development config
const merge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./common');

const VENDOR = process.env.INTELLITOWER_VENDOR || 'pepsi';
const VERSION = process.env.INTELLITOWER_VERSION || 'v.lean2';
const MEDIUMLEVEL_URL = process.env.INTELLITOWER_MEDIUMLEVEL_URL || 'http://172.20.10.2:5900/api/v0'; // 'http://93.55.118.44:5900/api/v0' - 'http://2.34.152.134:5900/api/v0';

module.exports = merge(commonConfig, {
  mode: 'development',
  entry: [
    'react-hot-loader/patch', // activate HMR for React
    'webpack-dev-server/client?http://0.0.0.0:8080',// bundle the client for webpack-dev-server and connect to the provided endpoint
    'webpack/hot/only-dev-server', // bundle the client for hot reloading, only- means to only hot reload for successful updates
    './index.tsx' // the entry point of our app
  ],
  devServer: {
    contentBase: './public/',
    hot: true, // enable HMR on the server
    host: '0.0.0.0',
    port: 8080,
    open: true,
    historyApiFallback: true,
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // enable HMR globally
    new webpack.NamedModulesPlugin(), // prints more readable module names in the browser console on HMR updates
    new webpack.DefinePlugin({
      'process.env.INTELLITOWER_VENDOR': JSON.stringify(VENDOR),
      'process.env.INTELLITOWER_VERSION': JSON.stringify(VERSION),
      'process.env.INTELLITOWER_MEDIUMLEVEL_URL': JSON.stringify(MEDIUMLEVEL_URL),
    }),
  ],
});
