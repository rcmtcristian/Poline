const path = require("path"); //to access built-in path module

const { merge } = require("webpack-merge"); // copy things declared in teh webpack config build

const config = require("./webpack.config"); //to access built-in plugins

/* The code is exporting a merged configuration object. It takes the existing `config` object and
merges it with the provided configuration object. The merged configuration object sets the mode to
"production" and specifies the output path as "public" using the `path.resolve()` method. */
module.exports = merge(config, {
  mode: "production",

  output: {
    path: path.resolve(__dirname, "public"),
  },
});
