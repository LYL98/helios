<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="调入仓">
          <select-storehouse size="small" v-model="query.tar_storehouse_id" @change="handleQuery('TableWarehouseDistribute')" isTarLimit @initCallBack="storehouseInit"/>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="调出仓">
          <select-storehouse size="small" v-model="query.src_storehouse_id" clearable filterable @change="handleQuery('TableWarehouseDistribute')" isSrcLimit/>
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="query.condition" placeholder="入库单号/商品编号/名称" size="small" @search="handleQuery('TableWarehouseDistribute')" @reset="handleClearQuery('TableWarehouseDistribute')"/>
        </my-query-item>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 16px;">
      <el-col :span="7">
        <my-query-item label="可售时间">
          <el-date-picker
            size="small"
            v-model="query.available_date"
            value-format="yyyy-MM-dd"
            @change="handleQuery('TableWarehouseDistribute')"
            placeholder="可售时间"
            style="width: 100%;"
          />
        </my-query-item>
      </el-col>
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
    </el-row>
  </div>
</template>

<script>
  import { SelectOption } from '@/common';
  import queryMixin from '@/share/mixin/query.mixin';
  import { Constant } from '@/util';
  import { SelectStorehouse } from '@/component';

  export default {
    name: "QueryWarehouseDistribute",
    components: {
      'select-option': SelectOption,
      'select-storehouse': SelectStorehouse
    },
    mixins: [queryMixin],
    created() {
    },
    data() {
      let initQuery = {
        src_storehouse_id: '',
        tar_storehouse_id: '',
        available_date: '',
        begin_date: '',
        end_date: '',
        condition: '',
        picker_value: null
      }
      return {
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
        this.handleQuery('TableWarehouseDistribute');
      },
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
        this.handleQuery('TableWarehouseDistribute');
      }
    }
  }
</script>

<style scoped>

</style>
