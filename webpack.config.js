/** @format */

const path = require("path");
const webpack = require("webpack");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

require("dotenv").config();

module.exports = {
  entry: "./app/frontend/entry.js",
  output: {
    path: path.resolve(__dirname, "app/public"),
    publicPath: "app/public/",
    filename: "js/script.js",
  },
  node: { fs: "empty" },
  devtool: "inline-source-map",
  plugins: [
    new BrowserSyncPlugin({
      host: "localhost",
      port: process.env.BROWSER_SYNC_PORT,
      proxy: {
        target: "http://localhost:" + process.env.SERVER_PORT,
        ws: true,
      },
      https: false,
      reloadDelay: 1200,
      open: false,
    }),
    new webpack.ProvidePlugin({
      riot: "riot",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.riot$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "@riotjs/webpack-loader",
            options: {
              hot: true,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
