var Path = require('path');

var Clean = require('clean-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var Webpack = require('webpack');

var Rupture = require('rupture');
var AutoPrefixer = require('autoprefixer-stylus');

var jadeExtract = new ExtractTextPlugin('index.html');
var plugins = [jadeExtract];

plugins.push(new Webpack.optimize.UglifyJsPlugin({
  compress: {
      warnings: false
  }
}));
plugins.push(new Clean(['build']));
plugins.push(new Webpack.optimize.OccurenceOrderPlugin(true));


module.exports = {
  context: Path.join(process.cwd(), 'assets'),
  entry: {
    main: ['./views/index', './style/main']
  },
  output: {
    path: './build',
    filename: '[name].js'
  },
  module: {
    loaders: [{
      test: /\.styl$/,
      include: Path.resolve(process.cwd(), 'assets'),
      loader: 'style!css!stylus?paths=node_modules/jeet/stylus/'
    }, {
      test: /\.jade$/,
      include: Path.resolve(process.cwd(), 'assets'),
      loader: jadeExtract.extract('html!jade-html')
    }]
  },
  resolve: {
    extensions: ['', '.js', '.styl', '.jade'],
    modulesDirectories: ['node_modules']
  },
  stylus: {
    use: [Rupture(), AutoPrefixer()]
  },
  plugins: plugins
};
