<template>
  <el-select v-model="selectId"
  :clearable="clearable"
  placeholder="请选择商品内标签"
  @change="handleChange"
  style="width: 100%;" :size="size"
  :disabled="disabled">
    <el-option
      v-for="item in dataItem"
      :key="item.id"
      :label="`${item.title}（加价率：${returnPercent(item.rise_min)}% - ${returnPercent(item.rise_max)}%）`"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import selectMixin from './../select.mixin';
import { Http, Config, DataHandle } from '@/util';

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
    // 返回百分比
    returnPercent(data) {
      return DataHandle.returnPercent(data);
    },
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
