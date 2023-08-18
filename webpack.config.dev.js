const { merge } = require("webpack-merge"); // copy things declared in teh webpack config build

const path = require("path"); //to access built-in path module
const config = require("./webpack.config"); //to access built-in plugins

module.exports = merge(config, {
  mode: "development",

  devtool: "source-map",

  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
  },

  output: {
    path: path.resolve(__dirname, "public"),
  },
});
