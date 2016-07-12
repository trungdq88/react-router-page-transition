var pkg = require('../package.json');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var ENV = process.env.NODE_ENV || 'production';

var fileLoader = 'file-loader?name=assets/[name].[ext]';
var cssLoader;
var jsxLoader = [];
var htmlLoader = [
  'file-loader?name=[path][name].[ext]',
  'template-html-loader?' + [
    'raw=true',
    'engine=lodash',
    'version=' + pkg.version,
    'title=' + pkg.name,
    'environment=' + ENV,
  ].join('&')
].join('!');

if (ENV === 'development') {
  jsxLoader.push('react-hot');
  cssLoader = [
    'style-loader',
    'css-loader?sourceMap&localIdentName=[name]__[local]___[hash:base64:5]',
    'postcss-loader'
  ].join('!');
} else {
  cssLoader = ExtractTextPlugin.extract('style-loader', [
    'css-loader?localIdentName=[hash:base64:5]',
    'postcss-loader'
  ].join('!'));
}

jsxLoader.push('babel');

var loaders = [
  {
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components)/,
    loaders: jsxLoader 
  },
  { test: /\.css$/, loader: cssLoader /* "style-loader!css-loader" */ },
  { test: /\.png$/, loader: "url-loader?limit=100000" },
  {
    test: /\.html$/,
    loader: htmlLoader
  },
  {
    test: /(\.jpe?g|\.gif|\.png|\.ico|\.csv)(\?\S*)?/,
    loader: fileLoader
  },
  {
    test: /\.less$/,
    loader: "style!css!less"
  }
];
module.exports = loaders;
