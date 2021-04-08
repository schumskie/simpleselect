const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = (env, argv) => {
  const isDev = argv.mode === "development";

  return {
    entry: isDev ? "./src/test.js" : "./src/index.js",
    output: {
      filename: `simpleselect.js`,
      library: isDev ? undefined : "SimpleSelect", // Important
      libraryTarget: isDev ? undefined : "umd", // Important
      path: path.resolve(__dirname, "dist"),
    },
    devtool: isDev ? "inline-source-map" : false,
    module: {
      rules: [
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
        {
          test: /\.css$/i,
          use: [
            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
          ],
        },
      ],
    },
    devServer: {
      contentBase: "./dist",
      compress: true,
    },
    plugins: [
      new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
      new MiniCssExtractPlugin({
        filename: `simpleselect.css`,
      }),
      new HtmlWebpackPlugin({
        title: "Simple Select",
        template: "src/index.html",
      }),
    ],
  };
};
