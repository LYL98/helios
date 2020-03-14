const os = require('os');

const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const configBase = require('./configBase');
const outputDir = configBase.BuildOutputDir || 'dist';

module.exports = {
  outputDir: outputDir,
  productionSourceMap: false,
  chainWebpack: config => {
    config.module.rule('js').uses.clear();
    config.module.rule('js')
      .test(/(\.js?$)|(\.jsx?$)/)
      .use('happypack/loader?id=happy-babel')
      .loader('happypack/loader?id=happy-babel');
    config.module.rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.loaders = {
          js: 'happypack/loader?id=happy-babel'
        }
        return options
      })
  },
  configureWebpack: {
    resolve: {
      mainFields: ['main'], // 只采用main字段作为入口文件描述字段，减少搜索步骤
    },
    optimization: {
      minimize: process.env.NODE_ENV === 'production' ? true : false, // 开发环境不压缩
      splitChunks: {
        chunks: "async", // 共有三个值可选：initial(初始模块)、async(按需加载模块)和all(全部模块)
        minSize: 30000, // 模块超过30k自动被抽离成公共模块
        minChunks: 1, // 模块被引用>=1次，便分割
        maxAsyncRequests: 5,  // 异步加载chunk的并发请求数量<=5
        maxInitialRequests: 3, // 一个入口并发加载的chunk数量<=3
        name: true, // 默认由模块名+hash命名，名称相同时多个模块将合并为1个，可以设置为function
        automaticNameDelimiter: '~', // 命名分隔符
        cacheGroups: { // 缓存组，会继承和覆盖splitChunks的配置
          default: {
            minChunks: 2, // 模块被引用>=2次，拆分至vendors公共模块
            priority: -20, // 优先级
            reuseExistingChunk: true, // 默认使用已有的模块
          },
          vendors: {
            name: "chunk.vendors",
            test: /[\/]node_modules[\/]/, // 表示默认拆分node_modules中的模块
            priority: -10
          },
          element: {
            name: "chunk.element", // 单独将 elementUI 拆包
            priority: 15, // 权重需大于其它缓存组
            test: /[\/]node_modules[\/]element-ui[\/]/
          },
          echarts: {
            name: "chunk.echarts",
            priority: 15,
            test: /([\/]node_modules[\/]echarts[\/]lib)|([\/]node_modules[\/]zrender[\/]lib)/
          },
        }
      }
    },
    plugins: [
      // 生产环境下: 1、显示打包进度条，2、打包结束后，替换之前的打包文件
      ...(process.env.NODE_ENV === 'production' ? [
        new WebpackBar(),
        new CleanWebpackPlugin([outputDir], {
          allowExternal: true,
          beforeEmit: true
        }),
      ] : []),

      // 引入dll文件的依赖
      new webpack.DllReferencePlugin({
        manifest: require("./public/dll/dll.core.manifest.json")
      }),

      // 将dll文件自动添加到html文件中
      new HtmlIncludeAssetsPlugin({
        assets: ['dll/dll.core.js'], // 添加的资源相对html的路径
        append: false // false 在其他资源的之前添加 true 在其他资源之后添加
      }),
      // 使用happypack 加速 babel-loader打包速度
      new HappyPack({
        id: 'happy-babel',
        loaders: [{
          loader: 'babel-loader',
          options: {
            babelrc: true,
            cacheDirectory: true // 启用缓存
          }
        }],
        threadPool: happyThreadPool,
        verbose: false
      }),
    ]
  },
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        data: '@import "./main.scss";'
      }
    }
  },
}
