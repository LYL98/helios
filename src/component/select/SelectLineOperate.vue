<template>
  <el-select v-model="lineCode" filterable placeholder="请选择线路" @change="changeLine">
    <el-option
      v-for="item in dataItem"
      :key="item.code"
      :label="item.title"
      :value="item.code">
    </el-option>
  </el-select>
</template>

<script>
import { Select, Option, MessageBox } from 'element-ui';
import { Http, Config } from '@/util';

export default {
  name: "SelectLineOperate",
  components: {
    'el-select': Select,
    'el-option': Option
  },
  created(){
    this.baseLineList();
  },
  props: ['value', 'provinceCode'],
  model: {
    prop: 'value',
    event: 'ev'
  },
  data() {
    return {
      pCode: this.provinceCode || '',
      dataItem: [],
      lineCode: this.value || ''
    };
  },
  methods: {
    //片区改变
    changeLine(v, isInit){
      this.$emit('ev', v);
      this.$emit('change', v, isInit);
    },
    //获取所有片区
    async baseLineList(){
      let that = this;
      let { pCode } = that;
      let res = await Http.get(Config.api.baseLineList, {
        province_code: pCode
      });
      if(res.code === 0){
        let rd = res.data;
        //如果只有一个省，默认选择，页面不显示
        if(rd.length > 0){
          that.changeLine(rd[0].code, true);
        }
        that.$data.dataItem = rd;
      }else{
        MessageBox.alert(res.message, '提示');
      }
    },
  },
  watch:{
    provinceCode: {
      deep: true,
      handler: function (a, b) {
        this.$data.pCode = a || '';
        this.baseLineList();
      }
    },
    value: {
      deep: true,
      handler: function (a, b) {
        this.$data.lineCode = a || '';
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .item{
    border-bottom: 1px solid #f3f4f6;
    padding: 10px;
  }
</style>
