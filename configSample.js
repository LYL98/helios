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
     * 资源上传地址
     * 华东地址：up.qiniu.com、up-z0.qiniu.com、upload.qiniu.com
     * 华南地址：up.qiniup.com
     */
    TencentUpPath = 'https://up.qiniup.com',

    /**
     * 资源下载地址
     * 测试：https://cdn-xxx-dev.xxx.xxx/
     * 生产：https://cdn-xxx-pro.xxx.xxx/
     */
    TencentPath = 'https://cdn-xxx-dev.xxx.xxx/',

    //构建后文件目录
    BuildOutputDir: '../dist'
}