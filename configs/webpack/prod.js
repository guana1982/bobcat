// production config
const merge = require('webpack-merge');
const {resolve} = require('path');
const webpack = require('webpack');
const commonConfig = require('./common');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const VENDOR = process.env.INTELLITOWER_VENDOR || 'pepsi';
const VERSION = process.env.INTELLITOWER_VERSION || 'v.lean2';
const MEDIUMLEVEL_URL = process.env.INTELLITOWER_MEDIUMLEVEL_URL || 'http://93.55.118.43:5900/api/v0';

module.exports = merge(commonConfig, {
  mode: 'production',
  entry: './index.tsx',
  output: {
    filename: './js/bundle.[hash].min.js',
    path: resolve(__dirname, '../../dist'),
    publicPath: './',
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.INTELLITOWER_VENDOR': JSON.stringify(VENDOR),
      'process.env.INTELLITOWER_VERSION': JSON.stringify(VERSION),
      'process.env.INTELLITOWER_MEDIUMLEVEL_URL': JSON.stringify(MEDIUMLEVEL_URL)
    }),
    new CopyWebpackPlugin([
      { from: '../public', to: '' }
    ])
  ],
});
