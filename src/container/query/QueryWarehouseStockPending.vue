<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="仓库">
          <select-storehouse size="small" v-model="query.tar_storehouse_id" @change="handleQuery('TableWarehouseStockPending')" isAuth @initCallBack="storehouseInit"/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="状态">
          <select-option
            :options="inventoryStatus"
            v-model="query.status"
            @change="handleQuery('TableWarehouseStockPending')"
            size="small"
            clearable
          />
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="query.condition" placeholder="入库单号/商品编号/名称" size="small" @search="handleQuery('TableWarehouseStockPending')" @reset="handleClearQuery('TableWarehouseStockPending')"/>
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
    name: "QueryWarehouseStockPending",
    components: {
      'select-option': SelectOption,
      'select-storehouse': SelectStorehouse
    },
    mixins: [queryMixin],
    created() {
    },
    data() {
      let initQuery = {
        status: '',
        condition: '',
        tar_storehouse_id: '',
        for_instock: 1, //该查询是否是用来 入库的 (调拨单)
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
      }
    },
    computed: {
      inventoryStatus: {
        get(){
          let d = Constant.INVENTORY_STATUS('value_key');
          delete d['全部入库'];
          return {
            '全部': '',
            ...d
          };
        }
      }
    },
    methods: {
      //初始化选择仓库时
      storehouseInit(dataItem){
        let d = dataItem.filter(item => item.province_code === this.$province.code);
        if(d.length > 0){
          this.$data.initQuery.tar_storehouse_id = d[0].id;
          this.$data.query.tar_storehouse_id = d[0].id;
        }else{
          this.$data.initQuery.tar_storehouse_id = dataItem[0].id;
          this.$data.query.tar_storehouse_id = dataItem[0].id;
        }
        this.handleQuery('TableWarehouseStockPending');
      }
    }
  }
</script>

<style scoped>

</style>
