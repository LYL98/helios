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
    name: "SelectGItem",
    mixins: [selectMixin],
    props: {
      supplierId: { type: String | Number, default: '' },
    },
    methods: {
      //获取数据
      async getData(){
        let res = await Http.get(Config.api.baseGItemList, {
          condition: this.query.condition,
          supplier_id: this.supplierId
        });
        if(res.code === 0){
          let rd = res.data;
          this.$data.dataItem = rd;
          //判断当前选择的id是否在列表里
          let con = rd.filter(item => item.id === this.selectId);
          if(con.length === 0){
            this.handleChange('');
          }
        }else{
          this.$messageBox.alert(res.message, '提示');
        }
      },
    },
    watch:{
      supplierId: {
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
