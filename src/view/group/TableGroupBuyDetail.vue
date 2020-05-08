<template>
  <el-table
    :data="data"
    height="300px"
    :row-class-name="highlightRowClassName"
    highlight-current-row="highlight-current-row"
  >
    <el-table-column type="index" :width="(page - 1) * pageSize < 950 ? 48 : (page - 1) * pageSize <= 999950 ? 68 : 88" label="序号" :index="indexMethod"></el-table-column>
    <el-table-column label="门店名称" prop="city_title" min-width="200">
      <template slot-scope="scope">
        <a v-if="auth.isAdmin || auth.GroupBuyMerchantDetail"
           href="javascript:void(0);"
           class="title"
           @click="handleShowItem(scope.row)">
          {{scope.row.store.title}}
        </a>
        <div v-else class="title-disable ">
          {{scope.row.store.title}}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="所在县域" prop="city_title" min-width="120">
      <template slot-scope="scope">
        <div>
          {{ scope.row.city_title }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="参团人数" prop="customer_num" min-width="100">
      <template slot-scope="scope">
        <div>{{ scope.row.customer_num }}</div>
      </template>
    </el-table-column>
    <el-table-column label="总件数" prop="gb_num" min-width="100">
      <template slot-scope="scope">
        <div>{{ scope.row.sale_num }}</div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import { Table, TableColumn, MessageBox, Tag } from 'element-ui';
  import {TableOperate} from '@/common';
  import { Constant, DataHandle } from '@/util';

  export default {
    name: "TableGroupBuyDetail",
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-tag': Tag,
      'my-table-operate': TableOperate
    },
    props: {
      data: { type: Array, required: true},
      page: { type: Number, required: true },
      pageSize: { type: Number, required: true },
      showItem: { type: Function, required: true },
    },
    computed: {
      
    },
    data() {
      return {
        auth: this.$auth,
        statusTagType: {
          pre: 'warning',
          ing: '',
          post: 'info',
          activated: 'regular',
          deactivated: 'info'
        },
      }
    },
    methods: {
      highlightRowClassName({row, rowIndex}) {
        if (rowIndex % 2 == 0) {
          return 'stripe-row';
        } else if (rowIndex % 2 != 0) {
          return 'default-row'
        }
        return '';
      },
      indexMethod(index) {
        return (this.$props.page - 1) * this.$props.pageSize + index + 1;
      },

      /**
       *  gb_result字段类型修改

          success：成功

          fail：失败（老数据）

          end_early：因提前结束失败

          end_insufficent：人数不足团购失败

       * @param status
       * @param result
       * @returns {string}
       */

      groupBuyProgressStatus(status, result) {
        if (result !== '') {
          let resultStatus = '';
          if (result === 'success') {
            resultStatus = '成功'
          } else if (result === 'fail') {
            resultStatus = '失败'
          } else if (result === 'end_early') {
            resultStatus = '因提前结束失败'
          } else if (result === 'end_insufficent') {
            resultStatus = '人数不足团购失败'
          }
          return resultStatus;
        } else {
          if (status === 'pre') {
            return '未开展'
          } else if (status === 'ing') {
            return '团购中'
          } else if (status === 'post') {
            return '已结束'
          } else {
            return ''
          }
        }
      },

      handleShowItem(row) {
        this.$props.showItem(row);
      },
    }
  }
</script>

<style scoped>
  .title {
    color: inherit;
    padding: 5px 10px 5px 0;
    text-decoration: underline;
    cursor: pointer;
  }
  .title:hover {
    font-weight: 600;
  }
  .title-disable {
    color: inherit;
    padding: 5px 10px 5px 0;
  }
</style>
