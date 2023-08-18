const path = require("path"); //to access built-in path module

const { merge } = require("webpack-merge"); // copy things declared in teh webpack config build

const config = require("./webpack.config"); //to access built-in plugins

module.exports = merge(config, {
  mode: "production",

  output: {
    path: path.resolve(__dirname, "public"),
  },
});
