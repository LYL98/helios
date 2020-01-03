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
    :filter-method="searchMethod"
  >
    <el-option v-if="showAll" key="" label="全部" value="">
    </el-option>
    <el-option
      v-for="item in dataItem"
      :key="item.id"
      :label="item.code + '/' + item.title"
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
    name: "SelectWarehouse",
    mixins: [selectMixin],
    props: {},
    methods: {
      //获取数据
      async getData(){
        let res = await Http.get(Config.api.baseWarehouseList, {
          ...this.query
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
  }
</script>

<style scoped>

</style>
