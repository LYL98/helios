<template>
  <el-select
    v-model="selectId"
    :size="size"
    :filterable="filterable"
    :clearable="clearable"
    :disabled="disabled"
    :placeholder="placeholder"
    style="width:100%;"
    @change="handleChange"
  >
    <el-option v-if="showAll" key="" label="全部" value="">
    </el-option>
    <el-option
      v-for="item in dataItem"
      :key="item.id"
      :label="item.title"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
  import { Http, Config } from '@/util';
  import selectMixin from './select.mixin';

  export default {
    name: "SelectSupplier",
    mixins: [selectMixin],
    props: {
      provinceCode: { type: String | Number, default: '' },
      supplierType: { type: String, default: '' }, //global_pur 统采；local_pur 地采
      billTerm: { type: String | Number, default: '' }, //账期
      placeholder: { type: String, default: '请选择供应商' }
    },
    methods: {
      //获取数据
      async getData(){
        let res = await Http.get(Config.api.baseSupplierList, {
          province_code: this.$props.provinceCode,
          condition: this.query.condition,
          supplier_type: this.$props.supplierType,
          bill_term: this.$props.billTerm,
          is_audited: 1, // 是否审核通过？ 0 否 1 是 null 全部
          is_freeze: 0 // 是否赠品？ 0 否 1 是 null 全部
        });
        if(res.code === 0){
          let rd = res.data;
          this.$data.dataItem = rd;
        }else{
          this.$messageBox.alert(res.message, '提示');
        }
      },
    }
  }
</script>

<style scoped>

</style>
