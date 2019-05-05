import { Config, Request } from '@/util';

export default {
    //商品框列表
    basicdataFrameList(data){
        return Request.requestGet(Config.api.basicdataFrameList, data);
    },
    //商品框信息添加
    basicdataFrameAdd(data){
        return Request.requestPost(Config.api.basicdataFrameAdd, data);
    },
    //商品框信息修改
    basicdataFrameEdit(data){
        return Request.requestPost(Config.api.basicdataFrameEdit, data);
    },
    //商品框信息删除
    basicdataFrameDelete(data){
        return Request.requestPost(Config.api.basicdataFrameDelete, data);
    },

    //商品标签新增
    basicdataItemTagsAdd(data){
        return Request.requestPost(Config.api.basicdataItemTagsAdd, data);
    },
    //商品标签修改
    basicdataItemTagsEdit(data){
        return Request.requestPost(Config.api.basicdataItemTagsEdit, data);
    },
    //商品标签列表
    basicdataItemTagsList(data){
        return Request.requestGet(Config.api.basicdataItemTagsList, data);
    },
    //商品标签删除
    basicdataItemTagsDelete(data){
        return Request.requestPost(Config.api.basicdataItemTagsDelete, data);
    },
    //默认icons
    basicdataItemTagsIcons(data) {
        return Request.requestGet(Config.api.basicdataItemTagsIcons, data);
    },
    //icons详情
    basicdataItemTagsDetail(data) {
        return Request.requestGet(Config.api.basicdataItemTagsDetail, data);
    },
    //商品展示分类列表
    basicdataDisplayClassList(data){
        return Request.requestGet(Config.api.basicdataDisplayClassList, data);
    },
    //商品展示分类新增
    basicdataDisplayClassAdd(data){
        return Request.requestPost(Config.api.basicdataDisplayClassAdd, data);
    },
    //商品展示分类修改
    basicdataDisplayClassEdit(data){
        return Request.requestPost(Config.api.basicdataDisplayClassEdit, data);
    },
    //商品展示分类删除
    basicdataDisplayClassDelete(data){
        return Request.requestPost(Config.api.basicdataDisplayClassDelete, data);
    },
    //商品科学分类列表(树型)
    basicdataSystemClassListTree(data){
        return Request.requestGet(Config.api.basicdataSystemClassListTree, data);
    },
    //商品科学分类新增
    basicdataSystemClassAdd(data){
        return Request.requestPost(Config.api.basicdataSystemClassAdd, data);
    },
    //商品科学分类修改
    basicdataSystemClassEdit(data){
        return Request.requestPost(Config.api.basicdataSystemClassEdit, data);
    },
    //商品科学分类删除
    basicdataSystemClassDelete(data){
        return Request.requestPost(Config.api.basicdataSystemClassDelete, data);
    },
    //省新增
    basicdataProvinceAdd(data){
        return Request.requestPost(Config.api.basicdataProvinceAdd, data);
    },
    //省修改
    basicdataProvinceEdit(data){
        return Request.requestPost(Config.api.basicdataProvinceEdit, data);
    },
    //省列表
    basicdataProvinceList(data){
        return Request.requestGet(Config.api.basicdataProvinceList, data);
    },
    //省删除
    basicdataProvinceDelete(data){
        return Request.requestPost(Config.api.basicdataProvinceDelete, data);
    },
    //片区新增
    basicdataZoneAdd(data){
        return Request.requestPost(Config.api.basicdataZoneAdd, data);
    },
    //片区修改
    basicdataZoneEdit(data){
        return Request.requestPost(Config.api.basicdataZoneEdit, data);
    },
    //片区列表
    basicdataZoneList(data){
        return Request.requestGet(Config.api.basicdataZoneList, data);
    },
    //片区删除
    basicdataZoneDelete(data){
        return Request.requestPost(Config.api.basicdataZoneDelete, data);
    },
    //县区新增
    basicdataCityAdd(data){
        return Request.requestPost(Config.api.basicdataCityAdd, data);
    },
    //县区修改
    basicdataCityEdit(data){
        return Request.requestPost(Config.api.basicdataCityEdit, data);
    },
    //县区列表
    basicdataCityList(data){
        return Request.requestGet(Config.api.basicdataCityList, data);
    },
    //县区删除
    basicdataCityDelete(data){
        return Request.requestPost(Config.api.basicdataCityDelete, data);
    },
    //商户内标签
    basicdataMerchantInnerTagsList(data){
        return Request.requestGet(Config.api.basicdataMerchantInnerTagsList, data);
    },
    //商户内标签新增
    basicdataMerchantInnerTagsAdd(data){
        return Request.requestPost(Config.api.basicdataMerchantInnerTagsAdd, data);
    },
    //商户内标签修改
    basicdataMerchantInnerTagsEdit(data){
        return Request.requestPost(Config.api.basicdataMerchantInnerTagsEdit, data);
    },
    //商户内标签删除
    basicdataMerchantInnerTagsDelete(data){
        return Request.requestPost(Config.api.basicdataMerchantInnerTagsDelete, data);
    },
    //商户外标签
    basicdataMerchantOuterTagsList(data){
        return Request.requestGet(Config.api.basicdataMerchantOuterTagsList, data);
    },
    //商户外标签新增
    basicdataMerchantOuterTagsAdd(data){
        return Request.requestPost(Config.api.basicdataMerchantOuterTagsAdd, data);
    },
    //商户外标签修改
    basicdataMerchantOuterTagsEdit(data){
        return Request.requestPost(Config.api.basicdataMerchantOuterTagsEdit, data);
    },
    //商户外标签删除
    basicdataMerchantOuterTagsDelete(data){
        return Request.requestPost(Config.api.basicdataMerchantOuterTagsDelete, data);
    },
    //商户等级列表
    basicdataGradeList(data){
        return Request.requestGet(Config.api.basicdataGradeList, data);
    },
    //商户级别添加
    basicdataGradeAdd(data){
        return Request.requestPost(Config.api.basicdataGradeAdd, data);
    },
    //商户级别修改
    basicdataGradeEdit(data){
        return Request.requestPost(Config.api.basicdataGradeEdit, data);
    },
    //商户等级删除
    basicdataGradeDelete(data){
        return Request.requestPost(Config.api.basicdataGradeDelete, data);
    },
    // 获取统一描述
    basicdataGetCommonDescription(data){
        return Request.requestGet(Config.api.basicdataGetCommonDescription, data);
    },
    // 设置统一描述
    basicdataSetCommonDescription(data){
        return Request.requestPost(Config.api.basicdataSetCommonDescription, data);
    },
};
