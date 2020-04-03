<template>
  <el-select
    v-model="selectId"
    :size="size"
    :filterable="filterable"
    :clearable="clearable"
    :disabled="disabled"
    :placeholder="placeholder"
    style="width:100%;"
    @change="handleChange"
    :filter-method="searchMethod"
  >
    <el-option v-if="showAll" key="" label="全部" value="">
    </el-option>
    <el-option
      v-for="item in handleDataItem"
      :key="item.id"
      :label="item.title"
      :value="item.id"
      :disabled="item.disabled"
    >
    </el-option>
  </el-select>
</template>

<script>
  import { Http, Config } from '@/util';
  import selectMixin from './select.mixin';

  export default {
    name: "SelectStorehouse",
    mixins: [selectMixin],
    props: {
      provinceCode: { type: String | Number, default: '' },
      placeholder: { type: String, default: '选择仓' },
      isAuth: { type: Boolean, default: false }, //是否要求权限
      initCallBack:  { type: Function }, //获取数据时回调，方便外边控制
    },
    computed: {
      handleDataItem(){
        let { dataItem, provinceCode } = this;
        if(provinceCode){
          let d = dataItem.filter(item => item.province_code === provinceCode);
          return d;
        }else{
          return dataItem;
        }
      }
    },
    methods: {
      //获取数据
      async getData(){
        let res = await Http.get(this.isAuth ? Config.api.baseSupStorehouseList : Config.api.baseStorehouseList, {
          ...this.query,
          province_code: this.provinceCode,
          need_num: 200
        });
        if(res.code === 0){
          let rd = res.data;
          this.$data.dataItem = rd;
          this.$emit('initCallBack', rd);
        }else{
          this.$messageBox.alert(res.message, '提示');
        }
      },
    },
    watch: {
      //监听区域code
      provinceCode: {
        deep: true,
        handler: function (a, b) {
          this.getData();
        }
      }
    }
  }
</script>

<style scoped>

</style>
