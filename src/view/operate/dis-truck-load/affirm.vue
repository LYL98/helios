<template>
  <div>
    <div style="padding: 0 30px 20px; color: #ff5252;">注：以下为缺货商品分配情况</div>
    <div style="padding: 0 30px;">
      <el-table :data="list" :row-class-name="highlightRowClassName">
        <el-table-column label="商品" min-width="160">
          <template slot-scope="scope">{{scope.row.item_code}}/{{scope.row.item_title}}</template>
        </el-table-column>
        <el-table-column label="应调拨" min-width="100">
          <template slot-scope="scope">{{scope.row.plan_num ? scope.row.plan_num + '件' : '-'}}</template>
        </el-table-column>
        <el-table-column label="实际调拨" min-width="100">
          <template slot-scope="scope">{{scope.row.num ? scope.row.num + '件' : '-'}}</template>
        </el-table-column>
        <el-table-column label="缺货" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.plan_num - scope.row.num <= 0">-</span>
            <span v-else>{{scope.row.plan_num - scope.row.num}}件</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-left: 140px; margin-top: 20px;">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleSubmit" :loading="loading">确 定</el-button>
    </div>
  </div>
</template>

<script>
  import { Button, Table, TableColumn } from "element-ui";
  import { Http, Config } from '@/util';

  export default {
    name: "affirm",
    components: {
      'el-button': Button,
      'el-table': Table,
      'el-table-column': TableColumn
    },
    props: {
      list: { type: Array, default: [] },
      loading: { type: Boolean, default: false }
    },
    data() {
      return {
      }
    },
    created() {
    },
    methods: {
      /**
     * 斑马线的背景颜色样式
     */
      highlightRowClassName({row, rowIndex}) {
        if (rowIndex % 2 == 0) {
          return 'stripe-row';
        } else if (rowIndex % 2 != 0) {
          return 'default-row'
        }
        return '';
      },

      handleSubmit() {
        this.$emit('submit');
      },

      handleCancel() {
        this.$emit('cancel');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .bg-grey {
    background-color: #EEE;
  }
  .px-20 {
    padding-left: 20px;
    padding-right: 20px;
  }
  .py-10 {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .m-0 {
    margin: 0;
  }
  .mt-10 {
    margin-top: 10px;
  }

  .mt-20 {
    margin-top: 20px;
  }

  .mt-30 {
    margin-top: 30px;
  }
</style>
