// production config
const merge = require('webpack-merge');
const {resolve} = require('path');
const webpack = require('webpack');
const commonConfig = require('./common');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const VENDOR = process.env.INTELLITOWER_VENDOR || 'pepsi';
const VERSION = process.env.INTELLITOWER_VERSION || 'v.lean2';
const MEDIUMLEVEL_URL = process.env.INTELLITOWER_MEDIUMLEVEL_URL || 'http://0.0.0.0:5900/api/v0';

module.exports = merge(commonConfig, {
  mode: 'production',
  entry: './index.tsx',
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        test: /\.js(\?.*)?$/i,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          warnings: false,
          ie8: false,
          compress: {
            drop_console: false // true, => Temporarily disabled
          },
        },
      }),
    ],
  },
  output: {
    filename: './js/bundle.[hash].min.js',
    path: resolve(__dirname, '../../build'),
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
