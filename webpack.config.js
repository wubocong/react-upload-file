const path = require('path');
const webpack = require('webpack');

const entry = [path.resolve(__dirname, 'src/index.js')];

const sharedConfig = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'react-upload-file',
    libraryTarget: 'umd'
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

const devBundleConfig = Object.assign({}, sharedConfig, {
  entry: {
    index: entry
  }
});

const prodBundleConfig = Object.assign({}, sharedConfig, {
  entry: {
    'index.min': entry
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ]
});

module.exports = [
  devBundleConfig,
  prodBundleConfig
];
