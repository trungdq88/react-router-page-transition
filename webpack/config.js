var path = require('path');
var util = require('util');
var autoprefixer = require('autoprefixer');
var pkg = require('../package.json');

var loaders = require('./loaders');
var plugins = require('./plugins');

var DEBUG = process.env.NODE_ENV === 'development';
var TEST = process.env.NODE_ENV === 'test';

var jsBundle = util.format('[name]/app.%s.js', pkg.version);

var entry = {
  simple: ['./simple/js/App.jsx'],
  material: ['./material/js/App.jsx'],
  reveal: ['./reveal/js/App.jsx'],
};

if (DEBUG) {
  Object.keys(entry).forEach(app => {
    entry[app].push(
      util.format(
        'webpack-dev-server/client?http://%s:%d',
        pkg.config.devHost,
        pkg.config.devPort
      )
    );
    entry[app].push('webpack/hot/dev-server');
  });
}

var config = {
  context: path.join(__dirname, '../examples'),
  cache: DEBUG,
  debug: DEBUG,
  target: 'web',
  devtool: DEBUG || TEST ? 'inline-source-map' : false,
  entry: entry,
  output: {
    path: path.resolve(pkg.config.buildDir),
    publicPath: '/',
    filename: jsBundle,
    pathinfo: false
  },
  module: {
    loaders: loaders
  },
  postcss: [
    autoprefixer
  ],
  plugins: plugins,
  resolve: {
    extensions: ['', '.js', '.json', '.jsx']
  },
  devServer: {
    contentBase: path.resolve(pkg.config.buildDir),
    headers: { "Access-Control-Allow-Origin": "*" },
    hot: true,
    noInfo: false,
    inline: true,
    stats: { colors: true }
  }
};

module.exports = config;
