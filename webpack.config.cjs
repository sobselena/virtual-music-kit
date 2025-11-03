const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = (env, options) => {
  const isProduction = options.mode === "production";

  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'source-map',
    watch: !isProduction,
    entry: ['./src/index.js', './src/sass/style.scss'],
    output: {
      path: path.join(__dirname, '/dist'),
      filename: 'script.js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: "defaults" }]
              ]
            }
          }
        }, {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'
          ]
        },
        {
        test: /\.html$/,
        loader: "html-loader",
      },
        {
  test: /\.(png|svg|jpe?g|gif|mp3)$/i,
  type: 'asset/resource',
  generator: {
    filename: 'assets/[name][ext]'
  }
}
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: 'index.html'
      }),
      new MiniCssExtractPlugin({
        filename: 'style.css'
      }),   new CopyWebpackPlugin({
      patterns: [
      { from: "src/assets/audio", to: "assets/audio" }
    ]
  })
    ]
  };
};
