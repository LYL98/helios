<template>
  <el-select :size="size"  v-model="salesManId" filterable placeholder="请选择采购员" clearable :class="isUseToQuery ? 'query-item-select' : 'default'" @change="changeBuyer">
    <el-option class="custom-el-select" v-if="hasAllSelection" label="全部" value=""></el-option>
    <el-option
      class="custom-el-select"
      v-for="item in dataItem"
      :key="item.id"
      :label="`${item.realname} ${item.phone ? '('+item.phone+')':''}`"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import { Select, Option, MessageBox } from 'element-ui';
import { Base } from '@/service';

export default {
  name: "SelectBuyer",
  components: {
    'el-select': Select,
    'el-option': Option
  },
  created(){
    this.baseCommonBuyerList();
  },
  props: ['value', 'provinceCode', 'size', 'hasAllSelection', 'isUseToQuery'],
  model: {
    prop: 'value',
    event: 'ev'
  },
  data() {
    return {
      pCode: this.provinceCode || '',
      salesManId: this.value || '',
      dataItem: []
    };
  },
  methods: {
    //采购人员改变
    changeBuyer(v, isInit){
      this.$emit('ev', v);
      this.$emit('change', v, isInit);
    },
    //获取所有采购人员
    async baseCommonBuyerList(){
      let that = this;
      let { pCode } = that;
      if(!pCode){
        that.$data.dataItem = [];
        return false;
      }
      let res = await Base.baseCommonBuyerList({
        province_code: pCode
      });
      if(res.code === 0){
        let rd = res.data;
        that.$data.dataItem = rd;
        //如果只有一个采购员，默认选择
        if(rd.length === 1){
          that.changeBuyer(rd[0].id, true);
        }else{
          //如果当前选择的采购员不存在这列表
          let judge = rd.filter(item => item.id === that.value);
          if(judge.length === 0) that.changeBuyer('', true);
        }
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
        this.baseCommonBuyerList();
      }
    },
    value: {
      deep: true,
      handler: function (a, b) {
        this.$data.salesManId = a || '';
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .default{
    width: 100%;
  }
</style>
