<template>
  <el-select v-model="selectId" clearable placeholder="请选择品类链接" @change="handleChange" style="width: 100%;">
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
    name: "SelectInnerTag",
    mixins: [selectMixin],
    created() {
    },
    data() {
      return {
      }
    },
    methods: {
      //获取商品标签列表
      async getData(){
        let that = this;
        let res = await Http.get(Config.api.baseItemInnerTagsList, {});
        if(res.code === 0){
          that.$data.dataItem = res.data;
        }else{
          this.$message({ message: res.message, type: 'error' });
        }
      },
    },
  }
</script>

<style scoped>

</style>
