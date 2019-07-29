<template>
  <el-select
    filterable
    @clear="onClear"
    :clearable="clearable"
    v-model="cityCode"
    :disabled="disabled"
    :placeholder="placeholder || '请选择县域'"
    style="width:100%;"
    :size="size"
    @change="changeCity"
  >
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
  name: "SelectCity",
  components: {
    'el-select': Select,
    'el-option': Option
  },
  created(){
    this.baseCityList();
  },
  props: ['value', 'provinceCode', 'showAll', 'clearable', 'placeholder', 'disabled', 'size'],
  model: {
    prop: 'value',
    event: 'ev'
  },
  data() {
    return {
      pCode: this.provinceCode || '',
      cityCode: this.value || '',
      dataItem: []
    };
  },
  methods: {
    //县市改变
    changeCity(v, isInit){
      this.$emit('ev', v);
      this.$emit('change', v, isInit);
    },
    onClear(v) {
      this.$emit('clear', v)
    },
    //获取所有县市
    async baseCityList(){
      let that = this;
      let { pCode } = that;
      if(!pCode){
        that.$data.dataItem = [];
        return false;
      }
      let res = await Http.get(Config.api.baseCityList, {
        province_code: pCode
      });
      if(res.code === 0){
        let rd = res.data;
        that.$data.dataItem = rd;
        //如果只有一个县市，默认选择，页面不显示
        if(rd.length === 1 && typeof this.showAll === 'undefined'){
          that.changeCity(rd[0].code, true);
        }else{
          //如果当前选择的县市不存在这列表
          let judge = rd.filter(item => item.code === that.value);
          if(judge.length === 0) that.changeCity('', true);
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
        this.baseCityList();
      }
    },
    value: {
      deep: true,
      handler: function (a, b) {
        this.$data.cityCode = a || '';
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
