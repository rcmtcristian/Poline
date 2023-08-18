const path = require("path"); //to access built-in path module
const webpack = require("webpack"); //to access built-in plugins

const CopyWebpackPlugin = require("copy-webpack-plugin"); // copy files from src to dist

const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // extract css to files

const IS_DEVELOPMENT = process.env.NODE_ENV === "dev"; // check if we are in dev mode
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin"); // minify images
const TerserPlugin = require("terser-webpack-plugin"); // minify js
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // clean dist folder

const dirApp = path.join(__dirname, "app"); // src directory
const dirShared = path.join(__dirname, "shared"); // favicons and stuff
const dirStyles = path.join(__dirname, "styles"); // styles directory
const dirNode = "node_modules";

module.exports = {
  entry: [path.join(dirApp, "index.js"), path.join(dirStyles, "index.scss")],
  resolve: {
    modules: [dirApp, dirShared, dirStyles, dirNode],
    extensions: [".ts", ".js", ".glsl"],
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT, //
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./shared",
          to: "",
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),

    new CleanWebpackPlugin(),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
            ],
          },
        },
      }),
      new TerserPlugin(),
    ],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },

      {
        test: /\.scss$/, // check for sass or css files
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "",
            },
          },
          {
            loader: "css-loader", // css-loader to resolve url() and @imports
          },
          {
            // postcss-loader to minify and autoprefix our css as well as prefixes css for browser compatibility
            loader: "postcss-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },

      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|webp|fnt)$/,
        loader: "file-loader",

        options: {
          name: "[path].[name].[hash].[ext]", // keep original file name to cache it or hash it for production    and so its not cached
          limit: 10000, // if less than 10 kb, add base64 encoded image to css
        },
      },

      {
        test: /\.(glsl|frag|vert)$/, // check for glsl, frag, vert files
        use: ["raw-loader", "glslify-loader"],
        exclude: /node_modules/,
      },
    ],
  },
};
