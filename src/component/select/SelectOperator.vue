<template>
  <el-select
    v-model="selectId"
    :size="size"
    :filterable="filterable"
    :clearable="clearable"
    :disabled="disabled"
    :placeholder="placeholder"
    :remote="remote"
    style="width:100%;"
    @change="handleChange"
  >
    <el-option v-if="showAll" key="" label="全部" value="">
    </el-option>
    <el-option
      v-for="item in getDataItem"
      :key="item.id"
      :label="item.realname + ' ' + item.phone"
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
    name: "SelectOperator",
    mixins: [selectMixin],
    props: {
      placeholder: { type: String, default: '请输入司机姓名/手机号' },
      post: { type: String, default: '' }, //职务 salesman(业务员) buyer(商品) supply(供应链) service(客服) other(其他)
      isFreeze: { type: String | Number, default: 0 }, //0:未冻结 1:已冻结
      optType: { type: String, default: '' },
      provinceCode: { type: String, default: '' },
      needNum: { type: String | Number, default: 200 },
      filterableData: { type: Function | Object, default: null }, //特殊筛选数据
    },
    computed: {
      getDataItem(){
        let { dataItem, filterableData } = this;
        if(typeof filterableData === 'function'){
          return filterableData(dataItem);
        }
        return dataItem;
      }
    },
    methods: {
      //获取数据
      async getData(){
        let { query, post, isFreeze, needNum, optType, provinceCode } = this;
        let res = await Http.get(Config.api.baseCommonOperatorList, {
          ...query,
          post: post,
          is_freeze: isFreeze,
          need_num: needNum,
        });
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$messageBox.alert(res.message, '提示');
        }
      },
    },
    watch:{
      provinceCode: {
        deep: true,
        handler: function (a, b) {
          this.getData();
        }
      },
      optType: {
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
