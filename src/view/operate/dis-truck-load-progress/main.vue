<template>
  <sub-menu>
    <template slot="left-query">
      <div class="menu-left-query">
        <div class="left">
          <global-storehouse v-if="query.delivery_date" v-model="query.src_storehouse_id" @initCallBack="initStorehouse" @change="changeQuery"/>
        </div>
        <div class="right">
          <global-delivery-date v-model="query.delivery_date" @change="changeQuery"/>
        </div>
      </div>
    </template>
    <div class="container-query">
      <el-row :gutter="32">
        <el-col :span="10">
          <my-query-item label="搜索">
            <query-search-input
              size="small"
              v-model="query.condition"
              placeholder="商品编号/名称"
              clearable
              @search="changeQuery"
              @reset="resetQuery"
            />
          </my-query-item>
        </el-col>
      </el-row>
    </div>

    <div class="container-table">
      <div @mousemove="handleTableMouseMove" class="table-conter">
        <el-table
          class="list-table my-table-float"
          :data="list"
          :row-class-name="highlightRowClassName"
          :highlight-current-row="true"
          :row-key="rowIdentifier"
          :current-row-key="clickedRow[rowIdentifier]"
        >
          <el-table-column type="index" width="80" align="center" label="序号" :index="indexMethod"></el-table-column>
          <el-table-column label="商品编号/名称" min-width="6">
            <template slot-scope="scope">{{scope.row.item_code}}/{{scope.row.item_title}}</template>
          </el-table-column>
          <el-table-column label="应出" min-width="2">
            <template slot-scope="scope">{{scope.row.plan_num ? scope.row.plan_num + '件' : '-'}}</template>
          </el-table-column>
          <el-table-column label="场地" min-width="2">
            <template slot-scope="scope">{{scope.row.palace_stock_num ? scope.row.palace_stock_num + '件' : '-'}}</template>
          </el-table-column>
          <el-table-column label="调拨" min-width="2">
            <template slot-scope="scope">{{scope.row.allocated_num ? scope.row.allocated_num + '件' : '-'}}</template>
          </el-table-column>
          <el-table-column label="仓库剩余库存" min-width="2">
            <template slot-scope="scope">{{scope.row.ware_stock_num ? scope.row.ware_stock_num + '件' : '-'}}</template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </sub-menu>
</template>

<script>
  import { Row, Col, Button, Input, Select, Option, Table, TableColumn, DatePicker } from 'element-ui';
  import { QueryItem, QuerySearchInput } from '@/common';
  import { GlobalStorehouse, GlobalDeliveryDate } from '@/component';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import mainMixin from '@/share/mixin/main.mixin';
  import tableMixin from '@/share/mixin/table.mixin';

  export default {
    name: 'distribute-plan',
    mixins: [mainMixin, tableMixin],
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'el-select': Select,
      'el-option': Option,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-date-picker': DatePicker,
      'my-query-item': QueryItem,
      'global-storehouse': GlobalStorehouse,
      'global-delivery-date': GlobalDeliveryDate,
      'query-search-input': QuerySearchInput
    },
    data() {
      return {
        query: {
          delivery_date: '',
          src_storehouse_id: '',
          condition: ''
        },
        list: []
      }
    },
    created() {
      documentTitle('场地 - 调拨装车 - 装车进度');
      this.initQuery();
    },
    methods: {
      initQuery() {
        this.$data.query = {
          ...this.query,
          page: 1,
          condition: ''
        };
      },

      // 初始化
      initStorehouse(){
        this.supDistributeAllocateLoading();
      },

      changeQuery() {
        this.$data.query.page = 1;
        this.supDistributeAllocateLoading();
      },

      resetQuery() {
        this.initQuery();
        this.supDistributeAllocateLoading();
      },

      async supDistributeAllocateLoading() {
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supDistributeAllocateLoading, this.query);
        this.$loading({isShow: false});
        if (res.code === 0){
          this.$data.list = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/share/scss/table.scss';
  .menu-left-query{
    width: 280px;
    display: flex;
    align-items: center;
    >.left{
      margin-right: 10px;
    }
  }
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
