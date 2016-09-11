module.exports = {
  entry: "./js/app.js",
  output: {
    filename: "./js/bundle.js"
  },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
}
