<template>
  <el-select v-model="tagName" clearable placeholder="请选择品类链接" @change="onChange">
    <el-option
      v-for="item in itemTags"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
import { Select, Option, MessageBox} from 'element-ui'
import { Http, Config } from '@/util';

  export default {
    name: "SelectTag",
    props: ['tag'],
    created() {
      let that = this;
      that.baseItemTagsList();//商品标签列表
    },
    data() {
      return {
        itemTags: [], //商品标签
        tagName: this.tag
      }
    },
    methods: {
      onChange(v) {
        this.$emit('change', v)
      },
      //获取商品标签列表
      async baseItemTagsList(){
        let that = this;
        let res = await Http.get(Config.api.baseItemTagsList, {});
        if(res.code === 0){
          res.data.map(item => {item.label=item.title; item.value=item.title});
          that.$data.itemTags = res.data;
        }else{
          MessageBox.alert(res.message, '提示');
        }
      },
    },
    components: {
      'el-select': Select,
      'el-option': Option
    }
  }
</script>

<style scoped>

</style>
