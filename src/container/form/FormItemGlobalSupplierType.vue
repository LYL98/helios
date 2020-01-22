<template>
  <form-layout title="采购属性" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="detail" :rules="rules" ref="ruleForm">
      <el-form-item label="商品编号/名称">{{detail.code}}/{{detail.title}}</el-form-item>
      <el-form-item label="供应商类型" prop="sup_type">
        <el-radio v-model="detail.sup_type" :label="key" :key="key" border size="mini" v-for="(value, key) in supplierType">{{value}}</el-radio>
        <div style="color: #ff5252; margin-top: 10px;">采购类型为商品重要属性，一旦切换需要重新选择供应商。</div>
      </el-form-item>
      <!--统采-->
      <el-form-item label="选择供应商" v-if="isShow && detail.sup_type === 'global_pur'">
        <form-item-global-supplier-type-g :pageComponent="this"/>
      </el-form-item>
      <!--地采-->
      <el-form-item label="选择供应商" v-else-if="isShow && detail.sup_type === 'local_pur'">
        <form-item-global-supplier-type-l :pageComponent="this"/>
      </el-form-item>
    </el-form>
  </form-layout>
</template>

<script>
import formMixin from './form.mixin';
import { Http, Config, Constant, Verification } from '@/util';
import FormItemGlobalSupplierTypeG from './FormItemGlobalSupplierTypeG';
import FormItemGlobalSupplierTypeL from './FormItemGlobalSupplierTypeL';

export default {
  name: "FormItemGlobalSupplierType",
  mixins: [formMixin],
  components: {
    'form-item-global-supplier-type-g': FormItemGlobalSupplierTypeG,
    'form-item-global-supplier-type-l': FormItemGlobalSupplierTypeL
  },
  created() {
  },
  data(){
    let initDetail = {}
    return{
      supplierType: Constant.SUPPLIER_TYPE(),
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
    }
  },
  methods: {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
