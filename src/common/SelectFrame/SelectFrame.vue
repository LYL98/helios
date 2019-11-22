<template>
  <el-select v-model="frameCode" filterable clearable placeholder="请选择筐" style="width:100%;" @change="changeFrame" :size="size">
    <el-option
      v-for="item in dataItem"
      :key="item.code"
      :label="`${item.title}（￥${returnPrice(item.price)}）`"
      :value="item.code">
    </el-option>
  </el-select>
</template>

<script>
import { Select, Option, MessageBox } from 'element-ui';
import { Http, Config, DataHandle } from '@/util';

export default {
  name: "SelectFrame",
  components: {
    'el-select': Select,
    'el-option': Option
  },
  created(){
    this.baseFrameList();
  },
  props: {
    value: { type: String | Number },
    size: { type: String, default: 'medium' }, //medium/small/mini
  },
  model: {
    prop: 'value',
    event: 'ev'
  },
  data() {
    return {
      frameCode: this.value || '',
      dataItem: []
    };
  },
  methods: {
    // 返回价格
    returnPrice(data) {
      return DataHandle.returnPrice(data);
    },
    //筐改变
    changeFrame(v, isInit){
      this.$emit('ev', v);
      this.$emit('change', v, isInit);
    },
    //获取所有筐
    async baseFrameList(){
      let that = this;
      let res = await Http.get(Config.api.baseFrameList, {});
      if(res.code === 0){
        let rd = res.data;
        that.$data.dataItem = rd;
        //如果只有一个筐，默认选择，页面不显示
        if(rd.length === 1){
          that.changeFrame(rd[0].code, true);
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
