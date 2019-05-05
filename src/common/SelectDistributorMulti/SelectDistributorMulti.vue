<template>
  <el-transfer v-model="distributorIds" :data="dataItem" :titles="['未选配送员','已选配送员']" @change="changeDistributor"></el-transfer>
</template>

<script>
import { Transfer, MessageBox } from 'element-ui';
import { Base } from '@/service';

export default {
  name: "SelectDistributorMulti",
  components: {
    'el-transfer': Transfer
  },
  created(){
    this.baseDistributorList();
  },
  props: ['value', 'provinceCode'],
  model: {
    prop: 'value',
    event: 'ev'
  },
  data() {
    return {
      pCode: this.provinceCode || '',
      distributorIds: this.value || [],
      dataItem: []
    };
  },
  methods: {
    //配送员改变
    changeDistributor(v){
      this.$emit('ev', v);
      this.$emit('change', v);
    },
    //获取所有配送员
    async baseDistributorList(){
      let that = this;
      let { pCode } = that;
      if(!pCode){
        that.$data.dataItem = [];
        return false;
      }
      let res = await Base.baseDistributorList({
        province_code: pCode
      });
      if(res.code === 0){
        let rd = res.data, d = [];
        rd.forEach(item => {
          d.push({
            label: item.realname,
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
        this.baseDistributorList();
      }
    },
    value: {
      deep: true,
      handler: function (a, b) {
        this.$data.distributorIds = a || [];
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  
</style>
