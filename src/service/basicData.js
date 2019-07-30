import { Config, Http } from '@/util';

export default {
    //商品框信息添加
    basicdataFrameAdd(data){
        return Http.post(Config.api.basicdataFrameAdd, data);
    },
    //商品框信息修改
    basicdataFrameEdit(data){
        return Http.post(Config.api.basicdataFrameEdit, data);
    },
    //商品框信息删除
    basicdataFrameDelete(data){
        return Http.post(Config.api.basicdataFrameDelete, data);
    },

    //商品标签新增
    basicdataItemTagsAdd(data){
        return Http.post(Config.api.basicdataItemTagsAdd, data);
    },
    //商品标签修改
    basicdataItemTagsEdit(data){
        return Http.post(Config.api.basicdataItemTagsEdit, data);
    },
    //商品标签列表
    basicdataItemTagsList(data){
        return Http.get(Config.api.basicdataItemTagsList, data);
    },
    //商品标签删除
    basicdataItemTagsDelete(data){
        return Http.post(Config.api.basicdataItemTagsDelete, data);
    },
    //默认icons
    basicdataItemTagsIcons(data) {
        return Http.get(Config.api.basicdataItemTagsIcons, data);
    },
    //icons详情
    basicdataItemTagsDetail(data) {
        return Http.get(Config.api.basicdataItemTagsDetail, data);
    },
    //商品展示分类列表
    basicdataDisplayClassList(data){
        return Http.get(Config.api.basicdataDisplayClassList, data);
    },
    //商品展示分类新增
    basicdataDisplayClassAdd(data){
        return Http.post(Config.api.basicdataDisplayClassAdd, data);
    },
    //商品展示分类修改
    basicdataDisplayClassEdit(data){
        return Http.post(Config.api.basicdataDisplayClassEdit, data);
    },
    //商品展示分类删除
    basicdataDisplayClassDelete(data){
        return Http.post(Config.api.basicdataDisplayClassDelete, data);
    },
    //商品科学分类列表(树型)
    basicdataSystemClassListTree(data){
        return Http.get(Config.api.basicdataSystemClassListTree, data);
    },
    //商品科学分类新增
    basicdataSystemClassAdd(data){
        return Http.post(Config.api.basicdataSystemClassAdd, data);
    },
    //商品科学分类修改
    basicdataSystemClassEdit(data){
        return Http.post(Config.api.basicdataSystemClassEdit, data);
    },
    //商品科学分类删除
    basicdataSystemClassDelete(data){
        return Http.post(Config.api.basicdataSystemClassDelete, data);
    },
    //省新增
    basicdataProvinceAdd(data){
        return Http.post(Config.api.basicdataProvinceAdd, data);
    },
    //省修改
    basicdataProvinceEdit(data){
        return Http.post(Config.api.basicdataProvinceEdit, data);
    },
    //省列表
    basicdataProvinceList(data){
        return Http.get(Config.api.basicdataProvinceList, data);
    },
    //省删除
    basicdataProvinceDelete(data){
        return Http.post(Config.api.basicdataProvinceDelete, data);
    },
    //片区新增
    basicdataZoneAdd(data){
        return Http.post(Config.api.basicdataZoneAdd, data);
    },
    //片区修改
    basicdataZoneEdit(data){
        return Http.post(Config.api.basicdataZoneEdit, data);
    },
    //片区列表
    basicdataZoneList(data){
        return Http.get(Config.api.basicdataZoneList, data);
    },
    //片区删除
    basicdataZoneDelete(data){
        return Http.post(Config.api.basicdataZoneDelete, data);
    },
    //县区新增
    basicdataCityAdd(data){
        return Http.post(Config.api.basicdataCityAdd, data);
    },
    //县区修改
    basicdataCityEdit(data){
        return Http.post(Config.api.basicdataCityEdit, data);
    },
    //县区列表
    basicdataCityList(data){
        return Http.get(Config.api.basicdataCityList, data);
    },
    //县区删除
    basicdataCityDelete(data){
        return Http.post(Config.api.basicdataCityDelete, data);
    },
    //商户内标签
    basicdataMerchantInnerTagsList(data){
        return Http.get(Config.api.basicdataMerchantInnerTagsList, data);
    },
    //商户内标签新增
    basicdataMerchantInnerTagsAdd(data){
        return Http.post(Config.api.basicdataMerchantInnerTagsAdd, data);
    },
    //商户内标签修改
    basicdataMerchantInnerTagsEdit(data){
        return Http.post(Config.api.basicdataMerchantInnerTagsEdit, data);
    },
    //商户内标签删除
    basicdataMerchantInnerTagsDelete(data){
        return Http.post(Config.api.basicdataMerchantInnerTagsDelete, data);
    },
    //商户外标签
    basicdataMerchantOuterTagsList(data){
        return Http.get(Config.api.basicdataMerchantOuterTagsList, data);
    },
    //商户外标签新增
    basicdataMerchantOuterTagsAdd(data){
        return Http.post(Config.api.basicdataMerchantOuterTagsAdd, data);
    },
    //商户外标签修改
    basicdataMerchantOuterTagsEdit(data){
        return Http.post(Config.api.basicdataMerchantOuterTagsEdit, data);
    },
    //商户外标签删除
    basicdataMerchantOuterTagsDelete(data){
        return Http.post(Config.api.basicdataMerchantOuterTagsDelete, data);
    },
    //商户等级列表
    basicdataGradeList(data){
        return Http.get(Config.api.basicdataGradeList, data);
    },
    //商户级别添加
    basicdataGradeAdd(data){
        return Http.post(Config.api.basicdataGradeAdd, data);
    },
    //商户级别修改
    basicdataGradeEdit(data){
        return Http.post(Config.api.basicdataGradeEdit, data);
    },
    //商户等级删除
    basicdataGradeDelete(data){
        return Http.post(Config.api.basicdataGradeDelete, data);
    },
    // 获取统一描述
    basicdataGetCommonDescription(data){
        return Http.get(Config.api.basicdataGetCommonDescription, data);
    },
    // 设置统一描述
    basicdataSetCommonDescription(data){
        return Http.post(Config.api.basicdataSetCommonDescription, data);
    },
};
