const path = require('path')

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  mode: 'development', // change to 'production' for production builds
  devtool: 'source-map',
  resolve: {
    extensions: ['.js'],
  },
}