<template>
  <el-cascader
    :options="dataTree"
    :size="size"
    style="width: 100%"
    :clearable="clearable"
    expand-trigger="hover"
    :props="dataProps"
    @change="handleChange"
    :placeholder="placeholder"
    :value="value"
    popper-class="my-cascader"
  ></el-cascader>
</template>

<script>
import { MessageBox, Cascader } from 'element-ui';
import { Http, Config } from '@/util';
import cascaderMixin from './cascader.mixin';

export default {
  name: "CascaderWarehouseTray",
  mixins: [cascaderMixin],
  components: {
    'el-cascader': Cascader
  },
  created(){
    this.baseSystemClassListTree();
  },
  props: {
    placeholder: { type: String, default: '请选择仓/库/托盘' }
  },
  model: {
    prop: 'value',
    event: 'ev'
  },
  data() {
    return {
      dataProps: {
        value: 'code',
        label: 'title',
        children: 'childs',
        checkStrictly: true
      },
      dataTree: []
    };
  },
  methods: {
    //获取仓列表
    async getData(){
      let res = await Http.get(Config.api.baseStorehouseList, {need_num: 50});
      if(res.code === 0){
        let rd = res.data;
        this.$data.dataItem = rd;
      }else{
        this.$messageBox.alert(res.message, '提示');
      }
    },
    //获取库列表
    async baseWarehouseList(){
      let res = await Http.get(Config.api.baseWarehouseList, {need_num: 50});
      if(res.code === 0){
        let rd = res.data;
        this.$data.dataItem = rd;
      }else{
        this.$messageBox.alert(res.message, '提示');
      }
    },
    //获取临库、托盘列表
    async baseWareTrayList(){
      let res = await Http.get(Config.api.baseWareTrayList, {need_num: 1000});
      if(res.code === 0){
        let rd = res.data;
        this.$data.dataItem = rd;
      }else{
        this.$messageBox.alert(res.message, '提示');
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .my-cascader{
    .el-radio{
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      .el-radio__input{
        width: 100%;
        height: 34px;
        .el-radio__inner{
          opacity: 0;
        }
      }
    }
  }
</style>
