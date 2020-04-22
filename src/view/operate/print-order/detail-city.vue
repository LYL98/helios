<template>
  <el-table :data="list" :row-class-name="highlightRowClassName">
    <el-table-column label="门店名称">
      <template slot-scope="scope">{{scope.row.store.title}}</template>
    </el-table-column>
    <el-table-column label="分配/应出" width="120">
      <template slot-scope="scope">
        <span :style="returnStyle(scope.row)">{{scope.row.num}}</span>
        <span>&nbsp;/&nbsp;</span>
        <span>{{scope.row.count_real}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import { Table, TableColumn } from "element-ui";
  import { InputNumber, SelectOption } from '@/common';

  export default {
    name: "detail",
    components: {
      'el-table': Table,
      'el-table-column': TableColumn
    },
    props: {
      list: { type: Array, default: [] },
    },
    data() {
      return {
      }
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
      //返回提醒样式
      returnStyle(data){
        if(data.num !== data.count_real){
          return 'color: #ff5252;font-weight: bold;';
        }
        return '';
      },
    }
  }
</script>

<style lang="scss" scoped>
  
</style>
