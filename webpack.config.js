const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer');
//config
const ROOT_DIR = __dirname;
const CLIENT_CONFIGS_DIR = path.resolve(ROOT_DIR, "./config");
const CONFIG_NAME = (process.env.CONFIG_NAME = process.env.CONFIG_NAME.trim());

function getJSONConfig() {
  let commonConfig = require(CLIENT_CONFIGS_DIR + "/common.json");
  let configPath = require(CLIENT_CONFIGS_DIR + "/" + CONFIG_NAME + ".json");
  return Object.assign(commonConfig, configPath);
}

const JSON_CONFIG = getJSONConfig();
const isDevelopment = process.env.WEBPACK_DEV_SERVER === "true";
const buildType = process.env.BUILD_TYPE || 'app';

module.exports = {
  entry: buildType === 'package' ? './src/package/index.js' : './src/app/index.jsx',
  output: {
    path: path.join(ROOT_DIR, buildType === 'package' ? '/package' : '/docs'),
    publicPath: JSON_CONFIG.publicPath,
    filename: "bundle.js",
    libraryTarget: buildType === 'app' ? 'umd' : 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: 'postcss-loader',
            options: {
                plugins: [
                    autoprefixer()
                ],
                sourceMap: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              includePaths: ["absolute/path/a", "absolute/path/b"]
            }
          }
        ]
      },
      {
        test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
        loader: "file-loader?name=[name].[ext]",
        options: {
          outputPath: 'media',
        },
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
  }
};

if(buildType === 'app'){
  module.exports.plugins = [
    new HtmlWebpackPlugin({
      template: "./src/app/index.html",
      APP_CONFIG: JSON.stringify(JSON_CONFIG),
      title: JSON_CONFIG.name
    })
  ]
}