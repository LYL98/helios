/***
 * 修改基础配置
 * @author epo
 * @created 2018-12-07
 */
module.exports = {
    /**
     * api地址
     * 测试：https://xxxdev.xxx.xxx
     * 生产：https://xxx.xxx.xxx
     */
    RequestHttp: 'https://xxxdev.xxx.xxx',

    /**
     * 七牛上传地址
     * 华东地址：up.qiniu.com、up-z0.qiniu.com、upload.qiniu.com
     * 华南地址：up.qiniup.com
     */
    QiniuUpPath: 'https://up.qiniup.com',

    /**
     * 七牛下载地址
     * 测试：https://static-dev.xxx.xxx/
     * 生产：https://static-pro.xxx.xxx/
     */
    QiniuPath: 'https://static-dev.xxx.xxx/',

    //是否打印网络请求日志
    IsPrintRequestLog: false,

    //构建后文件目录
    BuildOutputDir: '../dist'
}