<template>
  <div class="label pre">
    <!--  @click.native="clickTag(item.title)" -->
    <el-tag
      :type="judgeTag(item.title) ? 'danger' : 'info'"
      v-for="(item, index) in dataItem"
      :key="index"
      style="margin-right: 5px; margin-bottom: 5px; "
     >
        {{item.title}}
    </el-tag>
  </div>
</template>

<script>
import { Tag } from 'element-ui';
import { Http, Config, DataHandle } from '@/util';

export default {
  name: "SelecItemTags",
  components: {
    'el-tag': Tag
  },
  props: {
    value: { type: Array, default: [] }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  created() {
    this.baseItemTagsList();
  },
  data() {
    return {
      dataItem: []
    }
  },
  methods: {
    //获取商品标签列表
    async baseItemTagsList(){
      let that = this;
      let res = await Http.get(Config.api.baseItemTagsList, { province_code: this.$province.code });
      if(res.code === 0){
        that.$data.dataItem = res.data;
      }else{
        this.$message({ message: res.message, type: 'error' });
      }
    },
    //选择商品标签
    clickTag(tag){
      let { value, dataItem } = this;
      if(value.length === 0){
        value.push(tag);
      }else{
        for(let i = 0; i < value.length; i++){
          if(value[i] === tag){
            value.remove(i);
            break;
          }
          if(i === value.length - 1){
            value.push(tag);
            break;
          }
        }
      }
      
      // 检查提交的标签中是否含有不在标签列表中的标签
      let tmpTags = Array();
      for (let i = 0; i < dataItem.length; i++) {
        tmpTags.push(dataItem[i].title);
      }
      let removeTags = Array();
      for (let i = 0; i < value.length; i++) {
        if (!tmpTags.includes(value[i])) {
          removeTags.push({id: i, tag: value[i]})
        }
      }
      for (let i = 0; i < removeTags.length; i++) {
        value.remove(removeTags[i].id)
      }

      this.$forceUpdate(); //强制渲染
      this.$emit('change', value);
    },
    //判断是否选择tag
    judgeTag(tag){
      for(let i = 0; i < this.value.length; i++){
        if(this.value[i] === tag){
          return true;
        }
      }
      return false;
    },
  },
}
</script>

<style scoped>

</style>
