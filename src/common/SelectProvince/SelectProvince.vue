<template>
  <el-select v-model="provinceCode" filterable placeholder="请选择" :disabled="disabled" style="width:100%;" @change="changeProvince">
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
  name: "SelectProvince",
  components: {
    'el-select': Select,
    'el-option': Option
  },
  // 页面创建时，加载所有省份列表
  created(){
    this.baseProvinceList();
  },
  // props: ['value', 'disabled'],
  props: {
    value: String || Number,
    disabled: { type: Boolean, default: false }
  },
  model: {
    prop: 'value',
    event: 'ev'
  },
  data() {
    return {
      provinceCode: this.value || '',
      dataItem: []
    };
  },
  methods: {
    //省改变
    changeProvince(v, isInit){
      this.$emit('ev', v);
      this.$emit('change', v, isInit);
    },
    //获取所有省
    async baseProvinceList(){
      let that = this;
      let res = await Http.get(Config.api.baseProvinceList, {});
      if(res.code === 0){
        let rd = res.data;
        that.$data.dataItem = rd;
        //如果只有一个省，默认选择，页面不显示
        if(rd.length === 1){
          that.changeProvince(rd[0].code, true);
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
        this.$data.provinceCode = a || '';
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  
</style>
