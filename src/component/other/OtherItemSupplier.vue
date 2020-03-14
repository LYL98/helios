<template>
  <div v-if="supplierData.global_supplier_binds.length > 0 || isShowLocal">
    <h6 class="subtitle">供应商信息</h6>
    <el-form-item label="全国" v-if="supplierData.global_supplier_binds.length > 0">
      <p v-for="(item, index) in supplierData.global_supplier_binds" :key="index">{{index + 1}}、{{item.supplier.title}}</p>
    </el-form-item>
    <el-form-item label="区域" v-if="isShowLocal">
      <template v-for="(item, index) in supplierData.local_suppliers">
        <div :key="index" class="local-pur-item" v-if="item.province_code === $province.code">
          <div class="title">{{item.province.title}}</div>
          <p v-for="(s, i) in item.suppliers" :key="i">
            {{i + 1}}、{{s.supplier.title}}
            <span v-if="s.is_main" class="main-span">反采供应商</span>
          </p>
        </div>
      </template>
    </el-form-item>
  </div>
</template>

<script>
  import { FormItem } from 'element-ui';

  export default {
    name: "OtherItemSupplier",
    components: {
      'el-form-item': FormItem
    },
    props: {
      supplierData: { type: Object, default: {} }, //供应商列表
    },
    computed: {
      //是否显示反采供应商
      isShowLocal(){
        let d = this.supplierData;
        let con = d.local_suppliers.filter(item => item.province_code === this.$province.code);
        if(con.length > 0) return true;
        return false;
      }
    },
    methods: {
      
    }
  }
</script>

<style lang="scss" scoped>
  .local-pur-item{
    margin-bottom: 20px;
    >.title{
      margin-bottom: 6px;
      font-weight: bold;
    }
  }
  .main-span{
    background: #ff5252;
    color: #fff;
    padding: 0 3px;
    border-radius: 3px;
    font-size: 12px;
    position: relative;
    top: -1px;
  }
</style>
