// sha config (dev and prod)
const { resolve } = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const cssOptions = {
  modules: true,
  namedExport: true,
  camelCase: true
}

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  context: resolve(__dirname, '../../src'),
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader', 'source-map-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'awesome-typescript-loader'],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', 
          { 
            loader: 'css-loader'
            // loader: 'typings-for-css-modules-loader', 
            // options: cssOptions
          }
        ],
      },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader', 
          { 
            loader: 'typings-for-css-modules-loader', 
            options: cssOptions
          },
          'sass-loader',
        ],
      },
      // {
      //   test: /\.(eot|otf|ttf|woff|woff2)$/,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         outputPath: 'fonts/'
      //       }
      //     }
      //   ]
      // },
      // {
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   loaders: [
      //     'file-loader?hash=sha512&digest=hex&name=img/[hash].[ext]',
      //     'image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false',
      //   ],
      // }
    ],
  },
  plugins: [
    new CheckerPlugin(),
    new HtmlWebpackPlugin({template: 'index.html.ejs',}),
  ],
  performance: {
    hints: false,
  },
};
