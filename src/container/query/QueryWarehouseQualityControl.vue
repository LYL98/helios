<template>
  <div>
    <div class="app-my-sub-menu">
      <div class="my-sub-menu">
        <div class="left"></div>
        <div class="menu">
          <div :class="`menu-item ${query.type === key && 'active'}`" v-for="(value, key) in types" :key="key" @click="changeType(key)">{{value}}</div>
        </div>
        <div class="right"></div>
      </div>
    </div>
    <div class="container-query">
      <el-row :gutter="32">
        <el-col :span="7">
          <!--仓库品控-->
          <my-query-item label="仓库" v-if="fromPage === 'QualityControl'">
            <select-storehouse size="small" v-model="query.tar_storehouse_id" @change="changeStorehouse" isAuth @initCallBack="storehouseInit"/>
          </my-query-item>
        </el-col>
        <el-col :span="10">
          <my-query-item label="搜索">
            <query-search-input v-model="query.condition" placeholder="商品编号/名称/供应商" size="small" @search="handleQuery('TableWarehouseQualityControl')" @reset="handleClearQuery('TableWarehouseQualityControl')"/>
          </my-query-item>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { SelectOption, ButtonGroup } from '@/common';
  import queryMixin from './query.mixin';
  import { Constant } from '@/util';
  import { SelectStorehouse } from '@/component';

  export default {
    name: "QueryWarehouseQualityControl",
    components: {
      'select-option': SelectOption,
      'button-group': ButtonGroup,
      'select-storehouse': SelectStorehouse
    },
    mixins: [queryMixin],
    created() {
      //来自场地
      if(this.fromPage === 'Receiving'){
        let { initQuery, query } = this;
        initQuery.province_code = this.$province.code;
        query.province_code = this.$province.code;
        initQuery.for_accept = 1; //特殊 调拨
        query.for_accept = 1; //特殊 调拨
        this.$data.initQuery = initQuery;
        this.$data.query = query;
      }
    },
    props: {
      fromPage: { type: String, default: 'QualityControl' }, //仓库品控 QualityControl，场地品控 Receiving
    },
    data() {
      let initQuery = {
        province_code: '',
        type: 'purchase',//'采购': 'purchase', '调拨': 'distribute'
        condition: '',
        storehouse_id: '',
        tar_storehouse_id: ''
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
      }
    },
    computed: {
      types(){
        return {
          'purchase': '采购',
          'distribute': '调拨'
        }
      }
    },
    methods: {
      //选择类型
      changeType(type){
        this.$data.query.type = type;
        this.handleQuery('TableWarehouseQualityControl');
      },
      //选择仓库
      changeStorehouse(){
        let { initQuery, query } = this;
        initQuery.storehouse_id = initQuery.tar_storehouse_id;
        query.storehouse_id = query.tar_storehouse_id;
        this.$data.initQuery = initQuery;
        this.$data.query = query;
        this.handleQuery('TableWarehouseQualityControl');
      },
      //初始化选择仓库时
      storehouseInit(dataItem){
        let d = dataItem.filter(item => item.province_code === this.$province.code);
        let { initQuery, query } = this;
        if(d.length > 0){
          initQuery.storehouse_id = initQuery.tar_storehouse_id = d[0].id;
          query.storehouse_id = query.tar_storehouse_id = d[0].id;
        }else{
          initQuery.storehouse_id = initQuery.tar_storehouse_id = dataItem[0].id;
          query.storehouse_id = query.tar_storehouse_id = dataItem[0].id;
        }
        this.$data.initQuery = initQuery;
        this.$data.query = query;
        this.handleQuery('TableWarehouseQualityControl');
      }
    }
  }
</script>

<style lang="scss" scoped>
  /*三级菜单*/
  .my-sub-menu{
    height: 48px;
    overflow: hidden;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    background: #fff;
    padding: 0 10px;
    >.menu{
      flex: 1;
      display: flex;
      >.menu-item{
        padding: 0 20px;
        height: 48px;
        line-height: 48px;
        position: relative;
        color: #73767D;
        font-size: 14px;
        cursor: pointer;
        &.active{
          color: #00ADE7;
          font-weight: bold;
          font-size: 16px;
          &::after{
            content: ' ';
            border-bottom: 2px solid #00ADE7;
            position: absolute;
            left: 25px;
            bottom: 0;
            right: 25px;
          }
        }
      }
    }
  }
</style>
