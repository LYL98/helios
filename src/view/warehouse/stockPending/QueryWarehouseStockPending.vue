<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="创建时间">
          <el-date-picker
            size="small"
            v-model="query.picker_value"
            type="daterange"
            align="right"
            value-format="yyyy-MM-dd"
            unlink-panels
            :picker-options="fixDateOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changePicker"
            style="width: 100%;"
          />
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
    <el-row :gutter="32" style="margin-top: 16px;">
      <el-col :span="7">
        <my-query-item label="仓库">
          <select-storehouse size="small" v-model="query.storehouse_id" @change="changeStorehouse" isAuth @initCallBack="storehouseInit"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { SelectOption } from '@/common';
  import queryMixin from '@/share/mixin/query.mixin';
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
        storehouse_id: '',
        picker_value: null,
        begin_date: '',
        end_date: '',
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
        selectStorehouseData: {}, //当前选择的仓（入库时用）
      }
    },
    computed: {
      inventoryStatus: {
        get(){
          let d = Constant.INVENTORY_STATUS('value_key');
          //delete d['全部入库'];
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
        let { initQuery, query } = this;
        if(d.length > 0){
          initQuery.storehouse_id = d[0].id;
          query.storehouse_id = d[0].id;
          this.$data.selectStorehouseData = d[0];
        }else{
          initQuery.storehouse_id = dataItem[0].id;
          query.storehouse_id = dataItem[0].id;
          this.$data.selectStorehouseData = dataItem[0];
        }
        this.$data.initQuery = initQuery;
        this.$data.query = query;
        this.handleQuery('TableWarehouseStockPending');
      },
      //选择仓库
      changeStorehouse(data){
        this.$data.selectStorehouseData = data;
        this.handleQuery('TableWarehouseStockPending');
      },
      //搜索日期
      changePicker(value){
        if(value && value.length === 2){
          this.query.begin_date = value[0];
          this.query.end_date = value[1];
        }else{
          this.query.begin_date = '';
          this.query.end_date = '';
        }
        this.$data.query = this.query;
        this.handleQuery('TableWarehouseStockPending');
      },
    }
  }
</script>

<style scoped>

</style>
