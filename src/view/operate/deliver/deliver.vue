<template>
  <div>
    <div class="query">
      <el-row :gutter="32">
        <el-col :span="8">
          <my-query-item label="职务">
            <el-select size="small" v-model="query.progress_status" clearable class="query-item-select" @change="changeQuery">
              <el-option label="全部" value=""></el-option>
              <el-option label="司机" value="pre"></el-option>
              <el-option label="装车员" value="ing"></el-option>
              <el-option label="配送员" value="post"></el-option>
            </el-select>
          </my-query-item>
        </el-col>
        <el-col :span="8">
          <my-query-item label="审核状态">
            <el-select size="small" v-model="query.type" clearable class="query-item-select" @change="changeQuery">
              <el-option label="全部" value=""></el-option>
              <el-option label="待审核" value="pre"></el-option>
              <el-option label="已审核" value="ing"></el-option>
            </el-select>
          </my-query-item>
        </el-col>
        <el-col :span="8">
          <my-query-item label="冻结状态">
            <el-select size="small" v-model="query.status" clearable class="query-item-select" @change="changeQuery">
              <el-option label="全部" value=""></el-option>
              <el-option label="未冻结" value="pre"></el-option>
              <el-option label="已冻结" value="ing"></el-option>
            </el-select>
          </my-query-item>
        </el-col>
      </el-row>
      <el-row :gutter="32" style="margin-top: 16px">
        <el-col :span="8">
          <div class="display-flex align-items-center">
            <my-query-item label="搜索">
              <el-input
                class="query-item-select"
                size="small"
                placeholder="请输入姓名/手机号"
                v-model="query.condition"
                @change="changeQuery"
              />
            </my-query-item>
            <el-button size="small" type="primary" style="margin-left: 10px">搜索</el-button>
            <el-button size="small" type="primary" plain>重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="container-table">
      <div class="display-flex justify-content-end">
        <el-button type="primary" plain size="mini">导出配送人员</el-button>
        <el-button class="right" type="primary" size="mini" @click="handleAddItem">新增</el-button>
      </div>
      <div class="mt-16">
        <el-table :data="list.items">
          <el-table-column
            type="index"
            :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88"
            label="序号"
            :index="indexMethod"
          />
          <el-table-column
            min-width="100"
            label="姓名"
          />
          <el-table-column
            min-width="100"
            label="账号手机号"
          />
          <el-table-column
            min-width="100"
            label="职务"
          />
          <el-table-column
            min-width="100"
            label="车牌"
          />
          <el-table-column
            min-width="100"
            label="车型"
          />
          <el-table-column
            min-width="100"
            label="审核状态"
          />
          <el-table-column
            min-width="100"
            label="冻结状态"
          />
          <el-table-column
            min-width="100"
            label="操作"
          />
        </el-table>
      </div>
    </div>
    <div class="footer">
      <div class="table-pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40, 50]"
          @size-change="changePageSize"
          @current-change="changePage"
          :total="list.num"
          :page-size="query.page_size"
          :current-page="query.page"
        />
      </div>
    </div>
    <el-dialog
      :title="`${dialog.type === 'add' ? '新增' : '修改'}配送人员`"
      :close-on-click-modal="false"
      :visible.sync="dialog.visible"
      width="600px"
      append-to-body
    >
      <deliver-edit
        :type="dialog.type"
        :item="dialog.item"
      />
    </el-dialog>
  </div>
</template>

<script>
  import { Row, Col, Button, Input, Select, Option, Table, TableColumn, Pagination, Dialog } from 'element-ui';
  import { Constant } from '@/util';
  import { QueryItem, QuerySearchInput } from '@/common';
  import DeliverEdit from './deliver-edit';
  export default {
    name: 'deliver',
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-button': Button,
      'el-input': Input,
      'el-select': Select,
      'el-option': Option,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-pagination': Pagination,
      'el-dialog': Dialog,
      'my-query-item': QueryItem,
      'my-query-search-input': QuerySearchInput,
      'deliver-edit': DeliverEdit
    },
    data() {
      return {
        query: {
          page: 1,
          page_size: Constant.PAGE_SIZE,
        },
        list: {
          items: [],
          num: 33
        },
        dialog: {
          visible: false,
          type: 'add',
          item: null
        }
      }
    },
    created() {
      document.title = '场地 - 配送人员';
    },
    methods: {
      changeQuery() {
        console.log("this.$data.query: ", this.$data.query);
      },
      indexMethod(index) {
        return (this.query.page - 1) * this.query.page_size + index + 1;
      },
      changePage(page) {
        this.$data.query.page = page;
      },
      changePageSize(page_size) {
        this.$data.query.page_size = page_size;
      },
      handleAddItem() {
        this.$data.dialog = {
          visible: true,
          type: 'add',
          item: null
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .mt-16 {
    margin-top: 16px;
  }
  .display-flex {
    display: flex;
  }
  .justify-content-end {
    justify-content: flex-end;
  }
  .align-items-center {
    align-items: center;
  }
</style>
