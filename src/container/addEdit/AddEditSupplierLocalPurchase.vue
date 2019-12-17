<template>
  <div>
    <add-edit-layout :title="pageTitles[pageType]" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      <el-form class="custom-form" size="mini" label-position="right" :disabled="pageType === 'detail'" label-width="140px" style="width: 98%; max-width: 1400px; margin-top: 20px;" :model="detail" :rules="rules" ref="ruleForm">
        <el-form-item label="地采单号">
          {{detail.code}}
        </el-form-item>
        <el-form-item label="商品编号/名称">
          {{detail.item.code}}/{{detail.item.title}}
        </el-form-item>
        <el-form-item label="供货商">
          {{detail.supplier.title}}
        </el-form-item>
        <el-form-item label="采购价">
          {{returnPrice(detail.price_buy)}}
        </el-form-item>
        <el-form-item label="采购数量">
          {{detail.num}}
        </el-form-item>
        <el-form-item label="状态">
          {{detail.status}}
        </el-form-item>
        <el-form-item label="采购日期">
          {{detail.order_date}}
        </el-form-item>
      </el-form>

      <div style="margin-left: 110px; margin-top: 80px;">
        <template>
          <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
        </template>
      </div>
    </add-edit-layout>
  </div>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config } from '@/util';

export default {
  name: "AddEditSupplierLocalPurchase",
  mixins: [addEditMixin],
  components: {
  },
  created() {
  },
  data(){
    let initDetail = {
      supplier: {},
      item: {}
    }
    return {
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      rules: {
      },
      pageTitles: {
        detail: '地采订单详情'
      },
      pageType: 'add', //add, edit, detail
    }
  },
  methods: {
    //显示新增修改(重写) (数据，类型)
    showAddEdit(data, type){
      if(data){
        this.supplierLocalPurchaseDetail(data.id);
        this.$data.pageType = type;
      }
    },
    //获取详情
    async supplierLocalPurchaseDetail(id){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.supplierLocalPurchaseDetail, { id: id });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        this.$data.detail = res.data;
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "./add.edit.scss";
</style>
