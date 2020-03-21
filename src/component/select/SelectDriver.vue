<template>
  <el-select
    v-model="selectId"
    :size="size"
    :filterable="filterable"
    :clearable="clearable"
    :disabled="disabled"
    :placeholder="placeholder"
    :remote="remote"
    style="width:100%;"
    @change="handleChange"
    :filter-method="searchMethod"
  >
    <el-option v-if="showAll" key="" label="全部" value="">
    </el-option>
    <el-option
      v-for="item in dataItem"
      :key="item.id"
      :label="item.realname + ' ' + item.phone"
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
    name: "SelectDriver",
    mixins: [selectMixin],
    props: {
      placeholder: { type: String, default: '请输入司机姓名/手机号' },
      remote: { type: Boolean, default: true },
    },
    methods: {
      //获取数据
      async getData(){
        let { query } = this;
        if(!query.condition){
          this.$data.dataItem = [];
          return;
        }
        let res = await Http.get(Config.api.baseDistributorList, query);
        if(res.code === 0){
          let rd = res.data;
          this.$data.dataItem = rd;
        }else{
          this.$messageBox.alert(res.message, '提示');
        }
      },
    },
  }
</script>

<style scoped>

</style>
