<template>
  <el-select
    v-model="selectId" 
    :clearable="clearable"
    placeholder="请选择商品分类"
    style="width:100%;"
    :size="size"
    :disabled="disabled"
    @change="handleChange"
  >
    <el-option
      v-for="item in dataItem"
      :key="item.id"
      :label="item.title"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import selectMixin from './../select.mixin';
import { Http, Config } from '@/util';

export default {
  name: "SelectGroupItemClass",
  mixins: [selectMixin],
  components: {
  },
  created(){
  },
  props: ['value'],
  model: {
    prop: 'value',
    event: 'ev'
  },
  data() {
    return {
      dataItem: []
    };
  },
  methods: {
    //获取所有框
    async getData(){
      let that = this;
      let res = await Http.get(Config.api.groupItemClassList, {});
      if(res.code === 0){
        let rd = res.data;
        that.$data.dataItem = rd;
      }else{
        this.m$essageBox.alert(res.message, '提示');
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  
</style>
