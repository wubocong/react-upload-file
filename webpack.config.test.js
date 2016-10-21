const path = require('path');

const config = {
  entry: [path.resolve(__dirname, 'test/index.js')],
  output: {
    path: path.resolve(__dirname, 'test'),
    filename: 'bundle.js',
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
  }
  ],
  resolve: {
    extensions: ['', '.js']
  }
};

module.exports = config;
