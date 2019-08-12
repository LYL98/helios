<template>
  <el-cascader
    :options="systemClassTree"
    change-on-select
    :size="size"
    style="width: 100%"
    :clearable="clearable"
    expand-trigger="hover"
    :props="systemClassProps"
    @change="onChang"
    placeholder="请选择科学分类"
    :value="value"
  ></el-cascader>
</template>

<script>
import { MessageBox, Cascader } from 'element-ui';
import { Http, Config } from '@/util';

export default {
  name: "SelectSystemClass",
  components: {
    'el-cascader': Cascader
  },
  created(){
    this.baseSystemClassListTree();
  },
  props: {
    value: {type: Array, default: []},
    size: {type: String, default: ''},
    hasAllSelection: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true }
  },
  model: {
    prop: 'value',
    event: 'ev'
  },
  data() {
    return {
      systemClassProps: {
        value: 'code',
        label: 'title',
        children: 'childs'
      },
      systemClassTree: [],
    };
  },
  methods: {
    //获取所有科学分类
    async baseSystemClassListTree(){
      let res = await Http.get(Config.api.baseSystemClassListTree, {});
      if(res.code === 0){
        this.$data.systemClassTree = res.data;
        typeof callback === 'function' && callback(rd);
      }else{
        MessageBox.alert(res.message, '提示');
      }
    },
    //选择改变
    onChang(val) {
      this.$emit('change', val);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
