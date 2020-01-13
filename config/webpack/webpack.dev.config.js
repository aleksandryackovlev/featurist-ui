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
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

const createMiddleware = require('./createMiddleware');

const getClientEnvironment = require('../general/env');
const paths = require('../general/paths');

const env = getClientEnvironment('');

const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000', 10);

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: [require.resolve('react-dev-utils/webpackHotDevClient'), paths.appIndexJs],
  output: {
    pathinfo: true,
    filename: 'static/js/bundle.js',
    futureEmitAssets: true,
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: '',
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
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

      app.use(
        '/api',
        createMiddleware({
          file: path.resolve(__dirname, '../../src/api/petstore.yaml'),
        })
      );
    },
  },
  resolve: {
    modules: ['node_modules', paths.appNodeModules],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
  },
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: imageInlineSizeLimit,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.tsx?$/,
            loader: require.resolve('ts-loader'),
            options: {
              transpileOnly: true,
              configFile: paths.appTsConfig,
            },
          },
          {
            test: /\.css$/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 2,
                  sourceMap: true,
                  modules: true,
                  getLocalIdent: getCSSModuleLocalIdent,
                },
              },
              {
                loader: require.resolve('sass-loader'),
                options: {
                  sourceMap: true,
                },
              },
            ],
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
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
