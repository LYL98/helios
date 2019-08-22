<template>
  <el-select v-model="selectId" :size="size" :clearable="clearable" placeholder="请选择分类" style="width: 100%;" @change="handleChange">
    <el-option
      v-for="item in dataItem"
      :key="item.code"
      :label="item.title"
      :value="useName?item.title:item.code">
    </el-option>
  </el-select>
</template>

<script>
import selectMixin from './../select.mixin';
import { Http, Config, DataHandle } from '@/util';

export default {
  name: "SelectSystemClassList",
  components: {
  },
  mixins: [selectMixin],
  created() {
  },
  props: {

  },
  data() {
    return {
    }
  },
  methods: {
    //获取商品标签列表
    async getData(){
      let that = this;
      let res = await Http.get(Config.api.baseSystemClassList, {
        top_code: 10
      });
      if(res.code === 0){
        that.$data.dataItem = res.data;
      }else{
        this.$message({ message: res.message, type: 'error' });
      }
    },
  },
  watch:{
    value: {
      deep: true,
      handler: function (a, b) {
        this.$data.frameCode = a || '';
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  
</style>
