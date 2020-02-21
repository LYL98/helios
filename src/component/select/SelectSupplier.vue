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
      :value="item.id"
      :disabled="item.disabled"
    >
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
      supplierType: { type: String, default: '' }, //global_pur 预采；local_pur 反采
      billTerm: { type: String | Number, default: '' }, //账期
      placeholder: { type: String, default: '请选择供应商' },
      supplierIds: { type: Array }, //当前选择了的id
      pItemId: { type: String | Number, default: '' }, //商品搜索供应商
    },
    methods: {
      //获取数据
      async getData(){
        let res = await Http.get(Config.api.baseSupplierList, {
          province_code: this.$props.provinceCode,
          condition: this.query.condition,
          p_item_id: this.pItemId,
          supplier_type: this.$props.supplierType,
          bill_term: this.$props.billTerm,
          is_audited: 1, // 是否审核通过？ 0 否 1 是 null 全部
          is_freeze: 0 // 是否冻结？ 0 否 1 是 null 全部
        });
        if(res.code === 0){
          let rd = res.data;
          this.$data.dataItem = rd;
          this.judgeDisabled();
        }else{
          this.$messageBox.alert(res.message, '提示');
        }
      },
      //判断选项是否可用
      judgeDisabled(){
        let { supplierIds, dataItem } = this;

        if(!supplierIds || supplierIds.length === 0) return;

        let ds = [];
        dataItem.forEach((item, index) => {
          let ds = supplierIds.filter(id => id === item.id);
          if(ds.length > 0){
            dataItem[index].disabled = true;
          }else{
            dataItem[index].disabled = false;
          }
        });
        this.$data.dataItem = JSON.parse(JSON.stringify(dataItem));
      }
    },
    watch:{
      supplierIds: {
        deep: true,
        handler: function (a, b) {
          this.judgeDisabled();
        }
      },
      pItemId: {
        deep: true,
        handler: function (a, b) {
          if(a){
            this.getData();
          }else{
            this.$data.dataItem = [];
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
