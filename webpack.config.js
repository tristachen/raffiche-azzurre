const path              = require('path');
const fs                = require('fs');
const webpack           = require('webpack');
const webpackMerge      = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDevServer  = require('webpack-dev-server');
const nib               = require('nib');

const entry = {};
const files = fs.readdirSync('./scripts/views/');
files.forEach(function(file) {
  if (path.extname(file) === '.js') {
    const basename = path.basename(file, '.js');
    entry[basename] = path.resolve(__dirname, 'scripts/views/' + basename);
  }
});

const config = {
  base: {
    entry: entry,
    output: {
      path: path.resolve(__dirname, 'ra/assets'),
      filename: '[name].js'
    },
    module: {
      rules: [{
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: {
          loader: 'url-loader',
          options: { limit: 100000 }
        },
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      }, {
        test: /\.json$/,
        use: 'json-loader'
      }]
    },
    plugins: [
      new ExtractTextPlugin('content.css')
    ]
  },





  /**
   *
   * dev config
   *
   */
  dev: {
    module: {
      rules: [{
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true
            }
          }, {
            loader: 'stylus-loader',
            options: {
              use: [nib()],
              import: ['~nib/lib/nib/index.styl'],
              sourceMap: true
            }
          }]
        })
      }]
    },
    devServer: {
      contentBase: path.join(__dirname, 'ra'),
      compress: true,
      port: 9000
    },
    devtool: 'sourcemap'
  },





  /**
   *
   * prod config
   *
   */
  prod: {
    module: {
      rules: [{
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              minimize: true
            }
          }, {
            loader: 'stylus-loader',
            options: {
              use: [nib()],
              import: ['~nib/lib/nib/index.styl']
            }
          }]
        })
      }]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: true,
        }
      })
    ]
  }
};

module.exports = function buildConfig(env) {
  return webpackMerge(config.base, config[env]);
};
