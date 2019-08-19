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
    @visible-change="onVisibleChange"
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
      tempValue: []
    };
  },
  methods: {
    //获取所有科学分类
    async baseSystemClassListTree(){
      let res = await Http.get(Config.api.baseSystemClassListTree, {});
      if(res.code === 0){
        let rd = res.data;
        let fun = (d) =>{
          for(let i = 0; i < d.length; i++){
            if(d[i].childs.length === 0){
              delete d[i].childs;
            }else{
              fun(d[i].childs);
            }
          }
        }
        fun(rd);
        this.$data.systemClassTree = rd;
        typeof callback === 'function' && callback(rd);
      }else{
        MessageBox.alert(res.message, '提示');
      }
    },
    //选择改变
    onChang(val) {
      this.$data.tempValue = val;
      if(val.length === 0){
        this.$emit('change', val);
      }
    },
    //显示隐藏时
    onVisibleChange(visible){
      if(!visible){
        let data = {};
        let { systemClassTree, tempValue } = this;
        if(tempValue.length > 0){
          let fun = (d) =>{
            for(let i = 0; i < d.length; i++){
              if(d[i].code === tempValue[tempValue.length - 1]){
                data = d[i];
                break;
              }
              if(d[i].childs){
                fun(d[i].childs);
              }
            }
          }
          fun(systemClassTree);
        }
        this.$emit('change', tempValue, data);
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
