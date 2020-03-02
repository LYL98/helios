<template>
  <el-select v-model="frameCode" :size="size" filterable :clearable="clearable" placeholder="请选择展示分类" @change="changeDisplayClass" style="width: 100%;">
    <el-option v-if="hasAllSelection" label="全部" value=""></el-option>
    <el-option
      v-for="item in dataItem"
      :key="item.id"
      :label="item.title"
      :value="useName?item.title:item.id">
    </el-option>
  </el-select>
</template>

<script>
import { Select, Option, MessageBox } from 'element-ui';
import { Http, Config } from '@/util';

export default {
  name: "SelectDisplayClass",
  components: {
    'el-select': Select,
    'el-option': Option
  },
  created(){
    this.baseDisplayClassList();
  },
  props: ['value', 'size', 'hasAllSelection', 'useName', 'clearable'],
  model: {
    prop: 'value',
    event: 'ev'
  },
  data() {
    return {
      frameCode: this.value || '',
      query: {
        province_code: this.$province.code
      },
      dataItem: []
    };
  },
  methods: {
    //展示分类改变
    changeDisplayClass(v, isInit){
      this.$emit('ev', v);
      this.$emit('change', v, isInit);
    },
    //获取所有展示分类
    async baseDisplayClassList(){
      let that = this;
      let res = await Http.get(Config.api.baseDisplayClassList, this.query);
      if(res.code === 0){
        let rd = res.data;
        that.$data.dataItem = rd;
        //如果只有一个展示分类，默认选择
        if(rd.length === 1){
          that.changeDisplayClass(rd[0].id, true);
        }
      }else{
        MessageBox.alert(res.message, '提示');
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
