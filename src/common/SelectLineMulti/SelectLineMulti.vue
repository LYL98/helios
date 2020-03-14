<template>
  <el-transfer v-model="lineIds" :data="dataItem" :titles="['未选线路','已选线路']" @change="changeLine"></el-transfer>
</template>

<script>
import { Transfer, MessageBox } from 'element-ui';
import { Http, Config } from '@/util';

export default {
  name: "SelectLineMulti",
  components: {
    'el-transfer': Transfer
  },
  created(){
    this.baseLineListOperator();
  },
  props: ['value', 'provinceCode'],
  model: {
    prop: 'value',
    event: 'ev'
  },
  data() {
    return {
      pCode: this.provinceCode || '',
      lineIds: this.value || [],
      dataItem: []
    };
  },
  methods: {
    //线路改变
    changeLine(v){
      this.$emit('ev', v);
      this.$emit('change', v);
    },
    //获取所有线路
    async baseLineListOperator(){
      let that = this;
      let { pCode } = that;
      if(!pCode){
        that.$data.dataItem = [];
        return false;
      }
      let res = await Http.get(Config.api.baseLineListOperator, {
        province_code: pCode
      });
      if(res.code === 0){
        let rd = res.data, d = [];
        rd.forEach(item => {
          d.push({
            label: item.title,
            key: item.id,
          });
        });
        that.$data.dataItem = d;
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
        this.baseLineListOperator();
      }
    },
    value: {
      deep: true,
      handler: function (a, b) {
        this.$data.lineIds = a || [];
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  
</style>
