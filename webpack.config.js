const path              = require('path');
const webpack           = require('webpack');
const webpackMerge      = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDevServer  = require('webpack-dev-server');
const nib               = require('nib');

const config = {
  base: {
    entry: {
      'home': path.resolve(__dirname, 'scripts/views/home.js'),
      'players': path.resolve(__dirname, 'scripts/views/players.js'),
      'info-player': path.resolve(__dirname, 'scripts/views/info-player.js'),
      'info-team': path.resolve(__dirname, 'scripts/views/info-team.js'),
      'info-team-parade': path.resolve(__dirname, 'scripts/views/info-team-parade.js'),
      'info-match': path.resolve(__dirname, 'scripts/views/info-match.js'),
      'facilities-trainer': path.resolve(__dirname, 'scripts/views/facilities-trainer.js'),
      'facilities-youth': path.resolve(__dirname, 'scripts/views/facilities-youth.js'),
      'facilities-players': path.resolve(__dirname, 'scripts/views/facilities-players.js'),
      'facilities-transferlist': path.resolve(__dirname, 'scripts/views/facilities-transferlist.js'),
      'leauge-results': path.resolve(__dirname, 'scripts/views/leauge-results.js'),
      'friendlies': path.resolve(__dirname, 'scripts/views/friendlies.js'),
      'matches': path.resolve(__dirname, 'scripts/views/matches.js'),
      'challenge': path.resolve(__dirname, 'scripts/views/challenge.js'),
      'messages': path.resolve(__dirname, 'scripts/views/messages.js')
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
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
      contentBase: path.join(__dirname, 'dist'),
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
