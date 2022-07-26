/* global __dirname, require, module*/

const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2
const pkg = require('./package.json');

let libraryName = pkg.name;

let plugins = [], outputFile;

if (env === 'build') {
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}

const config = {
  entry: __dirname + '/lib.js',
  mode: "production",
  output: {
    path: __dirname + '/lib',
    filename: outputFile,
    library: {
      type: "module"
    },
  },
  // module: {
  //   rules: [
      // {
      //   test: /(\.jsx|\.js)$/,
      //   loader: 'babel-loader',
      //   exclude: /(node_modules|bower_components)/
      // }
    // ]
  // },
  resolve: {
    // modules: [path.resolve('./node_modules'), path.resolve('./lib')],
    // extensions: ['.json', '.js'],
    fallback: {
      fs: false,
      module: false
    }
  },
  // plugins: plugins,
  optimization: {
    minimize: false,
  //   minimizer: [new TerserPlugin()]
  },
  experiments: {
    outputModule: true
  }
};

module.exports = config;
