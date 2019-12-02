'use strict';

const path = require('path');
const resolve = require('resolve');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');

const getClientEnvironment = require('../general/env');
const paths = require('../general/paths');

const env = getClientEnvironment('');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: [
    require.resolve('react-dev-utils/webpackHotDevClient'),
    paths.appIndexJs,
  ],
  output: {
    pathinfo: true,
    filename: 'static/js/bundle.js',
    futureEmitAssets: true,
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: '',
    devtoolModuleFilenameTemplate: ((info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
  },
  devServer: {
    clientLogLevel: 'silent',
    compress: true,
    historyApiFallback: { disableDotRule: true },
    host: process.env.HOST,
    hot: true,
    open: true,
    overlay: false,
    port: process.env.PORT || 3000,
    publicPath: '/',
    quiet: true,
    stats: 'errors-only',
    before(app) {
      app.use(errorOverlayMiddleware());
      app.use(noopServiceWorkerMiddleware());
    },
  },
  plugins: [
    new HtmlWebpackPlugin({ inject: true, template: paths.appHtml }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
    new webpack.DefinePlugin(env.stringified),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ForkTsCheckerWebpackPlugin({
      typescript: resolve.sync('typescript', { basedir: paths.appNodeModules }),
      async: true,
      useTypescriptIncrementalApi: true,
      checkSyntacticErrors: true,
      tsconfig: paths.appTsConfig,
      reportFiles: [
        '**',
        '!**/__tests__/**',
        '!**/?(*.)(spec|test).*',
        '!**/src/setupProxy.*',
        '!**/src/setupTests.*',
      ],
      watch: paths.appSrc,
      silent: true,
    }),
  ],
  node: {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    http2: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  performance: false,
};
