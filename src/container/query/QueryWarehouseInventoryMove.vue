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
        <my-query-item :label="queryTitles[tabValue] || '仓库'">
          <select-storehouse v-model="query.storehouse_id" @change="handleQuery('TableWarehouseInventoryMove')" size="small" isAuth @initCallBack="storehouseInit" />
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="query.condition" placeholder="商品编号/名称" size="small" @search="handleQuery('TableWarehouseInventoryMove')" @reset="handleClearQuery('TableWarehouseInventoryMove')"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { SelectStorehouse } from '@/component';
  import queryMixin from './query.mixin';
  import { Constant } from '@/util';

  export default {
    name: "QueryWarehouseInventoryMove",
    components: {
      'select-storehouse': SelectStorehouse
    },
    mixins: [queryMixin],
    created() {
    },
    data() {
      let initQuery = {
        begin_date: '',
        end_date: '',
        storehouse_id: '',
        condition: '',
        picker_value: null,
        //province_code: this.$province.code,
      }
      return {
        tabValue: '', //由table控制
        queryTitles: {
          'check': '仓库',
          'variation': '仓库',
          'allot': '调入仓库',
          'move': '原仓库',
          'out_storage': '仓库'
        },
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
      }
    },
    methods: {
      //搜索日期
      changePicker(value){
        if(value && value.length === 2){
          this.query.begin_date = value[0];
          this.query.end_date = value[1];
        }else{
          this.query.begin_date = '';
          this.query.end_date = '';
        }
        this.query.page = 1;
        this.$data.query = this.query;
        this.handleQuery('TableWarehouseInventoryMove');
      },
      //初始化选择仓库时
      storehouseInit(dataItem){
        let d = dataItem.filter(item => item.province_code === this.$province.code);
        if(d.length > 0){
          this.$data.initQuery.storehouse_id = d[0].id;
          this.$data.query.storehouse_id = d[0].id;
        }else{
          this.$data.initQuery.storehouse_id = dataItem[0].id;
          this.$data.query.storehouse_id = dataItem[0].id;
        }
        this.handleQuery('TableWarehouseInventoryMove');
      }
    }
  }
</script>

<style scoped>

</style>
