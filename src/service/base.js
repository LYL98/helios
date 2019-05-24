import { Config, Http } from '@/util';

export default {
    //获取七牛token
    qiniuUploadToken(data){
        return Http.get(Config.api.qiniuUploadToken, data);
    },
    //七牛上传base64图片
    qiniuUpBase64(data, callback){
        var url = Config.qiniuUpPath + "/putb64/20264";
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            if (xhr.readyState==4){
                typeof callback === 'function' && callback('ok', xhr.responseText);
            }else{
                typeof callback === 'function' && callback('fail', xhr.responseText);
            }
        }
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.setRequestHeader("Authorization", data.up_token);
        xhr.send(data.img_base64);
    },
    //上传文件到qiniu
    uploadToQiniu(data, callback){
        var xhr = new XMLHttpRequest();
        var formData = new FormData();
        formData.append('token',data.token);
        formData.append('key',data.key);
        formData.append("domain",Config.qiniuUpPath);
        formData.append('file', data.file);
        xhr.onreadystatechange = function (e) {
            if(xhr.readyState == 4){
                if(xhr.status == 200){
                    typeof callback=='function' && callback(xhr.responseText);
                }else {
                    typeof callback=='function' && callback({
                        code: 500,
                        message: '上传失败，请重试'
                    });
                }
            }
        };
        xhr.open('POST', Config.qiniuUpPath, false);
        xhr.send(formData);
    },

    //获取腾讯PresignedUrl
    tencentPresignedUrl(data){
        return Http.get(Config.api.tencentPresignedUrl, data);
    },
    //上传文件到tencent  data里要有，presigned_url，file
    uploadToTencent(data){
        return Http.put(data.presigned_url, data);
    },
    //省列表 (组件共用）
    baseProvinceList(data){
        return Http.get(Config.api.baseProvinceList, data);
    },
    //省列表(我的省列表)（全局省份）
    baseProvinceListMy(data){
        return Http.get(Config.api.baseProvinceListMy, data);
    },
    // 门店列表
    baseStoreList(data) {
      return Http.get(Config.api.baseStoreList, data);
    },
    //片区列表(有数据限权)
    baseZoneList(data){
        return Http.get(Config.api.baseZoneList, data);
    },
    //县区列表(有数据限权)
    baseCityList(data){
        return Http.get(Config.api.baseCityList, data);
    },
    //线路列表（组件共用）（运营时用）
    baseLineList(data){
        return Http.get(Config.api.baseLineList, data);
    },
    //线路列表（组件共用）(新增运营人员时用)
    baseLineListOperator(data){
        return Http.get(Config.api.baseLineListOperator, data);
    },
    //框列表（组件共用）
    baseFrameList(data){
        return Http.get(Config.api.baseFrameList, data);
    },
    //科学分类树型（组件共用）
    baseSystemClassListTree(data){
        return Http.get(Config.api.baseSystemClassListTree, data);
    },
    //科学分类列表（组件共用）
    baseSystemClassList(data){
        return Http.get(Config.api.baseSystemClassList, data);
    },
    //展示分类列表（组件共用）
    baseDisplayClassList(data){
        return Http.get(Config.api.baseDisplayClassList, data);
    },
    //商品标签接口（组件共用）
    baseItemTagsList(data){
        return Http.get(Config.api.baseItemTagsList, data);
    },
    //商户级别列表（组件共用）
    baseMerchantGradeList(data){
        return Http.get(Config.api.baseMerchantGradeList, data);
    },
    //商户内标签列表（组件共用）
    baseMerchantInnerTagsList(data){
        return Http.get(Config.api.baseMerchantInnerTagsList, data);
    },
    //商户外标签列表（组件共用）
    baseMerchantOuterTagsList(data){
        return Http.get(Config.api.baseMerchantOuterTagsList, data);
    },
    //采购员列表（组件共用）
    baseCommonBuyerList(data){
        return Http.get(Config.api.baseCommonBuyerList, data);
    },
    //配送人员列表（组件共用）
    baseDistributorList(data){
        return Http.get(Config.api.baseDistributorList, data);
    },
    //商品列表（组件共用）
    baseItemList(data){
      return Http.get(Config.api.baseItemList, data);
    },
    //商户列表（组件共用）
    baseMerchantList(data){
      return Http.get(Config.api.baseMerchantList, data);
    },
    // 供应商列表
    baseSupplierList(data) {
      return Http.get(Config.api.baseSupplierList, data);
    },
    // 供应商列表
    baseSupplierListSelect(data) {
      return Http.get(Config.api.baseSupplierListSelect, data);
    },
    //商品详情（组件共用）
    baseItemDetail(data){
      return Http.get(Config.api.baseItemDetail, data);
    },
    baseOrderShipList(data) {
      return Http.get(Config.api.baseOrderShipList, data)
    }
};
