const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');
const { ContextReplacementPlugin } = require('webpack');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  lintOnSave: false,
  outputDir: 'dist',
  devServer: {
    open: true,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  filenameHashing: true,
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/assets/admin' : '/',
  configureWebpack: config => {
    const plugins = [new ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/)];

    if (process.env.BUNDLE_ANALYZER === 'YES') {
      plugins.push(new BundleAnalyzerPlugin());
    }

    config.plugins = [...config.plugins, ...plugins];
  },
  chainWebpack: config => {
    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            inline: /runtime\..*\.js$/
          }
        ])
        .end();

      config.optimization.runtimeChunk('single');
    });
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
    config.optimization.splitChunks({
      chunks: 'all',
      maxInitialRequests: 4,
      minSize: 0,
      cacheGroups: {
        leadshop: {
          name: 'chunk-leadshop',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial'
        },
        elementUi: {
          name: 'chunk-elementUi',
          test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
          priority: 20
        },
        echarts: {
          name: 'chunk-echarts',
          test: /[\\/]node_modules[\\/]_?echarts(.*)/,
          priority: 20
        },
        common: {
          name: 'chunk-commom',
          test: resolve('src/components'),
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    });
  }
};
