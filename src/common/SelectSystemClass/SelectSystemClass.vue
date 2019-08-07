<template>
  <el-cascader
    :options="scientificTypeList"
    change-on-select
    :size="size"
    style="width: 100%"
    clearable
    expand-trigger="hover"
    :props="systemClassProps"
    @change="onSystemClassChange"
    placeholder="请选择科学分类"
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
    this.baseSystemClassList('', list => {
      this.$data.scientificTypeList = list;
    });
  },
  props: ['value', 'size', 'hasAllSelection', 'clearable'],
  model: {
    prop: 'value',
    event: 'ev'
  },
  data() {
    return {
      systemClassProps: {
        value: 'code',
      },
      systemClassList: [], //科学分类列表
      scientificTypeList: [],
    };
  },
  methods: {
    //获取所有科学分类
    async baseSystemClassList(topCode, callback){
      if(topCode.length >= 8) return;
      let res = await Http.get(Config.api.baseSystemClassList, {
        top_code: topCode || ''
      });
      if(res.code === 0){
        let rd = res.data;
        rd.map(item => {
          item.label = item.title;
          item.children = [];
        });
        this.$data.systemClassList = rd;
        typeof callback === 'function' && callback(rd);
      }else{
        MessageBox.alert(res.message, '提示');
      }
    },
    //选择改变
    onSystemClassChange(val) {
      this.nodeList(val.length - 1, val)
    },
    //获取要查询的节点
    nodeList(n, val) {
      // console.log('n = ', n, val)
      if (n < 0) {
        return;
      }
      if (n === 0) {
        let index = -1;
        for (let i = 0; i < this.scientificTypeList.length; i++) {
          if (this.scientificTypeList[i].code === val[n]) {
            index = i;
            break;
          }
        }
        if (!this.scientificTypeList[index].children || this.scientificTypeList[index].children.length === 0) {
          if (index >= 0) {
            this.baseSystemClassList(val[0], list => {
              this.scientificTypeList[index].children = list;
            });
          }
          return;
        } else {
          return this.scientificTypeList[index].children
        }
      }

      let parentNodeList = this.nodeList(n - 1, val);
      let currentIndex = -1;
      for (let i = 0; i < parentNodeList.length; i ++) {
        if (parentNodeList[i].code === val[n]) {
          currentIndex = i;
        }
      }
      if (!parentNodeList[currentIndex].children || parentNodeList[currentIndex].children.length === 0) {
        if (currentIndex >= 0) {
          this.baseSystemClassList(val[n], list => {
            parentNodeList[currentIndex].children = list;
          })
        }
      } else {
        return parentNodeList[currentIndex].children
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
