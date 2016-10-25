const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require("webpack-dev-server");
const port = process.env.PORT || 8010;

const config = {
  entry: [`webpack-dev-server/client?http://localhost:${port}/`, 'babel-polyfill', path.resolve(__dirname, 'test/index.js')],
  output: {
    path: path.resolve(__dirname, 'test/'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015', 'stage-0']
      }
    }]
  },
  externals: [{
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    }
  }],
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
  },
};

const compiler = webpack(config);
const server = new WebpackDevServer(compiler, {
  contentBase: path.resolve(__dirname, 'test')
});

server.listen(port);