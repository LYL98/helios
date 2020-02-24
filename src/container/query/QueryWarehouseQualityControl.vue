<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <!--仓库品控-->
        <my-query-item label="仓库" v-if="fromPage === 'QualityControl'">
          <select-storehouse size="small" v-model="query.tar_storehouse_id" @change="changeStorehouse" isAuth @initCallBack="storehouseInit"/>
        </my-query-item>
        <!--场地品控-->
        <my-query-item label="配送日期" v-else-if="fromPage === 'Receiving'">
          <el-date-picker
            size="small"
            v-model="query.delivery_date"
            value-format="yyyy-MM-dd"
            @change="handleQuery('TableWarehouseQualityControl')"
            style="width: 100%;"
            placeholder="配送日期"
            :clearable="false"
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="类型">
          <select-option
            :options="types"
            v-model="query.type"
            @change="handleQuery('TableWarehouseQualityControl')"
            size="small"
          />
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="query.condition" placeholder="商品编号/名称/供应商" size="small" @search="handleQuery('TableWarehouseQualityControl')" @reset="handleClearQuery('TableWarehouseQualityControl')"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { SelectOption } from '@/common';
  import queryMixin from './query.mixin';
  import { Constant } from '@/util';
  import { SelectStorehouse } from '@/component';

  export default {
    name: "QueryWarehouseQualityControl",
    components: {
      'select-option': SelectOption,
      'select-storehouse': SelectStorehouse
    },
    mixins: [queryMixin],
    created() {
      //来自场地
      if(this.fromPage === 'Receiving'){
        let { initQuery, query } = this;
        initQuery.delivery_date = this.today;
        query.delivery_date = this.today;
        initQuery.province_code = this.$province.code;
        query.province_code = this.$province.code;
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
        delivery_date: '',
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
          '采购': 'purchase',
          '调拨': 'distribute'
        }
      }
    },
    methods: {
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

<style scoped>

</style>
