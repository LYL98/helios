const webpack = require("webpack");
const path = require('path');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const dllPath = path.resolve(__dirname, "./public/dll"); // dll文件存放的目录

module.exports = {
  mode: 'production',
  entry: {
    // 把 vue 相关模块的放到一个单独的动态链接库
    core: [
      "vue/dist/vue.runtime.esm.js",
      "vue-resource/dist/vue-resource.common.js",
      "vue-router/dist/vue-router.common.js",
      "vuex/dist/vuex.common.js",
      "vue-quill-editor",
      "vuedraggable",
      "md5",
      "core-js"
    ]
  },
  output: {
    filename: "dll.[name].js", // 生成vue.dll.js
    path: dllPath,
    library: "_dll_[name]"
  },
  plugins: [
    new CleanWebpackPlugin([dllPath]),
    new webpack.DllPlugin({
      name: "_dll_[name]",
      // manifest.json 描述动态链接库包含了哪些内容
      path: path.join(__dirname, "./public/dll", "dll.[name].manifest.json")
    }),
  ],
};
