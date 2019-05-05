import { Config, Request } from './../util';

export default {
    //权限树
    permissionTree(data){
        return Request.requestGet(Config.api.permissionTree, data);
    },
    //增加权限角色
    roleAdd(data){
        return Request.requestPost(Config.api.roleAdd, data);
    },
    //修改权限角色
    roleEdit(data){
        return Request.requestPost(Config.api.roleEdit, data);
    },
    //角色详情
    roleDetail(data){
        return Request.requestGet(Config.api.roleDetail, data);
    },
    //查询权限角色
    roleList(data){
        return Request.requestGet(Config.api.roleList, data);
    },
    //删除权限角色
    roleDelete(data){
        return Request.requestPost(Config.api.roleDelete, data);
    },
    //运营人员新增
    operatorAdd(data){
        return Request.requestPost(Config.api.operatorAdd, data);
    },
    //运营人员列表
    operatorList(data){
        return Request.requestGet(Config.api.operatorList, data);
    },
    //运营人员修改
    operatorEdit(data){
        return Request.requestPost(Config.api.operatorEdit, data);
    },
    //运营人员详情
    operatorDetail(data){
        return Request.requestGet(Config.api.operatorDetail, data);
    },
    //运营人员重置密码
    operatorPwdReset(data){
        return Request.requestPost(Config.api.operatorPwdReset, data);
    },
    //运营人员修改密码（自己密码）
    operatorPwdModify(data){
        return Request.requestPost(Config.api.operatorPwdModify, data);
    },
    //运营人员冻结
    operatorFreeze(data){
        return Request.requestPost(Config.api.operatorFreeze, data);
    },
    //运营人员解冻
    operatorUnFreeze(data){
        return Request.requestPost(Config.api.operatorUnFreeze, data);
    },
    // //获取常量
    // basicdataConstantGet(data){
    //     return Request.requestGet(Config.api.basicdataConstantGet, data);
    // },
    // //设置常量
    // basicdataConstantSet(data){
    //     return Request.requestPost(Config.api.basicdataConstantSet, data);
    // },
    //获取截单时间
    basicdataConfirmTimeGet(data){
      return Request.requestGet(Config.api.basicdataConfirmTime, data);
    },
    //设置截单时间
    basicdataConfirmTimeSet(data){
      return Request.requestPost(Config.api.basicdataConfirmTime, data);
    },
    //获取下单时间
    basicdataOrderTimeGet(data){
      return Request.requestGet(Config.api.basicdataOrderTime, data);
    },
    //设置下单时间
    basicdataOrderTimeSet(data){
      return Request.requestPost(Config.api.basicdataOrderTime, data);
    },
    //获取运费信息
    basicdataDeliveryInfoGet(data){
      return Request.requestGet(Config.api.basicdataDeliveryInfo, data);
    },
    //设置运费信息
    basicdataDeliveryInfoSet(data){
      return Request.requestPost(Config.api.basicdataDeliveryInfo, data);
    },
    //设置发货方式
    basicdataShipTypeSet(data) {
      return Request.requestPost(Config.api.basicdataShipType, data);
    },
    //获取发货方式
    basicdataShipTypeGet(data) {
      return Request.requestGet(Config.api.basicdataShipType, data);
    },
    //获取广告语
    basicdataAdGet(data) {
      return Request.requestGet(Config.api.basicdataAd, data);
    },
    //设置广告语
    basicdataAdSet(data) {
      return Request.requestPost(Config.api.basicdataAd, data);
    },
    // banner列表
    systemBannerList(data){
      return Request.requestGet(Config.api.systemBannerList, data);
    },
    // banner修改
    systemBannerUpdate(data){
      return Request.requestPost(Config.api.systemBannerUpdate, data);
    },
    //banner新增
    systemBannerAdd(data){
      return Request.requestPost(Config.api.systemBannerAdd, data);
    },
    //banner删除
    systemBannerDelete(data){
      return Request.requestPost(Config.api.systemBannerDelete, data);
    },//品牌配置
    systemBrand(data) {
        return data == 'get' ?  Request.requestGet(Config.api.BrandInfo) : Request.requestPost(Config.api.BrandInfo, data);
    },
    systemBrandService(data) {
        return data == 'get' ? Request.requestGet(Config.api.CustomerService) : Request.requestPost(Config.api.CustomerService, data);
    },
    //品牌信息获取
    systemBrandGet(data) {
      return Request.requestGet(Config.api.BrandInfo, data);
    },
    //品牌信息设置
    systemBrandSet(data) {
      return Request.requestPost(Config.api.BrandInfo, data);
    }

}
